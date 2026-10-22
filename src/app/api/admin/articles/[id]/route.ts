import { NextResponse } from "next/server";
import { addAdminActivity, publicationRequirementsMet } from "@/lib/admin-content";
import { jsonError, requireApiAdmin, validationError } from "@/lib/admin-api";
import { getDb } from "@/lib/db";
import { articleSchema } from "@/lib/validation";

type RouteParams = { params: Promise<{ id: string }> };
const idPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: Request, { params }: RouteParams) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  if (!idPattern.test(id)) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  try {
    const { rows } = await getDb().query(
      `SELECT id, title, slug, excerpt, article_link AS "articleLink", hashtags, content, thumbnail_url AS "thumbnailUrl",
              category, display_order AS "displayOrder", status,
              published_at AS "publishedAt", created_at AS "createdAt",
              updated_at AS "updatedAt", seo_title AS "seoTitle",
              seo_description AS "seoDescription"
       FROM articles WHERE id = $1`,
      [id],
    );
    return rows[0]
      ? NextResponse.json({ article: rows[0] })
      : NextResponse.json({ error: "Article not found." }, { status: 404 });
  } catch (error) {
    return jsonError(error, "Article could not be loaded.");
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  if (!idPattern.test(id)) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = articleSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error.issues);
  const article = parsed.data;
  if (
    !publicationRequirementsMet({
      status: article.status,
      contentLength: article.content.length,
      images: [article.thumbnailUrl],
    })
  ) {
    const fields = [];
    if (!article.thumbnailUrl) {
      fields.push({
        path: ["thumbnailUrl"],
        message: "Please upload a thumbnail image before publishing.",
      });
    }
    if (article.content.length === 0) {
      fields.push({
        path: ["content"],
        message: "A short description is required for article content.",
      });
    }
    if (fields.length > 0) return validationError(fields);

    return NextResponse.json(
      { error: "Published articles require content and a thumbnail reference." },
      { status: 400 },
    );
  }

  const client = await getDb().connect();
  try {
    await client.query("BEGIN");
    const previous = await client.query<{ status: "draft" | "published" }>(
      "SELECT status FROM articles WHERE id = $1 FOR UPDATE",
      [id],
    );
    if (!previous.rowCount) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }
    await client.query(
      `UPDATE articles
       SET title = $2, slug = $3, excerpt = $4, article_link = $5, hashtags = $6,
           content = $7::jsonb, thumbnail_url = $8, category = $9,
           display_order = $10, status = $11, seo_title = $12,
           seo_description = $13,
           published_at = CASE
             WHEN $11 = 'published' AND published_at IS NULL THEN NOW()
             WHEN $11 = 'draft' THEN NULL
             ELSE published_at
           END,
           updated_at = NOW()
       WHERE id = $1`,
      [
        id,
        article.title,
        article.slug,
        article.excerpt,
        article.articleLink || null,
        article.hashtags,
        JSON.stringify(article.content),
        article.thumbnailUrl,
        article.category || null,
        article.displayOrder ?? null,
        article.status,
        article.seoTitle || null,
        article.seoDescription || null,
      ],
    );
    const oldStatus = previous.rows[0].status;
    const action =
      oldStatus !== article.status
        ? article.status === "published"
          ? "published"
          : "unpublished"
        : "updated";
    await addAdminActivity(client, {
      actorId: auth.account.id,
      entityType: "article",
      entityId: id,
      action,
      summary: `${action === "updated" ? "Updated" : action === "published" ? "Published" : "Unpublished"} article “${article.title}”`,
    });
    await client.query("COMMIT");
    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query("ROLLBACK");
    if (typeof error === "object" && error && "code" in error && error.code === "23505") {
      return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    }
    return jsonError(error, "Article could not be updated.");
  } finally {
    client.release();
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  if (!idPattern.test(id)) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const status =
    typeof body === "object" && body !== null && "status" in body
      ? body.status
      : undefined;
  if (status !== "draft" && status !== "published") {
    return NextResponse.json({ error: "Invalid publication status." }, { status: 400 });
  }

  const client = await getDb().connect();
  try {
    await client.query("BEGIN");
    const result = await client.query<{ title: string; content: unknown[]; thumbnail_url: string; status: string }>(
      `SELECT title, content, thumbnail_url, status FROM articles WHERE id = $1 FOR UPDATE`,
      [id],
    );
    const article = result.rows[0];
    if (!article) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }
    if (
      !publicationRequirementsMet({
        status,
        contentLength: article.content.length,
        images: [article.thumbnail_url],
      })
    ) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Add full content and a thumbnail reference before publishing." },
        { status: 400 },
      );
    }
    await client.query(
      `UPDATE articles SET status = $2,
         published_at = CASE
           WHEN $2 = 'published' AND published_at IS NULL THEN NOW()
           WHEN $2 = 'draft' THEN NULL
           ELSE published_at
         END, updated_at = NOW()
       WHERE id = $1`,
      [id, status],
    );
    if (article.status !== status) {
      await addAdminActivity(client, {
        actorId: auth.account.id,
        entityType: "article",
        entityId: id,
        action: status === "published" ? "published" : "unpublished",
        summary: `${status === "published" ? "Published" : "Unpublished"} article “${article.title}”`,
      });
    }
    await client.query("COMMIT");
    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return jsonError(error, "Publication status could not be updated.");
  } finally {
    client.release();
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  if (!idPattern.test(id)) {
    return NextResponse.json({ error: "Article not found." }, { status: 404 });
  }
  const client = await getDb().connect();
  try {
    await client.query("BEGIN");
    const result = await client.query<{ title: string }>(
      "DELETE FROM articles WHERE id = $1 RETURNING title",
      [id],
    );
    if (!result.rowCount) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }
    await addAdminActivity(client, {
      actorId: auth.account.id,
      entityType: "article",
      entityId: id,
      action: "deleted",
      summary: `Deleted article “${result.rows[0].title}”`,
    });
    await client.query("COMMIT");
    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return jsonError(error, "Article could not be deleted.");
  } finally {
    client.release();
  }
}

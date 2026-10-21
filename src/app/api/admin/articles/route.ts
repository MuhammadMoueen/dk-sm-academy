import { NextResponse } from "next/server";
import { addAdminActivity, publicationRequirementsMet } from "@/lib/admin-content";
import { jsonError, requireApiAdmin, validationError } from "@/lib/admin-api";
import { getDb } from "@/lib/db";
import { articleSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const url = new URL(request.url);
    const search = (url.searchParams.get("q") ?? "").trim().slice(0, 120);
    const status = url.searchParams.get("status");
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
    const limit = 25;
    const db = getDb();
    const { rows } = await db.query(
      `SELECT id, title, slug, excerpt, hashtags, thumbnail_url AS "thumbnailUrl",
              category, display_order AS "displayOrder", status,
              published_at AS "publishedAt", created_at AS "createdAt",
              updated_at AS "updatedAt"
       FROM articles
       WHERE ($1::text = '' OR title ILIKE '%' || $1 || '%')
         AND ($2::text IS NULL OR status = $2)
       ORDER BY updated_at DESC
       LIMIT $3 OFFSET $4`,
      [search, status === "draft" || status === "published" ? status : null, limit, (page - 1) * limit],
    );
    const total = await db.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count
       FROM articles
       WHERE ($1::text = '' OR title ILIKE '%' || $1 || '%')
         AND ($2::text IS NULL OR status = $2)`,
      [search, status === "draft" || status === "published" ? status : null],
    );
    return NextResponse.json({
      articles: rows,
      page,
      pageSize: limit,
      total: Number(total.rows[0]?.count ?? 0),
    });
  } catch (error) {
    return jsonError(error, "Articles could not be loaded.");
  }
}

export async function POST(request: Request) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;

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
    return NextResponse.json(
      { error: "Published articles require content and a thumbnail reference." },
      { status: 400 },
    );
  }

  const client = await getDb().connect();
  try {
    await client.query("BEGIN");
    const result = await client.query<{ id: string }>(
      `INSERT INTO articles
        (title, slug, excerpt, hashtags, content, thumbnail_url, category, display_order,
         status, seo_title, seo_description, published_at)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9, $10, $11,
         CASE WHEN $9 = 'published' THEN NOW() ELSE NULL END)
       RETURNING id`,
      [
        article.title,
        article.slug,
        article.excerpt,
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
    const id = result.rows[0].id;
    await addAdminActivity(client, {
      actorId: auth.account.id,
      entityType: "article",
      entityId: id,
      action: article.status === "published" ? "published" : "created",
      summary: `${article.status === "published" ? "Published" : "Created draft"} article “${article.title}”`,
    });
    await client.query("COMMIT");
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    await client.query("ROLLBACK");
    if (typeof error === "object" && error && "code" in error && error.code === "23505") {
      return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    }
    return jsonError(error, "Article could not be saved.");
  } finally {
    client.release();
  }
}

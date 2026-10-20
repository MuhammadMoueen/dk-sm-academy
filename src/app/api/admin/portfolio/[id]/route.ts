import { NextResponse } from "next/server";
import { addAdminActivity, publicationRequirementsMet } from "@/lib/admin-content";
import { jsonError, requireApiAdmin, validationError } from "@/lib/admin-api";
import { getDb } from "@/lib/db";
import { portfolioSchema } from "@/lib/validation";

type RouteParams = { params: Promise<{ id: string }> };
const idPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: Request, { params }: RouteParams) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  if (!idPattern.test(id)) {
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
  }
  try {
    const { rows } = await getDb().query(
      `SELECT id, client_name AS "clientName",
              client_image_url AS "clientImage",
              transaction_image_url AS "transactionImage", review,
              rating::float8 AS rating, is_verified AS "isVerified", status,
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM portfolio_reviews WHERE id = $1`,
      [id],
    );
    return rows[0]
      ? NextResponse.json({ review: rows[0] })
      : NextResponse.json({ error: "Review not found." }, { status: 404 });
  } catch (error) {
    return jsonError(error, "Review could not be loaded.");
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  if (!idPattern.test(id)) {
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = portfolioSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error.issues);
  const review = parsed.data;
  if (
    !publicationRequirementsMet({
      status: review.status,
      contentLength: review.review.length,
      images: [review.clientImage, review.transactionImage],
    })
  ) {
    return NextResponse.json(
      {
        error:
          "Published reviews require a client photo and transaction image reference.",
      },
      { status: 400 },
    );
  }

  const client = await getDb().connect();
  try {
    await client.query("BEGIN");
    const previous = await client.query<{
      status: "draft" | "published";
      is_verified: boolean;
    }>("SELECT status, is_verified FROM portfolio_reviews WHERE id = $1 FOR UPDATE", [id]);
    if (!previous.rowCount) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }
    await client.query(
      `UPDATE portfolio_reviews
       SET client_name = $2, client_image_url = $3, transaction_image_url = $4,
           review = $5, rating = $6, is_verified = $7, status = $8,
           published_at = CASE
             WHEN $8 = 'published' AND published_at IS NULL THEN NOW()
             WHEN $8 = 'draft' THEN NULL
             ELSE published_at
           END,
           updated_at = NOW()
       WHERE id = $1`,
      [
        id,
        review.clientName,
        review.clientImage,
        review.transactionImage,
        review.review,
        review.rating,
        review.isVerified,
        review.status,
      ],
    );
    const old = previous.rows[0];
    const action =
      old.status !== review.status
        ? review.status === "published"
          ? "published"
          : "unpublished"
        : "updated";
    await addAdminActivity(client, {
      actorId: auth.account.id,
      entityType: "portfolio",
      entityId: id,
      action,
      summary: `${action === "updated" ? "Updated" : action === "published" ? "Published" : "Unpublished"} review for “${review.clientName}”`,
    });
    await client.query("COMMIT");
    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return jsonError(error, "Review could not be updated.");
  } finally {
    client.release();
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  if (!idPattern.test(id)) {
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
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
    const result = await client.query<{
      client_name: string;
      client_image_url: string;
      transaction_image_url: string;
      status: string;
    }>(
      `SELECT client_name, client_image_url, transaction_image_url, status
       FROM portfolio_reviews WHERE id = $1 FOR UPDATE`,
      [id],
    );
    const review = result.rows[0];
    if (!review) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }
    if (
      !publicationRequirementsMet({
        status,
        contentLength: review.client_name.length,
        images: [review.client_image_url, review.transaction_image_url],
      })
    ) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Add both image references before publishing this review." },
        { status: 400 },
      );
    }
    await client.query(
      `UPDATE portfolio_reviews SET status = $2,
         published_at = CASE
           WHEN $2 = 'published' AND published_at IS NULL THEN NOW()
           WHEN $2 = 'draft' THEN NULL
           ELSE published_at
         END, updated_at = NOW()
       WHERE id = $1`,
      [id, status],
    );
    if (review.status !== status) {
      await addAdminActivity(client, {
        actorId: auth.account.id,
        entityType: "portfolio",
        entityId: id,
        action: status === "published" ? "published" : "unpublished",
        summary: `${status === "published" ? "Published" : "Unpublished"} review for “${review.client_name}”`,
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
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
  }
  const client = await getDb().connect();
  try {
    await client.query("BEGIN");
    const result = await client.query<{ client_name: string }>(
      "DELETE FROM portfolio_reviews WHERE id = $1 RETURNING client_name",
      [id],
    );
    if (!result.rowCount) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }
    await addAdminActivity(client, {
      actorId: auth.account.id,
      entityType: "portfolio",
      entityId: id,
      action: "deleted",
      summary: `Deleted review for “${result.rows[0].client_name}”`,
    });
    await client.query("COMMIT");
    return NextResponse.json({ ok: true });
  } catch (error) {
    await client.query("ROLLBACK");
    return jsonError(error, "Review could not be deleted.");
  } finally {
    client.release();
  }
}

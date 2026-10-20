import { NextResponse } from "next/server";
import { addAdminActivity, publicationRequirementsMet } from "@/lib/admin-content";
import { jsonError, requireApiAdmin, validationError } from "@/lib/admin-api";
import { getDb } from "@/lib/db";
import { portfolioSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const auth = await requireApiAdmin(request);
  if (!auth.ok) return auth.response;
  try {
    const url = new URL(request.url);
    const search = (url.searchParams.get("q") ?? "").trim().slice(0, 120);
    const status = url.searchParams.get("status");
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
    const limit = 25;
    const filterStatus =
      status === "draft" || status === "published" ? status : null;
    const db = getDb();
    const { rows } = await db.query(
      `SELECT id, client_name AS "clientName",
              client_image_url AS "clientImage",
              transaction_image_url AS "transactionImage", review,
              rating::float8 AS rating, is_verified AS "isVerified", status,
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM portfolio_reviews
       WHERE ($1::text = '' OR client_name ILIKE '%' || $1 || '%')
         AND ($2::text IS NULL OR status = $2)
       ORDER BY updated_at DESC
       LIMIT $3 OFFSET $4`,
      [search, filterStatus, limit, (page - 1) * limit],
    );
    const total = await db.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count
       FROM portfolio_reviews
       WHERE ($1::text = '' OR client_name ILIKE '%' || $1 || '%')
         AND ($2::text IS NULL OR status = $2)`,
      [search, filterStatus],
    );
    return NextResponse.json({
      reviews: rows,
      page,
      pageSize: limit,
      total: Number(total.rows[0]?.count ?? 0),
    });
  } catch (error) {
    return jsonError(error, "Portfolio reviews could not be loaded.");
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
    const result = await client.query<{ id: string }>(
      `INSERT INTO portfolio_reviews
        (client_name, client_image_url, transaction_image_url, review,
         rating, is_verified, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7,
         CASE WHEN $7 = 'published' THEN NOW() ELSE NULL END)
       RETURNING id`,
      [
        review.clientName,
        review.clientImage,
        review.transactionImage,
        review.review,
        review.rating,
        review.isVerified,
        review.status,
      ],
    );
    const id = result.rows[0].id;
    await addAdminActivity(client, {
      actorId: auth.account.id,
      entityType: "portfolio",
      entityId: id,
      action: review.status === "published" ? "published" : "created",
      summary: `${review.status === "published" ? "Published" : "Created draft"} review for “${review.clientName}”`,
    });
    await client.query("COMMIT");
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    await client.query("ROLLBACK");
    return jsonError(error, "Portfolio review could not be saved.");
  } finally {
    client.release();
  }
}

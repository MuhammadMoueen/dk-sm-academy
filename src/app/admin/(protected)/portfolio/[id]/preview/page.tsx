
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import { getDb } from "@/lib/db";
import type { PortfolioItem } from "@/types/portfolio";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default async function PortfolioPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;

  const { rows } = await getDb().query<PortfolioItem>(
    `SELECT id, client_name AS "clientName",
            client_image_url AS "clientImage",
            transaction_image_url AS "transactionImage", review,
            rating::float8 AS rating,
            is_verified AS "isVerified", status,
            created_at AS "createdAt", updated_at AS "updatedAt"
     FROM portfolio_reviews WHERE id = $1`,
    [id],
  );

  const review = rows[0];

  if (!review) notFound();

  return (
    <section className="mx-auto max-w-2xl">
      <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              review.status === "published"
                ? "border-green-400/30 text-green-300"
                : "border-amber-300/30 text-amber-200"
            }`}
          >
            {review.status === "published" ? "Published" : "Draft preview"}
          </span>

          <Link
            href={`/admin/portfolio/${id}/edit`}
            className="rounded-lg border border-[#ffd43b]/40 px-3 py-1.5 text-sm font-semibold text-[#ffd43b] transition hover:bg-[#ffd43b]/10"
          >
            Edit review
          </Link>
        </div>
      </div>

      <AdminPageHeader badge="Portfolio preview">
        <span className="text-white">{review.clientName}</span>
        <span className="text-[#ffd43b]"> Review</span>
      </AdminPageHeader>

      <div className="mt-6">
        <PortfolioCard item={review} preview />
      </div>
    </section>
  );
}

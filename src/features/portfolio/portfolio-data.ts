import "server-only";

import { getDb } from "@/lib/db";
import type { ContentStatus } from "@/types/common";
import type { PortfolioItem } from "@/types/portfolio";

type PortfolioRow = {
  id: string;
  client_name: string;
  client_image_url: string;
  transaction_image_url: string;
  review: string;
  rating: number | string;
  is_verified: boolean;
  status: ContentStatus;
  created_at: Date;
  updated_at: Date;
};

function mapPortfolioItem(row: PortfolioRow): PortfolioItem {
  return {
    id: row.id,
    clientName: row.client_name,
    clientImage: row.client_image_url,
    transactionImage: row.transaction_image_url,
    review: row.review,
    rating: Number(row.rating),
    isVerified: row.is_verified,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

const portfolioColumns = `
  id, client_name, client_image_url, transaction_image_url, review,
  rating, is_verified, status, created_at, updated_at
`;

export async function getPublishedPortfolioItems() {
  const { rows } = await getDb().query<PortfolioRow>(
    `SELECT ${portfolioColumns}
     FROM portfolio_reviews
     WHERE status = 'published'
     ORDER BY created_at DESC`,
  );
  return rows.map(mapPortfolioItem);
}

export async function getPortfolioItemById(id: string) {
  const { rows } = await getDb().query<PortfolioRow>(
    `SELECT ${portfolioColumns} FROM portfolio_reviews WHERE id = $1`,
    [id],
  );
  return rows[0] ? mapPortfolioItem(rows[0]) : undefined;
}

export async function listPortfolioItems({
  search = "",
  status,
  limit = 25,
  offset = 0,
}: {
  search?: string;
  status?: ContentStatus;
  limit?: number;
  offset?: number;
} = {}) {
  const { rows } = await getDb().query<PortfolioRow>(
    `SELECT ${portfolioColumns}
     FROM portfolio_reviews
     WHERE ($1::text = '' OR client_name ILIKE '%' || $1 || '%')
       AND ($2::text IS NULL OR status = $2)
     ORDER BY updated_at DESC
     LIMIT $3 OFFSET $4`,
    [search, status ?? null, Math.min(limit, 100), Math.max(0, offset)],
  );
  return rows.map(mapPortfolioItem);
}

export async function getPortfolioCounts() {
  const { rows } = await getDb().query<{
    total: string;
    published: string;
    draft: string;
  }>(
    `SELECT COUNT(*)::text AS total,
       COUNT(*) FILTER (WHERE status = 'published')::text AS published,
       COUNT(*) FILTER (WHERE status = 'draft')::text AS draft
     FROM portfolio_reviews`,
  );
  return {
    total: Number(rows[0]?.total ?? 0),
    published: Number(rows[0]?.published ?? 0),
    draft: Number(rows[0]?.draft ?? 0),
  };
}

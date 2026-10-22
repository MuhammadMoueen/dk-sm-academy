import "server-only";

import { getDb } from "@/lib/db";
import type { Article, ArticleContentBlock } from "@/types/article";
import type { ContentStatus } from "@/types/common";

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  article_link: string | null;
  hashtags: string[] | null;
  content: ArticleContentBlock[] | null;
  thumbnail_url: string | null;
  category: string | null;
  display_order: number | null;
  status: ContentStatus;
  published_at: Date | null;
  updated_at: Date;
  seo_title: string | null;
  seo_description: string | null;
};

function mapArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    articleLink: row.article_link?.trim() || undefined,
    hashtags: row.hashtags ?? [],
    content: row.content ?? [],
    thumbnailUrl: row.thumbnail_url ?? "",
    category: row.category ?? undefined,
    displayOrder: row.display_order ?? undefined,
    status: row.status,
    publishedAt: row.published_at?.toISOString() ?? "",
    updatedAt: row.updated_at.toISOString(),
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
  };
}

const articleColumns = `
  id,
  title,
  slug,
  excerpt,
  article_link,
  hashtags,
  content,
  thumbnail_url,
  category,
  display_order,
  status,
  published_at,
  updated_at,
  seo_title,
  seo_description
`;

export async function getPublishedArticles(): Promise<Article[]> {
  const { rows } = await getDb().query<ArticleRow>(
    `SELECT ${articleColumns}
     FROM articles
     WHERE status = 'published'
     ORDER BY display_order ASC NULLS LAST,
              published_at DESC,
              created_at DESC`,
  );

  return rows.map(mapArticle);
}

export async function getPublishedArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  const { rows } = await getDb().query<ArticleRow>(
    `SELECT ${articleColumns}
     FROM articles
     WHERE slug = $1
       AND status = 'published'
     LIMIT 1`,
    [slug],
  );

  return rows[0] ? mapArticle(rows[0]) : undefined;
}

export async function getArticleById(
  id: string,
): Promise<Article | undefined> {
  const { rows } = await getDb().query<ArticleRow>(
    `SELECT ${articleColumns}
     FROM articles
     WHERE id = $1
     LIMIT 1`,
    [id],
  );

  return rows[0] ? mapArticle(rows[0]) : undefined;
}

export async function listArticles({
  search = "",
  status,
  limit = 25,
  offset = 0,
}: {
  search?: string;
  status?: ContentStatus;
  limit?: number;
  offset?: number;
} = {}): Promise<Article[]> {
  const { rows } = await getDb().query<ArticleRow>(
    `SELECT ${articleColumns}
     FROM articles
     WHERE ($1::text = '' OR title ILIKE '%' || $1 || '%')
       AND ($2::text IS NULL OR status = $2)
     ORDER BY updated_at DESC
     LIMIT $3 OFFSET $4`,
    [
      search,
      status ?? null,
      Math.min(Math.max(limit, 1), 100),
      Math.max(0, offset),
    ],
  );

  return rows.map(mapArticle);
}

export async function getArticleCounts(): Promise<{
  total: number;
  published: number;
  draft: number;
}> {
  const { rows } = await getDb().query<{
    total: string;
    published: string;
    draft: string;
  }>(
    `SELECT
       COUNT(*)::text AS total,
       COUNT(*) FILTER (WHERE status = 'published')::text AS published,
       COUNT(*) FILTER (WHERE status = 'draft')::text AS draft
     FROM articles`,
  );

  return {
    total: Number(rows[0]?.total ?? 0),
    published: Number(rows[0]?.published ?? 0),
    draft: Number(rows[0]?.draft ?? 0),
  };
}

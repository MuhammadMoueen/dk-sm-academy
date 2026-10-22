import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArticleContent } from "@/components/blog/article-content";
import { getDb } from "@/lib/db";
import type { ArticleContentBlock } from "@/types/article";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default async function ArticlePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  const { rows } = await getDb().query<{
    title: string;
    slug: string;
    excerpt: string;
    articleLink: string | null;
    content: ArticleContentBlock[];
    thumbnailUrl: string;
    category: string | null;
    publishedAt: string | null;
    createdAt: string;
    status: "draft" | "published";
  }>(
    `SELECT title, slug, excerpt, article_link AS "articleLink", content, thumbnail_url AS "thumbnailUrl",
            category, published_at AS "publishedAt", created_at AS "createdAt",
            status
     FROM articles WHERE id = $1`,
    [id],
  );
  const article = rows[0];
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
        <div className="flex gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${article.status === "published" ? "border-green-400/30 text-green-300" : "border-amber-300/30 text-amber-200"}`}>{article.status === "published" ? "Published" : "Draft preview"}</span>
          <Link href={`/admin/articles/${id}/edit`} className="rounded-lg border border-[#ffd43b]/40 px-3 py-1.5 text-sm font-semibold text-[#ffd43b]">Edit article</Link>
        </div>
      </div>
      <AdminPageHeader badge="Article preview">
        <span className="text-white">{article.title}</span>
      </AdminPageHeader>
      {article.category && <p className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wider text-[#ffd43b]">{article.category}</p>}
      <p className="mb-6 text-lg leading-relaxed text-gray-300">{article.excerpt}</p>
      <time dateTime={article.publishedAt ?? article.createdAt} className="mb-6 block text-sm text-gray-500">
        {new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(article.publishedAt ?? article.createdAt))}
      </time>
      {article.thumbnailUrl && (
        <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl border border-[#ffd43b]/20">
          <Image src={article.thumbnailUrl} alt={article.title} fill sizes="(min-width: 900px) 800px, 100vw" className="object-cover" />
        </div>
      )}
      <ArticleContent blocks={article.content} />
      {article.articleLink && (
        <a href={article.articleLink} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex font-semibold text-[#ffd43b] underline underline-offset-4">
          Read the linked article ↗
        </a>
      )}
    </article>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArticleContent } from "@/components/blog/article-content";
import { getDb } from "@/lib/db";
import type { ArticleContentBlock } from "@/types/article";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

const ARTICLE_BACKGROUND_IMAGE = "/images/blog-bg.png";

type ArticleRow = {
  title: string;
  slug: string;
  excerpt: string | null;
  articleLink: string | null;
  hashtags: string[] | null;
  content: ArticleContentBlock[] | null;
  thumbnailUrl: string | null;
  category: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "published";
};

function ArticleHeading({ title }: { title: string }) {
  const words = title.trim().split(/\s+/);
  const firstWord = words.shift() ?? "";

  return (
    <>
      <span className="text-white">{firstWord}</span>
      {words.length > 0 && (
        <>
          {" "}
          <span className="text-[#FFD43B]">{words.join(" ")}</span>
        </>
      )}
    </>
  );
}

export default async function ArticlePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;

  const { rows } = await getDb().query<ArticleRow>(
    `SELECT
       title,
       slug,
       excerpt,
       article_link AS "articleLink",
       hashtags,
       content,
       thumbnail_url AS "thumbnailUrl",
       category,
       published_at AS "publishedAt",
       created_at AS "createdAt",
       updated_at AS "updatedAt",
       status
     FROM articles
     WHERE id = $1
     LIMIT 1`,
    [id],
  );

  const article = rows[0];

  if (!article) notFound();

  const officialLink =
    typeof article.articleLink === "string"
      ? article.articleLink.trim()
      : "";

  const safeOfficialLink = /^https?:\/\/\S+$/i.test(officialLink)
    ? officialLink
    : "";

  const displayDate = article.publishedAt ?? article.createdAt;

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(9,9,9,0.60), rgba(9,9,9,0.76)), url("${ARTICLE_BACKGROUND_IMAGE}")`,
  };

  return (
    <article
      className="relative -mx-4 min-h-[60vh] bg-[#090909] bg-cover bg-center bg-no-repeat px-4 py-6 text-white sm:-mx-6 sm:px-6 sm:py-10 lg:-mx-8 lg:px-8"
      style={backgroundStyle}
    >
      <div className="mx-auto max-w-6xl">
        {/* Admin controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              article.status === "published"
                ? "border-green-400/30 text-green-300"
                : "border-amber-300/30 text-amber-200"
            }`}
          >
            {article.status === "published" ? "Published" : "Draft preview"}
          </span>

          <Link
            href={`/admin/articles/${id}/edit`}
            className="inline-flex min-h-10 items-center rounded-lg border border-[#FFD43B]/40 px-4 py-2 text-sm font-semibold text-[#FFD43B] transition hover:bg-[#FFD43B]/10"
          >
            Edit article
          </Link>
        </div>

        <AdminPageHeader badge="Article preview">
          <span className="text-white">{article.title}</span>
        </AdminPageHeader>

        {article.category && (
          <p className="mb-5 mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[#FFD43B]">
            {article.category}
          </p>
        )}

        {/* Article content left, rectangular thumbnail right */}
        <div className="mt-7 grid grid-cols-1 items-start gap-7 md:mt-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-10">
          <section className="min-w-0">
            <h1 className="mb-4 break-words text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              <ArticleHeading title={article.title} />
            </h1>

            <time
              dateTime={displayDate.toISOString()}
              className="mb-6 block text-sm text-gray-300"
            >
              {new Intl.DateTimeFormat("en", {
                dateStyle: "long",
              }).format(displayDate)}
            </time>

            {article.excerpt && (
              <div className="mb-6 rounded-xl border border-white/10 bg-black/25 p-4 sm:p-5">
                <p className="mb-0 whitespace-pre-line text-base leading-8 text-gray-100 sm:text-lg sm:leading-9">
                  {article.excerpt}
                </p>
              </div>
            )}

            {article.content && article.content.length > 0 && (
              <div className="article-detail-content min-w-0 break-words">
                <ArticleContent blocks={article.content} />
              </div>
            )}
          </section>

          {article.thumbnailUrl && (
            <aside className="min-w-0 lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-[#FFD43B]/35 bg-[#111]/80 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:p-3">
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-black/30">
                  <Image
                    src={article.thumbnailUrl}
                    alt={`${article.title} article thumbnail`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-contain"
                  />
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Hashtags first, official link button afterwards */}
        <div className="mt-9 border-t border-white/15 pt-6 sm:mt-12 sm:pt-8">
          {article.hashtags && article.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.hashtags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="rounded-full border border-[#FFD43B]/35 bg-black/30 px-3 py-1.5 text-xs font-semibold text-[#FFD43B] sm:text-sm"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}

          {safeOfficialLink && (
            <div className="mt-6">
              <a
                href={safeOfficialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="site-btn-primary inline-flex min-h-11 items-center justify-center gap-2"
              >
                Read Official Announcement
              <span aria-hidden="true">→</span>
              </a>
            </div>
          )}
        </div>

        {article.updatedAt.getTime() > displayDate.getTime() && (
          <p className="mt-8 border-t border-white/10 pt-5 text-sm text-gray-400">
            Updated{" "}
            <time dateTime={article.updatedAt.toISOString()}>
              {new Intl.DateTimeFormat("en", {
                dateStyle: "long",
              }).format(article.updatedAt)}
            </time>
          </p>
        )}
      </div>
    </article>
  );
}

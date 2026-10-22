import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/blog/article-content";
import { ArticleThumbnail } from "@/components/blog/article-thumbnail";
import { BrandLoader } from "@/components/layout/brand-loader";
import { getPublishedArticleBySlug } from "@/features/articles/articles";
import { connection } from "next/server";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const ARTICLE_BACKGROUND_IMAGE = "/images/blog-bg.png";

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

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  await connection();

  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | DK & SM Academy",
      robots: { index: false, follow: false },
    };
  }

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;

  return {
    title: `${title} | DK & SM Academy`,
    description,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${article.slug}`,
      publishedTime: article.publishedAt || undefined,
      images: article.thumbnailUrl ? [article.thumbnailUrl] : undefined,
    },
    twitter: {
      card: article.thumbnailUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: article.thumbnailUrl ? [article.thumbnailUrl] : undefined,
    },
  };
}

async function PublishedArticle({ params }: ArticlePageProps) {
  await connection();

  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) notFound();

  const contentBlocks = article.content ?? [];

  // Support the existing articleLink field and trim accidental whitespace.
  const officialLink =
    typeof article.articleLink === "string"
      ? article.articleLink.trim()
      : "";

  const safeOfficialLink = /^https?:\/\/\S+$/i.test(officialLink)
    ? officialLink
    : "";

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(9,9,9,0.58), rgba(9,9,9,0.72)), url("${ARTICLE_BACKGROUND_IMAGE}")`,
  };

  return (
    <article
      className="relative min-h-[60vh] border-t border-[#FFD43B]/25 bg-[#090909] bg-cover bg-center bg-no-repeat py-8 text-white sm:py-12 lg:py-16"
      style={backgroundStyle}
    >
      <div className="site-container">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-14">
            {/* Left: article title and description */}
            <div className="min-w-0">
              <header className="mb-6">
                <h1 className="mb-4 break-words text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  <ArticleHeading title={article.title} />
                </h1>

                {article.publishedAt && (
                  <p className="mb-0 text-sm text-gray-300">
                    <time dateTime={article.publishedAt}>
                      {new Intl.DateTimeFormat("en", {
                        dateStyle: "long",
                      }).format(new Date(article.publishedAt))}
                    </time>
                  </p>
                )}
              </header>

              {article.excerpt && (
                <div className="mb-6 rounded-xl border border-white/10 bg-black/25 p-4 sm:p-5">
                  <p className="mb-0 whitespace-pre-line text-base leading-8 text-gray-100 sm:text-lg sm:leading-9">
                    {article.excerpt}
                  </p>
                </div>
              )}

              {contentBlocks.length > 0 && (
                <div className="article-detail-content min-w-0 break-words">
                  <ArticleContent blocks={contentBlocks} />
                </div>
              )}
            </div>

            {/* Right: rectangular thumbnail */}
            {article.thumbnailUrl && (
              <aside className="min-w-0 lg:sticky lg:top-24">
                <div className="overflow-hidden rounded-2xl border border-[#FFD43B]/35 bg-[#111]/80 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:p-3">
                  <div className="overflow-hidden rounded-xl">
                    <ArticleThumbnail
                      src={article.thumbnailUrl}
                      alt={`${article.title} article thumbnail`}
                      sizes="(min-width: 1024px) 45vw, 100vw"
                    />
                  </div>
                </div>
              </aside>
            )}
          </div>

          {/* Bottom: hashtags, then official link button */}
          <div className="mt-10 border-t border-white/15 pt-6 sm:mt-12 sm:pt-8">
            {article.hashtags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.hashtags.map((tag) => (
                  <span
                    key={tag}
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
                  className="site-btn-primary inline-flex items-center justify-center gap-2"
                  aria-label={`Read the official announcement for ${article.title}`}
                >
                  Read Official Announcement
              <span aria-hidden="true">→</span>
                </a>
              </div>
            )}
          </div>

          {article.updatedAt &&
            article.publishedAt &&
            new Date(article.updatedAt).getTime() >
              new Date(article.publishedAt).getTime() && (
              <div className="mt-8 border-t border-white/10 pt-5 text-sm text-gray-400">
                <p className="mb-0">
                  Updated{" "}
                  <time dateTime={article.updatedAt}>
                    {new Intl.DateTimeFormat("en", {
                      dateStyle: "long",
                    }).format(new Date(article.updatedAt))}
                  </time>
                </p>
              </div>
            )}
        </div>
      </div>
    </article>
  );
}

export default function ArticlePage({ params }: ArticlePageProps) {
  return (
    <Suspense fallback={<BrandLoader />}>
      <PublishedArticle params={params} />
    </Suspense>
  );
}

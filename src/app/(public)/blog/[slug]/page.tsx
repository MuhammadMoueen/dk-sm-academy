import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/blog/article-content";
import { ArticleThumbnail } from "@/components/blog/article-thumbnail";
import { getPublishedArticleBySlug } from "@/features/articles/articles";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getPublishedArticleBySlug(slug);

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
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${article.slug}`,
      publishedTime: article.publishedAt,
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
  const { slug } = await params;
  const article = getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-[60vh] border-t border-[#ffd43b]/25 bg-[#080808] py-10 text-white sm:py-12 lg:py-14">
      <div className="site-container">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8">
            <a
              href="/blog"
              className="mb-5 inline-flex min-h-10 items-center font-semibold !text-[#ffd43b] underline underline-offset-4 hover:!text-[#ffe16a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b]"
            >
              ← All articles
            </a>
            {article.category && (
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#ffd43b]">
                {article.category}
              </p>
            )}
            <h1 className="mb-4 text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-tight tracking-[-0.04em] !text-white">
              {article.title}
            </h1>
            <p className="mb-0 text-sm text-gray-400">
              <time dateTime={article.publishedAt}>
                {new Intl.DateTimeFormat("en", {
                  dateStyle: "long",
                }).format(new Date(article.publishedAt))}
              </time>
            </p>
          </header>

          <ArticleThumbnail
            src={article.thumbnailUrl}
            alt={`${article.title} article thumbnail`}
            sizes="(min-width: 1024px) 896px, 100vw"
          />

          <ArticleContent blocks={article.content} />

          <div className="mt-10 border-t border-[#ffd43b]/20 pt-6 text-sm text-gray-400">
            {article.updatedAt !== article.publishedAt && (
              <p className="mb-0">
                Updated{" "}
                <time dateTime={article.updatedAt}>
                  {new Intl.DateTimeFormat("en", {
                    dateStyle: "long",
                  }).format(new Date(article.updatedAt))}
                </time>
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function ArticleLoadingState() {
  return (
    <div
      aria-label="Loading article"
      className="min-h-[60vh] border-t border-[#ffd43b]/25 bg-[#080808] py-10 sm:py-12"
    >
      <div className="site-container">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="mb-4 h-10 w-2/3 rounded bg-white/10" />
          <div className="mb-8 h-5 w-1/3 rounded bg-white/10" />
          <div className="aspect-[16/9] rounded-2xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function ArticlePage({ params }: ArticlePageProps) {
  return (
    <Suspense fallback={<ArticleLoadingState />}>
      <PublishedArticle params={params} />
    </Suspense>
  );
}

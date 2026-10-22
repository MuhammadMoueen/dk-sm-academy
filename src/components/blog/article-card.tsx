import Link from "next/link";
import { ArticleThumbnail } from "@/components/blog/article-thumbnail";
import type { Article } from "@/types/article";

export function ArticleCard({
  article,
  preview = false,
}: {
  article?: Article;
  preview?: boolean;
}) {
  const content = (
    <>
      <div className="overflow-hidden">
        <ArticleThumbnail
          src={article?.thumbnailUrl ?? ""}
          alt={
            article
              ? `${article.title} article thumbnail`
              : "Article thumbnail preview"
          }
          sizes="(min-width: 1280px) 280px, (min-width: 640px) 45vw, 86vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {article?.category && (
          <span className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#FFD43B]">
            {article.category}
          </span>
        )}

        <h3 className="mb-2 line-clamp-2 text-base font-black leading-snug !text-[#FFD43B] sm:text-lg">
        {article?.title ?? "Article title"}
        </h3>

        <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-gray-300">
          {article?.excerpt ??
            (preview
              ? "A concise introduction to an educational article will appear here once it is published."
              : "Article summary")}
        </p>

        {article?.hashtags?.length ? (
          <div className="mb-3 flex flex-wrap gap-x-2 gap-y-1">
            {article.hashtags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-semibold text-[#FFD43B]"
              >
                {tag.startsWith("#") ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto pt-1">
          {article ? (
            <Link
              href={`/blog/${article.slug}`}
              className="site-btn-primary inline-flex min-h-9 items-center gap-2 px-4 py-2 text-sm"
            >
              Read More <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <span className="inline-flex min-h-9 items-center text-sm font-semibold text-gray-500">
              {preview ? "Read More · Coming soon" : "Not published"}
            </span>
          )}
        </div>
      </div>
    </>
  );

  const className =
    "group flex h-full min-w-0 snap-start flex-col overflow-hidden rounded-xl border border-[#FFD43B]/25 bg-[#111] shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:border-[#FFD43B]/60 hover:shadow-[0_12px_30px_rgba(255,207,50,0.09)] motion-reduce:transform-none motion-reduce:transition-none";

  return article ? (
    <article className={className}>{content}</article>
  ) : (
    <div className={className}>{content}</div>
  );
}
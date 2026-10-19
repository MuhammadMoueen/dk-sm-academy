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
      <ArticleThumbnail
        src={article?.thumbnailUrl ?? ""}
        alt={article ? `${article.title} article thumbnail` : ""}
        sizes="(min-width: 1280px) 280px, (min-width: 640px) 45vw, 86vw"
      />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {article?.category && (
          <span className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#ffd43b]">
            {article.category}
          </span>
        )}
        <h3 className="mb-2 text-lg font-bold leading-snug !text-white sm:text-xl">
          {article?.title ?? "Article title"}
        </h3>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-300">
          {article?.excerpt ??
            (preview
              ? "A concise introduction to an educational article will appear here once it is published."
              : "Article summary")}
        </p>
        {article ? (
          <Link
            href={`/blog/${article.slug}`}
            className="inline-flex min-h-10 w-fit items-center gap-2 font-semibold !text-[#ffd43b] underline decoration-[#ffd43b]/70 underline-offset-4 transition-colors hover:!text-[#ffe16a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b] motion-reduce:transition-none"
          >
            Read Article <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <span className="inline-flex min-h-10 w-fit items-center font-semibold text-gray-500">
            {preview ? "Read Article · Coming soon" : "Not published"}
          </span>
        )}
      </div>
    </>
  );

  const className =
    "group flex min-w-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#ffd43b]/25 bg-[#111] shadow-[0_12px_34px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-1 hover:border-[#ffd43b]/55 hover:shadow-[0_16px_40px_rgba(255,207,50,0.09)] motion-reduce:transform-none motion-reduce:transition-none";

  return article ? (
    <article className={className}>{content}</article>
  ) : (
    <div className={className}>{content}</div>
  );
}

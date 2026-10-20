"use client";

import { useState } from "react";
import { ArticleCard } from "@/components/blog/article-card";
import type { Article } from "@/types/article";

export function ArticleCollection({
  articles,
  homepage = false,
  initialCount = 12,
}: {
  articles: Article[];
  homepage?: boolean;
  initialCount?: number;
}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  if (articles.length === 0) {
    if (homepage) {
      return (
        <div
          aria-label="Article card previews"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 xl:grid-cols-4"
        >
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="w-[min(86vw,320px)] shrink-0 sm:w-auto"
            >
              <ArticleCard preview />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-dashed border-[#ffd43b]/30 bg-[#111] px-5 py-10 text-center sm:py-14">
        <h2 className="mb-2 text-lg font-semibold !text-white">
          No articles published yet
        </h2>
        <p className="mb-0 text-sm text-gray-400">
          New educational articles will appear here after they have been
          published.
        </p>
      </div>
    );
  }

  const visibleArticles = articles.slice(0, visibleCount);

  return (
    <>
      <div
        className={
          homepage
            ? "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 xl:grid-cols-4"
            : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }
      >
        {visibleArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      {visibleCount < articles.length && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + initialCount)}
            className="site-btn-primary inline-flex"
          >
            Load More Articles <span aria-hidden="true">↓</span>
          </button>
        </div>
      )}
    </>
  );
}

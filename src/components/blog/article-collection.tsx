"use client";

import { useEffect, useId, useRef, useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselId = useId();

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const cards = Array.from(carousel.querySelectorAll<HTMLElement>("[data-article-card]"));
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleCard = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleCard) {
          const index = cards.indexOf(visibleCard.target as HTMLElement);
          if (index >= 0) setActiveIndex(index);
        }
      },
      { root: carousel, threshold: [0.6, 0.8] },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [visibleCount, articles.length]);

  function scrollToArticle(index: number) {
    carouselRef.current
      ?.querySelectorAll<HTMLElement>("[data-article-card]")
      .item(index)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  if (articles.length === 0) {
    if (homepage) {
      return (
        <div
          aria-label="Article card previews"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 xl:grid-cols-4"
        >
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="w-[calc(100%-2rem)] max-w-[360px] shrink-0 sm:w-auto sm:max-w-none">
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
        ref={carouselRef}
        id={carouselId}
        aria-label={homepage ? "Latest articles" : "Articles"}
        className={
          "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 " +
          (homepage ? "xl:grid-cols-4" : "lg:grid-cols-3 xl:grid-cols-4")
        }
      >
        {visibleArticles.map((article) => (
          <div
            key={article.id}
            data-article-card
            className="w-[calc(100%-2rem)] max-w-[360px] shrink-0 sm:w-auto sm:max-w-none"
          >
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
      {visibleArticles.length > 1 && (
        <div
          aria-label="Article carousel pagination"
          className="mt-3 flex justify-center gap-2 sm:hidden"
        >
          {visibleArticles.map((article, index) => (
            <button
              key={article.id}
              type="button"
              aria-label={`Show article ${index + 1} of ${visibleArticles.length}`}
              aria-controls={carouselId}
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => scrollToArticle(index)}
              className={`h-2.5 w-2.5 rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808] ${
                activeIndex === index
                  ? "border-[#ffd43b] bg-[#ffd43b]"
                  : "border-white/40 bg-white/10 hover:border-[#ffd43b]/70"
              }`}
            />
          ))}
        </div>
      )}
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

"use client";

import { useMemo, useState } from "react";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import type { PortfolioItem } from "@/types/portfolio";

export function PortfolioCollection({
  items,
  previewWhenEmpty = false,
  initialCount = 8,
}: {
  items: PortfolioItem[];
  previewWhenEmpty?: boolean;
  initialCount?: number;
}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const publishedItems = useMemo(
    () =>
      items
        .filter((item) => item.status === "published")
        .slice()
        .sort(
          (first, second) =>
            new Date(second.createdAt).getTime() -
            new Date(first.createdAt).getTime(),
        ),
    [items],
  );

  if (publishedItems.length === 0) {
    if (previewWhenEmpty) {
      return (
        <div
          aria-label="Portfolio card previews"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4"
        >
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="w-[min(86vw,320px)] shrink-0 sm:w-auto"
            >
              <PortfolioCard preview />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-dashed border-[#ffd43b]/30 bg-[#111] px-5 py-10 text-center sm:py-14">
        <p className="mb-2 text-lg font-semibold text-white">
          No published portfolio entries yet
        </p>
        <p className="mb-0 text-sm text-gray-400">
          Client dealings and reviews will appear here after an authorized
          admin publishes them.
        </p>
      </div>
    );
  }

  const visibleItems = publishedItems.slice(0, visibleCount);

  return (
    <>
      <div
        className={
          previewWhenEmpty
            ? "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4"
            : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }
      >
        {visibleItems.map((item) => (
          <PortfolioCard key={item.id} item={item} />
        ))}
      </div>

      {visibleCount < publishedItems.length && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + initialCount)}
            className="btn-secondary min-h-11 !text-[#ffd43b] hover:!text-[#ffe16a]"
          >
            Load More Reviews <span aria-hidden="true">↓</span>
          </button>
        </div>
      )}
    </>
  );
}

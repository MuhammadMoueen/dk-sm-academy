
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PortfolioCard } from "@/components/portfolio/portfolio-card";
import type { PortfolioItem } from "@/types/portfolio";

const CARD_WIDTH = 290;
const MOBILE_CARD_WIDTH = 260;
const VISIBLE_DEPTH = 5;

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
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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

  const isPreview =
    publishedItems.length === 0 && previewWhenEmpty;

  const orbitItems: (PortfolioItem | undefined)[] = isPreview
    ? Array.from({ length: 4 }, () => undefined)
    : publishedItems;

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage || orbitItems.length === 0) return;

    let animationFrame = 0;
    let previousTime = 0;
    let rotation = 0;

    const animate = (time: number) => {
      if (!previousTime) previousTime = time;

      const delta = Math.min(time - previousTime, 40);
      previousTime = time;

      // Continuous rotation. Hover never pauses the orbit.
      rotation += delta * 0.00024;

      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const mobile = width < 640;
      const count = orbitItems.length;

      const radiusX = Math.min(
        width * (mobile ? 0.36 : 0.37),
        mobile ? 165 : 430,
      );

      const radiusZ = Math.min(
        width * (mobile ? 0.22 : 0.24),
        mobile ? 100 : 230,
      );

      const radiusY = Math.min(height * 0.07, 30);

      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const angle =
          rotation + (index * Math.PI * 2) / count;

        const x = Math.sin(angle) * radiusX;
        const z = Math.cos(angle) * radiusZ;
        const y = Math.sin(angle * 2) * radiusY;

        const depth = (z + radiusZ) / (2 * radiusZ);
        const scale = 0.68 + depth * 0.32;
        const opacity = 0.48 + depth * 0.52;
        const tilt = -Math.sin(angle) * 10;

        card.style.transform =
          `translate(-50%, -50%) ` +
          `translate3d(${x}px, ${y}px, ${z}px) ` +
          `scale(${scale}) rotateY(${tilt}deg)`;

        card.style.opacity = String(opacity);
        card.style.zIndex = String(Math.round(depth * 100));

        // Keep cards at the back subtle without removing them
        // from the orbit or stopping their movement.
        card.style.filter =
          depth < 0.25 ? "brightness(0.72)" : "brightness(1)";
      });

      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [orbitItems.length]);

  if (publishedItems.length === 0 && !previewWhenEmpty) {
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
        ref={stageRef}
        aria-label="Rotating portfolio reviews"
        className="relative h-[430px] overflow-hidden sm:h-[490px] lg:h-[540px]"
        style={{ perspective: "1200px" }}
      >
        {orbitItems.map((item, index) => (
          <div
            key={item?.id ?? `portfolio-preview-${index}`}
            ref={(element) => {
              cardsRef.current[index] = element;
            }}
            className="absolute left-1/2 top-1/2 w-[min(76vw,290px)] sm:w-[290px]"
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform, opacity",
            }}
          >
            <PortfolioCard item={item} preview={!item} />
          </div>
        ))}
      </div>

      {!isPreview && visibleCount < publishedItems.length && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((count) => count + initialCount)
            }
            className="site-btn-primary inline-flex"
          >
            Load More Reviews <span aria-hidden="true">↓</span>
          </button>
        </div>
      )}
    </>
  );
}

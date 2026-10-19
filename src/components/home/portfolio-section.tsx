
import Image from "next/image";
import Link from "next/link";
import { PortfolioCollection } from "@/components/portfolio/portfolio-collection";
import { publishedPortfolioItems } from "@/features/portfolio/portfolio-data";
import type { PortfolioItem } from "@/types/portfolio";

function PortfolioIntroduction({
  fullPage = false,
}: {
  fullPage?: boolean;
}) {
  const Heading = fullPage ? "h1" : "h2";

  return (
    <header className="mb-7 max-w-3xl sm:mb-9">
      <span className="section-eyebrow">
        <span aria-hidden="true">✦</span>
        Client Portfolio
      </span>

      <Heading
        id="portfolio-heading"
        className="mb-3 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight tracking-[-0.04em] !text-white"
      >
        Real Deals.{" "}
        <span className="!text-[#ffd43b]">Real Experiences.</span>
      </Heading>

      <p className="max-w-2xl leading-relaxed text-gray-300">
        {fullPage
          ? "Read client feedback shared with DK & SM Academy. Portfolio entries are displayed after they have been reviewed and published."
          : "A selection of client dealings and feedback shared with DK & SM Academy. Each published entry includes its transaction image and the client’s own review."}
      </p>
    </header>
  );
}

export function PortfolioSection({
  items = publishedPortfolioItems,
  fullPage = false,
}: {
  items?: PortfolioItem[];
  fullPage?: boolean;
}) {
  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className={`relative isolate scroll-mt-20 overflow-hidden border-t border-[#ffd43b]/25 bg-[#080808] text-white ${
        fullPage
          ? "min-h-[60vh] py-10 sm:py-12 lg:py-14"
          : "py-8 sm:py-10 lg:py-10"
      }`}
    >
      {/* Portfolio background image */}
      <Image
        src="/images/portfolio-bg.png"
        alt=""
        fill
        priority={fullPage}
        sizes="100vw"
        className="pointer-events-none -z-20 object-cover object-center opacity-35"
      />

      {/* Dark overlay for readable text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#080808]/70 via-[#080808]/75 to-[#080808]/95"
      />

      <div className="site-container">
        <PortfolioIntroduction fullPage={fullPage} />

        <PortfolioCollection
          items={items}
          previewWhenEmpty={!fullPage}
          initialCount={fullPage ? 8 : 4}
        />

        {!fullPage && (
          <div className="mt-7 flex justify-center">
            <Link
              href="/portfolio"
              className="btn-secondary min-h-11 !text-[#ffd43b] hover:!text-[#ffe16a]"
            >
              View All Reviews <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

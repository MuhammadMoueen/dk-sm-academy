import { Suspense } from "react";
import type { Metadata } from "next";
import { ArticleCollection } from "@/components/blog/article-collection";
import { BrandLoader } from "@/components/layout/brand-loader";
import { getPublishedArticles } from "@/features/articles/articles";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Latest Articles | DK & SM Academy",
  description:
    "Explore educational articles about AI, technology, Forex, Crypto, and market insights from DK & SM Academy.",
  openGraph: {
    type: "website",
    title: "Latest Articles | DK & SM Academy",
    description:
      "Educational articles about AI, technology, Forex, Crypto, and market insights.",
    url: "/blog",
  },
};

const BLOG_BACKGROUND_IMAGE = "/images/blog-bg.png";

async function BlogContent() {
  await connection();

  const articles = await getPublishedArticles();

  return (
    <section
      aria-labelledby="blog-list-heading"
      className="relative isolate min-h-[60vh] overflow-hidden border-t border-[#FFD43B]/25 bg-[#080808] py-10 text-white sm:py-12 lg:py-14"
    >
      {/* Background image with a light dark overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(8,8,8,0.42), rgba(8,8,8,0.62)), url("${BLOG_BACKGROUND_IMAGE}")`,
        }}
      />

      <div className="site-container">
        <header className="mb-8 max-w-3xl sm:mb-10">
          <span className="section-eyebrow">
            <span aria-hidden="true">✦</span>
            Latest Insights
          </span>

          <h1
            id="blog-list-heading"
            className="mb-3 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight tracking-[-0.04em] !text-white"
          >
            Explore Our{" "}
            <span className="!text-[#FFD43B]">Articles</span>
          </h1>

          <p className="max-w-2xl leading-relaxed text-gray-200">
            Educational reading on AI, technology, Forex, Crypto, market
            insights, and other topics for curious, independent learners.
          </p>
        </header>

        <ArticleCollection articles={articles} initialCount={12} />
      </div>
    </section>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BrandLoader />}>
      <BlogContent />
    </Suspense>
  );
}

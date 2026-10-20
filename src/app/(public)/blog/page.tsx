import type { Metadata } from "next";
import { ArticleCollection } from "@/components/blog/article-collection";
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

export default async function BlogPage() {
  await connection();
  const articles = await getPublishedArticles();

  return (
    <section
      aria-labelledby="blog-list-heading"
      className="min-h-[60vh] border-t border-[#ffd43b]/25 bg-[#080808] py-10 text-white sm:py-12 lg:py-14"
    >
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
            Explore Our <span className="!text-[#ffd43b]">Articles</span>
          </h1>
          <p className="max-w-2xl leading-relaxed text-gray-300">
            Educational reading on AI, technology, Forex, Crypto, market
            insights, and other topics for curious, independent learners.
          </p>
        </header>

        <ArticleCollection articles={articles} initialCount={12} />
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArticleCollection } from "@/components/blog/article-collection";
import { getPublishedArticles } from "@/features/articles/articles";

export function BlogSection() {
  return (
    <section
      id="blog"
      aria-labelledby="blog-heading"
      className="scroll-mt-20 border-t border-[#ffd43b]/25 bg-[#080808] py-8 text-white sm:py-10 lg:py-10"
    >
      <div className="site-container">
        <header className="mb-7 max-w-3xl sm:mb-9">
          <span className="section-eyebrow">
            <span aria-hidden="true">✦</span>
            Latest Insights
          </span>
          <h2
            id="blog-heading"
            className="mb-3 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight tracking-[-0.04em] !text-white"
          >
            Explore Our <span className="!text-[#ffd43b]">Latest Articles</span>
          </h2>
          <p className="max-w-2xl leading-relaxed text-gray-300">
            Educational articles covering AI, technology, Forex, Crypto,
            market insights, and other topics to support thoughtful,
            independent learning.
          </p>
        </header>

        <ArticleCollection
          articles={getPublishedArticles().slice(0, 4)}
          homepage
          initialCount={4}
        />

        <div className="mt-7 flex justify-center">
          <Link
            href="/blog"
            className="btn-secondary min-h-11 !text-[#ffd43b] hover:!text-[#ffe16a]"
          >
            View All Articles <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

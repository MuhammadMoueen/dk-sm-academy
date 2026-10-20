import Link from "next/link";
import { ArticleCollection } from "@/components/blog/article-collection";
import {
  ContentPage,
  ContentSection,
} from "@/components/pages/content-page";
import { getPublishedArticles } from "@/features/articles/articles";

const resourceCategories = [
  {
    title: "Crypto and USDT basics",
    description:
      "Start with introductory information about digital assets, common terminology, and basic transaction considerations.",
    links: [{ label: "Crypto & USDT Buy/Sell", href: "/services/buy-sell" }],
  },
  {
    title: "Buying and selling concepts",
    description:
      "Review general considerations for exchanges, transaction details, supported networks, and checking transfer information.",
    links: [{ label: "Buy/Sell information", href: "/services/buy-sell" }],
  },
  {
    title: "Exchange features and account security",
    description:
      "Explore general exchange and campaign information alongside reminders to review provider terms and protect account credentials.",
    links: [
      { label: "Exchange Campaigns", href: "/services/exchange-campaigns" },
      { label: "Crypto & USDT Buy/Sell", href: "/services/buy-sell" },
    ],
  },
  {
    title: "Forex and market fundamentals",
    description:
      "The current site has no separate Forex-only course. The linked pages cover general market concepts, chart reading, trading education, and risk awareness.",
    links: [
      { label: "Trading & Market Analysis", href: "/services/trading" },
      { label: "Courses information", href: "/services/courses" },
    ],
  },
  {
    title: "Market analysis and risk management",
    description:
      "Learn how market commentary and analysis are presented, and why risk awareness matters when evaluating trading ideas.",
    links: [{ label: "Market Analysis", href: "/services/trading" }],
  },
];

export function LearningResourcesPage() {
  const articles = getPublishedArticles();

  return (
    <ContentPage
      eyebrow="Learning Resources"
      title={<>Explore and <span className="text-[#ffd43b]">Learn</span></>}
      description="Browse the educational information currently available from DK & SM Academy. Follow the links below to existing service pages and published articles."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {resourceCategories.map((category) => (
          <section
            key={category.title}
            className="flex min-w-0 flex-col rounded-2xl border border-[#ffd43b]/20 bg-[#101010]/90 p-5 sm:p-6"
          >
            <h2 className="mb-2 text-lg font-bold text-[#ffd43b]">
              {category.title}
            </h2>
            <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-300">
              {category.description}
            </p>
            <ul className="flex flex-wrap gap-2">
              {category.links.map((link) => (
                <li key={`${category.title}-${link.href}`}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-10 items-center rounded-lg border border-[#ffd43b]/35 px-3 py-2 text-sm font-semibold text-[#ffd43b] transition-colors hover:border-[#ffd43b] hover:text-[#ffe16a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b]"
                  >
                    {link.label} <span className="ml-2" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <ContentSection title="Published articles, guides, and videos">
        <p>
          Published written articles appear here when available. There are no
          published articles in the current site data. No separate video or
          downloadable learning library is currently configured.
        </p>
        <ArticleCollection articles={articles} initialCount={8} />
        <p>
          Visit the{" "}
          <Link
            href="/blog"
            className="font-semibold text-[#ffd43b] underline decoration-[#ffd43b]/50 underline-offset-4 hover:text-[#ffe16a]"
          >
            Blog listing
          </Link>{" "}
          to check for new publications.
        </p>
      </ContentSection>

      <ContentSection title="Educational notice">
        <p>
          These resources are for general educational and informational
          purposes only. They are not personalized financial, investment,
          legal, or tax advice. Trading and digital assets involve risk, and
          losses are possible. Read the full{" "}
          <Link
            href="/disclaimer"
            className="font-semibold text-[#ffd43b] underline decoration-[#ffd43b]/50 underline-offset-4 hover:text-[#ffe16a]"
          >
            Disclaimer
          </Link>{" "}
          before relying on website information.
        </p>
      </ContentSection>
    </ContentPage>
  );
}

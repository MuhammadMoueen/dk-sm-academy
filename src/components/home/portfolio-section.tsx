import Link from "next/link";

const learningAreas = [
  {
    number: "01",
    title: "Crypto foundations",
    description:
      "Explore educational guides that introduce digital assets, wallets, and blockchain concepts.",
    href: "/services/buy-sell",
  },
  {
    number: "02",
    title: "Market literacy",
    description:
      "Build familiarity with market terminology, chart concepts, and risk-aware learning.",
    href: "/services/trading",
  },
  {
    number: "03",
    title: "Digital skills",
    description:
      "Learn about structured courses, responsible content, and practical online skills.",
    href: "/services/courses",
  },
];

export function PortfolioSection() {
  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className="scroll-mt-20 bg-[#080808] py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="site-container">
        <header className="mb-8 max-w-3xl sm:mb-10">
          <span className="section-eyebrow">
            <span aria-hidden="true">✦</span>
            Learning Portfolio
          </span>
          <h2
            id="portfolio-heading"
            className="mb-3 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight tracking-[-0.04em] text-white"
          >
            Explore our <span className="text-[#ffd43b]">learning areas</span>
          </h2>
          <p className="max-w-2xl leading-relaxed text-gray-300">
            A look at the subjects and learning resources available through DK
            &amp; SM Academy.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {learningAreas.map((area) => (
            <article
              key={area.number}
              className="rounded-2xl border border-[#ffd43b]/20 bg-[#111] p-5 transition-colors hover:border-[#ffd43b]/50 sm:p-6"
            >
              <p className="mb-5 text-sm font-bold tracking-[0.15em] text-[#ffd43b]">
                {area.number}
              </p>
              <h3 className="mb-2 text-xl font-bold text-white">
                {area.title}
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-gray-300">
                {area.description}
              </p>
              <Link
                href={area.href}
                className="inline-flex items-center gap-2 font-semibold text-[#ffd43b] hover:text-[#ffe16a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b]"
              >
                Explore topic <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { siteConfig } from "@/config/site";

function CommunityImagePlaceholder({ name }: { name: string }) {
  return (
    <div
      role="img"
      aria-label={`${name} image placeholder. Platform screenshot will be added later.`}
      className="relative flex aspect-[16/9] flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#ffd43b]/25 bg-[#1a1915] text-center"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,207,50,0.12),transparent_65%)]"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="relative h-8 w-8 text-[#ffd43b]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <span className="relative text-sm font-medium text-gray-300">
        {name} screenshot
      </span>
      <span className="relative text-xs text-gray-500">Image to be added</span>
    </div>
  );
}

function CommunityCard({
  platform,
}: {
  platform: (typeof siteConfig.communityPlatforms)[number];
}) {
  const content = (
    <>
      <CommunityImagePlaceholder name={platform.name} />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="mb-2 text-xl font-bold !text-[#ffd43b]">
          {platform.name}
        </h3>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-300">
          {platform.description}
        </p>
        <span
          className={`inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
            platform.href
              ? "border-[#ffd43b]/45 !text-[#ffd43b] group-hover:border-[#ffd43b] group-hover:!text-[#ffe16a]"
              : "border-white/15 text-gray-400"
          }`}
        >
          {platform.action}
          {platform.href && <span aria-hidden="true">↗</span>}
        </span>
      </div>
    </>
  );

  const cardClassName =
    "group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#ffd43b]/25 bg-[#111] shadow-[0_12px_34px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-[#ffd43b]/55 hover:shadow-[0_16px_40px_rgba(255,207,50,0.09)] motion-reduce:transform-none motion-reduce:transition-none";

  return platform.href ? (
    <Link
      href={platform.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClassName}
      aria-label={`${platform.action}: ${platform.name} (opens in a new tab)`}
    >
      {content}
    </Link>
  ) : (
    <article className={cardClassName}>{content}</article>
  );
}

export function CommunitySection() {
  return (
    <section
      id="community"
      aria-labelledby="community-heading"
      className="scroll-mt-20 border-t border-[#ffd43b]/25 bg-[#080808] py-8 text-white sm:py-10 lg:py-10"
    >
      <div className="site-container">
        <header className="mb-7 max-w-3xl sm:mb-9">
          <span className="section-eyebrow">
            <span aria-hidden="true">✦</span>
            Learn Together
          </span>
          <h2
            id="community-heading"
            className="mb-3 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight tracking-[-0.04em] !text-white"
          >
            Grow with the <span className="!text-[#ffd43b]">Community</span>
          </h2>
          <p className="max-w-2xl leading-relaxed text-gray-300">
            Follow DK &amp; SM Academy on your preferred platform to learn,
            connect, and keep up with new educational resources.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {siteConfig.communityPlatforms.map((platform) => (
            <CommunityCard key={platform.name} platform={platform} />
          ))}
        </div>
      </div>
    </section>
  );
}

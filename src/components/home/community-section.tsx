import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

const LINKEDIN_URL = "https://www.linkedin.com/";

const communityImages: Record<string, string> = {
  YouTube: "/images/community/youtube.png",
  WhatsApp: "/images/community/whatsapp.png",
  Telegram: "/images/community/telegram.png",
  LinkedIn: "/images/community/linkedin.png",
};

function CommunityImage({
  name,
  image,
}: {
  name: string;
  image: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${name} platform screenshot`}
      className="relative aspect-[16/9] overflow-hidden rounded-xl border border-[#ffd43b]/25 bg-[#111]"
    >
      <Image
        src={image}
        alt={`${name} platform screenshot`}
        fill
        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </div>
  );
}

function CommunityCard({
  platform,
}: {
  platform: (typeof siteConfig.communityPlatforms)[number];
}) {
  const isLinkedIn = platform.name === "More Channels";
  const name = isLinkedIn ? "LinkedIn" : platform.name;

  const description = isLinkedIn
    ? "Connect with DK & SM Academy on LinkedIn for professional updates, educational content, and community news."
    : platform.description;

  const href = isLinkedIn ? LINKEDIN_URL : platform.href;
  const action = isLinkedIn ? "Visit LinkedIn" : platform.action;
  const image = communityImages[name];

  const content = (
    <>
      <CommunityImage name={name} image={image} />

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="mb-2 text-xl font-bold text-[#ffd43b]">
          {name}
        </h3>

        <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-300">
          {description}
        </p>

        <span
          className={`inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
            href
              ? "border-[#ffd43b]/45 text-[#ffd43b] group-hover:border-[#ffd43b] group-hover:text-[#ffe16a]"
              : "border-white/15 text-gray-400"
          }`}
        >
          {action}
          {href && <span aria-hidden="true">↗</span>}
        </span>
      </div>
    </>
  );

  const cardClassName =
    "group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#ffd43b]/25 bg-[#111] shadow-[0_12px_34px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-[#ffd43b]/55 hover:shadow-[0_16px_40px_rgba(255,207,50,0.12)] motion-reduce:transform-none motion-reduce:transition-none";

  return href ? (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClassName}
      aria-label={`${action}: ${name} (opens in a new tab)`}
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
            className="mb-3 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight tracking-[-0.04em] text-white"
          >
            Grow with the{" "}
            <span className="text-[#ffd43b]">Community</span>
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

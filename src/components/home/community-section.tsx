import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

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
  const { name, description, href, action } = platform;
  const image = communityImages[name];

  const content = (
    <>
      <CommunityImage name={name} image={image} />

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="mb-2 text-xl font-bold !text-[#FFD43B]">
          {name}
        </h3>

        <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-300">
          {description}
        </p>

        <span
          aria-disabled={href ? undefined : true}
          className="site-btn-primary inline-flex w-fit"
        >
          {action}

          {href && (
            <span
              aria-hidden="true"
              className="inline-block text-xl leading-none"
            >
              →
            </span>
          )}
        </span>
      </div>
    </>
  );

  const cardClassName =
    "group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#ffd43b]/25 bg-[#111]/90 shadow-[0_12px_34px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-[#ffd43b]/55 hover:shadow-[0_16px_40px_rgba(255,207,50,0.12)] motion-reduce:transform-none motion-reduce:transition-none";

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

export function CommunitySection({ page = false }: { page?: boolean }) {
  const Heading = page ? "h1" : "h2";

  return (
    <section
      id="community"
      aria-labelledby="community-heading"
      className={`relative isolate scroll-mt-20 overflow-hidden border-t border-[#ffd43b]/25 bg-[#080808] text-white ${
        page
          ? "min-h-[calc(100vh-72px)] py-12 sm:py-16 lg:py-20"
          : "py-8 sm:py-10 lg:py-10"
      }`}
    >
      <Image
        src="/images/community-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none -z-20 object-cover object-center opacity-35"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#080808]/65 via-[#080808]/55 to-[#080808]/90"
      />

      <div className="site-container">
        <header
          className={`max-w-3xl ${page ? "mb-9 sm:mb-12" : "mb-7 sm:mb-9"}`}
        >
          <span className="section-eyebrow">
            <span aria-hidden="true">✦</span>
            {page ? "Official Community" : "Learn Together"}
          </span>

          <Heading
            id="community-heading"
            className={`mb-3 font-extrabold leading-tight tracking-[-0.04em] text-white ${
              page
                ? "text-[clamp(2.25rem,5vw,3.75rem)]"
                : "text-[clamp(2rem,4vw,3.25rem)]"
            }`}
          >
            {page ? (
              <>
                Learn, connect, and grow with the{" "}
                <span className="text-[#ffd43b]">community</span>
              </>
            ) : (
              <>
                Grow with the <span className="text-[#ffd43b]">Community</span>
              </>
            )}
          </Heading>

          <p className="max-w-2xl leading-relaxed text-gray-300">
            {page
              ? "Join the DK & SM Academy community to explore educational topics, connect with others, and follow updates across our official platforms."
              : "Follow DK & SM Academy on your preferred platform to learn, connect, and keep up with new educational resources."}
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
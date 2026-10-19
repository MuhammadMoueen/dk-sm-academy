import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Airdrop Guides",
    description:
      "Explore airdrop information and project updates. Always check official project rules and eligibility before participating.",
    icon: "/images/icon-airdrop.png",
  },
  {
    title: "Market Analysis",
    description:
      "Learn about market trends through educational analysis and step-by-step trading guidance. No outcome or profit is guaranteed.",
    icon: "/images/icon-market.png",
  },
  {
    title: "Buy & Sell",
    description:
      "Get information about cryptocurrency buying and selling, subject to confirmed rates, availability, verification, and applicable rules.",
    icon: "/images/icon-buy-sell.png",
  },
  {
    title: "KYC Support",
    description:
      "Understand platform verification steps and requirements. Final approval is always decided by the relevant platform.",
    icon: "/images/icon-kyc.png",
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative isolate overflow-hidden bg-[#050505] text-white"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
        <Image
          src="/images/about-person.png"
          alt=""
          fill
          sizes="100vw"
          className="object-contain object-right-bottom opacity-90"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/85 to-black/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/35 via-transparent to-black/20"
      />

      <div className="mx-auto grid min-h-[600px] max-w-[1440px] items-center gap-8 px-6 py-14 sm:px-10 sm:py-16 lg:grid-cols-[1.18fr_0.82fr] lg:gap-4 lg:px-16 lg:py-12">
        <div className="relative z-10 max-w-[760px]">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ffcf32]/70 bg-black/35 px-4 py-2 text-xs font-bold uppercase tracking-wide !text-[#ffcf32] sm:text-sm">
            <span aria-hidden="true" className="text-base">
              ★
            </span>
            About DK &amp; SM Academy
          </p>

          <h2
            id="about-heading"
            className="!text-[clamp(2.75rem,5.2vw,4rem)] !font-extrabold !leading-[1.08] !tracking-tight !text-white"
          >
            Learn. Explore. <span className="!text-[#ffcf32]">Grow.</span>
          </h2>

          <h3 className="mt-1 !text-xl !font-bold !leading-snug !tracking-normal !text-[#ffcf32] sm:!text-[1.65rem]">
            Your Trusted Partner in Digital Finance
          </h3>

          <p className="mt-3 max-w-[650px] text-sm leading-6 !text-white/80 sm:text-base sm:leading-[1.55]">
            DK &amp; SM Academy helps people explore the world of
            cryptocurrencies through practical education, airdrop information,
            market insights, and step-by-step guidance. We share learning
            resources through videos, text guides, and our official channels
            to help people make more informed decisions.
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className={`group flex min-w-0 flex-col items-center px-2 py-1 text-center transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none ${
                  index < features.length - 1
                    ? "border-r border-[#ffcf32]/35"
                    : ""
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#ffcf32]/50 bg-black/55 p-3 transition duration-300 group-hover:border-[#ffcf32] group-hover:shadow-[0_0_24px_rgba(255,207,50,0.22)] motion-reduce:transition-none">
                  <Image
                    src={feature.icon}
                    alt=""
                    width={36}
                    height={36}
                    className="h-full w-full object-contain"
                  />
                </div>
                <h4 className="mt-2.5 max-w-24 !text-sm !font-bold !leading-tight !text-white sm:!text-base">
                  {feature.title}
                </h4>
                <p className="sr-only">{feature.description}</p>
                <span
                  aria-hidden="true"
                  className="mt-2 h-0.5 w-8 rounded-full bg-[#ffcf32]"
                />
              </article>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/services"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#ffcf32] px-6 py-3 text-sm font-extrabold !text-black shadow-[0_8px_30px_rgba(255,207,50,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ffda62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcf32] focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transition-none"
            >
              Explore Our Services
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div aria-hidden="true" className="hidden lg:block" />
      </div>
    </section>
  );
}

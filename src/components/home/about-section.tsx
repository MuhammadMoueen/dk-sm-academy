import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Airdrop Guides",
    description:
      "Explore verified airdrop information, project updates, and available opportunities.",
    icon: "/images/icon-airdrop.png",
  },
  {
    title: "Market Analysis",
    description:
      "Learn about market trends, trading analysis, and step-by-step trading strategies.",
    icon: "/images/icon-market.png",
  },
  {
    title: "Buy & Sell",
    description:
      "Get assistance with cryptocurrency buying and selling, subject to confirmed rates and availability.",
    icon: "/images/icon-buy-sell.png",
  },
  {
    title: "KYC Support",
    description:
      "Get step-by-step guidance on platform verification requirements and procedures.",
    icon: "/images/icon-kyc.png",
  },
];

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative isolate overflow-hidden bg-[#050505] text-white"
    >
      {/* Background Image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/about-background.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/90 to-black/30" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
        {/* LEFT CONTENT */}
        <div className="relative z-10 animate-[aboutFadeUp_0.8s_ease-out]">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ffca28]/70 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#ffca28] sm:text-sm">
            <span aria-hidden="true">✦</span>
            About DK &amp; SM Academy
          </span>

          <h2
            id="about-heading"
            className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl xl:text-6xl"
          >
            Learn. Explore.{" "}
            <span className="text-[#ffca28]">Grow.</span>
          </h2>

          <h3 className="mt-4 text-xl font-bold leading-snug text-[#ffca28] sm:text-2xl">
            Your Trusted Partner in Digital Finance
          </h3>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-200 sm:text-base sm:leading-8">
            DK &amp; SM Academy helps people explore the world of
            cryptocurrencies through practical education, airdrop information,
            market insights, and step-by-step guidance. We share educational
            videos, text guides, trading knowledge, and relevant updates to
            help people make more informed decisions in the digital finance
            space.
          </p>

          {/* FEATURE CARDS */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-3">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                style={{ animationDelay: `${index * 120}ms` }}
                className="group rounded-xl border border-[#ffca28]/25 bg-black/65 p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#ffca28] hover:bg-[#15120a]/90"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#ffca28]/60 bg-black/50 p-2 transition duration-300 group-hover:shadow-[0_0_20px_rgba(255,202,40,0.2)]">
                  <Image
                    src={feature.icon}
                    alt=""
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </div>

                <h4 className="mt-3 text-sm font-bold leading-snug text-[#ffcf32] sm:text-base">
                  {feature.title}
                </h4>

                <p className="mt-2 text-xs leading-5 text-gray-300">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>

          {/* SERVICES BUTTON */}
          <div className="mt-8">
            <Link
              href="/services"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#ffca28] px-6 py-3 text-sm font-extrabold text-black shadow-lg shadow-yellow-500/10 transition duration-300 hover:-translate-y-1 hover:bg-[#ffda62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffca28] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Explore Our Services
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE: CLIENT IMAGE */}
        <div className="relative mx-auto flex min-h-[380px] w-full max-w-[600px] items-end justify-center sm:min-h-[480px] lg:min-h-[600px]">
          {/* Golden Glow */}
          <div
            aria-hidden="true"
            className="absolute bottom-10 right-[10%] h-64 w-64 rounded-full bg-[#e8a900]/20 blur-3xl sm:h-80 sm:w-80"
          />

          <Image
            src="/images/about-person.png"
            alt="DK & SM Academy representative"
            width={900}
            height={1200}
            sizes="(max-width: 1023px) 85vw, 45vw"
            className="relative z-10 max-h-[620px] w-auto max-w-full object-contain object-bottom drop-shadow-[0_0_35px_rgba(255,190,30,0.18)]"
          />
        </div>
      </div>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes aboutFadeUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[aboutFadeUp_0\\.8s_ease-out\\] {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
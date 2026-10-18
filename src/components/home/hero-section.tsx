
import Image from "next/image";
import Link from "next/link";

const highlights = [
  { value: "Forex", label: "Currency Markets" },
  { value: "Crypto", label: "Digital Assets" },
  { value: "Learn", label: "Educational Resources" },
  { value: "Grow", label: "Community Learning" },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#ffd43b]/20 bg-black">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_45%,rgba(255,190,20,0.14),transparent_48%)]"
      />

      <div className="site-container">
        <div className="grid min-h-[620px] items-center gap-8 py-12 sm:py-16 lg:min-h-[590px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-2 lg:py-12">
          {/* Left: content */}
          <div className="relative z-10 max-w-2xl">
            <span className="section-eyebrow">
              <span aria-hidden="true" className="text-[#ffd43b]">
                ✦
              </span>
              Learn · Analyze · Grow Together
            </span>

            <h1 className="mt-4 text-[clamp(2.4rem,5.2vw,4.5rem)] font-extrabold leading-[1.06] tracking-[-0.045em] text-white">
              Your Trusted Platform for{" "}
              <span className="text-[#ffd43b]">
                Forex &amp; Crypto Education
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-300 sm:text-base sm:leading-8">
              Learn trading, understand market concepts, explore educational
              resources, and grow your knowledge with DK &amp; SM Academy.
            </p>

            <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row">
              <Link
                href="/community"
                className="btn-primary w-full sm:w-auto"
              >
                Join Our Community
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/portfolio"
                className="btn-secondary w-full sm:w-auto"
              >
                Explore Our Work
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ffd43b] text-xs text-black"
                >
                  ▶
                </span>
              </Link>
            </div>

            {/* Highlights */}
            <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-[#ffd43b]/20 pt-6 sm:grid-cols-4">
              {highlights.map((item) => (
                <div key={item.value} className="min-w-0">
                  <p className="mb-1 text-base font-extrabold text-[#ffd43b] sm:text-lg">
                    {item.value}
                  </p>
                  <p className="mb-0 text-xs leading-5 text-gray-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: trading visual */}
          <div className="relative mx-auto w-full max-w-[640px] lg:-mr-6 lg:max-w-none">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-8 rounded-full bg-[#ffc400]/15 blur-[90px]"
            />

            <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-[#ffd43b]/20 bg-[#080808] sm:min-h-[400px] lg:min-h-[500px] lg:border-0 lg:bg-transparent">
              <Image
                src="/images/hero-trading.png"
                alt="Golden cryptocurrency coins and a trading chart displayed on a smartphone"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 52vw"
                className="object-cover object-center"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5"
              />

              {/* Floating information cards */}
              <div className="absolute left-3 top-5 max-w-[175px] rounded-xl border border-[#ffd43b]/30 bg-black/80 p-3 shadow-xl backdrop-blur-md sm:left-5 sm:top-10 sm:max-w-[200px] sm:p-4">
                <p className="mb-1 text-xs font-bold text-[#ffd43b] sm:text-sm">
                  ✦ Trading Education
                </p>
                <p className="mb-0 text-[10px] text-gray-300 sm:text-xs">
                  Learn market concepts
                </p>
              </div>

              <div className="absolute bottom-5 left-3 max-w-[185px] rounded-xl border border-[#ffd43b]/30 bg-black/85 p-3 shadow-xl backdrop-blur-md sm:bottom-10 sm:left-5 sm:max-w-[215px] sm:p-4">
                <p className="mb-1 text-xs font-bold text-[#ffd43b] sm:text-sm">
                  ✦ Learning Resources
                </p>
                <p className="mb-0 text-[10px] text-gray-300 sm:text-xs">
                  Explore Forex and Crypto guides
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

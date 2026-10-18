
import Link from "next/link";

const stats = [
  { value: "10K+", label: "Community Members" },
  { value: "250+", label: "Education Resources" },
  { value: "100+", label: "Learning Examples" },
  { value: "24/7", label: "Community Support" },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#ffd43b]/20 bg-black">
      {/* Full-width background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[url('/images/hero-trading.png')] bg-cover bg-[center_35%] bg-no-repeat"
      />

      {/* Keep text readable while blending the image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/90 to-black/15"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-transparent to-black/20"
      />

      <div className="site-container">
        <div className="flex min-h-[650px] flex-col justify-center py-12 sm:min-h-[700px] sm:py-16 lg:min-h-[570px] lg:py-12">
          <div className="max-w-[720px]">
            <span className="section-eyebrow">
              <span aria-hidden="true">✦</span>
              Learn · Analyze · Grow Together
            </span>

            <h1 className="mt-4 max-w-[700px] text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[1.06] tracking-[-0.045em] text-white">
              Your Trusted Platform for{" "}
              <span className="text-[#ffd43b]">
                Forex &amp; Crypto Education
              </span>
            </h1>

            <p className="mt-5 max-w-[580px] text-sm leading-7 text-gray-200 sm:text-base sm:leading-8">
              Learn trading, get market insights, explore educational
              opportunities and join a growing community with DK &amp; SM
              Academy.
            </p>

            <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row">
              <Link href="/community" className="btn-primary w-full sm:w-auto">
                Join Our Community <span aria-hidden="true">→</span>
              </Link>

              <Link href="/portfolio" className="btn-secondary w-full sm:w-auto">
                Explore Our Work
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ffd43b] text-xs text-black"
                >
                  ▶
                </span>
              </Link>
            </div>
          </div>

          <div className="mt-10 grid max-w-[720px] grid-cols-2 gap-x-4 gap-y-5 rounded-xl border border-[#ffd43b]/20 bg-black/50 p-4 backdrop-blur-sm sm:grid-cols-4 sm:p-5">
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <p className="mb-1 text-lg font-extrabold text-[#ffd43b] sm:text-xl">
                  {stat.value}
                </p>
                <p className="mb-0 text-xs leading-5 text-gray-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

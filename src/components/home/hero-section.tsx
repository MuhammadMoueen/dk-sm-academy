
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const stats = [
  { value: 1000, suffix: "+", label: "Community Members" },
  { value: 50, suffix: "+", label: "Education Resources" },
  { value: 100, suffix: "+", label: "Learning Examples" },
  { value: 24, suffix: "/7", label: "Community Support" },
];

function AnimatedStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1800;
    let frameId = 0;
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (startTime === null) startTime = time;

      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(eased * value));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return (
    <div className="min-w-0">
      <p className="mb-1 text-xl font-extrabold tracking-tight text-[#ffd43b] sm:text-2xl">
        {count.toLocaleString("en-US")}
        {suffix}
      </p>
      <p className="mb-0 text-xs leading-5 text-gray-300">{label}</p>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#ffd43b]/20 bg-black">
      {/* Full-width hero background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[url('/images/hero-trading.png')] bg-cover bg-[center_35%] bg-no-repeat"
      />

      {/* Dark gradient keeps the headline readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/85 to-black/10"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-transparent to-black/20"
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
          </div>

          {/* Animated statistics */}
          <div className="mt-10 grid max-w-[720px] grid-cols-2 gap-x-4 gap-y-5 rounded-xl border border-[#ffd43b]/25 bg-black/65 p-4 backdrop-blur-md sm:grid-cols-4 sm:p-5">
            {stats.map((stat) => (
              <AnimatedStat
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

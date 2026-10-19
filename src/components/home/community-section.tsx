import Link from "next/link";
import { siteConfig } from "@/config/site";

export function CommunitySection() {
  return (
    <section
      id="community"
      aria-labelledby="community-heading"
      className="scroll-mt-20 border-t border-[#ffd43b]/15 bg-[#0c0b08] py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="site-container">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#ffd43b]/30 bg-gradient-to-br from-[#19160b] via-[#111] to-[#0b0b0b] px-6 py-10 text-center sm:px-10 sm:py-14">
          <span className="section-eyebrow">
            <span aria-hidden="true">✦</span>
            Learn Together
          </span>
          <h2
            id="community-heading"
            className="mb-3 text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-tight tracking-[-0.04em] text-white"
          >
            Grow with the <span className="text-[#ffd43b]">community</span>
          </h2>
          <p className="mx-auto mb-7 max-w-2xl leading-relaxed text-gray-300">
            Connect with DK &amp; SM Academy to explore learning resources,
            share questions, and continue building your knowledge.
          </p>
          <Link
            href={siteConfig.communityUrl}
            className="btn-primary w-full sm:w-auto"
          >
            Join Our Community <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

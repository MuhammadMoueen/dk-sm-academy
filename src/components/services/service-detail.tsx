import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { Service } from "@/components/services/service-data";

export function ServiceDetail({ service }: { service: Service }) {
  return (
    <article className="bg-[#080808] text-white">
      <header className="relative isolate overflow-hidden border-b border-[#ffd43b]/35 bg-[#080808]">
        <Image
          src={service.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none -z-20 object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#050505]/70 via-[#050505]/35 to-[#050505]/5"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#080808]/20 via-transparent to-black/5"
        />
        <div className="site-container relative z-10 flex min-h-[520px] items-center py-10 sm:min-h-[520px] sm:py-14 lg:min-h-[440px] lg:py-12">
          <div className="max-w-2xl">
            <span className="section-eyebrow">
              <span aria-hidden="true">✦</span>
              DK &amp; SM Academy
            </span>
            <h1 className="mb-4 text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.045em] text-white">
              {service.title}
            </h1>
            <p className="mb-7 max-w-xl text-base leading-relaxed text-gray-200 sm:text-lg">
              {service.introduction}
            </p>
            <Link
              href={siteConfig.communityUrl}
              className="btn-primary w-full sm:w-auto"
            >
              Join Our Community <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </header>

      <section
        aria-labelledby="service-faq-heading"
        className="relative isolate overflow-hidden border-b border-[#ffd43b]/20"
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
          className="pointer-events-none absolute inset-0 -z-10 bg-[#050505]/80"
        />

        <div className="site-container py-8 sm:py-10 lg:py-12">
          <div className="mx-auto max-w-5xl">
            <h2
              id="service-faq-heading"
              className="mb-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
            >
              Frequently <span className="text-[#ffd43b]">asked questions</span>
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-gray-300 sm:text-base">
              Find clear answers to common questions about{" "}
              {service.title.toLowerCase()} with DK &amp; SM Academy.
            </p>

            <div className="space-y-2">
              {service.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-[#ffd43b]/35 bg-[#090909]/90 px-4 py-3 open:border-[#ffd43b]/60 sm:px-5 sm:py-3.5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b] [&::-webkit-details-marker]:hidden">
                    <span>{faq.question}</span>
                    <span
                      aria-hidden="true"
                      className="relative shrink-0 text-2xl font-medium leading-none text-[#ffd43b]"
                    >
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline">−</span>
                    </span>
                  </summary>
                  <p className="mb-0 mt-3 border-t border-[#ffd43b]/15 pt-3 leading-relaxed text-gray-300">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { Service } from "@/components/services/service-data";

export function ServiceDetail({ service }: { service: Service }) {
  return (
    <article className="bg-[#080808] text-white">
      <header className="relative isolate overflow-hidden border-b border-[#ffd43b]/20">
        <div className="absolute inset-0 -z-20">
          <Image
            src={service.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-35"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/90 to-black/60"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-[#080808] via-transparent to-black/20"
        />

        <div className="site-container flex min-h-[460px] items-center py-16 sm:min-h-[520px] sm:py-20">
          <div className="max-w-3xl">
            <Link
              href="/#services"
              className="mb-6 inline-flex rounded-sm text-sm font-semibold text-[#ffd43b] underline decoration-[#ffd43b]/70 underline-offset-4 hover:text-[#ffe16a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b]"
            >
              ← All services
            </Link>
            <span className="section-eyebrow">
              <span aria-hidden="true">✦</span>
              DK &amp; SM Academy
            </span>
            <h1 className="mb-5 text-[clamp(2.4rem,6vw,4.75rem)] font-extrabold leading-[1.05] tracking-[-0.045em] text-white">
              {service.title}
            </h1>
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-gray-200 sm:text-lg">
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

      <div className="site-container py-14 sm:py-18 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-2xl border border-[#ffd43b]/30 bg-[#111] shadow-[0_16px_50px_rgba(0,0,0,0.4)] sm:mb-16">
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              sizes="(min-width: 1024px) 896px, (min-width: 640px) 85vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-12 sm:space-y-16">
            {service.sections.map((section, index) => (
              <section
                key={section.heading}
                aria-labelledby={`service-section-${index}`}
              >
                <h2
                  id={`service-section-${index}`}
                  className="mb-3 text-2xl font-bold text-white sm:text-3xl"
                >
                  {section.heading}
                </h2>
                <p className="mb-5 max-w-3xl leading-relaxed text-gray-300">
                  {section.introduction}
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {section.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 rounded-xl border border-[#ffd43b]/15 bg-[#111] p-4 text-sm leading-relaxed text-gray-200 sm:p-5"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ffd43b]"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <aside className="rounded-2xl border border-[#ffd43b]/35 bg-[#111] p-5 sm:p-7">
              <h2 className="mb-2 text-xl font-bold text-[#ffd43b]">
                Safety first
              </h2>
              <p className="mb-0 leading-relaxed text-gray-200">
                {service.safetyNote}
              </p>
            </aside>

            <section aria-labelledby="service-faq-heading">
              <h2
                id="service-faq-heading"
                className="mb-6 text-2xl font-bold text-white sm:text-3xl"
              >
                Frequently asked questions
              </h2>
              <div className="space-y-3">
                {service.faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-xl border border-[#ffd43b]/20 bg-[#111] p-4 open:border-[#ffd43b]/45 sm:p-5"
                  >
                    <summary className="cursor-pointer list-none pr-8 font-semibold text-white marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b]">
                      <span>{faq.question}</span>
                      <span
                        aria-hidden="true"
                        className="float-right text-[#ffd43b] transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mb-0 mt-3 leading-relaxed text-gray-300">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-14 rounded-2xl border border-[#ffd43b]/25 bg-gradient-to-br from-[#17150d] to-[#101010] p-6 text-center sm:mt-16 sm:p-10">
            <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
              Keep learning with the community
            </h2>
            <p className="mx-auto mb-6 max-w-2xl leading-relaxed text-gray-300">
              Join the DK &amp; SM Academy community to continue learning and
              connect with other members.
            </p>
            <Link
              href={siteConfig.communityUrl}
              className="btn-primary w-full sm:w-auto"
            >
              Join Our Community <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

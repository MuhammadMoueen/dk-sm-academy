import Image from "next/image";
import Link from "next/link";
import { services } from "@/components/services/service-data";

function ServiceCard({
  service,
  featured = false,
}: {
  service: (typeof services)[number];
  featured?: boolean;
}) {
  return (
    <article
      className={`group relative isolate flex flex-col justify-center overflow-hidden rounded-2xl border bg-[#0b0b0b] transition duration-300 motion-reduce:transition-none ${
        featured
          ? "min-h-[300px] border-[#ffd43b]/80 p-6 shadow-[0_0_28px_rgba(255,212,59,0.12)] sm:min-h-[330px] sm:p-7 lg:min-h-[390px] lg:p-8"
          : "min-h-[230px] border-[#ffd43b]/35 p-5 hover:border-[#ffd43b]/70 sm:min-h-[230px] sm:p-5 lg:min-h-[184px] lg:p-4"
      }`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 -z-10 w-[62%] sm:w-[58%] ${
          featured ? "lg:w-[68%]" : ""
        }`}
      >
        <Image
          src={service.image}
          alt=""
          fill
          sizes={
            featured
              ? "(min-width: 1024px) 34vw, (min-width: 640px) 58vw, 62vw"
              : "(min-width: 1024px) 14vw, (min-width: 640px) 29vw, 62vw"
          }
          className="object-contain object-right-bottom opacity-90 transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#0b0b0b] via-[#0b0b0b]/95 to-transparent"
      />

      <div
        className={`relative max-w-[70%] ${
          featured ? "sm:max-w-[62%]" : "sm:max-w-[70%]"
        }`}
      >
        <h3
          className={`mb-2 font-bold leading-tight tracking-tight text-[#ffd43b] ${
            featured ? "text-2xl sm:text-3xl" : "text-base sm:text-base"
          }`}
        >
          {service.title}
        </h3>

        <p
          className={`mb-3 text-gray-300 ${
            featured
              ? "max-w-[28rem] text-sm leading-relaxed sm:text-base"
              : "text-xs leading-[1.4]"
          }`}
        >
          {service.description}
        </p>

        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-2 rounded-sm font-semibold text-[#ffd43b] underline decoration-[#ffd43b]/70 underline-offset-4 transition-colors duration-200 hover:text-[#ffe16a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd43b] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0b0b0b]"
        >
          Explore <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export function ServicesSection({
  priority = false,
}: {
  priority?: boolean;
}) {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative isolate overflow-hidden bg-[#080808] py-16 text-white sm:py-20 lg:py-24"
    >
      <Image
        src="/images/services-bg.png"
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="pointer-events-none -z-20 object-cover object-center opacity-45"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#080808]/55 via-[#080808]/75 to-[#080808]"
      />

      <div className="site-container">
        <header className="mb-8 max-w-3xl sm:mb-10">
          <span className="section-eyebrow">
            <span aria-hidden="true">✦</span>
            Our Services
          </span>

          <h2
            id="services-heading"
            className="mb-2 text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-white"
          >
            Explore Our{" "}
            <span className="text-[#ffd43b]">Services</span>
          </h2>

          <p className="mb-2 text-base font-semibold leading-snug text-gray-200 sm:text-lg">
            Practical guidance for crypto, trading, and digital learning.
          </p>

          <p className="max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base">
            DK &amp; SM Academy provides educational resources, step-by-step
            guides, and community support to help you explore opportunities in
            the crypto world.
          </p>
        </header>

        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[0.95fr_1.12fr]">
          <ServiceCard service={services[0]} featured />

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {services.slice(1).map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

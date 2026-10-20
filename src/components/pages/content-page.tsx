import Image from "next/image";
import type { ReactNode } from "react";

export function ContentPage({
  eyebrow,
  title,
  description,
  children,
  backgroundImage,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children: ReactNode;
  backgroundImage?: string;
}) {
  return (
    <div className="relative isolate min-h-[60vh] overflow-hidden bg-[#080808] text-white">
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="pointer-events-none -z-20 object-cover object-center opacity-30"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#080808]/75 via-[#080808]/85 to-[#080808]"
          />
        </>
      )}
      <div className="site-container py-10 sm:py-12 lg:py-16">
        <header className="mb-8 max-w-4xl sm:mb-10">
          <span className="section-eyebrow">
            <span aria-hidden="true">✦</span>
            {eyebrow}
          </span>
          <h1 className="mb-3 text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold leading-tight tracking-[-0.04em] text-white">
            {title}
          </h1>
          <p className="max-w-3xl leading-relaxed text-gray-300">
            {description}
          </p>
        </header>
        <div className="mx-auto max-w-4xl space-y-4">{children}</div>
      </div>
    </div>
  );
}

export function ContentSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#ffd43b]/20 bg-[#101010]/90 p-5 sm:p-7">
      <h2 className="mb-3 text-xl font-bold text-[#ffd43b] sm:text-2xl">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-gray-300 sm:text-base">
        {children}
      </div>
    </section>
  );
}

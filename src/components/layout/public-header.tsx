"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { siteConfig } from "@/config/site";

function BrandLogo() {
  return (
    <Link
      href="/"
      aria-label="DK & SM Academy home"
      className="group inline-flex shrink-0 flex-col leading-none"
    >
      <span className="whitespace-nowrap font-serif text-2xl font-bold tracking-tight text-white sm:text-[27px]">
        DK <span className="text-[#f5c842]">&amp;</span> SM
      </span>

      <span className="mt-1.5 text-[9px] font-bold tracking-[0.38em] text-[#f5c842] transition-colors duration-200 group-hover:text-[#ffe17a] sm:text-[10px]">
        ACADEMY
      </span>
    </Link>
  );
}

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#f5c842]/20 bg-black/95 backdrop-blur-xl">
      <div className="site-container">
        <div className="flex min-h-[72px] items-center justify-between gap-4">
          <BrandLogo />

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-4 lg:flex xl:gap-6"
          >
            {siteConfig.navigation
              .filter((item) => item.label.toLowerCase() !== "contact")
              .map((item) => {
                const isSectionLink = item.href.startsWith("/#");
                const active =
                  !isSectionLink &&
                  (pathname === item.href ||
                    pathname.startsWith(`${item.href}/`));

                const className = `relative whitespace-nowrap py-6 text-sm font-semibold transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:bg-[#ffd43b] after:transition-transform after:duration-200 ${
                  active
                    ? "text-[#ffd43b] after:scale-x-100"
                    : "text-gray-200 after:scale-x-0 hover:text-[#ffd43b] hover:after:scale-x-100"
                }`;

                return isSectionLink ? (
                  <a
                    key={item.href}
                    href={pathname === "/" ? item.href.slice(1) : item.href}
                    aria-current={active ? "page" : undefined}
                    className={className}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={className}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </nav>

          <Link
            href={siteConfig.communityUrl}
            className="site-btn-primary !hidden whitespace-nowrap lg:!inline-flex"
          >
            Join Our Community <span aria-hidden="true">→</span>
          </Link>

          <div className="ml-auto flex min-w-0 items-center gap-2 lg:hidden">
            <Link
              href={siteConfig.communityUrl}
              className="site-btn-primary !inline-flex !min-h-9 shrink-0 !gap-1.5 !rounded-lg !px-2.5 !py-1.5 !text-[11px] !leading-none sm:!px-3 sm:!text-xs"
            >
              Join Community <span aria-hidden="true">→</span>
            </Link>
            <MobileNavigation />
          </div>
        </div>
      </div>
    </header>
  );
}

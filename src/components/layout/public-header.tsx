
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

function AcademyLogo() {
  return (
    <Link
      href="/"
      aria-label="DK & SM Academy home"
      className="inline-flex shrink-0 items-center gap-2"
    >
      <span aria-hidden="true" className="text-3xl font-black text-[#ffd43b]">
        ↗
      </span>

      <span className="flex flex-col leading-tight">
        <span className="text-base font-extrabold tracking-tight text-white">
          DK <span className="text-[#ffd43b]">&</span> SM
        </span>
        <span className="text-[9px] font-bold tracking-[0.28em] text-[#ffd43b]">
          ACADEMY
        </span>
      </span>
    </Link>
  );
}

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
      <div className="site-container">
        <div className="flex min-h-[70px] items-center justify-between gap-4">
          <AcademyLogo />

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-5 lg:flex xl:gap-7"
          >
            {siteConfig.navigation.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative whitespace-nowrap py-6 text-sm font-semibold transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:bg-[#ffd43b] after:transition-transform after:duration-200 ${
                    active
                      ? "text-[#ffd43b] after:scale-x-100"
                      : "text-white after:scale-x-0 hover:text-[#ffd43b] hover:after:scale-x-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href={siteConfig.communityUrl}
            className="btn-primary hidden !min-h-[42px] !rounded-lg !px-4 !text-xs lg:inline-flex"
          >
            Join Community <span aria-hidden="true">→</span>
          </Link>

          <div className="lg:hidden">
            <MobileNavigation />
          </div>
        </div>
      </div>
    </header>
  );
}


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Community", href: "/community" },
  { label: "Contact", href: "/contact" },
];

function BrandLogo() {
  return (
    <Link
      href="/"
      aria-label="DK & SM Academy home"
      className="group inline-flex shrink-0 items-center gap-2.5"
    >
      <span
        aria-hidden="true"
        className="relative flex h-10 w-10 items-end justify-center gap-[3px] border-b-2 border-[#f5c842] pb-1"
      >
        <span className="h-3 w-1.5 rounded-t-sm bg-[#dcae28] transition-colors group-hover:bg-[#ffe17a]" />
        <span className="h-5 w-1.5 rounded-t-sm bg-[#f5c842] transition-colors group-hover:bg-[#ffe17a]" />
        <span className="h-7 w-1.5 rounded-t-sm bg-[#ffe17a] transition-colors group-hover:bg-white" />
        <span className="absolute -right-0.5 top-0 text-sm font-black text-[#f5c842]">
          ↗
        </span>
      </span>

      <span className="flex flex-col leading-none">
        <span className="whitespace-nowrap font-serif text-[19px] font-bold tracking-[-0.06em] text-white sm:text-[21px]">
          DK <span className="text-[#f5c842]">&</span> SM
        </span>
        <span className="mt-1.5 pl-0.5 text-[9px] font-bold tracking-[0.32em] text-[#f5c842]">
          ACADEMY
        </span>
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
            {navigation.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-6 text-sm font-semibold transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:bg-[#f5c842] after:transition-transform after:duration-200 ${
                    active
                      ? "text-[#f5c842] after:scale-x-100"
                      : "text-gray-200 after:scale-x-0 hover:text-[#f5c842] hover:after:scale-x-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/community"
            className="hidden min-h-[42px] items-center gap-2 rounded-lg bg-[#f5c842] px-4 text-sm font-bold text-black transition-all duration-200 hover:bg-[#ffe17a] hover:shadow-[0_0_22px_rgba(245,200,66,0.22)] lg:inline-flex"
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

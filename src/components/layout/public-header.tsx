
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
            {navigation.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative whitespace-nowrap py-6 text-sm font-semibold transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:bg-[#f5c842] after:transition-transform after:duration-200 ${
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
            className="hidden min-h-[48px] items-center justify-center gap-3 rounded-xl bg-[#f5c842] px-6 py-3 text-sm font-bold text-black shadow-[0_4px_18px_rgba(245,200,66,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffda55] hover:shadow-[0_6px_24px_rgba(245,200,66,0.3)] lg:inline-flex"
          >
            Join Our Community
            <span aria-hidden="true" className="text-lg leading-none">
              →
            </span>
          </Link>

          <div className="lg:hidden">
            <MobileNavigation />
          </div>
        </div>
      </div>
    </header>
  );
}

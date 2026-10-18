
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

function AcademyLogo() {
  return (
    <Link
      href="/"
      aria-label="DK & SM Academy home"
      className="inline-flex shrink-0 items-center gap-2"
    >
      <span
        aria-hidden="true"
        className="text-3xl font-black leading-none text-[#ffd43b]"
      >
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

export { AcademyLogo };

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
      <div className="site-container">
        <div className="flex min-h-[70px] items-center justify-between gap-4">
          <AcademyLogo />

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-5 lg:flex xl:gap-7"
          >
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-sm font-medium text-gray-300 transition-colors hover:text-[#ffd43b]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link
              href={siteConfig.communityUrl}
              className="btn-primary whitespace-nowrap !min-h-[40px] !rounded-lg !px-4 !text-xs"
            >
              Join Community <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="lg:hidden">
            <MobileNavigation />
          </div>
        </div>
      </div>
    </header>
  );
}

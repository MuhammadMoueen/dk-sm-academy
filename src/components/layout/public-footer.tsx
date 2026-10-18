
import Link from "next/link";
import { siteConfig } from "@/config/site";

const footerLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Learning Hub", href: "/learning" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export function PublicFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[#ffd43b]/20 bg-[#090909]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-0 h-64 w-64 rounded-full bg-[#ffd43b]/5 blur-3xl"
      />

      <div className="site-container relative py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-3xl font-black text-[#ffd43b]">↗</span>
              <span className="flex flex-col leading-tight">
                <span className="text-lg font-extrabold text-white">
                  DK <span className="text-[#ffd43b]">&</span> SM
                </span>
                <span className="text-[9px] font-bold tracking-[0.28em] text-[#ffd43b]">
                  ACADEMY
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-gray-400">
              Learn, analyze and grow together with educational resources,
              market insights and community support.
            </p>

            <Link
              href={siteConfig.communityUrl}
              className="btn-primary mt-5"
            >
              Join Our Community <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div>
            <h2 className="mb-4 text-base font-bold tracking-normal">
              Quick Links
            </h2>
            <ul className="space-y-3">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 transition hover:text-[#ffd43b]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-base font-bold tracking-normal">
              Community
            </h2>
            <ul className="space-y-3">
              {siteConfig.socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-gray-400 transition hover:text-[#ffd43b]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-base font-bold tracking-normal">
              Important Information
            </h2>
            <ul className="space-y-3">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 transition hover:text-[#ffd43b]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-xs leading-6 text-gray-500">
              Educational content only. Trading involves risk, and losses are
              possible. Nothing on this website is a guarantee of profit or
              personalized financial advice.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="mb-0">
            © {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <p className="mb-0">Learn • Analyze • Grow Together</p>
        </div>
      </div>
    </footer>
  );
}

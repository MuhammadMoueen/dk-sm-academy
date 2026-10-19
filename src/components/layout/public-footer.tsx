
import Link from "next/link";

const currentYear = new Date().getFullYear();

const quickLinks = [
  { label: "Home", href: "/#home" },
  { label: "About Us", href: "/#about" },
  { label: "Our Services", href: "/#services" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Community", href: "/#community" },
  { label: "Blog", href: "/#blog" },
];

const services = [
  { label: "Buy & Sell", href: "/services/buy-sell" },
  { label: "Airdrops", href: "/services/airdrops" },
  { label: "Exchange Campaigns", href: "/services/exchange-campaigns" },
  { label: "Market Analysis", href: "/services/trading" },
  { label: "Learning Resources", href: "/services/courses" },
  { label: "Community Support", href: "/community" },
];

const importantLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const socials = [
  { name: "YouTube",  href: "https://www.youtube.com/@DKSMAcademy", icon: "youtube" },
  { name: "Telegram", href: "https://t.me/xhjkockklkmkkb", icon: "telegram" },
  { name: "Facebook", href: "https://www.facebook.com/Dk7869", icon: "facebook" },
  { name: "Instagram",href: "https://www.instagram.com/dksmacadem786", icon: "instagram" },
  { name: "X",        href: "https://x.com/dksmacademy786", icon: "x" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/dk7869", icon: "linkedin" },
];

function SocialIcon({ name }: { name: string }) {
  const common = {
    width: 19,
    height: 19,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "youtube":
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
        </svg>
      );

    case "telegram":
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M22.4 2.8 19 20.8c-.3 1.3-1 1.6-2.1 1l-5.8-4.3-2.8 2.7c-.3.3-.5.5-1 .5l.4-5.9L18.5 5c.5-.4-.1-.7-.7-.3L4.5 13.2l-5.7-1.8c-1.2-.4-1.2-1.2.3-1.8L21.3 1.1c1-.4 1.8.2 1.1 1.7Z" transform="translate(1 1) scale(.92)" />
        </svg>
      );

    case "facebook":
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z" />
        </svg>
      );

    case "instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.7" cy="6.5" r=".8" fill="currentColor" stroke="none" />
        </svg>
      );
      case "x":
        return (
          <svg {...common} viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.637 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932Zm-1.29 19.493h2.039L6.486 3.24H4.298L17.61 20.646Z"
            />
          </svg>
        );
      case "linkedin":
        return (
          <svg {...common} viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z"
            />
          </svg>
        );

    default:
      return (
        <svg {...common} stroke="none" fill="currentColor">
          <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-5-7.2L5.6 22H2.4l7.3-8.4L1.8 2h6.5l4.5 6.6L18.9 2Zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20Z" />
        </svg>
      );
  }
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="!text-base font-bold leading-tight tracking-wide !text-[#ffcf32]">
        {children}
      </h2>
      <div className="mt-2 h-[3px] w-8 rounded-full bg-[#ffcf32]" />
    </div>
  );
}

const footerLinkClass =
  "inline-block text-sm font-medium !text-white/90 transition-all duration-200 hover:font-bold hover:!text-[#ffcf32] focus-visible:font-bold focus-visible:!text-[#ffcf32]";

export function PublicFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-[#ffcf32]/40 bg-[#050505] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/footer-gold-background.png')",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/90 via-black/70 to-black/35"
      />

      <div className="mx-auto max-w-[1440px] px-6 pb-8 pt-12 sm:px-10 lg:px-14 lg:pb-10 lg:pt-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.15fr_0.7fr_0.9fr_0.85fr_1.2fr] xl:gap-x-10">
          <div className="min-w-0">
            <Link
              href="/"
              aria-label="DK & SM Academy home"
              className="inline-flex flex-col"
            >
              <span className="font-serif text-3xl font-bold tracking-tight text-white">
                DK <span className="text-[#ffcf32]">&amp;</span> SM
              </span>
              <span className="mt-1 pl-1 text-xs font-bold tracking-[0.42em] text-[#ffcf32]">
                ACADEMY
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-gray-300">
              Learn, analyze and grow together with educational resources,
              market insights and community support.
            </p>

            <Link
              href="https://whatsapp.com/channel/0029Vb6gQ7m8vd1GGTKvAl46"
              className="mt-6 inline-flex min-h-[48px] items-center justify-center gap-3 rounded-xl bg-[#f5c842] px-6 py-3 text-sm font-bold !text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ffda55] hover:!text-black hover:shadow-[0_6px_24px_rgba(245,200,66,0.3)]"
            >
              <span className="!text-black">Join Our Community</span>
              <span aria-hidden="true" className="text-lg leading-none !text-black">
                →
              </span>
            </Link>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${social.name}`}
                  title={social.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d6a91b]/80 bg-black/50 !text-[#ffcf32] transition duration-300 hover:-translate-y-1 hover:border-[#ffcf32] hover:bg-[#ffcf32] hover:!text-black"
                >
                  <SocialIcon name={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <FooterHeading>Our Services</FooterHeading>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service.label}>
                  <Link href={service.href} className={footerLinkClass}>
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <FooterHeading>Important Links</FooterHeading>
            <ul className="space-y-2.5">
              {importantLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <FooterHeading>Join Our Newsletter</FooterHeading>
            <p className="text-sm leading-7 text-gray-300">
              Get the latest market insights, educational content and updates
              directly in your inbox.
            </p>

            <div className="mt-5 flex min-h-12 overflow-hidden rounded-xl border border-white/35 bg-black/60 focus-within:border-[#ffcf32]">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email address"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                aria-label="Newsletter subscriptions are not available yet"
                title="Newsletter subscriptions are not available yet"
                disabled
                className="flex w-14 shrink-0 cursor-not-allowed items-center justify-center bg-[#ffcf32] text-xl font-bold text-black transition hover:bg-[#ffda55]"
              >
                →
              </button>
            </div>

            <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-gray-300">
              <span className="text-[#ffcf32]" aria-hidden="true">
                ◆
              </span>
              We respect your privacy. No spam, ever.
            </p>

            <p className="mt-3 text-xs leading-6 text-gray-300">
              Educational content only. Trading involves risk and losses are
              possible. Nothing on this website guarantees profits or provides
              personalized financial advice.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-[#d6a91b]/40 pt-6 sm:mt-14">
          <div className="flex flex-col gap-4 text-sm text-gray-300 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {currentYear} DK &amp; SM Academy. All rights reserved.
            </p>
            <p className="font-semibold tracking-[0.2em] text-[#ffcf32]">
              LEARN <span className="px-1">•</span> GROW{" "}
              <span className="px-1">•</span> SUCCEED
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}


import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Community", href: "/community" },
  { label: "Learning Hub", href: "/learning" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

const services = [
  { label: "Forex Education", href: "/services" },
  { label: "Crypto Education", href: "/services" },
  { label: "Market Analysis", href: "/services" },
  { label: "Trading Strategies", href: "/services" },
  { label: "Learning Resources", href: "/learning" },
  { label: "Community Support", href: "/community" },
];

const socials = [
  { name: "YouTube", href: "https://youtube.com", icon: "youtube" },
  { name: "Telegram", href: "https://telegram.org", icon: "telegram" },
  { name: "WhatsApp", href: "https://whatsapp.com", icon: "whatsapp" },
  { name: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { name: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { name: "X", href: "https://x.com", icon: "x" },
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

    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.7a8.5 8.5 0 1 1 16.1-4.1Z" />
          <path d="M8.5 7.8c.3-.5.6-.5.9-.5h.5c.2 0 .4.1.5.5l.8 1.8c.1.3.1.5-.1.7l-.7.8c-.2.2-.2.4 0 .7a8.5 8.5 0 0 0 2.9 2.8c.3.2.5.2.7-.1l.9-1.1c.2-.3.4-.3.7-.2l1.8.9c.3.2.5.3.5.5 0 .3-.2 1.3-.8 1.8-.6.6-1.5.8-2.4.6-1-.2-2.3-.8-3.9-2.2-1.4-1.2-2.4-2.8-2.7-3.8-.3-1.1.1-2 .4-2.7Z" />
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
    <div className="mb-5">
      <h2 className="text-base font-bold leading-tight tracking-wide text-[#ffcf32] sm:text-lg">
        {children}
      </h2>
      <div className="mt-2 h-[3px] w-9 rounded-full bg-[#ffcf32]" />
    </div>
  );
}

const footerLinkClass =
  "inline-block text-sm font-medium text-white/90 transition-all duration-200 hover:font-bold hover:text-[#ffcf32] focus-visible:font-bold focus-visible:text-[#ffcf32]";

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
        className="pointer-events-none absolute inset-0 -z-10 bg-black/60"
      />

      <div className="mx-auto max-w-[1440px] px-6 pb-8 pt-12 sm:px-10 lg:px-14 lg:pb-10 lg:pt-14">
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.7fr_0.9fr_1.2fr] lg:gap-x-12">
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
              href="/community"
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#ffcf32] px-5 py-3 text-sm font-bold text-black transition duration-300 hover:bg-[#ffda55] hover:shadow-[0_0_22px_rgba(255,207,50,0.25)]"
            >
              Join Our Community
              <span aria-hidden="true" className="text-lg">
                →
              </span>
            </Link>

            <div className="mt-6 flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${social.name}`}
                  title={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6a91b]/80 bg-black/50 text-[#ffcf32] transition duration-300 hover:-translate-y-1 hover:border-[#ffcf32] hover:bg-[#ffcf32] hover:text-black"
                >
                  <SocialIcon name={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="space-y-3.5">
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
            <ul className="space-y-3.5">
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
                aria-label="Newsletter subscription"
                title="Newsletter subscription will be connected later"
                className="flex w-14 shrink-0 items-center justify-center bg-[#ffcf32] text-xl font-bold text-black transition hover:bg-[#ffda55]"
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
              © {new Date().getFullYear()} DK &amp; SM Academy. All rights
              reserved.
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

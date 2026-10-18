
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

const socialLinks = [
  { label: "YouTube", symbol: "▶" },
  { label: "Telegram", symbol: "➤" },
  { label: "WhatsApp", symbol: "◉" },
  { label: "Facebook", symbol: "f" },
  { label: "Instagram", symbol: "◎" },
  { label: "X", symbol: "𝕏" },
];

export function PublicFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-yellow-500/30 bg-[#050505] text-white">
      {/* Golden trading background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/footer-gold-background.png')",
        }}
      />

      {/* Dark overlay keeps the text readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/65 to-black/90"
      />

      <div className="mx-auto max-w-[1440px] px-6 pb-10 pt-14 sm:px-10 lg:px-14 lg:pt-16">
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.8fr_0.9fr_1.2fr] lg:gap-x-12">
          {/* Brand */}
          <div className="min-w-0">
            <Link
              href="/"
              aria-label="DK and SM Academy home"
              className="group inline-flex flex-col"
            >
              <span className="font-serif text-3xl font-bold tracking-tight text-white">
                DK <span className="text-[#ffcf32]">&amp;</span> SM
              </span>
              <span className="mt-1 pl-1 text-xs font-bold tracking-[0.42em] text-[#ffcf32]">
                ACADEMY
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-300">
              Learn, analyze and grow together with educational resources,
              market insights and community support.
            </p>

            <Link
              href="/community"
              className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-lg bg-[#ffcf32] px-5 py-3 text-sm font-bold text-black transition duration-300 hover:bg-[#ffe16b] hover:shadow-[0_0_24px_rgba(255,207,50,0.25)]"
            >
              Join Our Community
              <span aria-hidden="true" className="text-lg">
                →
              </span>
            </Link>

            {/* Social links — connect the actual account URLs later */}
            <div className="mt-7 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href="/community"
                  aria-label={social.label}
                  title={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8aa18]/80 bg-black/40 text-lg font-semibold text-[#ffcf32] transition duration-300 hover:-translate-y-1 hover:border-[#ffcf32] hover:bg-[#ffcf32] hover:text-black"
                >
                  {social.symbol}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-bold text-[#ffcf32]">
              Quick Links
            </h2>
            <div className="mt-3 h-[3px] w-10 rounded-full bg-[#ffcf32]" />

            <ul className="mt-5 space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm text-gray-300 transition duration-200 hover:translate-x-1 hover:text-[#ffcf32]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h2 className="text-lg font-bold text-[#ffcf32]">
              Our Services
            </h2>
            <div className="mt-3 h-[3px] w-10 rounded-full bg-[#ffcf32]" />

            <ul className="mt-5 space-y-3.5">
              {services.map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className="inline-block text-sm text-gray-300 transition duration-200 hover:translate-x-1 hover:text-[#ffcf32]"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-[#ffcf32]">
              Join Our Newsletter
            </h2>
            <div className="mt-3 h-[3px] w-10 rounded-full bg-[#ffcf32]" />

            <p className="mt-5 text-sm leading-7 text-gray-300">
              Get the latest market insights, educational content and updates
              directly in your inbox.
            </p>

            <div className="mt-6 flex min-h-12 overflow-hidden rounded-xl border border-white/30 bg-black/60 transition focus-within:border-[#ffcf32]">
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
                aria-label="Subscribe to newsletter"
                title="Newsletter subscription will be connected later"
                className="flex w-14 shrink-0 items-center justify-center bg-[#ffcf32] text-xl font-bold text-black transition hover:bg-[#ffe16b]"
              >
                →
              </button>
            </div>

            <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-gray-300">
              <span className="mt-0.5 text-[#ffcf32]" aria-hidden="true">
                ◆
              </span>
              We respect your privacy. No spam, ever.
            </p>

            <p className="mt-3 text-xs leading-6 text-gray-400">
              Educational content only. Trading involves risk and losses are
              possible. Nothing on this website guarantees profits or provides
              personalized financial advice.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-[#d8aa18]/40 pt-6">
          <div className="flex flex-col gap-4 text-sm text-gray-300 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} DK &amp; SM Academy. All rights
              reserved.
            </p>

            <p className="font-semibold tracking-[0.22em] text-[#ffcf32]">
              LEARN <span className="px-1">•</span> GROW{" "}
              <span className="px-1">•</span> SUCCEED
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

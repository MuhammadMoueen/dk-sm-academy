
import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog & Guides", href: "/blog" },
  { label: "Community", href: "/community" },
  { label: "Learning Hub", href: "/learning" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

const serviceLinks = [
  { label: "Forex Education", href: "/services" },
  { label: "Crypto Education", href: "/services" },
  { label: "Market Analysis", href: "/services" },
  { label: "Trading Strategies", href: "/services" },
  { label: "Learning Resources", href: "/learning" },
  { label: "Community Support", href: "/community" },
];

const socialLinks = [
  { label: "YouTube", short: "▶", href: "/community" },
  { label: "Telegram", short: "➤", href: "/community" },
  { label: "WhatsApp", short: "W", href: "/community" },
  { label: "Facebook", short: "f", href: "/community" },
  { label: "Instagram", short: "◎", href: "/community" },
  { label: "X", short: "𝕏", href: "/community" },
];

function FooterBrand() {
  return (
    <Link
      href="/"
      aria-label="DK & SM Academy home"
      className="inline-flex flex-col leading-none"
    >
      <span className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
        DK <span className="text-[#f5c842]">&amp;</span> SM
      </span>
      <span className="mt-2 text-[11px] font-bold tracking-[0.48em] text-[#f5c842]">
        ACADEMY
      </span>
    </Link>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 text-lg font-bold text-[#f5c842]">
      {children}
      <span className="mt-3 block h-[3px] w-10 rounded-full bg-[#f5c842]" />
    </h2>
  );
}

function FooterLinkList({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li key={item.label}>
          <Link
            href={item.href}
            className="text-sm text-gray-300 transition-colors duration-200 hover:text-[#f5c842]"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function PublicFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-[#f5c842]/50 bg-black">
      {/* Background artwork */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/footer-gold-background.png')",
        }}
      />

      {/* Dark overlay keeps footer text readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-black/75"
      />

      <div className="site-container">
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-16">
          {/* Brand and social links */}
          <div className="lg:col-span-4">
            <FooterBrand />

            <p className="mt-6 max-w-sm text-sm leading-7 text-gray-300">
              Learn, analyze and grow together with educational resources,
              market insights and community support.
            </p>

            <Link
              href="/community"
              className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-lg bg-[#f5c842] px-5 font-bold text-black transition-all duration-200 hover:bg-[#ffe17a] hover:shadow-[0_0_24px_rgba(245,200,66,0.25)]"
            >
              Join Our Community <span aria-hidden="true">→</span>
            </Link>

            <div className="mt-7 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  title={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f5c842]/80 bg-black/50 text-xl font-bold text-[#f5c842] transition-all duration-200 hover:-translate-y-1 hover:bg-[#f5c842] hover:text-black"
                >
                  {social.short}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <FooterHeading>Quick Links</FooterHeading>
            <FooterLinkList items={quickLinks} />
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <FooterHeading>Our Services</FooterHeading>
            <FooterLinkList items={serviceLinks} />
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <FooterHeading>Join Our Newsletter</FooterHeading>

            <p className="max-w-md text-sm leading-7 text-gray-300">
              Get the latest market insights, educational content and updates
              directly in your inbox.
            </p>

            <form
              action="mailto:"
              method="get"
              className="mt-6 flex min-h-[54px] overflow-hidden rounded-xl border border-white/40 bg-black/70 focus-within:border-[#f5c842]"
            >
              <label htmlFor="footer-email" className="sr-only">
                Enter your email address
              </label>

              <input
                id="footer-email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                aria-label="Submit newsletter email"
                className="flex w-14 shrink-0 items-center justify-center bg-[#f5c842] text-2xl font-bold text-black transition-colors hover:bg-[#ffe17a]"
              >
                →
              </button>
            </form>

            <p className="mt-4 flex items-center gap-2 text-xs leading-5 text-gray-300">
              <span className="text-lg text-[#f5c842]" aria-hidden="true">
                ◆
              </span>
              We respect your privacy. No spam, ever.
            </p>

            <p className="mt-4 text-xs leading-5 text-gray-400">
              Educational content only. Trading involves risk and losses are
              possible. No guaranteed profits or personalized financial advice.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-[#f5c842]/30 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-gray-300 sm:text-sm">
            © {new Date().getFullYear()} DK &amp; SM Academy. All rights
            reserved.
          </p>

          <p className="text-xs font-bold tracking-[0.25em] text-[#f5c842] sm:text-sm">
            LEARN <span className="px-1">•</span> GROW{" "}
            <span className="px-1">•</span> SUCCEED
          </p>
        </div>
      </div>
    </footer>
  );
}

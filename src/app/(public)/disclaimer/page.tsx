import { ContentPage, ContentSection } from "@/components/pages/content-page";

export default function DisclaimerPage() {
  return (
    <ContentPage
      eyebrow="Important Information"
      title={<>Educational <span className="text-[#ffd43b]">Disclaimer</span></>}
      description="Please understand the limits and risks of general market and digital-asset information before using it."
    >
      <ContentSection title="Educational information only">
        <p>
          DK &amp; SM Academy shares educational information about
          cryptocurrency, Forex, markets, trading concepts, and digital
          assets. Content is for general educational and informational
          purposes only. It is not personalized financial, investment, legal,
          or tax advice, nor a recommendation to buy, sell, hold, or use any
          asset, strategy, exchange, or service.
        </p>
        <p>
          The services described on this website are educational. The Academy
          does not present investment management or acceptance of funds for
          investment management as a service.
        </p>
      </ContentSection>

      <ContentSection title="Risk and no guaranteed outcomes">
        <p>
          Trading and digital assets involve risk, including volatility,
          technology, liquidity, counterparty, and regulatory risks. You may
          lose some or all of the capital you commit. DK &amp; SM Academy does
          not guarantee profits, returns, trading success, or any particular
          outcome.
        </p>
        <p>
          Market-related statements may be incomplete, become outdated, or
          contain errors. Information is provided in a general context and may
          not reflect your circumstances. Past performance or examples do not
          predict future results.
        </p>
      </ContentSection>

      <ContentSection title="Your decisions and independent research">
        <p>
          You are responsible for your own research and decisions. Independently
          verify information with reliable, current sources, consider your
          financial circumstances and risk tolerance, and seek qualified
          professional advice where appropriate. Follow the laws and
          regulations applicable to you.
        </p>
      </ContentSection>

      <ContentSection title="Third-party services">
        <p>
          Exchanges, platforms, wallets, campaign providers, and other
          third-party services operate independently. DK &amp; SM Academy
          does not control their availability, terms, security, or decisions.
          Verify their current terms and use them at your own discretion.
        </p>
      </ContentSection>
    </ContentPage>
  );
}

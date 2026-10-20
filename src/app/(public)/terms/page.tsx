import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/pages/content-page";
import { siteConfig } from "@/config/site";

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Site Information"
      title={<>Terms &amp; <span className="text-[#ffd43b]">Conditions</span></>}
      description="These terms describe the general conditions for using the DK & SM Academy website."
    >
      <ContentSection title="Using this website">
        <p>
          You may use this website for lawful, personal, and educational
          purposes. Do not attempt to disrupt the site, misuse its forms or
          services, interfere with other visitors, or use its content in a way
          that violates applicable law or another person’s rights.
        </p>
      </ContentSection>

      <ContentSection title="Educational content and intellectual property">
        <p>
          Website materials are provided for general educational and
          informational purposes. Content may change and should not be treated
          as personalized financial, legal, or tax advice. See our{" "}
          <Link
            href="/disclaimer"
            className="font-semibold text-[#ffd43b] underline decoration-[#ffd43b]/50 underline-offset-4 hover:text-[#ffe16a]"
          >
            Disclaimer
          </Link>{" "}
          for further information.
        </p>
        <p>
          Unless otherwise noted, website text, graphics, and other materials
          are presented by DK &amp; SM Academy. You may view and share links to
          public pages for personal, non-commercial purposes. Do not reproduce
          or redistribute substantial material as your own without permission
          from the applicable rights holder.
        </p>
      </ContentSection>

      <ContentSection title="External platforms and links">
        <p>
          Links to exchanges, social platforms, and other third-party websites
          are provided for convenience or reference. Those services operate
          independently, may change their content or terms, and are not
          controlled by this website. Review their terms and privacy notices
          before using them.
        </p>
      </ContentSection>

      <ContentSection title="Limitations and changes">
        <p>
          The website and its content are provided on an as-available basis.
          To the extent permitted by applicable law, DK &amp; SM Academy is not
          responsible for losses arising from reliance on general website
          information, third-party services, interruptions, or errors. Nothing
          in these terms excludes liability that cannot lawfully be excluded.
        </p>
        <p>
          These terms may be updated as the website changes. Continued use
          after an updated version is posted indicates use under the revised
          terms, subject to applicable law.
        </p>
      </ContentSection>

      <ContentSection title="Questions">
        <p>
          For questions about these terms, contact DK &amp; SM Academy through
          its{" "}
          <Link
            href={siteConfig.communityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#ffd43b] underline decoration-[#ffd43b]/50 underline-offset-4 hover:text-[#ffe16a]"
          >
            official WhatsApp channel
          </Link>
          . Avoid sharing passwords, financial account details, or wallet
          recovery information.
        </p>
      </ContentSection>
    </ContentPage>
  );
}

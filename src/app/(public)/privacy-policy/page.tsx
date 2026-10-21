import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/pages/content-page";
import { siteConfig } from "@/config/site";

export default function PrivacyPolicyPage() {
  return (
    <ContentPage
      eyebrow="Privacy"
      title={<>Privacy <span className="text-[#ffd43b]">Policy</span></>}
      description="How information may be handled when you visit the DK & SM Academy website or contact us."
    >
      <ContentSection title="Information and website features">
        <p>
          The website may receive basic technical request information needed
          to deliver and protect pages, such as browser and device details,
          requested pages, timestamps, and network information. The exact
          records retained depend on the hosting configuration.
        </p>
        <p>
          The newsletter subscription control is currently disabled, and the
          contact endpoint is not implemented. These features do not currently
          provide working submission or subscription processing. Do not submit
          personal or sensitive information through them.
        </p>
      </ContentSection>

      <ContentSection title="Use, protection, and retention">
        <p>
          Technical information may be used as needed to deliver the website,
          diagnose service issues, and help protect its operation. The current
          application does not provide a published retention schedule for
          hosting-level technical records; retention may depend on the
          applicable hosting provider and configuration.
        </p>
        <p>
          We take reasonable care with the website and its information, but
          internet transmission and storage cannot be guaranteed to be
          completely secure. Do not send passwords, payment details, wallet
          recovery phrases, or other sensitive information through public
          channels.
        </p>
      </ContentSection>

      <ContentSection title="Cookies, third parties, and external links">
        <p>
          The application code does not currently identify a dedicated
          third-party analytics or advertising-cookie integration. The
          website may use a first-party, HttpOnly cookie to prevent repeated
          refreshes from inflating an aggregate daily visitor count. The
          analytics record stores only a daily total and does not store names,
          email addresses, or full IP addresses. Hosting, security, or future
          site features may use necessary technical storage depending on
          configuration. External websites and platforms linked from this site
          operate under their own privacy practices.
        </p>
      </ContentSection>

      <ContentSection title="Your choices and questions">
        <p>
          Privacy rights vary by location. Depending on applicable law, you may
          have rights to request access, correction, deletion, or restriction
          of personal information held about you. As the site does not
          currently offer a working contact or subscription submission
          feature, contact the Academy through its{" "}
          <Link
            href={siteConfig.communityUrl}
            className="font-semibold text-[#ffd43b] underline decoration-[#ffd43b]/50 underline-offset-4 hover:text-[#ffe16a]"
            target="_blank"
            rel="noopener noreferrer"
          >
            official WhatsApp channel
          </Link>{" "}
          for privacy questions. Please avoid sharing sensitive details there.
        </p>
      </ContentSection>
    </ContentPage>
  );
}

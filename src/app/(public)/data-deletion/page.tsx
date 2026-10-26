import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/pages/content-page";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Data Deletion Instructions | DK & SM Academy",
  description:
    "Instructions for requesting deletion of Facebook-related and other personal data handled by DK & SM Academy.",
};

export default async function DataDeletionPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  return (
    <ContentPage
      eyebrow="Privacy"
      title={<>Data Deletion <span className="text-[#ffd43b]">Instructions</span></>}
      description="How to request deletion of Facebook-related data and other personal information handled by DK & SM Academy."
    >
      {code && (
        <ContentSection title="Request status">
          <p>
            Your verified Facebook data deletion request was received and the
            local Facebook connection data was removed.
          </p>
          <p>
            Confirmation code: <strong className="text-white">{code}</strong>
          </p>
        </ContentSection>
      )}

      <ContentSection title="How to request deletion">
        <p>
          To request deletion of Facebook-related data, remove the DK &amp; SM
          Academy app from your Facebook account&apos;s Apps and Websites
          settings, where Facebook can send a verified deletion request to the
          application. You may also contact the Academy through its{" "}
          <Link
            href={siteConfig.communityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#ffd43b] underline decoration-[#ffd43b]/50 underline-offset-4 hover:text-[#ffe16a]"
          >
            official WhatsApp channel
          </Link>{" "}
          to request deletion of personal data processed through this website.
        </p>
        <p>
          Do not send passwords, access tokens, wallet recovery phrases,
          payment details, or other sensitive credentials in a deletion
          request.
        </p>
      </ContentSection>

      <ContentSection title="What to include">
        <p>
          Include your name or organization name, the email or account
          identifier associated with the request if applicable, the service or
          connection involved, and a clear description of the information you
          want deleted. For Facebook requests, identify the connected Facebook
          account or Page without sending an access token.
        </p>
      </ContentSection>

      <ContentSection title="Verification and processing">
        <p>
          We may ask for reasonable information to verify that a deletion
          request belongs to the requesting person or authorized
          administrator. We will not ask you to disclose a password or access
          token for verification.
        </p>
        <p>
          After verification, locally stored Facebook connection data and
          related analytics snapshots can be removed through the existing
          server-side deletion process. Other personal data handled by the
          website will be deleted when applicable, except where retention is
          required for legal, fraud-prevention, security, dispute-resolution,
          or other applicable obligations. The website does not publish a
          fixed hosting-log retention period.
        </p>
        <p>
          Deleting local data does not delete information held by Facebook,
          hosting providers, or other external platforms. You must make those
          requests directly with the relevant provider.
        </p>
      </ContentSection>
    </ContentPage>
  );
}

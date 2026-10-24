import { ContentPage, ContentSection } from "@/components/pages/content-page";

export default async function DataDeletionPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  return (
    <ContentPage
      eyebrow="Privacy"
      title={<>Data <span className="text-[#ffd43b]">Deletion</span></>}
      description="Information about Facebook data deletion requests for DK & SM Academy."
    >
      <ContentSection title="Request status">
        <p>
          Your Facebook data deletion request has been received. Facebook
          account access and locally stored Facebook Page connection data are
          removed when the verified deletion callback is processed.
        </p>
        {code ? (
          <p>
            Confirmation code: <strong>{code}</strong>
          </p>
        ) : (
          <p>
            If you submitted a request through Facebook, use the confirmation
            code provided by Facebook to identify it.
          </p>
        )}
      </ContentSection>
    </ContentPage>
  );
}

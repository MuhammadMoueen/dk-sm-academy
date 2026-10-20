import { ContentPage, ContentSection } from "@/components/pages/content-page";

export default function AboutPage() {
  return (
    <ContentPage
      eyebrow="About the Academy"
      title={<>Learn with <span className="text-[#ffd43b]">DK &amp; SM Academy</span></>}
      description="A place to explore educational resources, market context, and digital-asset learning."
    >
      <ContentSection title="About DK & SM Academy">
        <p>
          DK &amp; SM Academy shares educational resources, market insights,
          digital-asset learning material, and community updates. Our content
          is intended to help visitors explore financial and technology topics
          with context and curiosity.
        </p>
      </ContentSection>

      <ContentSection title="Our Educational Approach">
        <p>
          Our goal is to help people understand concepts, evaluate information
          independently, and learn about risks before making decisions. We
          encourage careful research and clear distinctions between education
          and personal financial advice.
        </p>
      </ContentSection>
    </ContentPage>
  );
}

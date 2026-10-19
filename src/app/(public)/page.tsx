
import { HeroSection } from "@/components/home/hero-section";
import AboutSection from "@/components/home/about-section";
import { BlogSection } from "@/components/blog/blog-section";
import { CommunitySection } from "@/components/home/community-section";
import { PortfolioSection } from "@/components/home/portfolio-section";
import { ServicesSection } from "@/components/services/services-section";

export default function HomePage() {
  return (
    <div>
      <div id="home" className="scroll-mt-20">
        <HeroSection />
      </div>
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <BlogSection />
      <CommunitySection />
    </div>
  );
}

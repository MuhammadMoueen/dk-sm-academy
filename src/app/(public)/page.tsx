
import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import AboutSection from "@/components/home/about-section";
import { BlogSection } from "@/components/blog/blog-section";
import { BrandLoader } from "@/components/layout/brand-loader";
import { CommunitySection } from "@/components/home/community-section";
import { PortfolioSection } from "@/components/home/portfolio-section";
import { ServicesSection } from "@/components/services/services-section";
import { connection } from "next/server";

async function HomeContent() {
  await connection();
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

export default function HomePage() {
  return (
    <Suspense fallback={<BrandLoader />}>
      <HomeContent />
    </Suspense>
  );
}

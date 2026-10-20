import { Suspense } from "react";
import { PortfolioSection } from "@/components/home/portfolio-section";
import { BrandLoader } from "@/components/layout/brand-loader";
import { connection } from "next/server";

async function PortfolioContent() {
  await connection();
  return <PortfolioSection fullPage />;
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={<BrandLoader />}>
      <PortfolioContent />
    </Suspense>
  );
}

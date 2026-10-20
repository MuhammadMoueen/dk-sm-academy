import { Suspense } from "react";
import { LearningResourcesPage } from "@/components/pages/learning-resources-page";
import { BrandLoader } from "@/components/layout/brand-loader";

export default function LearningResourcesRoute() {
  return (
    <Suspense fallback={<BrandLoader />}>
      <LearningResourcesPage />
    </Suspense>
  );
}

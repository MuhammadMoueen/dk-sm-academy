import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/services/service-detail";
import { getServiceBySlug } from "@/components/services/service-data";

export function ServicePage({ slug }: { slug: string }) {
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetail service={service} />;
}

import { PortfolioSection } from "@/components/home/portfolio-section";
import { connection } from "next/server";

export default async function PortfolioPage() {
  await connection();
  return <PortfolioSection fullPage />;
}

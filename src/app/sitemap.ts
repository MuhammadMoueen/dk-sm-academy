import type { MetadataRoute } from "next";
import { getPublishedArticleSlugs } from "@/features/articles/articles";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const articles = await getPublishedArticleSlugs();
  const staticRoutes = [
    "/",
    "/about",
    "/services",
    "/services/airdrops",
    "/services/buy-sell",
    "/services/courses",
    "/services/exchange-campaigns",
    "/services/trading",
    "/portfolio",
    "/reviews",
    "/blog",
    "/community",
    "/learning",
    "/learning-resources",
    "/faq",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: new URL(route, siteConfig.url).toString(),
      lastModified: now,
      changeFrequency: route === "/" ? "weekly" as const : "monthly" as const,
      priority: route === "/" ? 1 : 0.7,
    })),
    ...articles.map((article) => ({
      url: new URL(`/blog/${article.slug}`, siteConfig.url).toString(),
      lastModified: new Date(article.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}

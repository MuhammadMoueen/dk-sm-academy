import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: ["/admin", "/api"],
    },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}

import type { MetadataRoute } from "next";
import { getSiteBaseUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteBaseUrl();
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/stay", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/packages", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/gallery", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/explore-the-coast", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}


import type { MetadataRoute } from "next";
import { mockPrograms } from "@/lib/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://veriaid.example.com";
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/programs`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const programEntries: MetadataRoute.Sitemap = mockPrograms.flatMap((p) => [
    {
      url: `${base}/program/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${base}/proof/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ]);

  return [...staticEntries, ...programEntries];
}

import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { mockPrograms } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://veriaid.example.com";
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/programs`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  let slugs: string[] = [];
  try {
    const rows = await prisma.aidProgram.findMany({ select: { slug: true } });
    slugs = rows.map((r) => r.slug);
  } catch {
    slugs = mockPrograms.map((p) => p.id);
  }
  if (slugs.length === 0) slugs = mockPrograms.map((p) => p.id);

  const programEntries: MetadataRoute.Sitemap = slugs.flatMap((id) => [
    { url: `${base}/program/${id}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/proof/${id}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
  ]);

  return [...staticEntries, ...programEntries];
}

/**
 * Hybrid data layer — uses API when available, falls back to local mock.
 * - For server components, prefer direct DB / API calls
 * - For client components, this module is safe to import
 */
import { mockPrograms } from "./mock-data";
import type { AidProgram } from "./types";

export type { AidProgram } from "./types";

export { categories, statusLabel, statusColor, formatRupiah, getProgress } from "./mock-data";

/**
 * Fetch all programs (public). Falls back to mock on error.
 * Used by /programs and /program/[id] pages via async server components.
 */
export async function listProgramsServer(): Promise<AidProgram[]> {
  try {
    const { prisma } = await import("./db");
    const rows = await prisma.aidProgram.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toAidProgram);
  } catch (e) {
    if (process.env.NODE_ENV === "production") {
      console.error("listProgramsServer DB error:", e);
    }
    return mockPrograms as AidProgram[];
  }
}

export async function getProgramServer(idOrSlug: string): Promise<AidProgram | null> {
  try {
    const { prisma } = await import("./db");
    const row = await prisma.aidProgram.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });
    return row ? toAidProgram(row) : null;
  } catch {
    return (mockPrograms.find((p) => p.id === idOrSlug) as AidProgram) ?? null;
  }
}

interface PrismaProgram {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  description: string;
  targetFund: number;
  fundReceived: number;
  fundSpent: number;
  targetBeneficiary: number;
  aidType: string;
  status: string;
  aiScore: number;
  startDate: Date;
  endDate: Date | null;
  coverImage: string | null;
  organizer: string;
}

function toAidProgram(row: PrismaProgram): AidProgram {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    location: row.location,
    description: row.description,
    targetFund: row.targetFund,
    fundReceived: row.fundReceived,
    fundSpent: row.fundSpent,
    targetBeneficiary: row.targetBeneficiary,
    aidType: row.aidType,
    status: row.status as AidProgram["status"],
    aiScore: row.aiScore,
    startDate: row.startDate.toISOString(),
    endDate: row.endDate ? row.endDate.toISOString() : null,
    coverImage: row.coverImage,
    organizer: row.organizer,
  };
}

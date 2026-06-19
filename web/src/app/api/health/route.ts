// GET /api/health — service health check
import { prisma } from "@/lib/db";
import { isAIConfigured } from "@/lib/ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbOk = false;
  let dbError: string | null = null;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (e) {
    dbError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    status: "ok",
    service: "veriaid-ai-backend",
    time: new Date().toISOString(),
    db: { ok: dbOk, error: dbError },
    ai: { configured: isAIConfigured() },
    auth: { configured: Boolean(process.env.JWT_SECRET) },
  });
}

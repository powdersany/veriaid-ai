// /api/programs/[id]/proof — return the full chain for a program
import { prisma } from "@/lib/db";
import { verifyChain, shortHash } from "@/lib/server-blockchain";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function findProgram(id: string) {
  return prisma.aidProgram.findFirst({ where: { OR: [{ id }, { slug: id }] } });
}

export async function GET(_request: Request, ctx: RouteContext<"/api/programs/[id]/proof">) {
  const { id } = await ctx.params;
  const program = await findProgram(id);
  if (!program) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const events = await prisma.proofLedger.findMany({
    where: { programId: program.id },
    orderBy: { sequence: "asc" },
  });

  const chain = events.map((e) => ({
    event: e.eventType,
    timestamp: e.timestamp.toISOString(),
    data: JSON.parse(e.data),
    previousHash: e.previousHash,
    currentHash: e.currentHash,
    sequence: e.sequence,
    shortHash: shortHash(e.currentHash),
  }));

  const brokenAt = verifyChain(chain);
  const isValid = brokenAt === null;

  // Verification ID format: VER-{SLUG}-{AISCORE}-{YEAR}
  const year = new Date().getFullYear();
  const verificationId = `VER-${program.slug.toUpperCase()}-${program.aiScore || 0}-${year}`;

  return NextResponse.json({
    program: {
      id: program.id,
      slug: program.slug,
      title: program.title,
      status: program.status,
      aiScore: program.aiScore,
    },
    verificationId,
    isValid,
    brokenAt,
    eventCount: chain.length,
    chain,
  });
}

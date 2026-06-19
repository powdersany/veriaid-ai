// /api/verify/[hash] — verify a single event hash exists and is in a valid chain
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, ctx: RouteContext<"/api/verify/[hash]">) {
  const { hash } = await ctx.params;
  if (!hash || hash.length !== 64 || !/^[0-9a-f]{64}$/.test(hash)) {
    return NextResponse.json({ valid: false, reason: "Invalid hash format" }, { status: 400 });
  }

  const event = await prisma.proofLedger.findFirst({
    where: { currentHash: hash },
    include: {
      program: {
        select: { id: true, slug: true, title: true, status: true, aiScore: true },
      },
    },
  });
  if (!event) {
    return NextResponse.json({ valid: false, reason: "Hash not found in any program chain" });
  }

  // Re-verify the chain up to and including this event
  const events = await prisma.proofLedger.findMany({
    where: { programId: event.programId, sequence: { lte: event.sequence } },
    orderBy: { sequence: "asc" },
  });
  const chain = events.map((e) => ({
    event: e.eventType,
    timestamp: e.timestamp.toISOString(),
    data: JSON.parse(e.data),
    previousHash: e.previousHash,
    currentHash: e.currentHash,
    sequence: e.sequence,
  }));
  const { verifyChain } = await import("@/lib/server-blockchain");
  const brokenAt = verifyChain(chain);
  const isValid = brokenAt === null;

  return NextResponse.json({
    valid: isValid,
    event: {
      type: event.eventType,
      timestamp: event.timestamp.toISOString(),
      data: JSON.parse(event.data),
      sequence: event.sequence,
    },
    program: event.program,
  });
}

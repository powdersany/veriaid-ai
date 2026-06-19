// /api/programs/[id]/donations — public donation endpoint (alias for /fund with simpler payload)
import { prisma } from "@/lib/db";
import { computeEventHash } from "@/lib/server-blockchain";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function findProgram(id: string) {
  return prisma.aidProgram.findFirst({ where: { OR: [{ id }, { slug: id }] } });
}

export async function POST(request: Request, ctx: RouteContext<"/api/programs/[id]/donations">) {
  const { id } = await ctx.params;
  const program = await findProgram(id);
  if (!program) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount < 10_000) {
    return NextResponse.json({ error: "Minimum donasi Rp 10.000" }, { status: 400 });
  }
  const donorName = body.donorName ? String(body.donorName) : "Anonim";
  const method = String(body.method ?? "qris") === "bank" ? "donor_bank" : "donor_qris";
  const note = body.note ? String(body.note) : null;

  const fund = await prisma.fundRecord.create({
    data: { programId: program.id, amount, source: method, donorName, note },
  });

  const lastEvent = await prisma.proofLedger.findFirst({
    where: { programId: program.id },
    orderBy: { sequence: "desc" },
  });
  const prevHash = lastEvent?.currentHash ?? "0".repeat(64);
  const sequence = (lastEvent?.sequence ?? -1) + 1;
  const ts = new Date().toISOString();
  const data = { amount, method, donorName, note };
  const currentHash = computeEventHash("FUND_RECEIVED", ts, data, prevHash);

  const [updated] = await Promise.all([
    prisma.aidProgram.update({
      where: { id: program.id },
      data: { fundReceived: { increment: amount } },
    }),
    prisma.proofLedger.create({
      data: {
        programId: program.id,
        eventType: "FUND_RECEIVED",
        data: JSON.stringify(data),
        previousHash: prevHash,
        currentHash,
        sequence,
        timestamp: new Date(ts),
      },
    }),
  ]);

  return NextResponse.json(
    {
      donation: fund,
      program: { id: updated.id, slug: updated.slug, fundReceived: updated.fundReceived },
    },
    { status: 201 },
  );
}

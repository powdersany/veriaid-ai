// /api/programs/[id]/fund — record incoming donation / fund
// Public endpoint (donors don't need an account to give)
import { prisma } from "@/lib/db";
import { computeEventHash } from "@/lib/server-blockchain";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function findProgram(id: string) {
  return prisma.aidProgram.findFirst({ where: { OR: [{ id }, { slug: id }] } });
}

export async function POST(request: Request, ctx: RouteContext<"/api/programs/[id]/fund">) {
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
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "amount harus angka > 0" }, { status: 400 });
  }
  const source = String(body.source ?? "donor_qris");
  const donorName = body.donorName ? String(body.donorName) : null;
  const note = body.note ? String(body.note) : null;

  const fund = await prisma.fundRecord.create({
    data: {
      programId: program.id,
      amount,
      source,
      donorName,
      note,
    },
  });

  // Update program total + append proof chain event
  const lastEvent = await prisma.proofLedger.findFirst({
    where: { programId: program.id },
    orderBy: { sequence: "desc" },
  });
  const prevHash = lastEvent?.currentHash ?? "0".repeat(64);
  const sequence = (lastEvent?.sequence ?? -1) + 1;
  const ts = new Date().toISOString();
  const data = { amount, source, donorName, note };
  const currentHash = computeEventHash("FUND_RECEIVED", ts, data, prevHash);

  const [updated, _event] = await Promise.all([
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

  return NextResponse.json({ fund, program: updated }, { status: 201 });
}

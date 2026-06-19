// /api/programs/[id]/expense — record expense
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/server-auth";
import { computeEventHash } from "@/lib/server-blockchain";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function findProgram(id: string) {
  return prisma.aidProgram.findFirst({ where: { OR: [{ id }, { slug: id }] } });
}

export async function POST(request: Request, ctx: RouteContext<"/api/programs/[id]/expense">) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const program = await findProgram(id);
  if (!program) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (program.ownerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const item = String(body.item ?? "").trim();
  const amount = Number(body.amount);
  const category = String(body.category ?? "Paket Bantuan").trim();
  const date = body.date ? new Date(String(body.date)) : new Date();
  const note = body.note ? String(body.note) : null;

  if (!item) return NextResponse.json({ error: "item wajib diisi" }, { status: 400 });
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "amount harus angka > 0" }, { status: 400 });
  }

  const expense = await prisma.expense.create({
    data: { programId: program.id, item, amount, category, date, note },
  });

  const lastEvent = await prisma.proofLedger.findFirst({
    where: { programId: program.id },
    orderBy: { sequence: "desc" },
  });
  const prevHash = lastEvent?.currentHash ?? "0".repeat(64);
  const sequence = (lastEvent?.sequence ?? -1) + 1;
  const ts = new Date().toISOString();
  const data = { expenseId: expense.id, item, amount, category };
  const currentHash = computeEventHash("EXPENSE_RECORDED", ts, data, prevHash);

  const [updated] = await Promise.all([
    prisma.aidProgram.update({
      where: { id: program.id },
      data: { fundSpent: { increment: amount } },
    }),
    prisma.proofLedger.create({
      data: {
        programId: program.id,
        eventType: "EXPENSE_RECORDED",
        data: JSON.stringify(data),
        previousHash: prevHash,
        currentHash,
        sequence,
        timestamp: new Date(ts),
      },
    }),
  ]);

  return NextResponse.json({ expense, program: updated }, { status: 201 });
}

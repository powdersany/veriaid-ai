// /api/programs/[id] — read / update / delete
// `id` is the cuid primary key OR the slug.
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/server-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function findProgram(id: string) {
  // Try by id first, fall back to slug
  return prisma.aidProgram.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  });
}

export async function GET(_request: Request, ctx: RouteContext<"/api/programs/[id]">) {
  const { id } = await ctx.params;
  const program = await findProgram(id);
  if (!program) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [expenses, evidence, funds, analyses, proof] = await Promise.all([
    prisma.expense.findMany({
      where: { programId: program.id },
      orderBy: { date: "desc" },
    }),
    prisma.evidence.findMany({
      where: { programId: program.id },
      orderBy: { date: "desc" },
    }),
    prisma.fundRecord.findMany({
      where: { programId: program.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.analysis.findMany({
      where: { programId: program.id },
      orderBy: { createdAt: "desc" },
      take: 1,
    }),
    prisma.proofLedger.findMany({
      where: { programId: program.id },
      orderBy: { sequence: "asc" },
    }),
  ]);

  return NextResponse.json({ program, expenses, evidence, funds, analyses, proof });
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/programs/[id]">) {
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

  const updated = await prisma.aidProgram.update({
    where: { id: program.id },
    data: {
      title: body.title ?? undefined,
      description: body.description ?? undefined,
      category: body.category ?? undefined,
      location: body.location ?? undefined,
      targetFund: Number.isFinite(Number(body.targetFund))
        ? Number(body.targetFund)
        : undefined,
      targetBeneficiary: Number.isFinite(Number(body.targetBeneficiary))
        ? Number(body.targetBeneficiary)
        : undefined,
      aidType: body.aidType ?? undefined,
      coverImage: body.coverImage ?? undefined,
      endDate: body.endDate ? new Date(String(body.endDate)) : undefined,
      status: body.status ?? undefined,
    },
  });
  return NextResponse.json({ program: updated });
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/programs/[id]">) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const program = await findProgram(id);
  if (!program) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (program.ownerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await prisma.aidProgram.delete({ where: { id: program.id } });
  return NextResponse.json({ ok: true });
}

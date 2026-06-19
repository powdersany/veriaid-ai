// /api/programs — list + create
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/server-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 40);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const category = url.searchParams.get("category");
  const mine = url.searchParams.get("mine") === "1";

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (category) where.category = category;
  if (mine) {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    where.ownerId = user.id;
  }

  const programs = await prisma.aidProgram.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { expenses: true, evidence: true, funds: true } },
    },
  });

  return NextResponse.json({ programs });
}

export async function POST(request: Request) {
  const user = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  const category = String(body.category ?? "").trim();
  const location = String(body.location ?? "").trim();
  const description = String(body.description ?? "").trim();
  const targetFund = Number(body.targetFund);
  const targetBeneficiary = Number(body.targetBeneficiary);
  const aidType = String(body.aidType ?? "").trim();
  const startDate = body.startDate ? new Date(String(body.startDate)) : new Date();
  const organizer = String(body.organizer ?? user.organization ?? user.name).trim();

  if (!title || !category || !location) {
    return NextResponse.json(
      { error: "title, category, location wajib diisi" },
      { status: 400 },
    );
  }
  if (!Number.isFinite(targetFund) || targetFund <= 0) {
    return NextResponse.json({ error: "targetFund harus angka > 0" }, { status: 400 });
  }

  const baseSlug = slugify(title) || "program";
  let slug = baseSlug;
  let i = 1;
  while (await prisma.aidProgram.findUnique({ where: { slug } })) {
    i += 1;
    slug = `${baseSlug}-${i}`;
  }

  const program = await prisma.aidProgram.create({
    data: {
      title,
      category,
      location,
      description,
      targetFund,
      fundReceived: 0,
      fundSpent: 0,
      targetBeneficiary: Number.isFinite(targetBeneficiary) ? targetBeneficiary : 0,
      aidType,
      status: "pending_review",
      aiScore: 0,
      startDate,
      organizer,
      slug,
      ownerId: user.id,
    },
  });

  // Seed the proof chain with PROGRAM_CREATED event
  const { GENESIS, computeEventHash } = await import("@/lib/server-blockchain");
  const ts = new Date().toISOString();
  const data = {
    programId: program.slug,
    title: program.title,
    targetFund: program.targetFund,
    organizer: program.organizer,
    ownerId: user.id,
  };
  const currentHash = computeEventHash("PROGRAM_CREATED", ts, data, GENESIS);
  await prisma.proofLedger.create({
    data: {
      programId: program.id,
      eventType: "PROGRAM_CREATED",
      data: JSON.stringify(data),
      previousHash: GENESIS,
      currentHash,
      sequence: 0,
      timestamp: new Date(ts),
    },
  });

  return NextResponse.json({ program }, { status: 201 });
}

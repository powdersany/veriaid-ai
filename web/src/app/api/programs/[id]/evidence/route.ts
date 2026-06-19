// /api/programs/[id]/evidence — upload evidence record (metadata only for MVP)
// File binary upload out-of-scope for MVP; we store name/type/size + base64 OCR.
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/server-auth";
import { computeEventHash } from "@/lib/server-blockchain";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function findProgram(id: string) {
  return prisma.aidProgram.findFirst({ where: { OR: [{ id }, { slug: id }] } });
}

export async function POST(request: Request, ctx: RouteContext<"/api/programs/[id]/evidence">) {
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

  const name = String(body.name ?? "").trim();
  const type = String(body.type ?? "dokumen").trim();
  const size = String(body.size ?? "0 KB").trim();
  const ocrData = body.ocrData ? JSON.stringify(body.ocrData) : null;
  const status = body.status ? String(body.status) : "pending";
  const aiNote = body.aiNote ? String(body.aiNote) : null;

  if (!name) return NextResponse.json({ error: "name wajib diisi" }, { status: 400 });

  const evidence = await prisma.evidence.create({
    data: {
      programId: program.id,
      name,
      type,
      size,
      ocrData,
      status,
      aiNote,
    },
  });

  const lastEvent = await prisma.proofLedger.findFirst({
    where: { programId: program.id },
    orderBy: { sequence: "desc" },
  });
  const prevHash = lastEvent?.currentHash ?? "0".repeat(64);
  const sequence = (lastEvent?.sequence ?? -1) + 1;
  const ts = new Date().toISOString();
  const data = { evidenceId: evidence.id, name, type, status };
  const currentHash = computeEventHash("EVIDENCE_UPLOADED", ts, data, prevHash);

  await prisma.proofLedger.create({
    data: {
      programId: program.id,
      eventType: "EVIDENCE_UPLOADED",
      data: JSON.stringify(data),
      previousHash: prevHash,
      currentHash,
      sequence,
      timestamp: new Date(ts),
    },
  });

  return NextResponse.json({ evidence }, { status: 201 });
}

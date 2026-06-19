// /api/evidence/[id]/ocr — run OCR on a base64 image and patch the evidence
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/server-auth";
import { ocrEvidence } from "@/lib/ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request, ctx: RouteContext<"/api/evidence/[id]/ocr">) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  const evidence = await prisma.evidence.findUnique({
    where: { id },
    include: { program: true },
  });
  if (!evidence) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (evidence.program.ownerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const imageBase64 = String(body.imageBase64 ?? "");
  const mimeType = String(body.mimeType ?? "image/jpeg");
  if (!imageBase64) {
    return NextResponse.json({ error: "imageBase64 wajib diisi" }, { status: 400 });
  }

  const ocr = await ocrEvidence(imageBase64, mimeType);
  const updated = await prisma.evidence.update({
    where: { id: evidence.id },
    data: {
      status: ocr.nominal || ocr.vendor ? "analyzed" : "pending",
      aiNote:
        ocr.nominal || ocr.vendor
          ? `OCR: ${ocr.vendor ?? "vendor ?"} · Rp ${ocr.nominal?.toLocaleString("id-ID") ?? "?"}`
          : ocr.description,
      ocrData: JSON.stringify(ocr),
    },
  });

  return NextResponse.json({ evidence: updated, ocr });
}

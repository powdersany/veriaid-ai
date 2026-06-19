// /api/programs/me — current user's programs (dashboard)
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/server-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const programs = await prisma.aidProgram.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { expenses: true, evidence: true, funds: true } },
    },
  });

  return NextResponse.json({ programs });
}

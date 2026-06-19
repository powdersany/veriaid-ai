// /api/programs/[id]/analyze — trigger AI analysis
// Runs the 4-analyzer pipeline + generates a narrative report.
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/server-auth";
import { analyzeProgram } from "@/lib/ai";
import { computeEventHash } from "@/lib/server-blockchain";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
// AI calls may take 10-30s, give Next.js enough time.
export const maxDuration = 60;

async function findProgram(id: string) {
  return prisma.aidProgram.findFirst({ where: { OR: [{ id }, { slug: id }] } });
}

export async function POST(_request: Request, ctx: RouteContext<"/api/programs/[id]/analyze">) {
  const user = await getUserFromRequest();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const program = await findProgram(id);
  if (!program) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (program.ownerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [expenses, evidence] = await Promise.all([
    prisma.expense.findMany({ where: { programId: program.id } }),
    prisma.evidence.findMany({ where: { programId: program.id } }),
  ]);

  const result = await analyzeProgram({
    programTitle: program.title,
    category: program.category,
    targetFund: program.targetFund,
    fundReceived: program.fundReceived,
    fundSpent: program.fundSpent,
    targetBeneficiary: program.targetBeneficiary,
    expenseCount: expenses.length,
    evidenceCount: evidence.length,
    expenseCategories: Array.from(new Set(expenses.map((e) => e.category))),
  });

  const newStatus = result.overallScore >= 85 ? "verified" : result.overallScore >= 70 ? "in_progress" : "pending_review";

  const analysis = await prisma.analysis.create({
    data: {
      programId: program.id,
      aiScore: result.overallScore,
      breakdown: JSON.stringify(result.breakdown),
      detectedIssues: JSON.stringify(result.detectedIssues),
      report: result.report,
    },
  });

  // Update program score + status
  await prisma.aidProgram.update({
    where: { id: program.id },
    data: { aiScore: result.overallScore, status: newStatus },
  });

  // Append AI_REVIEWED event to chain
  const lastEvent = await prisma.proofLedger.findFirst({
    where: { programId: program.id },
    orderBy: { sequence: "desc" },
  });
  const prevHash = lastEvent?.currentHash ?? "0".repeat(64);
  const sequence = (lastEvent?.sequence ?? -1) + 1;
  const ts = new Date().toISOString();
  const data = { analysisId: analysis.id, aiScore: result.overallScore, newStatus };
  const currentHash = computeEventHash("AI_REVIEWED", ts, data, prevHash);
  await prisma.proofLedger.create({
    data: {
      programId: program.id,
      eventType: "AI_REVIEWED",
      data: JSON.stringify(data),
      previousHash: prevHash,
      currentHash,
      sequence,
      timestamp: new Date(ts),
    },
  });

  // If verified, also append REPORT_PUBLISHED
  if (newStatus === "verified") {
    const lastEvent2 = await prisma.proofLedger.findFirst({
      where: { programId: program.id },
      orderBy: { sequence: "desc" },
    });
    const prev2 = lastEvent2?.currentHash ?? "0".repeat(64);
    const seq2 = (lastEvent2?.sequence ?? -1) + 1;
    const ts2 = new Date().toISOString();
    const data2 = { status: "verified", aiScore: result.overallScore };
    const hash2 = computeEventHash("REPORT_PUBLISHED", ts2, data2, prev2);
    await prisma.proofLedger.create({
      data: {
        programId: program.id,
        eventType: "REPORT_PUBLISHED",
        data: JSON.stringify(data2),
        previousHash: prev2,
        currentHash: hash2,
        sequence: seq2,
        timestamp: new Date(ts2),
      },
    });
  }

  return NextResponse.json({ analysis: { ...analysis, breakdown: result.breakdown, detectedIssues: result.detectedIssues } });
}

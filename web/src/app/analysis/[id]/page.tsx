"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";
import { mockPrograms } from "@/lib/mock-data";
import { programsApi } from "@/lib/api-client";
import type { Analysis, AnalysisBreakdown, DetectedIssue, AidProgram } from "@/lib/types";

const colorByScore = (score: number) => {
  if (score >= 90) return "bg-success";
  if (score >= 75) return "bg-teal-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-danger";
};

const labelByScore = (score: number) => {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Cukup";
  if (score >= 40) return "Perlu Perhatian";
  return "Bermasalah";
};

const issueSeverityColor = (sev: string) => {
  if (sev === "high") return "bg-red-50 border border-red-200";
  if (sev === "medium") return "bg-amber-50 border border-amber-200";
  return "bg-blue-50 border border-blue-200";
};

const issueDotColor = (sev: string) => {
  if (sev === "high") return "bg-danger";
  if (sev === "medium") return "bg-warning";
  return "bg-blue-500";
};

export default function AnalysisPage() {
  const params = useParams<{ id: string }>();
  const program = mockPrograms.find((p) => p.id === params.id) as AidProgram | undefined;

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [breakdown, setBreakdown] = useState<AnalysisBreakdown | null>(null);
  const [issues, setIssues] = useState<DetectedIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<string | null>(null);

  // Load existing analysis on mount
  useEffect(() => {
    if (!params.id) return;
    programsApi
      .get(params.id)
      .then((r) => {
        const latest = r.analyses?.[0];
        if (latest) {
          setAnalysis(latest);
          try {
            setBreakdown(JSON.parse(latest.breakdown) as AnalysisBreakdown);
            setIssues(JSON.parse(latest.detectedIssues) as DetectedIssue[]);
          } catch {
            // ignore parse errors
          }
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal load analisis"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (!program) return null;

  const runAnalyze = async () => {
    setRunning(true);
    setError(null);
    try {
      const r = await programsApi.analyze(params.id);
      setAnalysis({
        id: r.analysis.id,
        programId: r.analysis.programId,
        aiScore: r.analysis.aiScore,
        breakdown: r.analysis.breakdown,
        detectedIssues: r.analysis.detectedIssues,
        report: r.analysis.report,
        createdAt: r.analysis.createdAt,
      });
      setBreakdown(r.analysis.breakdown as unknown as AnalysisBreakdown);
      setIssues(r.analysis.detectedIssues as unknown as DetectedIssue[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI analyze gagal");
    } finally {
      setRunning(false);
    }
  };

  const score = analysis?.aiScore ?? program.aiScore;
  const hasAnalysis = !!analysis;

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-teal-600 mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6M6 10h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Kembali ke Dashboard
        </Link>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs text-ink-500 mb-1">{program.category} · {program.location}</div>
            <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-ink-900">
              Hasil Analisis AI
            </h1>
            <p className="text-ink-500 mt-1">
              AI mereview konsistensi, bukti, dan anomali secara otomatis.
            </p>
          </div>
          <button
            onClick={runAnalyze}
            disabled={running || loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 disabled:opacity-60 transition-colors"
          >
            <svg className={`w-4 h-4 ${running ? "animate-spin" : ""}`} viewBox="0 0 20 20" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            {running ? "Menjalankan AI…" : hasAnalysis ? "Re-run Analisis" : "Jalankan Analisis AI"}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl border border-ink-200 p-12 text-center text-ink-500">
            <svg className="w-8 h-8 animate-spin mx-auto mb-3 text-teal-700" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
              <path d="M17 10a7 7 0 00-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Memuat analisis…
          </div>
        ) : !hasAnalysis ? (
          <div className="bg-white rounded-2xl border border-ink-200 p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 20 20" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-bold text-ink-900 mb-1">Belum ada analisis AI</h3>
            <p className="text-sm text-ink-500 mb-4">
              Klik tombol &ldquo;Jalankan Analisis AI&rdquo; untuk generate skor akuntabilitas &amp; rekomendasi.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-ink-200 p-6 lg:p-8 mb-6">
              <div className="grid sm:grid-cols-3 gap-6 items-center">
                <div className="text-center sm:border-r sm:border-ink-200 sm:pr-6">
                  <div className="text-xs text-ink-500 mb-1 uppercase tracking-wider">
                    Skor Akuntabilitas
                  </div>
                  <div className="font-display text-6xl font-extrabold text-gradient my-2">{score}</div>
                  <div className="text-sm text-ink-500">dari 100</div>
                </div>
                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold text-ink-700">Status Laporan</span>
                      <span className="font-semibold text-success">
                        {score >= 75 ? "Siap Dipublikasikan" : score >= 50 ? "Perlu Review" : "Bermasalah"}
                      </span>
                    </div>
                    <p className="text-sm text-ink-500">
                      {analysis.report?.slice(0, 220) ?? "Laporan telah diverifikasi AI."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-success">
                      {labelByScore(score)}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600">
                      Fully Audited
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl border border-ink-200 p-5 lg:p-6">
                <h2 className="font-display text-lg font-bold text-ink-900 mb-4">
                  Skor per Dimensi
                </h2>
                <div className="space-y-4">
                  {breakdown &&
                    Object.entries(breakdown).map(([key, dim]) => (
                      <div key={key}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="font-semibold text-ink-700">
                            {key === "financialConsistency"
                              ? "Konsistensi Finansial"
                              : key === "evidenceVerification"
                              ? "Verifikasi Bukti"
                              : key === "anomalyDetection"
                              ? "Deteksi Anomali"
                              : "Kualitas Pelaporan"}
                          </span>
                          <span className="font-display font-bold text-ink-900">
                            {dim.score} / 100
                          </span>
                        </div>
                        <div className="h-2 bg-ink-100 rounded-full overflow-hidden mb-1">
                          <div className={`h-full ${colorByScore(dim.score)} rounded-full`} style={{ width: `${dim.score}%` }} />
                        </div>
                        <p className="text-xs text-ink-500">{dim.desc}</p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-ink-200 p-5 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-bold text-ink-900">
                    Isu Terdeteksi
                  </h2>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-ink-100 text-ink-600">
                    {issues.filter((i) => !i.resolved).length} belum selesai
                  </span>
                </div>
                {issues.length === 0 ? (
                  <p className="text-sm text-ink-500 py-4 text-center">
                    Tidak ada masalah terdeteksi. ✓
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {issues.map((issue, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-3 p-3 rounded-lg ${
                          issue.resolved ? "bg-ink-50 opacity-60" : issueSeverityColor(issue.severity)
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                            issue.resolved ? "bg-success" : issueDotColor(issue.severity)
                          }`}
                        >
                          {issue.resolved ? (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="none">
                              <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <span className="text-white text-xs">!</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-ink-700">{issue.text}</p>
                          <p className="text-xs text-ink-500 mt-1">
                            {issue.resolved ? "Sudah diperbaiki" : `Severity: ${issue.severity}`}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}

        <div className="bg-gradient-to-br from-ink-900 to-teal-900 rounded-2xl p-6 lg:p-8 text-white">
          <h2 className="font-display text-xl font-bold mb-2">
            Rekomendasi AI
          </h2>
          <p className="text-white/80 mb-6 text-sm leading-relaxed">
            {hasAnalysis
              ? "Laporan telah dianalisis. Generate bukti blockchain untuk mengunci laporan secara permanen."
              : "Jalankan analisis AI untuk melihat rekomendasi otomatis."}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setAction("reviewed")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                action === "reviewed"
                  ? "bg-white text-teal-800"
                  : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
              }`}
            >
              {action === "reviewed" ? (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Ditandai Review
                </>
              ) : (
                "Tandai Perlu Review"
              )}
            </button>
            <button
              onClick={() => setAction("approved")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                action === "approved"
                  ? "bg-white text-teal-800"
                  : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
              }`}
            >
              {action === "approved" ? "✓ Disetujui" : "Setujui Laporan"}
            </button>
            <Link
              href={`/proof/${program.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-teal-800 bg-white rounded-lg hover:bg-ink-50 transition-colors"
            >
              Generate Bukti Blockchain
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
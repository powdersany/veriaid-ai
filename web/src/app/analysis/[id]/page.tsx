"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";
import { mockPrograms } from "@/lib/mock-data";

const aiBreakdown = [
  { label: "Konsistensi Finansial", score: 95, desc: "Pengeluaran sesuai alokasi budget", color: "bg-success" },
  { label: "Verifikasi Bukti", score: 92, desc: "8 dari 8 bukti terverifikasi", color: "bg-teal-500" },
  { label: "Anomali Distribusi", score: 96, desc: "Tidak ada anomali terdeteksi", color: "bg-blue-500" },
  { label: "Kualitas Pelaporan", score: 90, desc: "Laporan lengkap & terdokumentasi", color: "bg-gold-500" },
];

const detectedIssues = [
  { severity: "medium", text: "1 invoice duplikat terdeteksi (logistik, 19 Feb)", resolved: false },
  { severity: "low", text: "Foto distribusi batch ke-3 kurang jelas, perlu re-upload", resolved: false },
  { severity: "low", text: "Catatan penerima manfaat belum lengkap 5%", resolved: true },
];

export default function AnalysisPage() {
  const params = useParams<{ id: string }>();
  const program = mockPrograms.find((p) => p.id === params.id);
  const [action, setAction] = useState<string | null>(null);

  if (!program) {
    notFound();
  }

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

        <div className="mb-6">
          <div className="text-xs text-ink-500 mb-1">{program.category} · {program.location}</div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-ink-900">
            Hasil Analisis AI
          </h1>
          <p className="text-ink-500 mt-1">
            AI mereview konsistensi, bukti, dan anomali secara otomatis.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-ink-200 p-6 lg:p-8 mb-6">
          <div className="grid sm:grid-cols-3 gap-6 items-center">
            <div className="text-center sm:border-r sm:border-ink-200 sm:pr-6">
              <div className="text-xs text-ink-500 mb-1 uppercase tracking-wider">
                Skor Akuntabilitas
              </div>
              <div className="font-display text-6xl font-extrabold text-gradient my-2">
                {program.aiScore}
              </div>
              <div className="text-sm text-ink-500">dari 100</div>
            </div>
            <div className="sm:col-span-2 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-ink-700">Status Laporan</span>
                  <span className="font-semibold text-success">Siap Dipublikasikan</span>
                </div>
                <p className="text-sm text-ink-500">
                  Laporan telah diverifikasi AI dan siap untuk generate bukti blockchain publik.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-success">
                  {program.aiScore >= 90 ? "Excellent" : "Good"}
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600">
                  Fully Audited
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-50 text-purple-600">
                  AI Verified
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
              {aiBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-semibold text-ink-700">{item.label}</span>
                    <span className="font-display font-bold text-ink-900">
                      {item.score} / 100
                    </span>
                  </div>
                  <div className="h-2 bg-ink-100 rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-ink-500">{item.desc}</p>
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
                {detectedIssues.filter((i) => !i.resolved).length} belum selesai
              </span>
            </div>
            <ul className="space-y-3">
              {detectedIssues.map((issue, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    issue.resolved
                      ? "bg-ink-50 opacity-60"
                      : issue.severity === "medium"
                      ? "bg-amber-50 border border-amber-200"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                      issue.resolved
                        ? "bg-success"
                        : issue.severity === "medium"
                        ? "bg-warning"
                        : "bg-blue-500"
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
                      {issue.resolved
                        ? "Sudah diperbaiki"
                        : `Severity: ${issue.severity}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-ink-900 to-teal-900 rounded-2xl p-6 lg:p-8 text-white">
          <h2 className="font-display text-xl font-bold mb-2">
            Rekomendasi AI
          </h2>
          <p className="text-white/80 mb-6 text-sm leading-relaxed">
            Berdasarkan analisis, program ini siap untuk dipublikasikan. Generate
            bukti blockchain untuk mengunci laporan secara permanen dan publikasikan
            ke donatur.
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

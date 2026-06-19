import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";
import { ShareModal } from "@/components/ShareModal";
import { mockPrograms, formatRupiah, getProgress, statusLabel, statusColor } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — VeriAid AI",
  description: "Kelola program bantuan Anda. Pantau dana, bukti, dan skor akuntabilitas real-time.",
};

// Aggregate stats from mock data
const totalPrograms = mockPrograms.length;
const totalFundRecorded = mockPrograms.reduce((sum, p) => sum + p.fundReceived, 0);
const totalAidDelivered = mockPrograms.reduce((sum, p) => sum + p.targetBeneficiary, 0);
const avgAiScore = Math.round(
  mockPrograms.reduce((sum, p) => sum + p.aiScore, 0) / mockPrograms.length
);
const pendingReview = mockPrograms.filter((p) => p.status === "pending_review").length;
const verifiedCount = mockPrograms.filter((p) => p.status === "verified").length;

export default function DashboardOverviewPage() {
  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-ink-900">
            Overview
          </h1>
          <p className="text-ink-500 mt-1">
            Pantau semua program bantuan yang Anda kelola.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Program"
            value={totalPrograms.toString()}
            icon="M3 7h18M3 12h18M3 17h18"
            color="bg-teal-50 text-teal-700"
          />
          <StatCard
            label="Total Dana"
            value={formatRupiah(totalFundRecorded)}
            icon="M12 4v12m-4-8l4-4 4 4M5 18h14"
            color="bg-gold-50 text-gold-500"
          />
          <StatCard
            label="Penerima Manfaat"
            value={totalAidDelivered.toLocaleString("id-ID")}
            icon="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z"
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            label="Rata-rata Skor AI"
            value={`${avgAiScore} / 100`}
            icon="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
            color="bg-purple-50 text-purple-600"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="p-5 bg-white border border-ink-200 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-warning flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-2xl font-display font-extrabold text-ink-900">
                {pendingReview}
              </div>
              <div className="text-sm text-ink-500">Program Menunggu Review AI</div>
            </div>
          </div>
          <div className="p-5 bg-white border border-ink-200 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 text-success flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-2xl font-display font-extrabold text-ink-900">
                {verifiedCount}
              </div>
              <div className="text-sm text-ink-500">Program Terverifikasi</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-ink-200 overflow-hidden">
          <div className="p-5 lg:p-6 border-b border-ink-200 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-ink-900">
                Program Aktif
              </h2>
              <p className="text-sm text-ink-500 mt-0.5">
                Klik baris untuk lihat detail
              </p>
            </div>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Tambah
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-ink-50 text-left text-xs font-semibold text-ink-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Program</th>
                  <th className="px-5 py-3 hidden md:table-cell">Status</th>
                  <th className="px-5 py-3 hidden lg:table-cell">Progress</th>
                  <th className="px-5 py-3">Skor AI</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {mockPrograms.map((p) => {
                  const progress = getProgress(p.fundSpent, p.targetFund);
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-ink-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-ink-900 text-sm">
                          {p.title}
                        </div>
                        <div className="text-xs text-ink-500 mt-0.5">
                          {p.location}
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${statusColor[p.status]}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {statusLabel[p.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden min-w-[80px]">
                            <div
                              className="h-full bg-gradient-to-r from-teal-500 to-teal-600"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-ink-500 w-10 text-right">
                            {progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`font-display font-bold ${
                            p.aiScore >= 90
                              ? "text-success"
                              : p.aiScore >= 80
                              ? "text-blue-600"
                              : "text-warning"
                          }`}
                        >
                          {p.aiScore}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <ShareModal
                            programId={p.id}
                            programTitle={p.title}
                          />
                          <Link
                            href={`/dashboard/program/${p.id}/finance`}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-900"
                          >
                            Kelola
                            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="none">
                              <path d="M4 10h12m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="p-5 bg-white border border-ink-200 rounded-xl">
      <div
        className={`w-10 h-10 mb-3 flex items-center justify-center rounded-lg ${color}`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path
            d={icon}
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="text-xs text-ink-500 mb-1">{label}</div>
      <div className="font-display text-xl lg:text-2xl font-bold text-ink-900">
        {value}
      </div>
    </div>
  );
}

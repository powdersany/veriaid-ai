import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/db";
import { mockPrograms, formatRupiah, getProgress, statusLabel, statusColor } from "@/lib/mock-data";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProgram(idOrSlug: string) {
  return prisma.aidProgram.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const program = (await getProgram(id)) ?? mockPrograms.find((p) => p.id === id);
  if (!program) return { title: "Program tidak ditemukan — VeriAid AI" };
  return {
    title: `${program.title} — VeriAid AI`,
    description: program.description,
  };
}

const journeySteps = [
  "Program Dibuat",
  "Dana Diterima",
  "Dana Dialokasikan",
  "Pengeluaran Dicatat",
  "Bukti Diunggah",
  "AI Review",
  "Terverifikasi",
  "Dipublikasikan",
];

const aiBreakdown = [
  { label: "Konsistensi Finansial", score: 95, color: "bg-success" },
  { label: "Verifikasi Bukti", score: 92, color: "bg-teal-500" },
  { label: "Anomali Distribusi", score: 96, color: "bg-blue-500" },
  { label: "Kualitas Pelaporan", score: 90, color: "bg-gold-500" },
];

const recentActivity = [
  { time: "2 jam lalu", text: "Bukti foto distribusi 50 paket diunggah", type: "evidence" },
  { time: "5 jam lalu", text: "Pengeluaran Rp 1.200.000 dicatat untuk logistik", type: "expense" },
  { time: "1 hari lalu", text: "AI selesai menganalisis konsistensi laporan", type: "ai" },
  { time: "2 hari lalu", text: "Alokasi budget diperbarui: Logistik Rp 2.5M", type: "allocation" },
  { time: "3 hari lalu", text: "Donasi Rp 2.000.000 diterima dari 23 donatur", type: "fund" },
];

export default async function ProgramDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dbProgram = await getProgram(id);
  const program = dbProgram
    ? {
        ...dbProgram,
        startDate: dbProgram.startDate.toISOString(),
        endDate: dbProgram.endDate ? dbProgram.endDate.toISOString() : undefined,
        coverImage: dbProgram.coverImage ?? undefined,
        status: dbProgram.status as "verified" | "in_progress" | "pending_review",
      }
    : mockPrograms.find((p) => p.id === id);
  if (!program) notFound();

  const progress = getProgress(program.fundSpent, program.targetFund);
  const remaining = program.fundReceived - program.fundSpent;
  const verifiedSteps = program.status === "verified" ? 8 : program.status === "in_progress" ? 5 : 3;

  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-ink-50 to-white pt-8 pb-12 lg:pb-16">
          <div className="container-page">
            <Link
              href="/programs"
              className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-teal-600 mb-6"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                <path d="M12 4l-6 6 6 6M6 10h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Kembali ke daftar program
            </Link>

            <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
                    {program.category}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${statusColor[program.status]}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {statusLabel[program.status]}
                  </span>
                </div>

                <h1 className="font-display font-extrabold text-[clamp(1.875rem,4vw,2.75rem)] leading-tight tracking-tight text-ink-900 mb-4">
                  {program.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-500 mb-6">
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2a6 6 0 016 6c0 4.5-6 10-6 10s-6-5.5-6-10a6 6 0 016-6z" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    {program.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                      <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M3 8h14M7 4v3M13 4v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Mulai {new Date(program.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M3 17a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    {program.organizer}
                  </span>
                </div>

                <p className="text-lg text-ink-500 leading-relaxed">{program.description}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-ink-200 shadow-[var(--shadow-card)]">
                <div className="text-center">
                  <div className="text-sm text-ink-500 mb-1">Skor Akuntabilitas</div>
                  <div className="font-display text-5xl font-extrabold text-gradient mb-2">
                    {program.aiScore}
                  </div>
                  <div className="text-xs text-ink-400">dari 100 poin</div>
                </div>
                <Link
                  href={`/proof/${program.id}`}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L3 5v5c0 4.4 3 8.5 7 9.4 4-0.9 7-5 7-9.4V5l-7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Lihat Bukti Blockchain
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8 lg:py-12">
          <div className="container-page">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Target Dana"
                value={formatRupiah(program.targetFund)}
                icon={<path d="M3 7h14M3 12h14M3 17h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
              />
              <StatCard
                label="Dana Diterima"
                value={formatRupiah(program.fundReceived)}
                highlight="text-teal-700"
                icon={<path d="M12 4v12m-4-8l4-4 4 4M5 18h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
              />
              <StatCard
                label="Penerima Manfaat"
                value={program.targetBeneficiary.toLocaleString("id-ID") + " KK"}
                icon={<circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />}
              />
              <StatCard
                label="Jenis Bantuan"
                value={program.aidType}
                icon={<path d="M3 8h14l-1 9H4L3 8zM8 8V5a2 2 0 014 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
              />
            </div>
          </div>
        </section>

        {/* Fund Usage */}
        <section className="py-8 lg:py-12 bg-ink-50">
          <div className="container-page">
            <h2 className="font-display text-2xl font-bold text-ink-900 mb-6">
              Ringkasan Penggunaan Dana
            </h2>
            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 items-center">
              <div className="flex flex-col items-center">
                <DonutChart
                  percent={progress}
                  spent={program.fundSpent}
                  total={program.targetFund}
                />
              </div>
              <div className="space-y-3">
                <BudgetRow
                  label="Paket Makanan"
                  amount={program.fundSpent * 0.55}
                  total={program.targetFund}
                  color="bg-teal-500"
                />
                <BudgetRow
                  label="Logistik & Distribusi"
                  amount={program.fundSpent * 0.28}
                  total={program.targetFund}
                  color="bg-gold-500"
                />
                <BudgetRow
                  label="Operasional & Admin"
                  amount={program.fundSpent * 0.17}
                  total={program.targetFund}
                  color="bg-blue-500"
                />
                <div className="pt-4 mt-2 border-t border-ink-200 flex items-center justify-between text-sm">
                  <span className="text-ink-500 font-medium">Sisa Dana</span>
                  <span className="font-display font-bold text-ink-900">
                    {formatRupiah(remaining)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Aid Journey Timeline */}
        <section className="py-8 lg:py-12">
          <div className="container-page">
            <h2 className="font-display text-2xl font-bold text-ink-900 mb-2">
              Perjalanan Program
            </h2>
            <p className="text-ink-500 mb-8">
              Setiap tahap tercatat otomatis dan terverifikasi di blockchain.
            </p>
            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {journeySteps.map((step, i) => {
                const isDone = i < verifiedSteps;
                const isCurrent = i === verifiedSteps;
                return (
                  <li
                    key={step}
                    className={`relative p-4 rounded-xl border transition-all ${
                      isDone
                        ? "bg-white border-teal-200"
                        : isCurrent
                        ? "bg-amber-50 border-amber-200"
                        : "bg-ink-50 border-ink-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isDone
                            ? "bg-teal-500 text-white"
                            : isCurrent
                            ? "bg-amber-500 text-white"
                            : "bg-ink-200 text-ink-500"
                        }`}
                      >
                        {isDone ? "✓" : i + 1}
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div
                          className={`text-sm font-semibold ${
                            isDone
                              ? "text-ink-900"
                              : isCurrent
                              ? "text-amber-900"
                              : "text-ink-500"
                          }`}
                        >
                          {step}
                        </div>
                        <div className="text-xs mt-0.5 text-ink-500">
                          {isDone ? "Selesai" : isCurrent ? "Berjalan" : "Menunggu"}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* AI Summary + Activity */}
        <section className="py-8 lg:py-12 bg-ink-50">
          <div className="container-page grid lg:grid-cols-[1.5fr_1fr] gap-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink-900 mb-2">
                Ringkasan Analisis AI
              </h2>
              <p className="text-ink-500 mb-6">
                Skor dihitung otomatis dari 4 dimensi akuntabilitas.
              </p>
              <div className="space-y-4">
                {aiBreakdown.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium text-ink-700">{item.label}</span>
                      <span className="font-display font-bold text-ink-900">
                        {item.score} / 100
                      </span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-ink-900 mb-2">
                Aktivitas Terbaru
              </h2>
              <p className="text-ink-500 mb-6">Update real-time dari program.</p>
              <div className="space-y-3">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-white rounded-lg border border-ink-200">
                    <div className="w-1.5 h-1.5 mt-2 rounded-full bg-teal-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-ink-700">{a.text}</p>
                      <p className="text-xs text-ink-400 mt-1">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blockchain Proof CTA */}
        <section className="py-12 lg:py-20">
          <div className="container-page">
            <div className="relative px-6 sm:px-10 py-10 bg-gradient-to-br from-ink-900 to-teal-900 rounded-3xl text-white text-center overflow-hidden">
              <h2 className="relative font-display text-2xl lg:text-3xl font-extrabold mb-2">
                Verifikasi bukti blockchain program ini
              </h2>
              <p className="relative text-white/80 mb-6 max-w-xl mx-auto">
                Setiap transaksi di-hash dan dirangkai di ledger publik. Cek
                integritas laporan secara independen.
              </p>
              <Link
                href={`/proof/${program.id}`}
                className="relative inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-teal-800 bg-white rounded-lg hover:bg-ink-50 transition-colors"
              >
                Buka Halaman Verifikasi
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
  highlight = "text-ink-900",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: string;
}) {
  return (
    <div className="p-5 bg-white border border-ink-200 rounded-xl">
      <div className="w-9 h-9 mb-3 flex items-center justify-center bg-ink-50 text-ink-500 rounded-lg">
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
          {icon}
        </svg>
      </div>
      <div className="text-xs text-ink-500 mb-1">{label}</div>
      <div className={`font-display text-lg font-bold ${highlight}`}>
        {value}
      </div>
    </div>
  );
}

function DonutChart({
  percent,
  spent,
  total,
}: {
  percent: number;
  spent: number;
  total: number;
}) {
  const conicStops = `conic-gradient(from 0deg, #1B8A8A 0% ${percent}%, #E5E7EB ${percent}% 100%)`;
  return (
    <div className="relative w-48 h-48">
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: conicStops }}
      />
      <div className="absolute inset-6 bg-white rounded-full flex flex-col items-center justify-center">
        <div className="font-display text-3xl font-extrabold text-ink-900">
          {percent}%
        </div>
        <div className="text-xs text-ink-500 mt-1">Terealisasi</div>
      </div>
    </div>
  );
}

function BudgetRow({
  label,
  amount,
  total,
  color,
}: {
  label: string;
  amount: number;
  total: number;
  color: string;
}) {
  const pct = Math.round((amount / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="text-ink-700">{label}</span>
        <span className="font-semibold text-ink-900">
          {formatRupiah(amount)} <span className="text-ink-400 text-xs">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 bg-white rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

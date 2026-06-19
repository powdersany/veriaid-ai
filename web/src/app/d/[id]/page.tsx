import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import {
  mockPrograms,
  formatRupiah,
  getProgress,
  statusLabel,
  statusColor,
  generateMockHash,
  generateMockTransactions,
} from "@/lib/mock-data";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const program = mockPrograms.find((p) => p.id === id);
  if (!program) {
    return { title: "Program tidak ditemukan · VeriAid AI" };
  }
  return {
    title: `Donasi untuk ${program.title} · VeriAid AI`,
    description: `${program.description} Pantau transparansi dana: ${formatRupiah(program.fundReceived)} dari ${formatRupiah(program.targetFund)} terkumpul.`,
  };
}

export default async function DonatePage({ params }: PageProps) {
  const { id } = await params;
  const program = mockPrograms.find((p) => p.id === id);

  if (!program) {
    notFound();
  }

  const progress = getProgress(program.fundReceived, program.targetFund);
  const spentProgress = getProgress(program.fundSpent, program.fundReceived);
  const transactions = generateMockTransactions(program.id, 5);
  const hash = generateMockHash(program.id);

  return (
    <>
      <Nav />
      <main className="flex-1 bg-gradient-to-b from-white via-ink-50/30 to-white">
        {/* Hero */}
        <section className="relative section-spacing overflow-hidden">
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute -top-32 -right-20 w-[480px] h-[480px] rounded-full bg-teal-500/30 blur-[80px]" />
            <div className="absolute -bottom-24 -left-16 w-[380px] h-[380px] rounded-full bg-gold-500/20 blur-[80px]" />
          </div>

          <div className="container-page max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${statusColor[program.status]}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {statusLabel[program.status]}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-ink-100 text-ink-700">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2a6 6 0 016 6c0 4-6 10-6 10s-6-6-6-10a6 6 0 016-6z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                {program.location}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-ink-100 text-ink-700">
                {program.category}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-tight text-ink-900">
              {program.title}
            </h1>
            <p className="text-lg text-ink-500 leading-relaxed mt-4 max-w-2xl">
              {program.description}
            </p>
            <p className="text-sm text-ink-500 mt-3">
              Diselenggarakan oleh{" "}
              <strong className="text-ink-700">{program.organizer}</strong>
            </p>
          </div>
        </section>

        {/* Progress Card + Donate CTA */}
        <section className="container-page max-w-4xl -mt-6 mb-12 relative z-10">
          <div className="bg-white rounded-3xl shadow-[var(--shadow-card-lg)] border border-ink-200 overflow-hidden">
            <div className="p-6 lg:p-8 bg-gradient-to-br from-teal-800 to-teal-900 text-white">
              <div className="flex items-end justify-between gap-4 mb-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-white/70 font-semibold">
                    Dana Terkumpul
                  </div>
                  <div className="font-display font-extrabold text-[clamp(2rem,5vw,3rem)] leading-none mt-1">
                    {formatRupiah(program.fundReceived)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wider text-white/70 font-semibold">
                    Target
                  </div>
                  <div className="text-base lg:text-lg font-semibold mt-1">
                    {formatRupiah(program.targetFund)}
                  </div>
                </div>
              </div>
              <div className="h-3 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-300 transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-white/80 font-semibold">
                  {progress}% tercapai
                </span>
                <span className="text-white/70">
                  {formatRupiah(program.targetFund - program.fundReceived)} lagi
                </span>
              </div>
            </div>

            <div className="p-6 lg:p-8 flex flex-wrap gap-3 justify-end bg-ink-50/50">
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-all shadow-[var(--shadow-glow)] hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 3v10m0 0l-4-4m4 4l4-4M3 17h14"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Donasi Sekarang
              </Link>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-ink-800 bg-white border border-ink-200 rounded-lg hover:border-teal-500 hover:text-teal-800 hover:bg-ink-50 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3 8a7 7 0 0114 0v3a2 2 0 01-2 2h-1v-7h3M3 8v3a2 2 0 002 2h1v-7H3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                Bagikan
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="container-page max-w-4xl mb-12">
          <h2 className="font-display font-bold text-xl text-ink-900 mb-5">
            Detail Program
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <StatCard
              label="Target Dana"
              value={formatRupiah(program.targetFund)}
              icon="M12 6v12M6 12h12"
            />
            <StatCard
              label="Dana Terpakai"
              value={formatRupiah(program.fundSpent)}
              accent={`${spentProgress}% dari terkumpul`}
              icon="M3 12h14m-7-7v14"
            />
            <StatCard
              label="Penerima Manfaat"
              value={`${program.targetBeneficiary.toLocaleString("id-ID")} keluarga`}
              icon="M10 14a4 4 0 100-8 4 4 0 000 8zM3 18a7 7 0 0114 0"
            />
            <StatCard
              label="Skor Akuntabilitas"
              value={`${program.aiScore} / 100`}
              accent={
                program.aiScore >= 90
                  ? "Sangat Baik"
                  : program.aiScore >= 80
                  ? "Baik"
                  : "Perlu Review"
              }
              icon="M9 12l2 2 4-4M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
            <StatCard
              label="Tipe Bantuan"
              value={program.aidType}
              icon="M3 7l9-4 9 4-9 4-9-4zm0 5l9 4 9-4M3 17l9 4 9-4"
            />
            <StatCard
              label="Periode"
              value={`${formatDateShort(program.startDate)}${program.endDate ? ` – ${formatDateShort(program.endDate)}` : " – sekarang"}`}
              icon="M3 7h18M3 7v12a2 2 0 002 2h14a2 2 0 002-2V7M8 3v4m8-4v4"
            />
          </div>
        </section>

        {/* Trust Section */}
        <section className="container-page max-w-4xl mb-12">
          <div className="bg-gradient-to-br from-teal-50 via-white to-gold-50 border-2 border-teal-200 rounded-2xl p-6 lg:p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-teal-800 text-white rounded-xl">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-display font-extrabold text-lg text-ink-900">
                  Bukti Integritas Blockchain
                </h3>
                <p className="text-sm text-ink-600 mt-1">
                  Setiap transaksi & laporan program ini di-hash dengan
                  SHA-256 dan dicatat di immutable ledger publik.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-lg border border-teal-200">
                <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1">
                  SHA-256 Hash
                </div>
                <code className="text-sm text-teal-800 font-mono break-all">
                  {hash}
                </code>
              </div>
              <div className="p-3 bg-white rounded-lg border border-teal-200">
                <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1">
                  Status Verifikasi
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-success" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 10l4 4 6-8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-ink-900">
                    Verified · Anti-Manipulasi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="container-page max-w-4xl mb-16">
          <h2 className="font-display font-bold text-xl text-ink-900 mb-5">
            Aktivitas Terbaru
          </h2>
          <div className="bg-white border border-ink-200 rounded-2xl overflow-hidden">
            {transactions.map((tx, i) => (
              <div
                key={tx.id}
                className={`flex items-center gap-3 p-4 ${
                  i < transactions.length - 1 ? "border-b border-ink-200" : ""
                }`}
              >
                <div
                  className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full ${
                    tx.type === "donation"
                      ? "bg-green-100 text-green-700"
                      : tx.type === "expense"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {tx.type === "donation" ? (
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 3v10m0 0l-4-4m4 4l4-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : tx.type === "expense" ? (
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 17V7m0 0l-4 4m4-4l4 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M3 8h14M3 8l3-3M3 8l3 3M17 12H3m14 0l-3-3m3 3l-3 3"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-ink-900 truncate">
                    {tx.description}
                  </div>
                  <div className="text-xs text-ink-500 mt-0.5">
                    {tx.actor} · {tx.date}
                  </div>
                </div>
                <div
                  className={`text-sm font-bold flex-shrink-0 ${
                    tx.type === "donation"
                      ? "text-success"
                      : tx.type === "expense"
                      ? "text-orange-600"
                      : "text-blue-600"
                  }`}
                >
                  {tx.type === "donation" ? "+" : "−"}
                  {formatRupiah(tx.amount)}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink-400 text-center mt-3">
            Demo data — aktivitas real-time tersedia setelah integrasi backend
          </p>
        </section>

        {/* CTA Bottom */}
        <section className="container-page max-w-4xl mb-20">
          <div className="bg-ink-900 text-white rounded-3xl p-8 lg:p-12 text-center">
            <h2 className="font-display font-extrabold text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight">
              Saluran donasi terpercaya
            </h2>
            <p className="text-white/70 mt-3 max-w-lg mx-auto">
              Setiap donasi tercatat otomatis di blockchain VeriAid. Donatur
              mendapat bukti SHA-256 unik yang bisa diverifikasi publik kapan
              saja.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-ink-900 bg-white rounded-lg hover:bg-ink-100 transition-colors"
              >
                Donasi via QRIS
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-600 transition-colors border border-teal-600"
              >
                Transfer Bank
              </Link>
            </div>
            <p className="text-xs text-white/50 mt-6 tracking-wider">
              Hackathon MVP v1.0 · Payment gateway coming soon
            </p>
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
  accent,
}: {
  label: string;
  value: string;
  icon: string;
  accent?: string;
}) {
  return (
    <div className="p-5 bg-white border border-ink-200 rounded-xl">
      <div className="w-9 h-9 mb-3 flex items-center justify-center rounded-lg bg-teal-50 text-teal-700">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d={icon} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
        {label}
      </div>
      <div className="text-base font-bold text-ink-900 mt-1 leading-tight">
        {value}
      </div>
      {accent && (
        <div className="text-xs text-ink-500 mt-1">{accent}</div>
      )}
    </div>
  );
}

function formatDateShort(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
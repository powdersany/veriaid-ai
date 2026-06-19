import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { VerifyButton } from "@/components/VerifyButton";
import { mockPrograms } from "@/lib/mock-data";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return mockPrograms.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const program = mockPrograms.find((p) => p.id === id);
  return {
    title: program
      ? `Bukti Blockchain — ${program.title} | VeriAid AI`
      : "Bukti Blockchain — VeriAid AI",
    description:
      "Sertifikat publik berbasis SHA-256 hash chain. Verifikasi integritas laporan program bantuan secara independen.",
  };
}

const proofEvents = [
  { event: "REPORT_PUBLISHED", hash: "0x4f8a3c9b...d7e2", time: "2026-02-28 14:32:01" },
  { event: "REPORT_APPROVED", hash: "0x2b7e1f4a...8c3d", time: "2026-02-28 14:28:47" },
  { event: "AI_REVIEWED", hash: "0x9d5c8e2f...1a6b", time: "2026-02-28 14:15:22" },
  { event: "EVIDENCE_UPLOADED", hash: "0x6a3b4d7e...9c2f", time: "2026-02-27 16:42:18" },
  { event: "EXPENSE_RECORDED", hash: "0x4e8f2a1b...5d9c", time: "2026-02-25 09:14:55" },
  { event: "FUND_ALLOCATED", hash: "0x1c7b9e3a...4f8d", time: "2026-02-10 11:23:09" },
  { event: "FUND_RECEIVED", hash: "0x8a2d5f6c...3b7e", time: "2026-01-20 10:05:33" },
  { event: "PROGRAM_CREATED", hash: "0x3f6e8a2b...1c4d", time: "2026-01-15 09:00:00" },
];

export default async function ProofPage({ params }: PageProps) {
  const { id } = await params;
  const program = mockPrograms.find((p) => p.id === id);
  if (!program) notFound();

  const verificationId = `VER-${program.id.toUpperCase()}-${program.aiScore}-2026`;
  const isValid = program.status === "verified";

  return (
    <>
      <Nav />
      <main className="flex-1 bg-ink-50">
        <section className="section-spacing">
          <div className="container-page max-w-4xl">
            <Link
              href={`/program/${program.id}`}
              className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-teal-600 mb-6"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                <path d="M12 4l-6 6 6 6M6 10h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Kembali ke program
            </Link>

            <div className="text-center mb-8">
              <div className="inline-flex w-16 h-16 items-center justify-center bg-gradient-to-br from-teal-800 to-teal-600 rounded-2xl mb-4">
                <svg className="w-9 h-9 text-white" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2L4 8v8c0 7.5 5.1 14.5 12 16 6.9-1.5 12-8.5 12-16V8L16 2z" fill="rgba(255,255,255,0.15)" />
                  <path d="M11 16l3.5 3.5L21 13" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h1 className="font-display font-extrabold text-[clamp(1.75rem,4vw,2.5rem)] leading-tight tracking-tight text-ink-900 mb-2">
                Proof of Integrity
              </h1>
              <p className="text-ink-500">
                Sertifikat publik berbasis SHA-256 hash chain untuk{" "}
                <strong className="text-ink-900">{program.title}</strong>
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-[var(--shadow-card-lg)] border border-ink-200 overflow-hidden">
              <div className="p-6 sm:p-8 border-b border-ink-200 bg-gradient-to-br from-ink-50 to-white">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-ink-500 uppercase tracking-wider mb-1">
                      Status Verifikasi
                    </div>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-full ${
                        isValid
                          ? "bg-green-50 text-success"
                          : "bg-amber-50 text-warning"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isValid ? "bg-success" : "bg-warning"
                        }`}
                      />
                      {isValid ? "Valid · Terverifikasi" : "Menunggu Review"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-ink-500 uppercase tracking-wider mb-1">
                      Diterbitkan
                    </div>
                    <div className="text-sm font-semibold text-ink-900">
                      {new Date(program.startDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                  <Field label="Verification ID" value={verificationId} mono />
                  <Field label="Program ID" value={program.id} mono />
                  <Field label="Organisasi" value={program.organizer} />
                  <Field label="Lokasi" value={program.location} />
                  <Field label="Skor AI" value={`${program.aiScore} / 100`} highlight />
                  <Field
                    label="Report Integrity"
                    value={isValid ? "Utuh (tidak dimodifikasi)" : "Dalam Review"}
                  />
                </div>

                <div className="pt-6 border-t border-ink-200">
                  <div className="text-xs text-ink-500 uppercase tracking-wider mb-2">
                    Hash Saat Ini (HEAD)
                  </div>
                  <code className="block p-4 bg-ink-900 text-green-400 rounded-xl font-mono text-sm break-all">
                    0x4f8a3c9b2e7d1a6f5c8b9e2d4a7f1c3b6e9d2a5f8c1b4e7d3a6f9c2b5e8d1a4f
                  </code>
                </div>

                <div className="pt-6 border-t border-ink-200">
                  <div className="text-xs text-ink-500 uppercase tracking-wider mb-2">
                    Previous Hash
                  </div>
                  <code className="block p-4 bg-ink-100 text-ink-700 rounded-xl font-mono text-sm break-all">
                    0x2b7e1f4a8c3d6a9f1e4b7c2d5a8f1e3b6c9d2a5f8e1b4c7d3a6f9c2b5e8d1a6f
                  </code>
                </div>

                <div className="pt-6 border-t border-ink-200">
                  <VerifyButton valid={isValid} />
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-2xl border border-ink-200 overflow-hidden">
              <div className="p-6 border-b border-ink-200">
                <h2 className="font-display text-lg font-bold text-ink-900">
                  Event Log (Hash Chain)
                </h2>
                <p className="text-sm text-ink-500 mt-1">
                  Setiap event di-hash dan dirangkai. Memodifikasi satu event akan
                  membatalkan seluruh chain.
                </p>
              </div>
              <div className="divide-y divide-ink-200">
                {proofEvents.map((e, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-ink-50 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500/10 text-teal-700 flex items-center justify-center text-xs font-bold">
                      {proofEvents.length - i}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-ink-900">
                        {e.event.replace(/_/g, " ")}
                      </div>
                      <code className="text-xs text-ink-500 font-mono break-all">
                        {e.hash}
                      </code>
                    </div>
                    <div className="text-xs text-ink-500 hidden sm:block whitespace-nowrap">
                      {e.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
              <h3 className="font-display text-base font-bold text-blue-900 mb-2">
                Apa yang bisa diverifikasi?
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Siapa pun (donatur, jurnalis, regulator) bisa request halaman
                ini. Sistem akan re-compute hash chain dari event pertama
                (genesis) hingga event terbaru, lalu bandingkan dengan hash yang
                tersimpan. Jika cocok, berarti laporan{" "}
                <strong>benar-benar tidak dimodifikasi</strong> sejak dipublikasikan.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Field({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-ink-500 uppercase tracking-wider mb-1.5">
        {label}
      </div>
      <div
        className={`${mono ? "font-mono text-sm" : "text-sm font-semibold"} ${
          highlight ? "text-gradient text-lg" : "text-ink-900"
        } break-words`}
      >
        {value}
      </div>
    </div>
  );
}

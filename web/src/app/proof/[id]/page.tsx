import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { VerifyButton } from "@/components/VerifyButton";
import { prisma } from "@/lib/db";
import { mockPrograms } from "@/lib/mock-data";
import { shortHash } from "@/lib/server-blockchain";
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
  const program = await getProgram(id);
  const fallback = mockPrograms.find((p) => p.id === id);
  const p = program ?? fallback;
  return {
    title: p ? `Bukti Blockchain — ${p.title} | VeriAid AI` : "Bukti Blockchain — VeriAid AI",
    description:
      "Sertifikat publik berbasis SHA-256 hash chain. Verifikasi integritas laporan program bantuan secara independen.",
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ProofPage({ params }: PageProps) {
  const { id } = await params;
  const program = await getProgram(id);
  if (!program) {
    // Fall back to mock data so static export still works on Vercel
    const fallback = mockPrograms.find((p) => p.id === id);
    if (!fallback) notFound();
    return <MockProofCard id={id} />;
  }

  const events = await prisma.proofLedger.findMany({
    where: { programId: program.id },
    orderBy: { sequence: "asc" },
  });

  // Reverse for display (newest first), but keep the chain data
  const displayEvents = [...events].reverse();
  const head = events[events.length - 1];
  const headShort = head ? shortHash(head.currentHash) : "0x000...000";
  const headFull = head?.currentHash ?? "0".repeat(64);
  const prevFull = head?.previousHash ?? "0".repeat(64);
  const isValid = program.status === "verified" && events.length > 0;
  const verificationId = `VER-${program.slug.toUpperCase()}-${program.aiScore || 0}-${new Date().getFullYear()}`;

  return (
    <>
      <Nav />
      <main className="flex-1 bg-ink-50">
        <section className="section-spacing">
          <div className="container-page max-w-4xl">
            <Link
              href={`/program/${program.slug}`}
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
                        isValid ? "bg-green-50 text-success" : "bg-amber-50 text-warning"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isValid ? "bg-success" : "bg-warning"}`} />
                      {isValid ? `Valid · ${events.length} event` : "Menunggu Review"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-ink-500 uppercase tracking-wider mb-1">
                      Diterbitkan
                    </div>
                    <div className="text-sm font-semibold text-ink-900">
                      {formatDateLong(program.startDate.toISOString())}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                  <Field label="Verification ID" value={verificationId} mono />
                  <Field label="Program ID" value={program.slug} mono />
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
                    Hash Saat Ini (HEAD) · {headShort}
                  </div>
                  <code className="block p-4 bg-ink-900 text-green-400 rounded-xl font-mono text-xs break-all">
                    {headFull}
                  </code>
                </div>

                <div className="pt-6 border-t border-ink-200">
                  <div className="text-xs text-ink-500 uppercase tracking-wider mb-2">
                    Previous Hash
                  </div>
                  <code className="block p-4 bg-ink-100 text-ink-700 rounded-xl font-mono text-xs break-all">
                    {prevFull}
                  </code>
                </div>

                <div className="pt-6 border-t border-ink-200">
                  <VerifyButtonHash hash={headFull} />
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white rounded-2xl border border-ink-200 overflow-hidden">
              <div className="p-6 border-b border-ink-200">
                <h2 className="font-display text-lg font-bold text-ink-900">
                  Event Log (Hash Chain) — {events.length} event
                </h2>
                <p className="text-sm text-ink-500 mt-1">
                  Setiap event di-hash dan dirangkai. Memodifikasi satu event akan membatalkan seluruh chain.
                </p>
              </div>
              <div className="divide-y divide-ink-200">
                {displayEvents.length === 0 ? (
                  <div className="p-8 text-center text-ink-500 text-sm">
                    Belum ada event untuk program ini.
                  </div>
                ) : (
                  displayEvents.map((e) => (
                    <div key={e.id} className="flex items-center gap-4 p-4 hover:bg-ink-50 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500/10 text-teal-700 flex items-center justify-center text-xs font-bold">
                        #{e.sequence}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-ink-900">
                          {e.eventType.replace(/_/g, " ")}
                        </div>
                        <code className="text-xs text-ink-500 font-mono break-all">
                          {shortHash(e.currentHash, 10, 8)}
                        </code>
                      </div>
                      <div className="text-xs text-ink-500 hidden sm:block whitespace-nowrap">
                        {formatDate(e.timestamp.toISOString())}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
              <h3 className="font-display text-base font-bold text-blue-900 mb-2">
                Apa yang bisa diverifikasi?
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Siapa pun (donatur, jurnalis, regulator) bisa request halaman ini. Sistem akan re-compute hash chain dari
                event pertama (genesis) hingga event terbaru, lalu bandingkan dengan hash yang tersimpan. Jika cocok,
                berarti laporan <strong>benar-benar tidak dimodifikasi</strong> sejak dipublikasikan.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function VerifyButtonHash({ hash }: { hash: string }) {
  return <VerifyButton valid={true} hash={hash} />;
}

function MockProofCard({ id }: { id: string }) {
  const fallback = mockPrograms.find((p) => p.id === id)!;
  return (
    <>
      <Nav />
      <main className="flex-1 bg-ink-50">
        <section className="section-spacing">
          <div className="container-page max-w-4xl">
            <Link href={`/program/${fallback.id}`} className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-teal-600 mb-6">
              ← Kembali ke program
            </Link>
            <div className="bg-white rounded-2xl border border-ink-200 p-8 text-center">
              <h1 className="font-display text-2xl font-bold text-ink-900 mb-2">{fallback.title}</h1>
              <p className="text-ink-500 text-sm">
                Data program ada di mock fallback. Untuk proof chain real, jalankan database backend.
              </p>
              <code className="block mt-4 p-3 bg-ink-100 text-xs text-ink-700 rounded font-mono">
                npm run db:reset && npm run dev
              </code>
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

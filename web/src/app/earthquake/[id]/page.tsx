import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { QrisButton, TransferButton } from "@/components/PaymentInfoModal";
import {
  fetchLatestEarthquake,
  fetchRecentEarthquakes,
  magnitudeColor,
  magnitudeSeverity,
} from "@/lib/disasters";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await findEarthquake(id);
  if (!event) return { title: "Bencana tidak ditemukan · VeriAid AI" };
  return {
    title: `Donasi untuk ${event.title} · VeriAid AI`,
    description: `Bantu korban gempa ${event.location}. Magnitude ${event.magnitude}, kedalaman ${event.depth}. Donasi transparan via VeriAid AI.`,
  };
}

async function findEarthquake(id: string) {
  // Try latest first (most common click)
  const latest = await fetchLatestEarthquake();
  if (latest?.id === id) return latest;
  // Then search in recent list
  const recent = await fetchRecentEarthquakes();
  return recent.find((e) => e.id === id) ?? null;
}

export default async function EarthquakeDonatePage({ params }: PageProps) {
  const { id } = await params;
  const event = await findEarthquake(id);
  if (!event) notFound();

  return (
    <>
      <Nav />
      <main className="flex-1 bg-gradient-to-b from-white via-ink-50/30 to-white">
        {/* Hero with shakemap */}
        <section className="relative section-spacing overflow-hidden">
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute -top-32 -right-20 w-[480px] h-[480px] rounded-full bg-red-500/10 blur-[80px]" />
            <div className="absolute -bottom-24 -left-16 w-[380px] h-[380px] rounded-full bg-amber-500/10 blur-[80px]" />
          </div>

          <div className="container-page max-w-4xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-display font-extrabold rounded-lg ${magnitudeColor(
                  event.magnitude
                )}`}
              >
                M{event.magnitude} &middot; {magnitudeSeverity(event.magnitude)}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                Bencana Alam
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
                {event.location}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-tight text-ink-900">
              {event.title}
            </h1>
            <p className="text-lg text-ink-500 leading-relaxed mt-4 max-w-2xl">
              Gempa bumi {event.date} pukul {event.time} dengan kedalaman {event.depth}.
              {event.feltIn !== "-" && (
                <> Dirasakan di {event.feltIn}.</>
              )}
            </p>

            {/* Source badge */}
            <a
              href={event.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-sm font-semibold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zM2 10a8 8 0 1116 0"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M10 2c2.5 2.5 3.5 5 3.5 8s-1 5.5-3.5 8M10 2c-2.5 2.5-3.5 5-3.5 8s1 5.5 3.5 8M2 10h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              Sumber: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
            </a>
          </div>
        </section>

        {/* Shakemap + Donate */}
        <section className="container-page max-w-4xl -mt-6 mb-12 relative z-10">
          <div className="bg-white rounded-3xl shadow-[var(--shadow-card-lg)] border border-ink-200 overflow-hidden">
            {/* Shakemap image */}
            <div className="relative aspect-video bg-ink-100">
              <Image
                src={event.imageUrl}
                alt={`Shakemap ${event.title}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
                unoptimized
              />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 divide-x divide-ink-200 border-b border-ink-200">
              <div className="p-4 text-center">
                <div className="text-xs text-ink-400 mb-1">Magnitude</div>
                <div className={`font-display text-2xl font-extrabold ${magnitudeColor(event.magnitude).split(" ")[0].replace("bg-", "text-")}`}>
                  M{event.magnitude}
                </div>
              </div>
              <div className="p-4 text-center">
                <div className="text-xs text-ink-400 mb-1">Kedalaman</div>
                <div className="font-display text-2xl font-extrabold text-ink-900">
                  {event.depth}
                </div>
              </div>
              <div className="p-4 text-center">
                <div className="text-xs text-ink-400 mb-1">Koordinat</div>
                <div className="font-display text-sm font-bold text-ink-900">
                  {event.coordinates}
                </div>
              </div>
            </div>

            {/* Donate CTA */}
            <div className="p-6 lg:p-8">
              <div className="text-center mb-6">
                <h2 className="font-display text-xl font-bold text-ink-900 mb-2">
                  Bantu Korban Gempa {event.location}
                </h2>
                <p className="text-sm text-ink-500">
                  Donasi Anda akan disalurkan untuk bantuan darurat, logistik, dan pemulihan pasca bencana.
                  Semua transaksi tercatat transparan di blockchain.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <QrisButton programTitle={`Bantuan Gempa ${event.location}`} />
                <TransferButton programTitle={`Bantuan Gempa ${event.location}`} />
              </div>
            </div>
          </div>
        </section>

        {/* Info section */}
        <section className="container-page max-w-4xl mb-12">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L2 18h16L10 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M10 8v4M10 14h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3 className="font-display font-bold text-ink-900 mb-1">Data Real-time dari BMKG</h3>
                <p className="text-sm text-ink-600">
                  Data gempa ini diambil langsung dari API resmi BMKG (Badan Meteorologi, Klimatologi, dan Geofisika).
                  Shakemap menunjukkan intensitas guncangan di berbagai wilayah. Data diperbarui otomatis setiap 5 menit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Back link */}
        <section className="container-page max-w-4xl mb-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
              <path d="M13 16l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Kembali ke Beranda
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

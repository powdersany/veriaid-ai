import Link from "next/link";
import { fetchRecentEarthquakes, magnitudeColor } from "@/lib/disasters";

/**
 * Compact horizontal ticker of latest earthquakes for the landing page.
 * Server Component — fetches BMKG data at request time.
 */
export async function DisasterTicker() {
  const events = (await fetchRecentEarthquakes()).slice(0, 3);
  if (events.length === 0) return null;

  return (
    <section className="section-spacing bg-ink-50 border-y border-ink-200">
      <div className="container-page">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-danger" />
            </span>
            <h2 className="font-display text-xl lg:text-2xl font-extrabold text-ink-900">
              Gempa Terkini
            </h2>
          </div>
          <span className="text-xs text-ink-400 bg-ink-200 px-2 py-0.5 rounded-full">
            Sumber: BMKG
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => (
            <Link
              key={ev.id}
              href={`/earthquake/${ev.id}`}
              className="group flex gap-4 p-4 bg-white border border-ink-200 rounded-xl hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] hover:border-teal-500/30 transition-all"
            >
              {/* Magnitude badge */}
              <div className="flex-shrink-0">
                <span
                  className={`inline-flex items-center justify-center w-14 h-14 text-lg font-display font-extrabold rounded-xl ${magnitudeColor(
                    ev.magnitude
                  )}`}
                >
                  M{ev.magnitude}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-ink-900 mb-1 truncate group-hover:text-teal-700 transition-colors">
                  {ev.location}
                </h3>
                <p className="text-xs text-ink-500">
                  {ev.date} &middot; {ev.time}
                </p>
                <p className="text-xs text-ink-400 mt-1">
                  Kedalaman {ev.depth}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-ink-300 group-hover:text-teal-600 transition-colors"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M7 4l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/programs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-900 transition-colors"
          >
            Lihat Semua Bencana
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
              <path
                d="M7 4l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

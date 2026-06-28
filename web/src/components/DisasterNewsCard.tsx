import Link from "next/link";
import Image from "next/image";
import {
  type DisasterEvent,
  magnitudeColor,
  magnitudeSeverity,
} from "@/lib/disasters";

export function DisasterNewsCard({ event }: { event: DisasterEvent }) {
  return (
    <div className="group bg-white border border-ink-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-[var(--shadow-card-lg)] hover:border-teal-500/30 transition-all">
      {/* Shakemap image */}
      <div className="relative aspect-video bg-ink-100 overflow-hidden">
        <Image
          src={event.imageUrl}
          alt={`Shakemap ${event.title}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        {/* Magnitude badge overlay */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-display font-extrabold rounded-lg ${magnitudeColor(
              event.magnitude
            )}`}
          >
            M{event.magnitude}
          </span>
        </div>
        {/* Source badge overlay */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider bg-black/60 text-white rounded-md backdrop-blur-sm">
            {event.source}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-base font-bold text-ink-900 mb-1.5 line-clamp-2 group-hover:text-teal-700 transition-colors">
          {event.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-ink-500 mb-3">
          <span className="inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2a6 6 0 016 6c0 4.5-6 10-6 10s-6-5.5-6-10a6 6 0 016-6z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            {event.location}
          </span>
          <span>|</span>
          <span>{event.date}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-xs">
            <span className="text-ink-400">Kedalaman</span>
            <div className="font-semibold text-ink-800">{event.depth}</div>
          </div>
          <div className="text-xs">
            <span className="text-ink-400">Kekuatan</span>
            <div className="font-semibold text-ink-800">
              {magnitudeSeverity(event.magnitude)}
            </div>
          </div>
        </div>

        {event.feltIn !== "-" && (
          <p className="text-xs text-ink-500 mb-4 line-clamp-2">
            <span className="font-semibold text-ink-700">Dirasakan:</span>{" "}
            {event.feltIn}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-ink-200">
          <Link
            href={`/d/${event.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
              <path
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                fill="currentColor"
                fillOpacity="0.2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            Donasi Sekarang
          </Link>
          <a
            href={event.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-2.5 text-sm font-semibold text-ink-700 bg-ink-100 rounded-lg hover:bg-ink-200 transition-colors"
            title="Sumber data BMKG"
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
            Sumber
          </a>
        </div>
      </div>
    </div>
  );
}

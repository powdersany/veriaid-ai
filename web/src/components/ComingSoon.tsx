import Link from "next/link";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

interface ComingSoonProps {
  title: string;
  description: string;
  emoji?: string;
}

export function ComingSoon({ title, description, emoji = "🚧" }: ComingSoonProps) {
  return (
    <>
      <Nav />
      <main className="flex-1 flex items-center justify-center section-spacing">
        <div className="container-page max-w-2xl text-center">
          <div className="text-6xl mb-6" aria-hidden="true">
            {emoji}
          </div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-teal-600 px-3.5 py-1.5 bg-teal-500/10 rounded-full">
            Segera Hadir
          </span>
          <h1 className="font-display font-extrabold text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-tight text-ink-900 mt-6">
            {title}
          </h1>
          <p className="text-lg text-ink-500 mt-4 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-all shadow-[var(--shadow-glow)] hover:-translate-y-0.5"
            >
              ← Kembali ke Beranda
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-ink-800 bg-white border border-ink-200 rounded-lg hover:border-teal-500 hover:text-teal-800 hover:bg-ink-50 transition-all"
            >
              Lihat Program
            </Link>
          </div>
          <p className="text-xs text-ink-400 tracking-wider mt-8">
            Hackathon MVP v1.0 · Konten ini sedang dalam pengembangan
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
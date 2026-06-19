import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col bg-ink-50">
      <div className="container-page flex-1 flex flex-col items-center justify-center text-center py-12">
        <div className="relative mb-8">
          <div className="font-display text-[clamp(8rem,24vw,14rem)] font-extrabold text-ink-200 leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-teal-500/10 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-teal-600"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink-900 mb-3">
          Halaman tidak ditemukan
        </h1>
        <p className="text-lg text-ink-500 max-w-md mb-8">
          Link yang Tuan cari mungkin sudah dipindahkan, dihapus, atau tidak
          pernah ada.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 10l7-7M3 10l7 7M3 10h14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Kembali ke Beranda
          </Link>
          <Link
            href="/programs"
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-ink-800 bg-white border border-ink-200 rounded-lg hover:border-teal-500 hover:text-teal-800 transition-colors"
          >
            Lihat Program
          </Link>
        </div>
      </div>

      <div className="container-page py-6 border-t border-ink-200 flex items-center justify-between text-xs text-ink-500">
        <Logo />
        <span>Hackathon MVP v1.0</span>
      </div>
    </main>
  );
}

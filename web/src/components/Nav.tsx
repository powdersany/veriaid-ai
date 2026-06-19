import Link from "next/link";
import { Logo } from "./Logo";

export function Nav() {
  return (
    <header
      role="banner"
      className="sticky top-0 z-50 glass-nav"
    >
      <div className="container-page flex items-center justify-between h-18 py-4 gap-8">
        <Logo />
        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-ink-700"
        >
          <Link href="#masalah" className="hover:text-teal-600 transition-colors">
            Masalah
          </Link>
          <Link href="#solusi" className="hover:text-teal-600 transition-colors">
            Solusi
          </Link>
          <Link href="#cara-kerja" className="hover:text-teal-600 transition-colors">
            Cara Kerja
          </Link>
          <Link href="#teknologi" className="hover:text-teal-600 transition-colors">
            Teknologi
          </Link>
        </nav>
        <div className="flex items-center gap-2.5">
          <Link
            href="#programs"
            className="hidden sm:inline-flex items-center px-5 py-2.5 text-sm font-semibold text-ink-800 bg-white border border-ink-200 rounded-lg hover:border-teal-500 hover:text-teal-800 hover:bg-ink-50 transition-all"
          >
            Lihat Program
          </Link>
          <Link
            href="#dashboard"
            className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-all shadow-[var(--shadow-glow)] hover:shadow-lg hover:-translate-y-px"
          >
            Untuk Organisasi
          </Link>
        </div>
      </div>
    </header>
  );
}

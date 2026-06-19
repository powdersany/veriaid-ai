import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer role="contentinfo" className="bg-ink-900 text-white/70 pt-14 pb-6">
      <div className="container-page grid md:grid-cols-[1.5fr_2fr] gap-12 pb-10 border-b border-white/10">
        <div>
          <Logo variant="light" />
          <p className="text-[0.9375rem] mt-4 max-w-xs leading-relaxed">
            Buktikan setiap kebaikan secara transparan, akuntabel, dan
            tepercaya.
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 sm:grid-cols-3 gap-8"
        >
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Platform
            </h4>
            <Link href="/programs" className="block text-[0.9375rem] py-1.5 hover:text-white transition-colors">
              Program Bantuan
            </Link>
            <Link href="/#verify" className="block text-[0.9375rem] py-1.5 hover:text-white transition-colors">
              Verifikasi Laporan
            </Link>
            <Link href="/register" className="block text-[0.9375rem] py-1.5 hover:text-white transition-colors">
              Untuk Organisasi
            </Link>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Resources
            </h4>
            <Link href="/#cara-kerja" className="block text-[0.9375rem] py-1.5 hover:text-white transition-colors">
              Cara Kerja
            </Link>
            <Link href="/#teknologi" className="block text-[0.9375rem] py-1.5 hover:text-white transition-colors">
              Teknologi
            </Link>
            <Link href="/docs" className="block text-[0.9375rem] py-1.5 hover:text-white transition-colors">
              API Docs
            </Link>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Company
            </h4>
            <Link href="/about" className="block text-[0.9375rem] py-1.5 hover:text-white transition-colors">
              Tentang
            </Link>
            <Link href="/contact" className="block text-[0.9375rem] py-1.5 hover:text-white transition-colors">
              Kontak
            </Link>
            <Link href="/privacy" className="block text-[0.9375rem] py-1.5 hover:text-white transition-colors">
              Privasi
            </Link>
          </div>
        </nav>
      </div>
      <div className="container-page flex flex-wrap justify-between items-center gap-2 pt-6 text-xs text-white/50">
        <span>© 2026 VeriAid AI · Hackathon MVP v1.0</span>
        <span>Dibangun untuk transparansi, dirancang untuk kepercayaan.</span>
      </div>
    </footer>
  );
}

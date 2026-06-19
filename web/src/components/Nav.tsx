"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Logo } from "./Logo";

export function Nav() {
  const [open, setOpen] = useState(false);

  // Close menu on route change (hash links)
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  // Close on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
          <Link href="/#masalah" className="hover:text-teal-600 transition-colors">
            Masalah
          </Link>
          <Link href="/#solusi" className="hover:text-teal-600 transition-colors">
            Solusi
          </Link>
          <Link href="/#cara-kerja" className="hover:text-teal-600 transition-colors">
            Cara Kerja
          </Link>
          <Link href="/#teknologi" className="hover:text-teal-600 transition-colors">
            Teknologi
          </Link>
        </nav>
        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/programs"
            className="hidden sm:inline-flex items-center px-5 py-2.5 text-sm font-semibold text-ink-800 bg-white border border-ink-200 rounded-lg hover:border-teal-500 hover:text-teal-800 hover:bg-ink-50 transition-all"
          >
            Lihat Program
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-all shadow-[var(--shadow-glow)] hover:shadow-lg hover:-translate-y-px"
          >
            Untuk Organisasi
          </Link>
        </div>
        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-ink-200 text-ink-700 hover:bg-ink-50 hover:border-teal-500 hover:text-teal-700 transition-colors"
        >
          {open ? (
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu drawer */}
      {open && (
        <div className="lg:hidden border-t border-ink-200 bg-white">
          <nav aria-label="Mobile" className="container-page py-4 flex flex-col gap-1">
            <Link
              href="/#masalah"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-50 hover:text-teal-700 transition-colors"
            >
              Masalah
            </Link>
            <Link
              href="/#solusi"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-50 hover:text-teal-700 transition-colors"
            >
              Solusi
            </Link>
            <Link
              href="/#cara-kerja"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-50 hover:text-teal-700 transition-colors"
            >
              Cara Kerja
            </Link>
            <Link
              href="/#teknologi"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-ink-700 hover:bg-ink-50 hover:text-teal-700 transition-colors"
            >
              Teknologi
            </Link>
            <div className="my-2 border-t border-ink-200" />
            <Link
              href="/programs"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-semibold text-ink-800 bg-ink-50 hover:bg-ink-100 transition-colors"
            >
              Lihat Program
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-semibold text-white bg-teal-800 hover:bg-teal-900 text-center transition-colors"
            >
              Untuk Organisasi
            </Link>
            <div className="my-2 border-t border-ink-200" />
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-ink-600 hover:bg-ink-50 transition-colors text-center"
            >
              Sudah punya akun? Masuk →
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
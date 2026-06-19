"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-ink-50">
        <div className="container-page flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 text-danger flex items-center justify-center">
            <svg
              className="w-10 h-10"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 9v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-ink-900 mb-2">
            Terjadi Kesalahan
          </h1>
          <p className="text-ink-500 max-w-md mb-2">
            Maaf, ada masalah saat memuat halaman. Tim kami sudah diberi tahu.
          </p>
          {error.digest && (
            <code className="text-xs text-ink-400 bg-ink-100 px-2 py-1 rounded mb-6">
              Error ID: {error.digest}
            </code>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                <path d="M3 10a7 7 0 0114 0M3 10l3-3m-3 3l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Coba Lagi
            </button>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 text-sm font-semibold text-ink-800 bg-white border border-ink-200 rounded-lg hover:border-teal-500 hover:text-teal-800 transition-colors"
            >
              Ke Beranda
            </Link>
          </div>
        </div>
        <div className="container-page py-6 border-t border-ink-200">
          <Logo />
        </div>
      </body>
    </html>
  );
}

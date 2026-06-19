"use client";

import { useState, useMemo } from "react";
import { ProgramCard } from "@/components/ProgramCard";
import {
  mockPrograms,
  categories,
  type AidProgram,
} from "@/lib/mock-data";

type SortKey = "newest" | "largest" | "highest_score";

export function ProgramsList() {
  const [category, setCategory] = useState("Semua");
  const [sort, setSort] = useState<SortKey>("newest");
  const [search, setSearch] = useState("");

  const filtered = useMemo<AidProgram[]>(() => {
    let result = [...mockPrograms];
    if (category !== "Semua") {
      result = result.filter((p) => p.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    } else if (sort === "largest") {
      result.sort((a, b) => b.targetFund - a.targetFund);
    } else if (sort === "highest_score") {
      result.sort((a, b) => b.aiScore - a.aiScore);
    }
    return result;
  }, [category, sort, search]);

  return (
    <section className="section-spacing">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-teal-600 px-3.5 py-1.5 bg-teal-500/10 rounded-full">
            Program Bantuan
          </span>
          <h1 className="font-display font-extrabold text-[clamp(2rem,4.5vw,3rem)] leading-tight tracking-tight text-ink-900 mt-4">
            Semua program bantuan yang <span className="text-gradient">aktif</span>.
          </h1>
          <p className="text-lg text-ink-500 mt-4">
            Telusuri program dari berbagai organisasi. Setiap program punya
            bukti transaksi, analisis AI, dan sertifikat blockchain.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 17a8 8 0 100-16 8 8 0 000 16zM18 18l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari program, lokasi, atau kategori..."
              className="w-full pl-12 pr-4 py-3.5 text-base bg-white border border-ink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                  category === cat
                    ? "bg-teal-800 text-white"
                    : "bg-white border border-ink-200 text-ink-700 hover:border-teal-500 hover:text-teal-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:ml-auto sm:justify-end">
            <span className="text-sm text-ink-500">Urutkan:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="px-3 py-2 text-sm font-semibold bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            >
              <option value="newest">Terbaru</option>
              <option value="largest">Dana Terbesar</option>
              <option value="highest_score">Skor AI Tertinggi</option>
            </select>
          </div>
        </div>

        {filtered.length > 0 ? (
          <>
            <div className="text-sm text-ink-500 mb-4">
              Menampilkan{" "}
              <strong className="text-ink-900 font-semibold">
                {filtered.length}
              </strong>{" "}
              program
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 px-6 bg-ink-50 rounded-2xl border border-dashed border-ink-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-ink-400"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3 className="font-display text-lg font-bold text-ink-900 mb-2">
              Tidak ada program ditemukan
            </h3>
            <p className="text-ink-500 mb-4">
              Coba ubah filter atau kata kunci pencarian.
            </p>
            <button
              onClick={() => {
                setCategory("Semua");
                setSearch("");
              }}
              className="px-5 py-2 text-sm font-semibold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

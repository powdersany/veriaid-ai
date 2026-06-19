"use client";

import { useState, type DragEvent, type FormEvent } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { mockPrograms } from "@/lib/mock-data";

type EvidenceType = "foto" | "nota" | "invoice" | "laporan" | "dokumen";

interface Evidence {
  id: string;
  name: string;
  type: EvidenceType;
  size: string;
  date: string;
  status: "analyzed" | "pending" | "flagged";
  aiNote?: string;
}

const initialEvidence: Record<string, Evidence[]> = {
  "flood-relief-demak-2026": [
    { id: "ev1", name: "Distribusi_Demak_3kec.jpg", type: "foto", size: "2.4 MB", date: "2026-02-22", status: "analyzed", aiNote: "Cocok dengan data penerima" },
    { id: "ev2", name: "Nota_pembelian_paket.pdf", type: "nota", size: "184 KB", date: "2026-02-20", status: "analyzed", aiNote: "OCR: Rp 4.785.000 terdeteksi" },
    { id: "ev3", name: "Invoice_logistik_2.pdf", type: "invoice", size: "92 KB", date: "2026-02-19", status: "flagged", aiNote: "Nomor invoice duplikat terdeteksi" },
    { id: "ev4", name: "Foto_sebelum_distribusi.jpg", type: "foto", size: "1.8 MB", date: "2026-02-18", status: "analyzed" },
    { id: "ev5", name: "Laporan_koordinator.docx", type: "laporan", size: "78 KB", date: "2026-02-15", status: "pending" },
  ],
};

const typeIcon: Record<EvidenceType, string> = {
  foto: "M3 7h18M3 12h18M3 17h18",
  nota: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  invoice: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  laporan: "M9 12h6m-6 4h6M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  dokumen: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
};

const statusInfo: Record<Evidence["status"], { label: string; class: string }> = {
  analyzed: { label: "Selesai Dianalisis", class: "bg-green-50 text-success" },
  pending: { label: "Antre AI", class: "bg-amber-50 text-warning" },
  flagged: { label: "Anomali Terdeteksi", class: "bg-red-50 text-danger" },
};

export default function EvidencePage() {
  const params = useParams<{ id: string }>();
  const program = mockPrograms.find((p) => p.id === params.id);

  const [items, setItems] = useState<Evidence[]>(initialEvidence[params.id] || []);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedType, setSelectedType] = useState<EvidenceType>("foto");

  if (!program) {
    notFound();
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newItems: Evidence[] = Array.from(files).map((f) => ({
      id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      type: selectedType,
      size: `${(f.size / 1024).toFixed(0)} KB`,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    }));
    setItems((prev) => [...newItems, ...prev]);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto">
        <Link
          href={`/dashboard/program/${params.id}/finance`}
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-teal-600 mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6M6 10h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Kembali ke Finance
        </Link>

        <div className="mb-6">
          <div className="text-xs text-ink-500 mb-1">{program.category} · {program.location}</div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-ink-900">
            Bukti &amp; Dokumentasi
          </h1>
          <p className="text-ink-500 mt-1">
            Unggah foto, nota, invoice, dan laporan. AI akan menganalisis otomatis.
          </p>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-ink-700">Tipe:</span>
          {(["foto", "nota", "invoice", "laporan", "dokumen"] as EvidenceType[]).map(
            (t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 text-sm font-semibold rounded-full capitalize transition-colors ${
                  selectedType === t
                    ? "bg-teal-800 text-white"
                    : "bg-white border border-ink-200 text-ink-700 hover:border-teal-500"
                }`}
              >
                {t}
              </button>
            )
          )}
        </div>

        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`mb-6 p-8 lg:p-12 border-2 border-dashed rounded-2xl text-center transition-all ${
            isDragging
              ? "border-teal-500 bg-teal-50"
              : "border-ink-300 bg-white hover:border-teal-400"
          }`}
        >
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 16a4 4 0 01-.88-7.9 5 5 0 019.84-1.1A4.5 4.5 0 0117 16M12 12v8m0-8l-3 3m3-3l3 3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="font-display text-lg font-bold text-ink-900 mb-1">
            Drop file di sini atau klik untuk upload
          </h3>
          <p className="text-sm text-ink-500 mb-4">
            PDF, JPG, PNG, DOCX · maks 10 MB per file
          </p>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 cursor-pointer transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Pilih File
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        </div>

        <div className="bg-white rounded-2xl border border-ink-200 overflow-hidden">
          <div className="p-5 lg:p-6 border-b border-ink-200 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-ink-900">
                Bukti Terunggah
              </h2>
              <p className="text-sm text-ink-500 mt-0.5">
                {items.length} file · {items.filter((i) => i.status === "analyzed").length} selesai dianalisis
              </p>
            </div>
            {items.some((i) => i.status === "pending") && (
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
                Analisis dengan AI
              </button>
            )}
          </div>
          {items.length > 0 ? (
            <div className="divide-y divide-ink-200">
              {items.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 lg:p-5 flex items-center gap-4 hover:bg-ink-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-ink-100 text-ink-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d={typeIcon[ev.type]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ink-900 text-sm truncate">
                      {ev.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-ink-500">
                      <span className="capitalize">{ev.type}</span>
                      <span>·</span>
                      <span>{ev.size}</span>
                      <span>·</span>
                      <span>{ev.date}</span>
                    </div>
                    {ev.aiNote && (
                      <div className="mt-1.5 text-xs text-ink-600 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" viewBox="0 0 20 20" fill="none">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                        </svg>
                        <span className="italic">{ev.aiNote}</span>
                      </div>
                    )}
                  </div>
                  <span
                    className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${statusInfo[ev.status].class}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {statusInfo[ev.status].label}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-ink-500">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-ink-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-ink-400" viewBox="0 0 24 24" fill="none">
                  <path d="M7 16a4 4 0 01-.88-7.9 5 5 0 019.84-1.1A4.5 4.5 0 0117 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-sm">Belum ada bukti diunggah</p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

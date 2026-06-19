"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";

type Step = 1 | 2 | 3;

const categories = [
  "Bencana Alam",
  "Kesehatan",
  "Pendidikan",
  "Pemberdayaan Ekonomi",
  "Infrastruktur",
];

export default function CreateProgramPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    title: "",
    category: categories[0],
    location: "",
    description: "",
    targetBeneficiary: "",
    aidType: "",
    targetFund: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const canNext1 = form.title && form.category && form.location;
  const canNext2 = form.description && form.targetBeneficiary && form.aidType;
  const canSubmit = form.targetFund;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 40);
    const newId = `${slug}-${Date.now().toString().slice(-4)}`;
    setSubmitting(false);
    router.push(`/dashboard/program/${newId}/finance`);
  };

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-ink-900">
            Buat Program Baru
          </h1>
          <p className="text-ink-500 mt-1">
            Isi detail program bantuan Anda. Bisa diedit setelah dibuat.
          </p>
        </div>

        <div className="mb-6 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  step >= s
                    ? "bg-teal-800 text-white"
                    : "bg-ink-200 text-ink-500"
                }`}
              >
                {step > s ? "✓" : s}
              </div>
              <div
                className={`text-xs font-semibold hidden sm:block ${
                  step >= s ? "text-ink-900" : "text-ink-500"
                }`}
              >
                {s === 1 ? "Informasi" : s === 2 ? "Detail" : "Target"}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-0.5 ${
                    step > s ? "bg-teal-800" : "bg-ink-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-ink-200 p-6 lg:p-8">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-display text-lg font-bold text-ink-900 mb-4">
                Informasi Dasar
              </h2>

              <Field
                label="Nama Program"
                required
                help="Nama yang deskriptif dan mudah dipahami publik"
              >
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="Bantuan Banjir Demak 2026"
                  className={inputClass}
                />
              </Field>

              <Field label="Kategori" required>
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className={inputClass}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Lokasi" required>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="Demak, Jawa Tengah"
                  className={inputClass}
                />
              </Field>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  disabled={!canNext1}
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Lanjut
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display text-lg font-bold text-ink-900 mb-4">
                Detail Program
              </h2>

              <Field label="Deskripsi" required>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Jelaskan tujuan, penerima manfaat, dan rencana distribusi program..."
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <Field
                label="Penerima Manfaat"
                required
                help="Estimasi jumlah individu atau keluarga yang akan dibantu"
              >
                <input
                  type="number"
                  required
                  min="1"
                  value={form.targetBeneficiary}
                  onChange={(e) => update("targetBeneficiary", e.target.value)}
                  placeholder="500"
                  className={inputClass}
                />
              </Field>

              <Field label="Jenis Bantuan" required>
                <input
                  type="text"
                  required
                  value={form.aidType}
                  onChange={(e) => update("aidType", e.target.value)}
                  placeholder="Paket Makanan + Air Bersih"
                  className={inputClass}
                />
              </Field>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-ink-700 bg-white border border-ink-200 rounded-lg hover:border-ink-300 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                    <path d="M16 10H4m4 4l-4-4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Kembali
                </button>
                <button
                  type="button"
                  disabled={!canNext2}
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Lanjut
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-display text-lg font-bold text-ink-900 mb-4">
                Target Pendanaan
              </h2>

              <Field
                label="Target Dana (Rp)"
                required
                help="Total dana yang dibutuhkan untuk menjalankan program"
              >
                <input
                  type="number"
                  required
                  min="100000"
                  value={form.targetFund}
                  onChange={(e) => update("targetFund", e.target.value)}
                  placeholder="10000000"
                  className={inputClass}
                />
              </Field>

              <div className="p-4 bg-ink-50 rounded-xl">
                <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">
                  Ringkasan
                </div>
                <dl className="space-y-1.5 text-sm">
                  <Summary label="Program" value={form.title} />
                  <Summary label="Kategori" value={form.category} />
                  <Summary label="Lokasi" value={form.location} />
                  <Summary label="Penerima" value={`${form.targetBeneficiary || 0} individu`} />
                  <Summary label="Jenis" value={form.aidType} />
                  <Summary
                    label="Target Dana"
                    value={
                      form.targetFund
                        ? `Rp ${Number(form.targetFund).toLocaleString("id-ID")}`
                        : "-"
                    }
                    highlight
                  />
                </dl>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-ink-700 bg-white border border-ink-200 rounded-lg hover:border-ink-300 transition-colors"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Membuat program..." : "Buat Program"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </DashboardShell>
  );
}

const inputClass =
  "w-full px-4 py-3 text-base bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors";

function Field({
  label,
  required,
  help,
  children,
}: {
  label: string;
  required?: boolean;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink-700 mb-1.5">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      {children}
      {help && <p className="text-xs text-ink-500 mt-1.5">{help}</p>}
    </div>
  );
}

function Summary({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-500">{label}</dt>
      <dd
        className={`font-semibold text-right ${
          highlight ? "text-teal-700" : "text-ink-900"
        }`}
      >
        {value || "-"}
      </dd>
    </div>
  );
}

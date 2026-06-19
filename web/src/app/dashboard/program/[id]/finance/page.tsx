"use client";

import { useState, useEffect, type FormEvent } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";
import { mockPrograms, formatRupiah, getProgress } from "@/lib/mock-data";
import { programsApi } from "@/lib/api-client";
import type { Expense } from "@/lib/types";

const categories = ["Paket Bantuan", "Logistik", "Operasional", "SDM"];

export default function FinancePage() {
  const params = useParams<{ id: string }>();
  const program = mockPrograms.find((p) => p.id === params.id);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    item: "",
    amount: "",
    category: categories[0],
    note: "",
  });

  // Load expenses for this program
  useEffect(() => {
    if (!params.id) return;
    programsApi
      .get(params.id)
      .then((r) => {
        setExpenses(
          r.expenses.map((e) => ({
            id: e.id,
            programId: e.programId,
            item: e.item,
            amount: e.amount,
            category: e.category,
            date: typeof e.date === "string" ? e.date.split("T")[0] : new Date(e.date).toISOString().split("T")[0],
            note: e.note ?? undefined,
          })),
        );
      })
      .catch(() => {
        // Fallback to localStorage-cached data
        try {
          const cached = localStorage.getItem(`veriaid:expenses:${params.id}`);
          if (cached) setExpenses(JSON.parse(cached));
        } catch {}
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (!program) {
    notFound();
  }

  const spent = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = program.fundReceived - spent;
  const progress = Math.min(100, Math.round((spent / program.targetFund) * 100));

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.item || !form.amount) return;
    setSubmitting(true);
    try {
      const result = await programsApi.recordExpense(params.id, {
        item: form.item,
        amount: Number(form.amount),
        category: form.category,
        note: form.note || undefined,
      });
      const newExp: Expense = {
        id: result.expense.id,
        programId: result.expense.programId,
        item: result.expense.item,
        amount: result.expense.amount,
        category: result.expense.category,
        date:
          typeof result.expense.date === "string"
            ? result.expense.date.split("T")[0]
            : new Date(result.expense.date).toISOString().split("T")[0],
        note: result.expense.note ?? undefined,
      };
      const next = [newExp, ...expenses];
      setExpenses(next);
      try {
        localStorage.setItem(`veriaid:expenses:${params.id}`, JSON.stringify(next));
      } catch {}
      setForm({ item: "", amount: "", category: categories[0], note: "" });
    } catch (err) {
      // Optimistic local fallback if API offline
      const newExp: Expense = {
        id: `e_${Date.now()}`,
        programId: params.id,
        item: form.item,
        amount: Number(form.amount),
        category: form.category,
        date: new Date().toISOString().split("T")[0],
        note: form.note || undefined,
      };
      const next = [newExp, ...expenses];
      setExpenses(next);
      try {
        localStorage.setItem(`veriaid:expenses:${params.id}`, JSON.stringify(next));
      } catch {}
      setForm({ item: "", amount: "", category: categories[0], note: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-teal-600 mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6M6 10h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Kembali ke Dashboard
        </Link>

        <div className="mb-6">
          <div className="text-xs text-ink-500 mb-1">{program.category} · {program.location}</div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-ink-900">
            {program.title}
          </h1>
          <p className="text-ink-500 mt-1">Kelola dana &amp; pengeluaran program</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Mini label="Target Dana" value={formatRupiah(program.targetFund)} />
          <Mini label="Dana Masuk" value={formatRupiah(program.fundReceived)} accent="text-teal-700" />
          <Mini label="Terpakai" value={formatRupiah(spent)} accent="text-gold-500" />
          <Mini label="Sisa" value={formatRupiah(remaining)} accent={remaining < 0 ? "text-danger" : "text-success"} />
        </div>

        <div className="p-5 bg-white border border-ink-200 rounded-2xl mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-ink-700">Realisasi Dana</span>
            <span className="text-ink-500">{progress}% dari target</span>
          </div>
          <div className="h-3 bg-ink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6">
          <div className="bg-white rounded-2xl border border-ink-200 p-5 lg:p-6 h-fit">
            <h2 className="font-display text-lg font-bold text-ink-900 mb-4">
              Catat Pengeluaran
            </h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <input
                type="text"
                required
                value={form.item}
                onChange={(e) => setForm((f) => ({ ...f, item: e.target.value }))}
                placeholder="Item (mis. 500 paket makanan)"
                className={inputClass}
              />
              <input
                type="number"
                required
                min="1"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder="Nominal (Rp)"
                className={inputClass}
              />
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={inputClass}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <textarea
                rows={2}
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                placeholder="Catatan (opsional)"
                className={`${inputClass} resize-none text-sm`}
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                {submitting ? "Menyimpan…" : "Tambah Pengeluaran"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-ink-200 overflow-hidden">
            <div className="p-5 lg:p-6 border-b border-ink-200">
              <h2 className="font-display text-lg font-bold text-ink-900">
                Riwayat Pengeluaran
              </h2>
              <p className="text-sm text-ink-500 mt-0.5">
                {expenses.length} transaksi tercatat
              </p>
            </div>
            {expenses.length > 0 ? (
              <div className="divide-y divide-ink-200">
                {expenses.map((e) => (
                  <div
                    key={e.id}
                    className="p-4 lg:p-5 flex items-center gap-4 hover:bg-ink-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-ink-900 text-sm">
                        {e.item}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-ink-500">
                        <span className="px-2 py-0.5 bg-ink-100 rounded-full">
                          {e.category}
                        </span>
                        <span>·</span>
                        <span>{e.date}</span>
                        {e.note && (
                          <>
                            <span>·</span>
                            <span className="truncate">{e.note}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="font-display font-bold text-ink-900 text-right whitespace-nowrap">
                      {formatRupiah(e.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-ink-500">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-ink-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-ink-400" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-sm">Belum ada pengeluaran tercatat</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

const inputClass =
  "w-full px-4 py-2.5 text-sm bg-white border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-colors";

function Mini({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="p-3 bg-white border border-ink-200 rounded-xl">
      <div className="text-xs text-ink-500">{label}</div>
      <div className={`font-display text-base lg:text-lg font-bold ${accent ?? "text-ink-900"}`}>
        {value}
      </div>
    </div>
  );
}

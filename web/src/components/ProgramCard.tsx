import Link from "next/link";
import {
  type AidProgram,
  formatRupiah,
  getProgress,
  statusLabel,
  statusColor,
} from "@/lib/mock-data";

export function ProgramCard({ program }: { program: AidProgram }) {
  const progress = getProgress(program.fundSpent, program.targetFund);
  const aiScoreColor =
    program.aiScore >= 90
      ? "text-success"
      : program.aiScore >= 80
      ? "text-blue-600"
      : "text-warning";

  return (
    <Link
      href={`/program/${program.id}`}
      className="group block p-6 bg-white border border-ink-200 rounded-2xl hover:-translate-y-1 hover:shadow-[var(--shadow-card-lg)] hover:border-teal-500/30 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
          {program.category}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${statusColor[program.status]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {statusLabel[program.status]}
        </span>
      </div>

      <h3 className="font-display text-lg font-bold text-ink-900 mb-2 group-hover:text-teal-700 transition-colors">
        {program.title}
      </h3>

      <div className="flex items-center gap-1.5 text-sm text-ink-500 mb-5">
        <svg
          className="w-4 h-4"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 2a6 6 0 016 6c0 4.5-6 10-6 10s-6-5.5-6-10a6 6 0 016-6z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle
            cx="10"
            cy="8"
            r="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        {program.location}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-ink-500">Dana Terpakai</span>
          <span className="font-semibold text-ink-900">
            {formatRupiah(program.fundSpent)} /{" "}
            {formatRupiah(program.targetFund)}
          </span>
        </div>
        <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-ink-500 mt-1.5">
          {progress}% terealisasi
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-ink-200">
        <div>
          <div className="text-xs text-ink-500">Skor Akuntabilitas</div>
          <div className={`font-display text-lg font-bold ${aiScoreColor}`}>
            {program.aiScore} / 100
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-ink-500">Penerima Manfaat</div>
          <div className="font-display text-lg font-bold text-ink-900">
            {program.targetBeneficiary.toLocaleString("id-ID")}
          </div>
        </div>
      </div>
    </Link>
  );
}

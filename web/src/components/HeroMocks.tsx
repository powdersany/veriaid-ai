export function ProofCard() {
  return (
    <div className="absolute top-0 right-0 w-full max-w-sm bg-white rounded-2xl shadow-[var(--shadow-card-lg)] overflow-hidden border border-ink-200 z-10">
      <div className="flex items-center gap-3 p-5 bg-gradient-to-br from-ink-50 to-white border-b border-ink-200">
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M16 2L4 8v8c0 7.5 5.1 14.5 12 16 6.9-1.5 12-8.5 12-16V8L16 2z"
            fill="url(#proof-card-grad)"
          />
          <path
            d="M11 16l3.5 3.5L21 13"
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="proof-card-grad" x1="0" y1="0" x2="32" y2="32">
              <stop stopColor="#0F4C5C" />
              <stop offset="1" stopColor="#1B8A8A" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex-1">
          <div className="font-bold text-ink-900 text-sm">Proof of Integrity</div>
          <div className="text-[0.6875rem] text-ink-500 tracking-wider mt-0.5">
            SERTIFIKAT VERIAID
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-success">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          Terverifikasi
        </span>
      </div>
      <div className="p-5 space-y-0">
        <Row label="Program" value="Bantuan Banjir Demak" />
        <Row label="Dana Terpakai" value="Rp 8,7M / Rp 10M" />
        <Row label="Penerima Manfaat" value="500 keluarga" />
        <Row label="Skor AI" value={<span className="text-gradient">94 / 100</span>} />
        <div className="flex items-center gap-2.5 mt-4 p-2.5 px-3 bg-ink-50 rounded-md text-xs">
          <span className="text-ink-500 font-semibold tracking-wider">SHA-256</span>
          <code className="text-teal-800 font-semibold">0x4f8a...d7e2</code>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-dashed border-ink-200 text-sm last:border-0">
      <span className="text-ink-500">{label}</span>
      <strong className="text-ink-900 font-semibold">{value}</strong>
    </div>
  );
}

export function AnomalyCard() {
  return (
    <div className="absolute -bottom-2 -left-2 sm:left-0 flex items-center gap-3.5 p-4 px-5 bg-white rounded-xl shadow-[var(--shadow-card-lg)] border border-ink-200 z-20 min-w-[240px]">
      <div className="w-10 h-10 flex items-center justify-center bg-amber-50 text-warning rounded-lg">
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M3 17l4-4 3 3 7-7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 9h3v3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div className="text-xs text-ink-500 font-medium">Anomali Terdeteksi</div>
        <div className="text-[0.9375rem] font-bold text-ink-900 mt-0.5">
          3 isu ditandai
        </div>
      </div>
    </div>
  );
}

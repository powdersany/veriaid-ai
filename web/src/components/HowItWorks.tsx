const steps = [
  {
    title: "Organisasi mencatat dana bantuan",
    desc: "NGO/yayasan mencatat dana bantuan yang diterima, sumber, dan target program.",
  },
  {
    title: "Bukti diunggah",
    desc: "Foto distribusi, nota pembelian, dan dokumen pendukung diunggah ke platform.",
  },
  {
    title: "AI menganalisis konsistensi",
    desc: "AI cek OCR, financial consistency, dan distribusi anomaly. Skor akuntabilitas di-generate.",
  },
  {
    title: "Blockchain mengunci bukti",
    desc: "Hash SHA-256 disimpan di immutable ledger, memastikan laporan tidak bisa diubah.",
  },
  {
    title: "Publik memverifikasi laporan",
    desc: "Donatur & publik bisa verifikasi laporan via halaman transparansi publik.",
  },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="section-spacing">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-teal-600 px-3.5 py-1.5 bg-teal-500/10 rounded-full">
            Cara Kerja
          </span>
          <h2 className="font-display font-extrabold text-[clamp(1.875rem,4vw,2.75rem)] leading-tight tracking-tight text-ink-900 mt-4">
            Dari donasi ke{" "}
            <span className="text-gradient">dampak terverifikasi</span> dalam 5
            langkah.
          </h2>
        </div>

        <ol className="relative max-w-3xl mx-auto space-y-6">
          <div
            className="absolute left-5 sm:left-[19px] top-5 bottom-5 w-0.5 bg-gradient-to-b from-teal-500 to-gold-500 opacity-30"
            aria-hidden="true"
          />
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white border-2 border-teal-500 text-teal-600 font-display font-bold rounded-full z-10 shadow-[0_0_0_6px_white]">
                {i + 1}
              </div>
              <div className="flex-1 pt-1.5">
                <h3 className="text-lg font-bold text-ink-900 mb-1.5">
                  {step.title}
                </h3>
                <p className="text-[0.9375rem] text-ink-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

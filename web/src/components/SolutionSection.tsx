const steps = [
  {
    num: "01",
    title: "Catat & Alokasikan",
    desc: "Catat dana masuk, alokasikan ke kategori program, dan lacak pergerakannya secara real-time.",
    items: ["Input dana diterima", "Alokasi budget per kategori", "Saldo & biaya per bantuan real-time"],
  },
  {
    num: "02",
    title: "Unggah & Analisis",
    desc: "Unggah foto distribusi, nota, invoice. AI menganalisis konsistensi finansial & anomali distribusi.",
    items: ["OCR + image understanding", "Pengecekan konsistensi finansial", "Detektor anomali distribusi"],
    featured: true,
  },
  {
    num: "03",
    title: "Verifikasi & Publikasi",
    desc: "Generate proof hash blockchain, publish public transparency report yang siap audit publik.",
    items: ["SHA-256 immutable ledger", "Sertifikat Proof of Integrity", "Halaman verifikasi publik"],
  },
];

export function SolutionSection() {
  return (
    <section
      id="solusi"
      className="section-spacing bg-ink-50"
    >
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-teal-600 px-3.5 py-1.5 bg-teal-500/10 rounded-full">
            Solusinya
          </span>
          <h2 className="font-display font-extrabold text-[clamp(1.875rem,4vw,2.75rem)] leading-tight tracking-tight text-ink-900 mt-4">
            Satu platform.{" "}
            <span className="text-gradient">Akuntabilitas menyeluruh</span>.
          </h2>
          <p className="text-lg text-ink-500 mt-4 leading-relaxed">
            VeriAid mengubah bukti bantuan yang tersebar menjadi laporan
            akuntabilitas yang terstruktur, teranalisis AI, terverifikasi publik,
            dan tahan manipulasi.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step) => (
            <article
              key={step.num}
              className={`relative p-8 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card-lg)] ${
                step.featured
                  ? "bg-gradient-to-b from-white to-ink-50 border-teal-500/30 shadow-[var(--shadow-glow)]"
                  : "bg-white border-ink-200"
              }`}
            >
              <div className="font-display text-sm font-bold text-teal-600 tracking-wider mb-4">
                {step.num}
              </div>
              <h3 className="font-display text-xl font-bold text-ink-900 mb-3">
                {step.title}
              </h3>
              <p className="text-[0.9375rem] text-ink-500 leading-relaxed mb-5">
                {step.desc}
              </p>
              <ul className="space-y-2 text-sm text-ink-700">
                {step.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-4 h-4 flex-shrink-0 inline-block bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M3%208l3%203%207-7%22%20stroke%3D%22%231B8A8A%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-center bg-no-repeat" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const problems = [
  {
    title: "Donatur tidak tahu",
    desc: "Donatur sulit melacak bagaimana dana bantuan benar-benar digunakan di lapangan.",
    icon: (
      <path
        d="M12 9v4m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
  {
    title: "Laporan manual",
    desc: "Organisasi masih menyusun laporan distribusi & keuangan secara manual, rentan error & delay.",
    icon: (
      <path
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
  {
    title: "Bukti tersebar",
    desc: "Nota, foto distribusi, dan laporan ada di banyak tempat — sulit diaudit secara holistik.",
    icon: (
      <path
        d="M3 7h18M3 12h18M3 17h12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
  {
    title: "Sulit diverifikasi",
    desc: "Bukti penggunaan dana tidak bisa diverifikasi terbuka oleh publik atau pihak independen.",
    icon: (
      <path
        d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
  {
    title: "Tidak ada jejak audit",
    desc: "Laporan bisa berubah setelah dipublikasikan tanpa jejak audit yang kuat dan transparan.",
    icon: (
      <path
        d="M3 3h18v18H3zM3 9h18M9 21V9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Kepercayaan rapuh",
    desc: "Publik hanya bergantung pada laporan sepihak — tidak ada cara sederhana cek konsistensi data.",
    icon: (
      <path
        d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
];

export function ProblemSection() {
  return (
    <section id="masalah" className="section-spacing">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-teal-600 px-3.5 py-1.5 bg-teal-500/10 rounded-full">
            Masalahnya
          </span>
          <h2 className="font-display font-extrabold text-[clamp(1.875rem,4vw,2.75rem)] leading-tight tracking-tight text-ink-900 mt-4">
            Dana bantuan terkumpul. Tapi{" "}
            <span className="text-gradient">kepercayaan sulit dibuktikan</span>.
          </h2>
          <p className="text-lg text-ink-500 mt-4 leading-relaxed">
            Banyak program bantuan berhasil mengumpulkan donasi, tapi setelah
            dana terkumpul, proses pelaporan dan pembuktian penggunaan dana
            masih lemah dan rentan manipulasi.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {problems.map((p) => (
            <article
              key={p.title}
              className="group p-7 bg-white border border-ink-200 rounded-2xl hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_12px_32px_-16px_rgba(220,38,38,0.18)] transition-all"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 text-danger rounded-xl mb-4">
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  {p.icon}
                </svg>
              </div>
              <h3 className="text-lg font-bold text-ink-900 mb-2">
                {p.title}
              </h3>
              <p className="text-[0.9375rem] text-ink-500 leading-relaxed">
                {p.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

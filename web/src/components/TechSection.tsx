const techs = [
  {
    name: "AI Accountability Assistant",
    desc: "Decision support system — bukan autopilot. AI menganalisis konsistensi, mendeteksi anomali, dan menghasilkan laporan.",
    tags: ["OCR", "Vision", "LLM Analysis", "Anomaly Detection"],
    icon: (
      <>
        <path
          d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </>
    ),
    iconStyle: "bg-gradient-to-br from-teal-500/20 to-gold-500/20 text-gold-400",
  },
  {
    name: "Blockchain Proof",
    desc: "Setiap laporan dikunci dengan SHA-256 hash chain. Tidak bisa diedit, dilacak jejak auditnya.",
    tags: ["SHA-256", "Immutable Ledger", "Public Verify"],
    icon: (
      <path
        d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
    iconStyle:
      "bg-gradient-to-br from-gold-500/20 to-teal-500/20 text-teal-500",
  },
];

export function TechSection() {
  return (
    <section
      id="teknologi"
      className="section-spacing bg-gradient-to-b from-ink-900 to-teal-900 text-white"
    >
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-gold-400 px-3.5 py-1.5 bg-white/10 rounded-full">
            Teknologi
          </span>
          <h2 className="font-display font-extrabold text-[clamp(1.875rem,4vw,2.75rem)] leading-tight tracking-tight text-white mt-4">
            Ditenagai <span className="text-gradient">AI</span> & diamankan{" "}
            <span className="text-gradient">Blockchain</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {techs.map((t) => (
            <article
              key={t.name}
              className="p-8 bg-white/[0.04] border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-1 transition-all"
            >
              <div
                className={`inline-flex items-center justify-center w-13 h-13 rounded-xl mb-5 ${t.iconStyle}`}
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  {t.icon}
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                {t.name}
              </h3>
              <p className="text-[0.9375rem] text-white/70 leading-relaxed mb-6">
                {t.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-semibold bg-white/10 text-white/85 rounded-full border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

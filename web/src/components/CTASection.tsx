export function CTASection() {
  return (
    <section id="verify" className="py-12 lg:py-20">
      <div className="container-page">
        <div className="relative px-6 sm:px-10 lg:px-12 py-16 lg:py-20 bg-gradient-to-br from-teal-800 to-teal-900 rounded-3xl text-center text-white overflow-hidden">
          <div
            className="absolute -top-1/2 -right-1/5 w-[600px] h-[600px] rounded-full bg-gold-500/30 blur-[60px]"
            aria-hidden="true"
          />
          <h2 className="relative font-display font-extrabold text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight max-w-2xl mx-auto">
            Siap membawa{" "}
            <span className="text-gradient">transparansi</span> ke program
            bantuan Anda?
          </h2>
          <p className="relative text-lg text-white/85 max-w-xl mx-auto mt-4">
            Mulai gratis untuk program komunitas. Skala ke NGO besar & CSR
            company dengan fitur enterprise.
          </p>
          <div className="relative flex flex-wrap items-center justify-center gap-3 mt-8">
            <a
              href="#dashboard"
              className="inline-flex items-center px-7 py-3.5 text-base font-semibold text-teal-800 bg-white rounded-lg hover:bg-ink-50 hover:-translate-y-0.5 transition-all shadow-[0_16px_40px_-16px_rgba(0,0,0,0.4)]"
            >
              Mulai Gratis
            </a>
            <a
              href="#demo"
              className="inline-flex items-center px-7 py-3.5 text-base font-semibold text-white border border-white/30 rounded-lg hover:bg-white/10 hover:border-white/60 transition-all"
            >
              Lihat Demo
            </a>
          </div>
          <div className="relative text-xs text-white/60 tracking-wider mt-6">
            Tanpa kartu kredit · Setup 5 menit · Hackathon MVP v1.0
          </div>
        </div>
      </div>
    </section>
  );
}

import { ProofCard, AnomalyCard } from "./HeroMocks";

export function Hero() {
  return (
    <section className="relative section-spacing overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -top-32 -right-20 w-[480px] h-[480px] rounded-full bg-teal-500/40 blur-[80px]" />
        <div className="absolute -bottom-24 -left-16 w-[380px] h-[380px] rounded-full bg-gold-500/25 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,17,23,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,17,23,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          }}
        />
      </div>

      <div className="container-page grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-teal-600 px-3.5 py-1.5 bg-teal-500/10 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse-dot" />
            Bertenaga AI · Terverifikasi Blockchain
          </span>
          <h1 className="font-display font-extrabold text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.08] tracking-tight text-ink-900 mt-6">
            Buktikan setiap kebaikan secara{" "}
            <span className="text-gradient">transparan</span>, akuntabel, dan
            tepercaya.
          </h1>
          <p className="text-[clamp(1rem,1.4vw,1.125rem)] text-ink-500 leading-relaxed mt-6 max-w-xl">
            VeriAid bantu NGO, yayasan, dan relawan membuktikan bagaimana setiap
            rupiah bantuan diterima, dialokasikan, digunakan, dan dilaporkan —
            dengan analisis AI dan bukti blockchain yang tahan manipulasi.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="#programs"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-all shadow-[var(--shadow-glow)] hover:-translate-y-0.5"
            >
              Lihat Program Bantuan
              <svg
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 10h12m-4-4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="#verify"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-ink-800 bg-white border border-ink-200 rounded-lg hover:border-teal-500 hover:text-teal-800 hover:bg-ink-50 transition-all"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 2L3 5v5c0 4.4 3 8.5 7 9.4 4-0.9 7-5 7-9.4V5l-7-3z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 10l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Verifikasi Laporan
            </a>
          </div>
          <div className="flex flex-wrap gap-6 sm:gap-10 pt-6 mt-8 border-t border-ink-200">
            <div>
              <strong className="block font-display text-2xl font-bold text-ink-900">
                240+
              </strong>
              <span className="block text-sm text-ink-500 mt-0.5">
                Program Bantuan
              </span>
            </div>
            <div>
              <strong className="block font-display text-2xl font-bold text-ink-900">
                Rp 1,2M
              </strong>
              <span className="block text-sm text-ink-500 mt-0.5">
                Dana Terverifikasi
              </span>
            </div>
            <div>
              <strong className="block font-display text-2xl font-bold text-ink-900">
                100%
              </strong>
              <span className="block text-sm text-ink-500 mt-0.5">
                Siap Audit
              </span>
            </div>
          </div>
        </div>

        <div className="relative h-[460px] mt-8 lg:mt-0">
          <ProofCard />
          <AnomalyCard />
        </div>
      </div>
    </section>
  );
}

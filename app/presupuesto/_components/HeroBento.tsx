'use client'

const BULLETS = [
  'Sin pago inicial',
  'Sin permanencia',
  'Lista en 1 semana',
  'Precio fijo mensual',
  'Sin letra pequeña',
]

export default function HeroBento() {
  return (
    <section className="relative h-[80vh] min-h-[560px] overflow-hidden">

      {/* ── Video background ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/media/main_hero/poster.jpg"
        aria-hidden="true"
      >
        <source src="/media/main_hero/hero.webm" type="video/webm" />
        <source src="/media/main_hero/hero.mp4"  type="video/mp4" />
      </video>

      {/* Top gradient — keeps nav legible over video */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 100%)' }}
        aria-hidden="true"
      />

      {/* ── Right panel — full height, two-tone ── */}
      {/*  mobile: bottom-anchored full-width | desktop: right-side full-height  */}
      <div className="absolute bottom-0 left-0 right-0 md:top-0 md:bottom-0 md:left-auto md:right-0 md:w-[52%] flex flex-col">

        {/* Subtle left-edge gradient (desktop only) */}
        <div
          className="hidden md:block absolute left-0 top-0 bottom-0 w-16 pointer-events-none"
          style={{ background: 'linear-gradient(to right, transparent 0%, rgba(29,29,31,0.55) 60%, rgba(29,29,31,1) 100%)' }}
          aria-hidden="true"
        />

        {/* Box 1 — black, flex-1 (taller) */}
        <div className="relative flex-1 bg-[#1D1D1F] flex flex-col justify-end px-8 py-8 md:px-12 md:py-12">
          <p className="font-manrope text-[10px] tracking-[0.22em] uppercase text-white/35 mb-5">
            Tu agencia de diseño web&nbsp;·&nbsp;Sin complicaciones.
          </p>
          <h1
            className="font-outfit font-black text-white uppercase leading-[0.95] tracking-tight mb-4"
            style={{ fontSize: 'clamp(36px, 4.5vw, 72px)' }}
          >
            Diseño web<br />profesional
          </h1>
          <p
            className="font-outfit font-bold uppercase tracking-tight text-white/90"
            style={{ fontSize: 'clamp(18px, 2.2vw, 34px)' }}
          >
            Desde <span className="text-[#34C759]">29€/mes</span>
          </p>
        </div>

        {/* Box 2 — white, shorter */}
        <div className="relative bg-white px-8 py-6 md:px-12 md:py-7">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 md:flex-col md:gap-3">
            {BULLETS.map(item => (
              <li key={item} className="flex items-center gap-3 font-manrope text-sm text-[#1D1D1F]">
                <span
                  className="shrink-0 w-[7px] h-[7px] bg-[#1D1D1F] block"
                  style={{ transform: 'rotate(45deg)' }}
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ── Scroll hint — bottom-left over video ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-[24%] md:translate-x-0 z-10">
        <button
          onClick={() => document.getElementById('showcase-cards')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Ver ejemplos de webs"
          className="cursor-pointer bg-transparent border-0 p-0"
          style={{ animation: 'heroPulse 2s ease-in-out infinite' }}
        >
          <div className="w-11 h-11 rounded-full border border-white/40 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </button>
      </div>

      <style>{`
        @keyframes heroPulse {
          0%, 100% { transform: translateY(0);   opacity: 1;   }
          50%       { transform: translateY(6px); opacity: 0.6; }
        }
      `}</style>

    </section>
  )
}

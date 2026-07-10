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
    <>
      {/* ── Hero section: 70vh ── */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden flex flex-col">

        {/* Video background */}
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
          <source src="/media/main_hero/hero.mp4" type="video/mp4" />
        </video>

        {/* Right-side gradient overlay so boxes read cleanly */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 48%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Right-aligned content column */}
        <div className="relative z-10 flex flex-1 items-center justify-end px-6 md:px-12 lg:px-20">
          <div className="flex flex-col gap-2.5 w-full max-w-[320px] md:max-w-[360px]">

            {/* Box 1 — black */}
            <div className="bg-[#1D1D1F] rounded-2xl px-6 py-7 md:px-8 md:py-9">
              <h1 className="font-outfit font-black text-white uppercase leading-[1.0] tracking-tight mb-3"
                  style={{ fontSize: 'clamp(22px, 3vw, 36px)' }}>
                Diseño web<br />profesional
              </h1>
              <p className="font-outfit font-bold text-white/90 uppercase tracking-tight mb-4"
                 style={{ fontSize: 'clamp(15px, 2vw, 22px)' }}>
                Desde <span className="text-[#34C759]">29€/mes</span>
              </p>
              <p className="font-manrope text-[10px] tracking-[0.18em] uppercase text-white/40 leading-snug">
                Tu agencia de diseño web&nbsp;|&nbsp;Sin complicaciones.
              </p>
            </div>

            {/* Box 2 — white */}
            <div className="bg-white rounded-2xl px-6 py-5 md:px-8 md:py-6">
              <ul className="flex flex-col gap-2.5">
                {BULLETS.map(item => (
                  <li key={item} className="flex items-center gap-3 font-manrope text-sm text-[#1D1D1F]">
                    <span
                      className="shrink-0 w-2 h-2 bg-[#34C759] block"
                      style={{ transform: 'rotate(45deg)' }}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Scroll arrow — bottom-center */}
        <div className="relative z-10 flex justify-center pb-6">
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
            0%, 100% { transform: translateY(0); opacity: 1; }
            50%       { transform: translateY(6px); opacity: 0.7; }
          }
        `}</style>
      </section>
    </>
  )
}

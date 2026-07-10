'use client'

/* ── Topic icons (stroke, 22 × 22) ── */
function IconWallet() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="6" width="22" height="14" rx="2" />
      <path d="M1 10h22" />
      <circle cx="17.5" cy="15" r="1.5" fill="#1D1D1F" stroke="none" />
    </svg>
  )
}
function IconCalendar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M9 16l2 2 4-4" />
    </svg>
  )
}
function IconZap() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
function IconTag() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
function IconShield() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

const ITEMS = [
  { label: 'Sin pago inicial',    Icon: IconWallet   },
  { label: 'Sin permanencia',     Icon: IconCalendar },
  { label: 'Lista en 1 semana',   Icon: IconZap      },
  { label: 'Precio fijo mensual', Icon: IconTag      },
  { label: 'Sin letra pequeña',   Icon: IconShield   },
]

export default function HeroBento() {
  return (
    <>
      <style>{`
        /* Panel fills full height on desktop */
        @media (min-width: 768px) {
          .hero-right-panel { top: 0; }
        }
        /* Hide scrollbar on carousel */
        .hero-carousel::-webkit-scrollbar { display: none; }
        .hero-carousel { -ms-overflow-style: none; scrollbar-width: none; }
        /* Pulse animation for scroll arrow */
        @keyframes heroPulse {
          0%, 100% { transform: translateY(0);   opacity: 1;    }
          50%       { transform: translateY(7px); opacity: 0.55; }
        }
      `}</style>

      <section className="relative h-[80vh] min-h-[560px] overflow-hidden">

        {/* ── Video ── */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay muted loop playsInline
          poster="/media/main_hero/poster.jpg"
          aria-hidden="true"
        >
          <source src="/media/main_hero/hero.webm" type="video/webm" />
          <source src="/media/main_hero/hero.mp4"  type="video/mp4" />
        </video>

        {/* Top vignette — nav readability */}
        <div
          className="absolute inset-x-0 top-0 h-28 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, transparent 100%)' }}
          aria-hidden="true"
        />

        {/* ── Right panel ──
             mobile : full-width, bottom-anchored (height = content)
             desktop: right 52%, top-0 to bottom-0 (full height)        */}
        <div
          className="hero-right-panel absolute bottom-0 left-0 right-0 md:left-auto md:w-[52%] flex flex-col"
        >
          {/* Box 1 — black, grows to fill space */}
          <div className="relative flex-1 bg-[#1D1D1F] flex flex-col justify-end px-8 pb-8 pt-8 md:px-14 md:pb-10 md:pt-24">
            <h1
              className="font-outfit font-black text-white leading-[0.93] tracking-tight mb-5"
              style={{ fontSize: 'clamp(40px, 5.2vw, 76px)' }}
            >
              DISEÑO<br />
              WEB PROFESIONAL<br />
              DESDE <span className="text-[#34C759]">29€/MES</span>
            </h1>
            <p className="font-manrope text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-white/45 leading-relaxed">
              TU AGENCIA DE DISEÑO WEB&nbsp;·&nbsp;SIN COMPLICACIONES.
            </p>
          </div>

          {/* Box 2 — white, horizontal icon carousel */}
          <div className="relative bg-white px-8 py-5 md:px-14 md:py-6">
            <div className="hero-carousel overflow-x-auto">
              <div className="flex gap-7 md:gap-10 min-w-max">
                {ITEMS.map(({ label, Icon }) => (
                  <div key={label} className="flex flex-col items-start gap-2">
                    <Icon />
                    <span className="font-manrope text-[11px] md:text-xs text-[#1D1D1F] leading-snug whitespace-nowrap">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Pulsing scroll arrow — over video, desktop only ── */}
        <div className="absolute bottom-6 z-20 hidden md:block" style={{ left: '22%', transform: 'translateX(-50%)' }}>
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

      </section>
    </>
  )
}

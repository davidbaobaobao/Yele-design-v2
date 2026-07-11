'use client'

import { useEffect, useRef } from 'react'

/* ── Topic icons (stroke, 20 × 20) ── */
function IconWallet() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="6" width="22" height="14" rx="2" />
      <path d="M1 10h22" />
      <circle cx="17.5" cy="15" r="1.5" fill="#1D1D1F" stroke="none" />
    </svg>
  )
}
function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}
function IconTag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

const MARQUEE_ITEMS = [...ITEMS, ...ITEMS]

export default function HeroBento() {
  const panelRef = useRef<HTMLDivElement>(null)

  /* Parallax: card moves at 30% of scroll speed */
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    function onScroll() {
      const y = window.scrollY
      if (panel) panel.style.transform = `translateY(${y * 0.3}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{`
        /* Marquee scrolls left infinitely */
        @keyframes marqueeLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hero-marquee-track {
          animation: marqueeLeft 18s linear infinite;
          will-change: transform;
        }
        .hero-marquee-track:hover { animation-play-state: paused; }

        /* Scroll arrow pulse */
        @keyframes heroPulse {
          0%, 100% { transform: translateY(0);   opacity: 1;    }
          50%       { transform: translateY(7px); opacity: 0.55; }
        }
      `}</style>

      <section className="relative h-screen overflow-hidden">

        {/* ── HQ Video background ── */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay muted loop playsInline
          poster="/media/main_hero/poster_hq.jpg"
          aria-hidden="true"
        >
          <source src="/media/main_hero/hero_hq.webm" type="video/webm" />
          <source src="/media/main_hero/hero_hq.mp4"  type="video/mp4" />
        </video>

        {/* Top vignette for nav legibility */}
        <div
          className="absolute inset-x-0 top-0 h-28 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, transparent 100%)' }}
          aria-hidden="true"
        />

        {/* ── Floating card — 40% wide, vertically centred in middle 50% ── */}
        <div
          ref={panelRef}
          className="absolute right-0 flex flex-col"
          style={{
            top: '25%',
            bottom: '25%',
            width: '40%',
          }}
        >
          {/* Black card — matte black */}
          <div
            className="relative flex-1 flex flex-col justify-end px-10 pb-9 pt-10"
            style={{ backgroundColor: '#0a0a0a' }}
          >
            <h1
              className="font-outfit font-black text-white leading-[0.93] tracking-tight mb-5"
              style={{ fontSize: 'clamp(32px, 3.6vw, 68px)' }}
            >
              DISEÑO<br />
              WEB PROFESIONAL<br />
              DESDE <span className="text-[#34C759]">29€/MES</span>
            </h1>
            <p className="font-manrope text-[10px] tracking-[0.22em] uppercase text-white/40 leading-relaxed">
              TU AGENCIA DE DISEÑO WEB&nbsp;·&nbsp;SIN COMPLICACIONES.
            </p>
          </div>

          {/* White card — compact looping marquee */}
          <div className="bg-white overflow-hidden py-3.5">
            <div className="hero-marquee-track flex items-center" style={{ width: 'max-content' }}>
              {MARQUEE_ITEMS.map(({ label, Icon }, i) => (
                <div key={i} className="flex items-center gap-2.5 px-6 shrink-0">
                  <Icon />
                  <span className="font-manrope text-xs font-medium text-[#1D1D1F] whitespace-nowrap">
                    {label}
                  </span>
                  <span className="ml-4 text-[#D1D5DB] text-[10px] select-none">·</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Scroll arrow — bottom-center of section ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
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

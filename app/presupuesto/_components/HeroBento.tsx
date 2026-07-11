'use client'

import { useEffect, useRef } from 'react'

/* ── Marquee SVG icons ── */
function IcoClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}
function IcoCoin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v12M9.5 9.2c0-1.2 1.1-2 2.5-2s2.5.8 2.5 2-1.1 1.6-2.5 2-2.5.8-2.5 2 1.1 2 2.5 2 2.5-.8 2.5-2" />
    </svg>
  )
}
function IcoNoCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <line x1="4" y1="21" x2="20" y2="5" />
    </svg>
  )
}
function IcoDoc() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M9 13h6M9 16.5h4" />
    </svg>
  )
}
function IcoUnlock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7.5a4 4 0 0 1 7.85-1" />
    </svg>
  )
}

const ITEMS = [
  { label: 'Lista en 1 semana',   Icon: IcoClock  },
  { label: 'Precio fijo mensual', Icon: IcoCoin   },
  { label: 'Sin pago inicial',    Icon: IcoNoCard },
  { label: 'Sin letra pequeña',   Icon: IcoDoc    },
  { label: 'Sin permanencia',     Icon: IcoUnlock },
]
const MARQUEE_ITEMS = [...ITEMS, ...ITEMS]

export default function HeroBento() {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    function onScroll() {
      const y = window.scrollY
      if (card) card.style.transform = `translateY(calc(-50% + ${y * 0.3}px))`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <style>{`
        @keyframes marqueeLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hero-marquee-track {
          animation: marqueeLeft 16s linear infinite;
          will-change: transform;
        }
        .hero-marquee-track:hover { animation-play-state: paused; }

        @keyframes heroPulse {
          0%, 100% { transform: translateY(0);   opacity: 1;    }
          50%       { transform: translateY(7px); opacity: 0.55; }
        }

        @keyframes badgeStar {
          0%   { transform: scale(1)    rotate(0deg);   }
          50%  { transform: scale(1.35) rotate(180deg); }
          100% { transform: scale(1)    rotate(360deg); }
        }
        .hero-badge-star {
          animation: badgeStar 2.4s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>

      <section className="relative h-screen overflow-hidden">

        {/* Blurred poster fills letterbox gaps */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/media/main_hero/poster_hq.jpg')",
            filter: 'blur(28px)',
            transform: 'scale(1.08)',
          }}
          aria-hidden="true"
        />
        <video
          className="absolute inset-0 w-full h-full object-contain"
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

        {/* ── Floating card — vertically centred, right-aligned, parallax ── */}
        <div
          ref={cardRef}
          className="absolute right-0 z-20"
          style={{
            top: '50%',
            transform: 'translateY(-50%)',
            width: 'clamp(300px, 44vw, 620px)',
          }}
        >
          <div
            className="flex overflow-hidden"
            style={{ boxShadow: '0 32px 64px -24px rgba(0,0,0,0.55)' }}
          >
            {/* ── Main card column ── */}
            <div className="flex-1 flex flex-col min-w-0">

              {/* Black box */}
              <div
                style={{
                  background: '#0a0a0a',
                  padding: 'clamp(24px, 3.5vw, 52px) clamp(18px, 3vw, 40px) clamp(20px, 2.8vw, 36px)',
                }}
              >
                <h1
                  className="font-outfit font-black text-white"
                  style={{
                    fontSize: 'clamp(34px, 6.2vw, 90px)',
                    lineHeight: 0.96,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Diseño<br />
                  Web<br />
                  Profesional
                </h1>

                <p
                  className="font-manrope text-white/55 mt-5"
                  style={{ fontSize: 'clamp(11px, 1.2vw, 16px)', lineHeight: 1.5 }}
                >
                  Tu agencia de diseño web · Sin complicaciones
                </p>
                <p
                  className="font-outfit font-bold text-white"
                  style={{ fontSize: 'clamp(13px, 1.4vw, 18px)', marginTop: '4px' }}
                >
                  Desde <span style={{ color: '#34C759' }}>29€/mes</span>
                </p>
              </div>

              {/* White marquee box */}
              <div style={{ background: '#ffffff', padding: '18px 0', overflow: 'hidden' }}>
                <div className="hero-marquee-track flex items-center" style={{ width: 'max-content' }}>
                  {MARQUEE_ITEMS.map(({ label, Icon }, i) => (
                    <div key={i} className="flex items-center gap-2 shrink-0" style={{ padding: '0 16px' }}>
                      <Icon />
                      <span
                        className="font-manrope font-semibold text-[#0a0a0a] whitespace-nowrap"
                        style={{ fontSize: 'clamp(11px, 1.1vw, 15px)' }}
                      >
                        {label}
                      </span>
                      <span className="text-[#D1D5DB] text-xs ml-2 select-none" aria-hidden="true">·</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── Red promo badge strip ── */}
            <div
              className="flex-shrink-0 flex flex-col items-center"
              style={{
                background: '#e2482f',
                width: 'clamp(38px, 4vw, 56px)',
                padding: '16px 0',
              }}
            >
              <svg
                className="hero-badge-star flex-shrink-0"
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 3l2 5.5L19.5 10l-5.5 2L12 18l-2-6L4.5 10 10 8.5 12 3z"
                  fill="#ffffff"
                />
                <path
                  d="M19 15l1 3 3 .5-3 .5-1 3-1-3-3-.5 3-.5 1-3z"
                  fill="#ffffff"
                />
              </svg>
              <div className="flex-1 flex items-center justify-center mt-3">
                <span
                  className="font-manrope font-semibold text-white whitespace-nowrap"
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    fontSize: 'clamp(9px, 0.85vw, 13px)',
                    letterSpacing: '0.05em',
                  }}
                >
                  Primer mes gratis
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ── Pulsing scroll arrow — bottom-centre ── */}
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

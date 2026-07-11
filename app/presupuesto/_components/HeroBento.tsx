'use client'

import { useEffect, useRef } from 'react'

/* ── Marquee SVG icons ── */
function IcoClock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}
function IcoCoin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v12M9.5 9.2c0-1.2 1.1-2 2.5-2s2.5.8 2.5 2-1.1 1.6-2.5 2-2.5.8-2.5 2 1.1 2 2.5 2 2.5-.8 2.5-2" />
    </svg>
  )
}
function IcoNoCard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <line x1="4" y1="21" x2="20" y2="5" />
    </svg>
  )
}
function IcoDoc() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M9 13h6M9 16.5h4" />
    </svg>
  )
}
function IcoUnlock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
          50%  { transform: scale(1.4)  rotate(180deg); }
          100% { transform: scale(1)    rotate(360deg); }
        }
        .hero-badge-star {
          animation: badgeStar 2.4s ease-in-out infinite;
          transform-origin: center;
          flex-shrink: 0;
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

        {/* ── Floating card — vertically centred, right-anchored, parallax ── */}
        <div
          ref={cardRef}
          className="absolute right-0 z-20"
          style={{
            top: '50%',
            transform: 'translateY(-50%)',
            /* Reference card = 670px inside a 750px container. Scale to 46vw max 670px */
            width: 'clamp(300px, 46vw, 670px)',
          }}
        >
          {/* Card shell — position:relative for absolute badge inside */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 30px 60px -20px rgba(0,0,0,0.35)',
            }}
          >

            {/* ── Red promo badge — absolutely overlays black box ──
                Reference: top:168px, right:0, width:70px, height:220px.
                168px ≈ 14vw at 1200px viewport (max = 168px). */}
            <div
              style={{
                position: 'absolute',
                top: 'clamp(70px, 14vw, 168px)',
                right: 0,
                width: 'clamp(44px, 5.8vw, 70px)',
                height: 'clamp(130px, 18.3vw, 220px)',
                background: '#e2482f',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '18px',
                gap: '12px',
                zIndex: 2,
              }}
              aria-hidden="true"
            >
              <svg className="hero-badge-star" width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17 5.8 21.3l2.4-7.4L2 9.4h7.6L12 2z" />
              </svg>
              <span
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontWeight: 600,
                  fontSize: 'clamp(10px, 1.1vw, 16px)',
                  letterSpacing: '0.04em',
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                }}
              >
                Primer mes gratis
              </span>
            </div>

            {/* ── Black content box ──
                Reference: padding: 56px 24px 40px 24px */}
            <div
              style={{
                background: '#0a0a0a',
                padding: 'clamp(28px, 4.7vw, 56px) clamp(12px, 2vw, 24px) clamp(20px, 3.3vw, 40px)',
              }}
            >
              {/* Reference: font-family Archivo, weight 500, 96px, line-height 0.98,
                  letter-spacing -0.02em, margin-left 20px */}
              <h1
                className="font-archivo"
                style={{
                  fontWeight: 500,
                  fontSize: 'clamp(38px, 8vw, 96px)',
                  lineHeight: 0.98,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  marginLeft: 'clamp(10px, 1.7vw, 20px)',
                }}
              >
                Diseño<br />
                Web<br />
                Profesional
              </h1>

              {/* Reference: Inter 400, 22px, margin-top 32px, margin-left 20px */}
              <p
                className="font-manrope"
                style={{
                  marginTop: 'clamp(16px, 2.7vw, 32px)',
                  marginLeft: 'clamp(10px, 1.7vw, 20px)',
                  fontWeight: 400,
                  fontSize: 'clamp(13px, 1.8vw, 22px)',
                  letterSpacing: '0.01em',
                  color: '#ffffff',
                }}
              >
                Tu agencia de diseño web · Sin complicaciones
              </p>

              {/* Reference: Inter 600, 22px, margin-top 8px, margin-left 20px */}
              <p
                className="font-manrope"
                style={{
                  marginTop: '8px',
                  marginLeft: 'clamp(10px, 1.7vw, 20px)',
                  fontWeight: 600,
                  fontSize: 'clamp(13px, 1.8vw, 22px)',
                  letterSpacing: '0.01em',
                  color: '#ffffff',
                }}
              >
                Desde <span style={{ color: '#34C759' }}>29€/mes</span>
              </p>
            </div>

            {/* ── White marquee box ──
                Reference: padding 22px 0, Inter 600 18px */}
            <div
              style={{
                background: '#ffffff',
                padding: 'clamp(14px, 1.8vw, 22px) 0',
                overflow: 'hidden',
              }}
            >
              <div className="hero-marquee-track flex items-center" style={{ width: 'max-content' }}>
                {MARQUEE_ITEMS.map(({ label, Icon }, i) => (
                  <div key={i} className="flex items-center shrink-0" style={{ gap: '10px', padding: '0 20px' }}>
                    <Icon />
                    <span
                      className="font-manrope"
                      style={{
                        fontWeight: 600,
                        fontSize: 'clamp(12px, 1.5vw, 18px)',
                        color: '#0a0a0a',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {label}
                    </span>
                    <span style={{ color: '#D1D5DB', marginLeft: '10px', fontSize: '12px' }} aria-hidden="true">·</span>
                  </div>
                ))}
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

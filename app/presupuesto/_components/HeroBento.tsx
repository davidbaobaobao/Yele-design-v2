'use client'

import { useRef, useEffect } from 'react'
import { useVideoAutoplay } from '@/hooks/useVideoAutoplay'

/* ── Marquee SVG icons (stroke, 20×20) ── */
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
  const cardRef  = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

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

  useVideoAutoplay(videoRef)

  return (
    <>
      <style>{`
        @keyframes marqueeLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hero-marquee-track {
          animation: marqueeLeft 14s linear infinite;
          will-change: transform;
        }
        .hero-marquee-track:hover { animation-play-state: paused; }

        @keyframes heroPulse {
          0%, 100% { transform: translateY(0);   opacity: 1;    }
          50%       { transform: translateY(7px); opacity: 0.55; }
        }

        /* Mobile: keep video cropped to purple animated area */
        @media (max-width: 767px) {
          .hero-vid { object-position: 85% 62%; }
        }

        @keyframes sparkleMain {
          0%   { transform: rotate(0deg)   scale(1);    opacity: 0.8; }
          50%  { transform: rotate(180deg) scale(1.22); opacity: 1;   }
          100% { transform: rotate(360deg) scale(1);    opacity: 0.8; }
        }
        @keyframes sparkleDot {
          0%, 100% { transform: scale(1);    opacity: 1;   }
          50%       { transform: scale(1.5);  opacity: 0.6; }
        }
        .hero-sparkle-main {
          animation: sparkleMain 3s ease-in-out infinite;
          transform-origin: 12px 10px;
        }
        .hero-sparkle-dot {
          animation: sparkleDot 3s ease-in-out infinite 1.5s;
          transform-origin: 19px 17.5px;
        }
      `}</style>

      <section className="relative h-[100dvh] md:h-screen overflow-hidden">

        {/* Video: object-cover crops on small windows, zooms/expands on large */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover hero-vid"
          autoPlay muted loop playsInline
          poster="/media/main_hero/poster_hq.jpg"
          aria-hidden="true"
        >
          <source src="/media/main_hero/hero_hq.mp4"  type="video/mp4" />
          <source src="/media/main_hero/hero_hq.webm" type="video/webm" />
        </video>

        {/* Top vignette for nav legibility */}
        <div
          className="absolute inset-x-0 top-0 h-28 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, transparent 100%)' }}
          aria-hidden="true"
        />

        {/* ── Desktop card — hidden on mobile ── */}
        <div
          ref={cardRef}
          className="hidden md:block absolute right-0 z-20"
          style={{ top: '50%', transform: 'translateY(-50%)', width: 670 }}
        >
          {/* Card shell */}
          <div style={{ position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.35)' }}>

            {/* ── Red promo badge ── exact reference: top 168, right 0, w 70, h 220 */}
            <div
              style={{
                position: 'absolute',
                top: 168,
                right: 0,
                width: 70,
                height: 220,
                background: '#e2482f',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: 18,
                gap: 12,
                zIndex: 2,
              }}
              aria-hidden="true"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  className="hero-sparkle-main"
                  d="M12 3L13.6 8.4L19 10L13.6 11.6L12 17L10.4 11.6L5 10L10.4 8.4L12 3Z"
                  stroke="#ffffff" strokeWidth="1.6" strokeLinejoin="round"
                />
                <path
                  className="hero-sparkle-dot"
                  d="M19 14.5L19.7 17L22 17.5L19.7 18L19 20.5L18.3 18L16 17.5L18.3 17L19 14.5Z"
                  fill="#ffffff"
                />
              </svg>
              <span
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontWeight: 600,
                  fontSize: 16,
                  letterSpacing: '0.04em',
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                }}
              >
                Primer mes <span style={{ fontWeight: 800 }}>gratis</span>
              </span>
            </div>

            {/* ── Black content box ── */}
            <div style={{ background: '#000000', padding: '56px 24px 40px 24px' }}>
              <h1
                className="font-archivo"
                style={{
                  fontWeight: 500,
                  fontSize: 96,
                  lineHeight: 0.98,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  marginLeft: 20,
                }}
              >
                Diseño<br />
                Web<br />
                Profesional
              </h1>
              <p
                className="font-manrope"
                style={{ marginTop: 32, marginLeft: 20, fontWeight: 400, fontSize: 22, letterSpacing: '0.01em', color: '#ffffff' }}
              >
                Tu agencia de diseño web · Sin complicaciones
              </p>
              <p
                className="font-manrope"
                style={{ marginTop: 8, marginLeft: 20, fontWeight: 600, fontSize: 22, letterSpacing: '0.01em', color: '#ffffff' }}
              >
                Desde 49€/mes
              </p>
            </div>

            {/* ── White marquee box ── */}
            <div style={{ background: '#ffffff', padding: '22px 0', overflow: 'hidden' }}>
              <div className="hero-marquee-track flex items-center" style={{ width: 'max-content' }}>
                {MARQUEE_ITEMS.map(({ label, Icon }, i) => (
                  <div key={i} className="flex items-center shrink-0" style={{ gap: 12, padding: '0 24px' }}>
                    <Icon />
                    <span
                      className="font-manrope"
                      style={{ fontWeight: 600, fontSize: 18, color: '#0a0a0a', whiteSpace: 'nowrap' }}
                    >
                      {label}
                    </span>
                    <span style={{ color: '#D1D5DB', marginLeft: 8, fontSize: 12 }} aria-hidden="true">·</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Mobile text overlay — hidden on md+ ── */}
        <div className="md:hidden absolute inset-0 z-20 flex flex-col justify-center px-7 pb-24">
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.52) 100%)' }}
            aria-hidden="true"
          />
          <div className="relative">
            <h1
              className="font-archivo text-white"
              style={{ fontWeight: 500, fontSize: 52, lineHeight: 0.98, letterSpacing: '-0.02em' }}
            >
              Diseño<br />Web<br />Profesional
            </h1>
            <p className="font-manrope text-white/80 mt-4 text-base leading-relaxed">
              Tu agencia de diseño web · Sin complicaciones
            </p>
            <p className="font-manrope text-white font-semibold mt-1.5 text-base">
              Desde 49€/mes
            </p>
          </div>
        </div>

        {/* ── Mobile bottom: horizontal orange badge + marquee strip ── */}
        <div className="md:hidden absolute bottom-0 inset-x-0 z-20">
          {/* Orange badge */}
          <div
            style={{
              background: '#e2482f',
              padding: '13px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path className="hero-sparkle-main" d="M12 3L13.6 8.4L19 10L13.6 11.6L12 17L10.4 11.6L5 10L10.4 8.4L12 3Z" stroke="#ffffff" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 600, fontSize: 15, color: '#ffffff', whiteSpace: 'nowrap' }}>
              Primer mes <span style={{ fontWeight: 800 }}>gratis</span>
            </span>
          </div>
          {/* Marquee strip */}
          <div style={{ background: '#ffffff', padding: '13px 0', overflow: 'hidden' }}>
            <div className="hero-marquee-track flex items-center" style={{ width: 'max-content' }}>
              {MARQUEE_ITEMS.map(({ label, Icon }, i) => (
                <div key={i} className="flex items-center shrink-0" style={{ gap: 8, padding: '0 16px' }}>
                  <Icon />
                  <span className="font-manrope" style={{ fontWeight: 600, fontSize: 14, color: '#0a0a0a', whiteSpace: 'nowrap' }}>
                    {label}
                  </span>
                  <span style={{ color: '#D1D5DB', marginLeft: 6, fontSize: 10 }} aria-hidden="true">·</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Pulsing scroll arrow — desktop only ── */}
        <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
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

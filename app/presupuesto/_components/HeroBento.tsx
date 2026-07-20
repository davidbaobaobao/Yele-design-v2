'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { useVideoAutoplay } from '@/hooks/useVideoAutoplay'
import { useLang } from '@/context/LanguageContext'


export default function HeroBento() {
  const cardRef  = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { t } = useLang()

  const ITEMS = [
    t('Precio fijo mensual', 'Fixed monthly price'),
    t('Sin pago inicial',    'No upfront payment'),
    t('Sin permanencia',     'Cancel anytime'),
    t('Entrega rápida',      'Fast delivery'),
  ]
  const MARQUEE_ITEMS = [...ITEMS, ...ITEMS]

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

  // Mobile: swap down to lighter source (desktop keeps hero_hq from HTML)
  useEffect(() => {
    const v = videoRef.current
    if (!v || window.innerWidth >= 768) return
    const sources = v.querySelectorAll('source')
    ;(sources[0] as HTMLSourceElement).src = '/media/main_hero/hero2_mobile.webm'
    ;(sources[1] as HTMLSourceElement).src = '/media/main_hero/hero2_mobile.mp4'
    v.load()
  }, [])

  useVideoAutoplay(videoRef)

  return (
    <>
      <section className="relative h-[100dvh] md:h-screen overflow-hidden bg-black">

        {/* Poster — priority-preloaded, unoptimized so it hits CDN directly without optimizer delay */}
        <Image
          src="/media/main_hero/hero2_poster.jpg"
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover hero-vid"
          aria-hidden="true"
        />

        {/* Video — overlays the poster once it starts playing */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover hero-vid"
          autoPlay muted loop playsInline preload="auto"
          poster="/media/main_hero/hero2_poster.jpg"
          aria-hidden="true"
        >
          <source src="/media/main_hero/hero2_hq.webm" type="video/webm" />
          <source src="/media/main_hero/hero2_hq.mp4"  type="video/mp4" />
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
                {t('Primer mes ', 'Start for ')}<span style={{ fontWeight: 800 }}>{t('gratis', 'free')}</span>
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
                Web<br />
                {t('Diseño', 'Design')}<br />
                {t('Reimaginado', 'Reimagined')}
              </h1>
              <p
                className="font-manrope"
                style={{ marginTop: 32, marginLeft: 20, fontWeight: 400, fontSize: 22, letterSpacing: '0.01em', color: '#ffffff' }}
              >
                {t('Tu agencia de diseño web · Sin complicaciones', 'Your Web design agency · Hassle-free')}
              </p>
              <p
                className="font-manrope"
                style={{ marginTop: 8, marginLeft: 20, fontWeight: 600, fontSize: 22, letterSpacing: '0.01em', color: '#ffffff' }}
              >
                {t('Desde 49 €/mes', 'From $99/month')}
              </p>
            </div>

            {/* ── White marquee box ── */}
            <div style={{ background: '#ffffff', padding: '22px 0', overflow: 'hidden' }}>
              <div className="hero-marquee-track flex items-center" style={{ width: 'max-content' }}>
                {MARQUEE_ITEMS.map((label, i) => (
                  <div key={i} className="flex items-center shrink-0">
                    <span
                      className="font-manrope"
                      style={{ fontWeight: 600, fontSize: 18, color: '#0a0a0a', whiteSpace: 'nowrap', padding: '0 32px' }}
                    >
                      {label}
                    </span>
                    <span style={{ color: '#e2482f', fontSize: 18, fontWeight: 600 }} aria-hidden="true">›</span>
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
              style={{ fontWeight: 500, fontSize: 64, lineHeight: 0.98, letterSpacing: '-0.02em' }}
            >
              Web<br />{t('Diseño', 'Design')}<br />{t('Reimaginado', 'Reimagined')}
            </h1>
            <p className="font-manrope text-white/80 mt-4 text-lg leading-relaxed">
              {t('Tu agencia de diseño web · Sin complicaciones', 'Your Web design agency · Hassle-free')}
            </p>
            <p className="font-manrope text-white font-semibold mt-1.5 text-lg">
              {t('Desde 49 €/mes', 'From $99/month')}
            </p>
          </div>
        </div>

        {/* ── Mobile bottom: horizontal orange badge + marquee strip ── */}
        <div className="md:hidden absolute bottom-0 inset-x-0 z-[70]">
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
              {t('Primer mes ', 'Start for ')}<span style={{ fontWeight: 800 }}>{t('gratis', 'free')}</span>
            </span>
          </div>
          {/* Marquee strip */}
          <div style={{ background: '#ffffff', padding: '13px 0', overflow: 'hidden' }}>
            <div className="hero-marquee-track flex items-center" style={{ width: 'max-content' }}>
              {MARQUEE_ITEMS.map((label, i) => (
                <div key={i} className="flex items-center shrink-0">
                  <span className="font-manrope" style={{ fontWeight: 600, fontSize: 14, color: '#0a0a0a', whiteSpace: 'nowrap', padding: '0 22px' }}>
                    {label}
                  </span>
                  <span style={{ color: '#e2482f', fontSize: 14, fontWeight: 600 }} aria-hidden="true">›</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Spinning scroll arrow — desktop only ── */}
        <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
            aria-label="Scroll down"
            className="cursor-pointer bg-transparent border-0 p-0"
          >
            <div className="scroll-arrow-wrap">
              <div className="scroll-arrow-spin">
                <svg width="52" height="52" viewBox="0 0 120 120" fill="none" stroke="#e2482f" strokeWidth="14" strokeLinecap="butt" strokeLinejoin="miter" aria-hidden="true">
                  <polyline points="30,42 60,78 90,42" />
                </svg>
              </div>
            </div>
          </button>
        </div>

      </section>
    </>
  )
}

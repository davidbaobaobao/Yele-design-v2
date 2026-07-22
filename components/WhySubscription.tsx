'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import { useVideoAutoplay } from '@/hooks/useVideoAutoplay'

// ── Card data ─────────────────────────────────────────────────────────────────

const PALETTE = [
  '#C9BFE0', // 0 Lilac mist
  '#A98FC4', // 1 Deep lavender
  '#D9A0C4', // 2 Orchid pink
  '#E8B4B8', // 3 Blush rose
  '#F0AE83', // 4 Soft coral
  '#F6D3AE', // 5 Peach cream
  '#FBEFDF', // 6 Ivory white
]

const DARK_INK = new Set([0, 2, 3, 4, 5, 6])

const CARDS = [
  {
    en: { title: 'Fixed monthly price',       desc: 'No hidden fees, no end-of-month surprises. Design, marketing, and maintenance — all in one flat rate.' },
    es: { title: 'Precio mensual fijo',        desc: 'Sin tarifas ocultas ni sorpresas a final de mes. Diseño, marketing y mantenimiento en una cuota plana.' },
  },
  {
    en: { title: 'No lock-in',                desc: "Cancel whenever you want — no penalties, no fine print. You stay because you want to, not because you're stuck." },
    es: { title: 'Sin permanencia',            desc: 'Cancela cuando quieras, sin penalizaciones ni letra pequeña. Te quedas porque quieres, no porque estás atado.' },
  },
  {
    en: { title: 'Content generation',        desc: 'Stunning photos, videos, and copy that make your site stand out from the competition — not blend into it.' },
    es: { title: 'Creación de contenido',      desc: 'Fotos, vídeos y textos impactantes que hacen que tu web destaque sobre la competencia.' },
  },
  {
    en: { title: 'Changes included',          desc: 'Request the changes you need and we make them — no extra invoice every time you want to tweak something.' },
    es: { title: 'Cambios incluidos',          desc: 'Solicita los cambios que necesitas y los hacemos, sin factura extra cada vez que quieras modificar algo.' },
  },
  {
    en: { title: 'Maintenance always on',     desc: 'Hosting, domain, security, and updates covered continuously — not just on launch day.' },
    es: { title: 'Mantenimiento activo',       desc: 'Hosting, dominio, seguridad y actualizaciones cubiertos de forma continua, no solo el día del lanzamiento.' },
  },
  {
    en: { title: 'Marketing month after month', desc: "We don't disappear after delivering the site — content, SEO, and conversion improvements, ongoing." },
    es: { title: 'Marketing mes a mes',        desc: 'No desaparecemos tras entregar la web: contenido, SEO y mejoras de conversión, de forma continua.' },
  },
  {
    en: { title: 'Fast delivery',             desc: 'Your site ready in days, not months. And future updates, just as fast.' },
    es: { title: 'Entrega rápida',             desc: 'Tu web lista en días, no en meses. Y las actualizaciones futuras, igual de rápidas.' },
  },
]

const ICONS = [
  <svg key="tag" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>,
  <svg key="unlock" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/>
  </svg>,
  <svg key="camera" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
  </svg>,
  <svg key="pencil" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/>
  </svg>,
  <svg key="shield" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>,
  <svg key="trend" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>,
  <svg key="zap" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>,
]

// ── Fan layout constants ───────────────────────────────────────────────────────

// Alternating tilts for the organic fan feel
const TILTS = [-11, 8, -9, 12, -7, 10, -6]

// Per-gap spacing multipliers — uneven spacing looks more organic
const SPACING_FACTORS = [0.97, 1.03, 0.95, 1.04, 0.98, 1.02]

const N = CARDS.length
// How many strip-px move per deltaY-px of scroll wheel
const SENSITIVITY = 0.55

// ── Responsive layout ─────────────────────────────────────────────────────────

type Layout = {
  cardW:       number
  cardH:       number
  offsets:     number[]   // cumulative center-to-center offsets, OFFSETS[0]=0
  totalTravel: number     // = OFFSETS[N-1]
  X0:          number     // left of card 0 when strip is at x=0 (card 0 centred)
}

function calcLayout(vw: number, vh: number): Layout {
  // Card width: 28-32% of viewport on desktop, wider on mobile
  const cardW = Math.max(280, Math.min(460, Math.round(vw * 0.30)))
  // Base gap between card centres (≈68% of card width → ~32% overlap)
  const baseGap = Math.round(cardW * 0.68)
  // Build cumulative offsets with per-gap variation
  const offsets: number[] = [0]
  for (const f of SPACING_FACTORS) {
    offsets.push(offsets[offsets.length - 1] + Math.round(baseGap * f))
  }
  return {
    cardW,
    // Cards taller than the stage so their bottom gets clipped (the "cut" effect)
    cardH:       Math.round(vh * 1.08),
    offsets,
    totalTravel: offsets[N - 1],
    X0:          Math.round(vw / 2 - cardW / 2),
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function WhySubscription() {
  const { t }      = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)

  const snappingRef    = useRef(false)
  const xTargetRef     = useRef(0)          // target for the spring
  const touchStartY    = useRef(0)
  const currentCardRef = useRef(0)
  const layoutRef      = useRef<Layout>(calcLayout(1440, 900))

  const [layout,      setLayout]      = useState<Layout>(layoutRef.current)
  const [currentCard, setCurrentCard] = useState(0)

  // Spring: x drives the horizontal card strip
  const motionX = useMotionValue(0)
  const springX = useSpring(motionX, { stiffness: 88, damping: 21, mass: 0.85 })

  useVideoAutoplay(videoRef)

  // ── Resize ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    function calc() {
      const l = calcLayout(window.innerWidth, window.innerHeight)
      layoutRef.current = l
      // Re-clamp target to new bounds
      const clamped = Math.max(-l.totalTravel, Math.min(0, xTargetRef.current))
      xTargetRef.current = clamped
      motionX.set(clamped)
      setLayout({ ...l })
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Track active card from spring value ─────────────────────────────────────
  useEffect(() => {
    return springX.on('change', (val) => {
      const { offsets } = layoutRef.current
      let closest = 0
      let minDist  = Infinity
      for (let i = 0; i < N; i++) {
        const d = Math.abs(-val - offsets[i])
        if (d < minDist) { minDist = d; closest = i }
      }
      if (closest !== currentCardRef.current) {
        currentCardRef.current = closest
        setCurrentCard(closest)
      }
    })
  }, [springX])

  // ── Wheel handler ───────────────────────────────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    function onWheel(e: WheelEvent) {
      if (!el) return
      const { top, bottom } = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (bottom <= 0 || top >= vh) return

      const down  = e.deltaY > 0
      const { totalTravel } = layoutRef.current

      // Section entering from below → snap to top
      if (top > 10 && down) {
        e.preventDefault()
        if (!snappingRef.current) {
          snappingRef.current = true
          window.scrollTo({ top: window.scrollY + top, behavior: 'smooth' })
          setTimeout(() => { snappingRef.current = false }, 900)
        }
        return
      }

      // Section flush at viewport top → drive card strip
      if (top <= 10 && top >= -80) {
        if (down  && xTargetRef.current <= -totalTravel) return  // at last card → release
        if (!down && xTargetRef.current >= 0)            return  // at first card → release

        e.preventDefault()
        const newX = Math.max(-totalTravel, Math.min(0, xTargetRef.current - e.deltaY * SENSITIVITY))
        xTargetRef.current = newX
        motionX.set(newX)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Touch ───────────────────────────────────────────────────────────────────
  function onTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0]!.clientY
  }
  function onTouchEnd(e: React.TouchEvent) {
    const el = sectionRef.current
    if (!el) return
    const { top, bottom } = el.getBoundingClientRect()
    if (bottom <= 0 || top >= window.innerHeight) return
    const dy = touchStartY.current - e.changedTouches[0]!.clientY
    if (Math.abs(dy) < 40) return

    const { offsets, totalTravel } = layoutRef.current
    const dir  = dy > 0 ? 1 : -1
    const next = Math.max(0, Math.min(N - 1, currentCardRef.current + dir))
    const newX = Math.max(-totalTravel, Math.min(0, -offsets[next]))
    xTargetRef.current = newX
    motionX.set(newX)
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const { cardW, cardH, offsets, X0 } = layout

  return (
    <section
      ref={sectionRef}
      id="why-subscription"
      className="relative h-screen overflow-hidden bg-[#0a0a0a]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay muted loop playsInline preload="none"
        poster="/media/pricing2/pricing2_poster.jpg"
        aria-hidden="true"
      >
        <source src="/media/pricing2/pricing2_hq.webm" type="video/webm" />
        <source src="/media/pricing2/pricing2_hq.mp4"  type="video/mp4" />
      </video>

      {/* Scrim */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.12) 36%, rgba(0,0,0,0.52) 100%)' }}
      />

      <div className="relative z-10 h-full flex flex-col">

        {/* Title */}
        <div className="flex-shrink-0 pt-12 pb-4 text-center">
          <h2
            className="font-outfit font-semibold text-white leading-tight"
            style={{ fontSize: 'clamp(24px, 3.2vw, 46px)' }}
          >
            {t('¿Por qué suscripción', 'Why subscription')}{' '}
            <span className="we-subtitle-orange">{t('es mejor?', 'is better?')}</span>
          </h2>
        </div>

        {/* Card stage — overflow-hidden clips card bottoms for the "cut" look */}
        <div className="relative flex-1 overflow-hidden">

          {/* Strip — the whole fan translates horizontally as you scroll */}
          <motion.div
            className="absolute inset-0"
            style={{ x: springX }}
          >
            {CARDS.map((card, i) => {
              const darkInk  = DARK_INK.has(i)
              const fg       = darkInk ? '#1a0a2e' : '#ffffff'
              const fgMuted  = darkInk ? 'rgba(15,5,25,0.65)' : 'rgba(255,255,255,0.65)'
              const iconRing = darkInk ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.18)'
              // Centred card always on top; z drops with distance from centre
              const zIdx     = 50 - Math.abs(i - currentCard) * 5
              const pad      = Math.max(24, Math.round(cardW * 0.082))
              const titlePx  = Math.max(22, Math.min(34, Math.round(cardW * 0.074)))
              const descPx   = Math.max(14, Math.min(17, Math.round(cardW * 0.038)))

              return (
                <div
                  key={i}
                  style={{
                    position:        'absolute',
                    left:            X0 + offsets[i],
                    top:             12,
                    width:           cardW,
                    height:          cardH,
                    borderRadius:    24,
                    background:      PALETTE[i],
                    padding:         pad,
                    display:         'flex',
                    flexDirection:   'column',
                    zIndex:          zIdx,
                    // Alternating tilt around the top-centre pivot
                    transform:       `rotateZ(${TILTS[i]}deg)`,
                    transformOrigin: 'center top',
                    boxShadow:       '0 24px 64px rgba(0,0,0,0.50)',
                    willChange:      'transform',
                    userSelect:      'none',
                    WebkitUserSelect: 'none',
                  }}
                >
                  {/* Icon badge */}
                  <div style={{
                    width: Math.max(44, Math.round(cardW * 0.13)),
                    height: Math.max(44, Math.round(cardW * 0.13)),
                    borderRadius: 14,
                    background: iconRing,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: fg, marginBottom: Math.round(pad * 0.9), flexShrink: 0,
                  }}>
                    {ICONS[i]}
                  </div>

                  {/* Counter */}
                  <p style={{
                    fontFamily:    'var(--font-manrope), sans-serif',
                    fontSize:      11,
                    fontWeight:    600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color:         fgMuted,
                    marginBottom:  10,
                  }}>
                    {String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                  </p>

                  {/* Title */}
                  <h3 style={{
                    fontFamily:   'var(--font-outfit), sans-serif',
                    fontSize:     titlePx,
                    fontWeight:   700,
                    lineHeight:   1.14,
                    color:        fg,
                    marginBottom: 16,
                    flexShrink:   0,
                  }}>
                    {t(card.es.title, card.en.title)}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize:   descPx,
                    lineHeight: 1.60,
                    color:      fgMuted,
                  }}>
                    {t(card.es.desc, card.en.desc)}
                  </p>
                </div>
              )
            })}
          </motion.div>

        </div>
      </div>
    </section>
  )
}

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

// Icons at 40px — sized for the large circular badge
const ICONS = [
  <svg key="tag" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>,
  <svg key="unlock" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/>
  </svg>,
  <svg key="camera" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
  </svg>,
  <svg key="pencil" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/>
  </svg>,
  <svg key="shield" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>,
  <svg key="trend" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>,
  <svg key="zap" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>,
]

// ── Fan layout constants ───────────────────────────────────────────────────────

const TILTS = [-11, 8, -9, 12, -7, 10, -6]
const SPACING_FACTORS = [1.00, 1.00, 1.00, 1.00, 1.00, 1.00]

const N = CARDS.length
const SENSITIVITY = 0.65

// ── Responsive layout ─────────────────────────────────────────────────────────

type Layout = {
  cardW:       number
  cardH:       number
  offsets:     number[]
  totalTravel: number
  X0:          number   // left edge of card 0 when strip is at x=0 (card 0 centred)
  cardTop:     number   // how far from section top cards begin (bottom 70% of viewport)
}

function calcLayout(vw: number, vh: number): Layout {
  const cardW   = Math.max(380, Math.min(660, Math.round(vw * 0.46)))
  const baseGap = Math.round(cardW * 1.08)
  const offsets: number[] = [0]
  for (const f of SPACING_FACTORS) {
    offsets.push(offsets[offsets.length - 1] + Math.round(baseGap * f))
  }
  // Cards fill the bottom 70% of the section
  const cardTop = Math.round(vh * 0.30)
  return {
    cardW,
    cardH:       Math.round(vh) - cardTop + 80,
    offsets,
    totalTravel: offsets[N - 1],
    X0:          Math.round(vw / 2 - cardW / 2),
    cardTop,
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function WhySubscription() {
  const { t }      = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)

  const snappingRef = useRef(false)
  const xTargetRef  = useRef(0)
  const touchStartY = useRef(0)
  const layoutRef   = useRef<Layout>(calcLayout(1440, 900))

  const [layout, setLayout] = useState<Layout>(layoutRef.current)

  const motionX = useMotionValue(0)
  const springX = useSpring(motionX, { stiffness: 88, damping: 21, mass: 0.85 })

  useVideoAutoplay(videoRef)

  // ── Resize ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    function calc() {
      const l = calcLayout(window.innerWidth, window.innerHeight)
      layoutRef.current = l
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

  // ── Wheel ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    function onWheel(e: WheelEvent) {
      if (!el) return
      const { top, bottom } = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (bottom <= 0 || top >= vh) return

      const down = e.deltaY > 0
      const { totalTravel } = layoutRef.current

      if (top > 10 && down) {
        e.preventDefault()
        if (!snappingRef.current) {
          snappingRef.current = true
          window.scrollTo({ top: window.scrollY + top, behavior: 'smooth' })
          setTimeout(() => { snappingRef.current = false }, 900)
        }
        return
      }

      if (top <= 10 && top >= -80) {
        if (down  && xTargetRef.current <= -totalTravel) return
        if (!down && xTargetRef.current >= 0)            return
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
    // Find which card is currently closest to derive the touch-advance target
    let cur = 0
    let minD = Infinity
    for (let i = 0; i < N; i++) {
      const d = Math.abs(-xTargetRef.current - offsets[i])
      if (d < minD) { minD = d; cur = i }
    }
    const dir  = dy > 0 ? 1 : -1
    const next = Math.max(0, Math.min(N - 1, cur + dir))
    const newX = Math.max(-totalTravel, Math.min(0, -offsets[next]))
    xTargetRef.current = newX
    motionX.set(newX)
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const { cardW, cardH, offsets, X0, cardTop } = layout

  // Title appears in the strip to the left of card 0 — only when space is available
  const titleW      = Math.min(380, Math.max(0, X0 - 40))
  const showTitle   = titleW > 120
  const titleLeft   = X0 - titleW - 40
  const titleFontPx = Math.max(32, Math.min(62, Math.round(X0 * 0.16)))

  return (
    <div id="why-subscription">
      {/* ── Mobile: sticky card stack — each card slides up over the previous ── */}
      <div className="md:hidden bg-[#0a0a0a]">
        {CARDS.map((card, i) => {
          const darkInk  = DARK_INK.has(i)
          const fg       = darkInk ? '#1a0a2e' : '#ffffff'
          const fgMuted  = darkInk ? 'rgba(15,5,25,0.58)' : 'rgba(255,255,255,0.68)'
          const iconRing = darkInk ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.20)'
          return (
            <div
              key={i}
              className="sticky top-0"
              style={{ height: '100dvh', zIndex: i + 1, padding: '0 12px' }}
            >
              <div style={{
                height:        '100%',
                background:    PALETTE[i],
                borderRadius:  24,
                padding:       '56px 24px 40px',
                display:       'flex',
                flexDirection: 'column',
                justifyContent:'flex-start',
                overflow:      'hidden',
              }}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: iconRing, display: 'flex', alignItems: 'center', justifyContent: 'center', color: fg, marginBottom: 28, flexShrink: 0 }}>
                  {ICONS[i]}
                </div>
                <h3 style={{ fontFamily: 'var(--font-outfit), sans-serif', fontSize: 'clamp(28px, 8vw, 40px)', fontWeight: 700, lineHeight: 1.08, color: fg, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
                  {t(card.es.title, card.en.title)}
                </h3>
                <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: 'clamp(15px, 4vw, 17px)', lineHeight: 1.60, color: fgMuted, margin: 0 }}>
                  {t(card.es.desc, card.en.desc)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Desktop: horizontal spring fan ── */}
      <section
        ref={sectionRef}
        className="hidden md:block relative h-screen overflow-hidden bg-[#0a0a0a]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: '50% 0%' }}
        autoPlay muted loop playsInline preload="none"
        poster="/media/pricing2/pricing2_poster.jpg"
        aria-hidden="true"
      >
        <source src="/media/pricing2/pricing2_hq.webm" type="video/webm" />
        <source src="/media/pricing2/pricing2_hq.mp4"  type="video/mp4" />
      </video>

      {/* Scrim — bottom opacity matches the Pricing section top for a seamless visual join */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.00) 35%, rgba(0,0,0,0.55) 100%)' }}
      />

      {/* Stage — full section height, strip translates inside it */}
      <div className="relative z-10 h-full">
        <motion.div
          className="absolute inset-0"
          style={{ x: springX }}
        >
          {/* Section title — moves with the strip, disappears as you scroll */}
          {showTitle && (
            <div
              style={{
                position:      'absolute',
                left:          titleLeft,
                top:           '32%',
                width:         titleW,
                pointerEvents: 'none',
                userSelect:    'none',
              }}
              aria-hidden="true"
            >
              <h2
                style={{
                  fontFamily:    'var(--font-outfit), sans-serif',
                  fontSize:      titleFontPx,
                  fontWeight:    700,
                  lineHeight:    1.18,
                  color:         '#0a0a0a',
                  margin:        0,
                  textAlign:     'right',
                  letterSpacing: '-0.02em',
                }}
              >
                {t('¿Por qué suscripción', 'Why subscription')}
              </h2>

              {/* Orange line — "is better?" */}
              <div style={{ marginTop: 14, textAlign: 'right' }}>
                <span
                  className="we-subtitle-orange"
                  style={{
                    display:       'block',
                    fontFamily:    'var(--font-outfit), sans-serif',
                    fontSize:      Math.round(titleFontPx * 1.12),
                    fontWeight:    700,
                    lineHeight:    1.08,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {t('es mejor?', 'is better?')}
                </span>
              </div>

              {/* Right-pointing bouncing arrow */}
              <motion.div
                style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg
                  width="44" height="44"
                  viewBox="0 0 120 120"
                  fill="none"
                  stroke="#e2482f"
                  strokeWidth="13"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  aria-hidden="true"
                >
                  <polyline points="32,22 88,60 32,98" />
                </svg>
              </motion.div>
            </div>
          )}

          {/* Card fan */}
          {CARDS.map((card, i) => {
            const darkInk  = DARK_INK.has(i)
            const fg       = darkInk ? '#1a0a2e' : '#ffffff'
            const fgMuted  = darkInk ? 'rgba(15,5,25,0.60)' : 'rgba(255,255,255,0.65)'
            const iconRing = darkInk ? 'rgba(0,0,0,0.14)' : 'rgba(255,255,255,0.20)'
            // Static z-index: earlier cards always in front — no discrete "pop" on scroll
            const zIdx     = N - i

            const pad      = Math.max(36, Math.round(cardW * 0.085))
            const iconSize = Math.max(72, Math.round(cardW * 0.16))
            const titlePx  = Math.max(30, Math.min(54, Math.round(cardW * 0.10)))
            const descPx   = Math.max(14, Math.min(17, Math.round(cardW * 0.036)))
            // Icon sits slightly lower than the card edge; title+desc grouped just below icon
            const topPad   = Math.round(pad * 1.4)
            const iconGap  = Math.round(pad * 0.75)

            return (
              <div
                key={i}
                style={{
                  position:         'absolute',
                  left:             X0 + offsets[i],
                  top:              cardTop,
                  width:            cardW,
                  height:           cardH,
                  borderRadius:     24,
                  background:       PALETTE[i],
                  display:          'flex',
                  flexDirection:    'column',
                  justifyContent:   'flex-start',
                  padding:          pad,
                  paddingTop:       topPad,
                  zIndex:           zIdx,
                  transform:        `rotateZ(${TILTS[i]}deg)`,
                  transformOrigin:  'center top',
                  boxShadow:        '0 24px 64px rgba(0,0,0,0.50)',
                  willChange:       'transform',
                  userSelect:       'none',
                  WebkitUserSelect: 'none',
                }}
              >
                {/* Icon — large circular badge, slightly below card top */}
                <div style={{
                  width:           iconSize,
                  height:          iconSize,
                  borderRadius:    '50%',
                  background:      iconRing,
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  color:           fg,
                  flexShrink:      0,
                  marginBottom:    iconGap,
                }}>
                  {ICONS[i]}
                </div>

                {/* Title — large, just below icon */}
                <h3 style={{
                  fontFamily:    'var(--font-outfit), sans-serif',
                  fontSize:      titlePx,
                  fontWeight:    700,
                  lineHeight:    1.08,
                  color:         fg,
                  margin:        0,
                  marginBottom:  18,
                  letterSpacing: '-0.02em',
                }}>
                  {t(card.es.title, card.en.title)}
                </h3>

                {/* Description — grouped near title */}
                <p style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize:   descPx,
                  lineHeight: 1.60,
                  color:      fgMuted,
                  margin:     0,
                }}>
                  {t(card.es.desc, card.en.desc)}
                </p>
              </div>
            )
          })}
        </motion.div>
      </div>
      </section>
    </div>
  )
}

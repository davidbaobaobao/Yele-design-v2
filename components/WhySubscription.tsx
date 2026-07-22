'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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

// Cards with light backgrounds → dark ink; deep lavender (1) → white ink
const DARK_INK = new Set([0, 2, 3, 4, 5, 6])

const CARDS = [
  {
    en: { title: 'Fixed monthly price', desc: 'No hidden fees, no end-of-month surprises. Design, marketing, and maintenance — all in one flat rate.' },
    es: { title: 'Precio mensual fijo',  desc: 'Sin tarifas ocultas ni sorpresas a final de mes. Diseño, marketing y mantenimiento en una cuota plana.' },
  },
  {
    en: { title: 'No lock-in',           desc: "Cancel whenever you want — no penalties, no fine print. You stay because you want to, not because you're stuck." },
    es: { title: 'Sin permanencia',      desc: 'Cancela cuando quieras, sin penalizaciones ni letra pequeña. Te quedas porque quieres, no porque estás atado.' },
  },
  {
    en: { title: 'Content generation',   desc: 'Stunning photos, videos, and copy that make your site stand out from the competition — not blend into it.' },
    es: { title: 'Creación de contenido', desc: 'Fotos, vídeos y textos impactantes que hacen que tu web destaque sobre la competencia.' },
  },
  {
    en: { title: 'Changes included',     desc: 'Request the changes you need and we make them — no extra invoice every time you want to tweak something.' },
    es: { title: 'Cambios incluidos',    desc: 'Solicita los cambios que necesitas y los hacemos, sin factura extra cada vez que quieras modificar algo.' },
  },
  {
    en: { title: 'Maintenance always on', desc: 'Hosting, domain, security, and updates covered continuously — not just on launch day.' },
    es: { title: 'Mantenimiento activo', desc: 'Hosting, dominio, seguridad y actualizaciones cubiertos de forma continua, no solo el día del lanzamiento.' },
  },
  {
    en: { title: 'Marketing month after month', desc: "We don't disappear after delivering the site — content, SEO, and conversion improvements, ongoing." },
    es: { title: 'Marketing mes a mes', desc: 'No desaparecemos tras entregar la web: contenido, SEO y mejoras de conversión, de forma continua.' },
  },
  {
    en: { title: 'Fast delivery',        desc: 'Your site ready in days, not months. And future updates, just as fast.' },
    es: { title: 'Entrega rápida',       desc: 'Tu web lista en días, no en meses. Y las actualizaciones futuras, igual de rápidas.' },
  },
]

// ── Inline icons ──────────────────────────────────────────────────────────────

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

// ── Constants ─────────────────────────────────────────────────────────────────

const LOCK_MS = 500
const N = CARDS.length

// ── Component ─────────────────────────────────────────────────────────────────

export default function WhySubscription() {
  const { t }       = useLang()
  const sectionRef  = useRef<HTMLElement>(null)
  const videoRef    = useRef<HTMLVideoElement>(null)
  const activeRef   = useRef(0)
  const lockedRef   = useRef(false)
  const snappingRef = useRef(false)
  const dragStart   = useRef(0)
  const touchStartY = useRef(0)

  const [active, setActive] = useState(0)
  const [layout, setLayout] = useState({ w: 640, h: 520, slide: 800 })

  useVideoAutoplay(videoRef)

  // Responsive card size + slide distance
  useEffect(() => {
    function calc() {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const w = vw < 640
        ? Math.round(vw * 0.9)
        : Math.min(Math.round(vw * 0.58), 700)
      const h = Math.min(Math.round(vh * 0.68), 540)
      setLayout({ w, h, slide: vw })
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  function advance(dir: 1 | -1) {
    if (lockedRef.current) return
    const next = activeRef.current + dir
    if (next < 0 || next >= N) return
    lockedRef.current = true
    activeRef.current = next
    setActive(next)
    setTimeout(() => { lockedRef.current = false }, LOCK_MS)
  }

  // Wheel-based snap + card navigation (same pattern as WeStackSection)
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    function onWheel(e: WheelEvent) {
      if (!el) return
      const { top, bottom } = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (bottom <= 0 || top >= vh) return

      const down = e.deltaY > 0
      const cur  = activeRef.current

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
        if (down  && cur >= N - 1) return
        if (!down && cur <= 0)     return
        e.preventDefault()
        advance(down ? 1 : -1)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    advance(dy > 0 ? 1 : -1)
  }

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
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.22) 45%, rgba(0,0,0,0.68) 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center px-4 pt-16 pb-8">

        {/* Section heading */}
        <div className="text-center mb-8">
          <h2
            className="font-outfit font-semibold text-white leading-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
          >
            {t('¿Por qué suscripción', 'Why subscription')}<br />
            <span className="we-subtitle-orange">{t('es mejor?', 'is better?')}</span>
          </h2>
        </div>

        {/* Horizontal slide carousel */}
        <div
          className="relative flex-1 w-full overflow-hidden select-none"
          onPointerDown={(e) => { dragStart.current = e.clientX }}
          onPointerUp={(e) => {
            const dx = dragStart.current - e.clientX
            if (Math.abs(dx) > 48) advance(dx > 0 ? 1 : -1)
          }}
        >
          {CARDS.map((card, i) => {
            const off      = i - active
            const darkInk  = DARK_INK.has(i)
            const fg       = darkInk ? '#1a0a2e' : '#ffffff'
            const fgMuted  = darkInk ? 'rgba(15,5,25,0.65)' : 'rgba(255,255,255,0.65)'
            const iconRing = darkInk ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.18)'

            return (
              <motion.div
                key={i}
                animate={{ x: off * layout.slide }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                style={{
                  position:         'absolute',
                  left:             `calc(50% - ${layout.w / 2}px)`,
                  top:              '50%',
                  marginTop:        -(layout.h / 2),
                  width:            layout.w,
                  height:           layout.h,
                  borderRadius:     24,
                  background:       PALETTE[i],
                  padding:          clamp(28, layout.w * 0.06, 48),
                  display:          'flex',
                  flexDirection:    'column',
                  cursor:           off !== 0 ? 'pointer' : 'default',
                  zIndex:           20 - Math.abs(off),
                  userSelect:       'none',
                  WebkitUserSelect: 'none',
                  boxShadow:        off === 0
                    ? '0 32px 80px rgba(0,0,0,0.65), 0 8px 24px rgba(0,0,0,0.40)'
                    : '0 12px 36px rgba(0,0,0,0.35)',
                }}
              >
                {/* Icon badge */}
                <div style={{
                  width: 60, height: 60, borderRadius: 17,
                  background: iconRing,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: fg, marginBottom: 28, flexShrink: 0,
                }}>
                  {ICONS[i]}
                </div>

                {/* Counter */}
                <p style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: fgMuted, marginBottom: 14,
                }}>
                  {String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                </p>

                {/* Title */}
                <h3 style={{
                  fontFamily:   'var(--font-outfit), sans-serif',
                  fontSize:     clamp(22, layout.w * 0.048, 34),
                  fontWeight:   700,
                  lineHeight:   1.15,
                  color:        fg,
                  marginBottom: 18,
                  flexShrink:   0,
                }}>
                  {t(card.es.title, card.en.title)}
                </h3>

                {/* Description */}
                <p style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize:   clamp(14, layout.w * 0.027, 17),
                  lineHeight: 1.65,
                  color:      fgMuted,
                  flex:       1,
                }}>
                  {t(card.es.desc, card.en.desc)}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Dot indicators */}
        <div className="flex items-center gap-2.5 mt-5" role="tablist" aria-label="Card navigation">
          {CARDS.map((_, i) => (
            <motion.button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Card ${i + 1}`}
              onClick={() => {
                if (lockedRef.current) return
                lockedRef.current = true
                activeRef.current = i
                setActive(i)
                setTimeout(() => { lockedRef.current = false }, LOCK_MS)
              }}
              animate={{
                width:           i === active ? 28 : 8,
                backgroundColor: i === active ? PALETTE[active] : 'rgba(255,255,255,0.25)',
              }}
              transition={{ duration: 0.28 }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

      </div>
    </section>
  )
}

// ── Utility ───────────────────────────────────────────────────────────────────

function clamp(min: number, val: number, max: number) {
  return Math.max(min, Math.min(max, val))
}

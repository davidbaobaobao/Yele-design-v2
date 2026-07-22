'use client'

// WeStackSection — replaces 6 individual We-* sections with a card-stack animation.
// Scroll down = advance card. At last card, page scroll resumes.
// 250ms lock per transition to prevent accidental double-advance.

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useLang } from '@/context/LanguageContext'

const LOCK_MS = 500
const TOTAL = 6

const CARDS = [
  {
    id: 'design',
    h1Es: 'Diseñamos',   h1En: 'We design',
    h2Es: 'tu visión',   h2En: 'your vision',
    bodyEs: 'De webs que impactan visualmente a webs de alta conversión y todo lo que hay entre medias.',
    bodyEn: 'From bold statement websites to high converting websites and everything in between.',
    poster: '/media/wedesign/wedesign_poster.jpg',
    webm:   '/media/wedesign/wedesign_hq.webm',
    mp4:    '/media/wedesign/wedesign_hq.mp4',
  },
  {
    id: 'create',
    h1Es: 'Creamos',                        h1En: 'We create',
    h2Es: 'todo el contenido que necesitas', h2En: 'Any content you need',
    bodyEs: 'De fotografía y vídeo a copy e ilustraciones. Para que tu web sea impactante y llamativa.',
    bodyEn: 'From photography and video to copy and illustrations. So your website looks stunning and eye-catching.',
    poster: '/media/we%20create/bgvideo_poster.jpg',
    webm:   '/media/we%20create/bgvideo_hq.webm',
    mp4:    '/media/we%20create/bgvideo_hq.mp4',
  },
  {
    id: 'deliver',
    h1Es: 'Entregamos', h1En: 'We deliver',
    h2Es: 'Rápido',     h2En: 'Fast',
    bodyEs: 'Nos movemos rápido. Sin tiempo perdido. Al grano.',
    bodyEn: 'We move fast. No wasted time. Straight to the point.',
    poster: '/media/wedeliver/wedeliver2_poster.jpg',
    webm:   '/media/wedeliver/wedeliver2_hq.webm',
    mp4:    '/media/wedeliver/wedeliver2_hq.mp4',
  },
  {
    id: 'ensure',
    h1Es: 'Garantizamos',    h1En: 'We ensure',
    h2Es: 'máximo rendimiento', h2En: 'peak performance',
    bodyEs: 'Siempre online. Siempre fiable.',
    bodyEn: 'Always online. Always reliable.',
    poster: '/media/weensure/weensure_poster.jpg',
    webm:   '/media/weensure/weensure_hq.webm',
    mp4:    '/media/weensure/weensure_hq.mp4',
  },
  {
    id: 'improve',
    h1Es: 'Mejoramos',      h1En: 'We improve',
    h2Es: 'continuamente',  h2En: 'continuously',
    bodyEs: 'Siempre evolucionando. Tu web nunca quedará obsoleta.',
    bodyEn: 'Always evolving. Your website is never outdated.',
    poster: '/media/weimprove/weimprove_poster.jpg',
    webm:   '/media/weimprove/weimprove_hq.webm',
    mp4:    '/media/weimprove/weimprove_hq.mp4',
  },
  {
    id: 'help',
    h1Es: 'Ayudamos a',      h1En: 'We help',
    h2Es: 'llegar más lejos', h2En: 'you reach further',
    bodyEs: 'SEO, anuncios, IA, automatización y mucho más.',
    bodyEn: 'SEO, ads, AI calling, automation, and beyond.',
    poster: '/media/wehelp/wehelp2initial_hq.jpg',
    webm:   '/media/wehelp/wehelp_hq.webm',
    mp4:    '/media/wehelp/wehelp_hq.mp4',
  },
] as const

type Card = (typeof CARDS)[number]

// Visual state for each card based on its offset from the active card.
// x offsets are proportional to cardW so they work at any card size.
function cardState(off: number, cardW: number) {
  if (off < 0)   return { x: -cardW * 1.2, y: 0,            rotateZ: -15, scale: 0.80, opacity: 0 }
  if (off === 0) return { x: 0,            y: 0,            rotateZ: 0,   scale: 1.00, opacity: 1 }
  if (off === 1) return { x: cardW * 0.18, y: 0,            rotateZ: 7,   scale: 0.82, opacity: 0.92 }
  if (off === 2) return { x: cardW * 0.24, y: cardW * 0.02, rotateZ: 12,  scale: 0.70, opacity: 0.72 }
  /* off >= 3 */ return { x: cardW * 0.28, y: cardW * 0.03, rotateZ: 14,  scale: 0.62, opacity: 0 }
}

// ─── Individual card ──────────────────────────────────────────────────────────

// Cards with light video backgrounds → black text for contrast
const DARK_TEXT_IDS = new Set(['design', 'deliver', 'improve'])

function WeCard({ card, isActive }: { card: Card; isActive: boolean }) {
  const { t } = useLang()
  const videoRef = useRef<HTMLVideoElement>(null)
  const isDark   = DARK_TEXT_IDS.has(card.id)
  const h1Color  = isDark ? '#0a0a0a'              : '#ffffff'
  const bodyColor = isDark ? 'rgba(0,0,0,0.70)'   : 'rgba(255,255,255,0.70)'

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.setAttribute('muted', '')
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    v.muted = true

    if (isActive) {
      v.currentTime = 0
      if (v.networkState === HTMLMediaElement.NETWORK_EMPTY) v.load()
      v.play().catch(() => {
        setTimeout(() => { if (v?.paused) { v.muted = true; v.play().catch(() => {}) } }, 300)
      })
    } else {
      v.pause()
    }

    // iOS Safari often fires 'ended' instead of looping
    function onEnded() { if (isActive) { v!.currentTime = 0; v!.play().catch(() => {}) } }
    v.addEventListener('ended', onEnded)
    return () => v.removeEventListener('ended', onEnded)
  }, [isActive])

  return (
    <div className="relative w-full h-full">
      {/* Poster — always visible underneath video */}
      <Image
        src={card.poster}
        alt=""
        fill
        sizes="(max-width: 640px) 92vw, 90vw"
        className="object-cover"
        priority={card.id === 'design'}
        aria-hidden
      />
      {/* Video — fades in when active, poster shows through when not */}
      <video
        ref={videoRef}
        loop muted playsInline preload="none"
        poster={card.poster}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
      >
        <source src={card.webm} type="video/webm" />
        <source src={card.mp4}  type="video/mp4" />
      </video>
      {/* Text: vertically centered, left half of card, right-aligned to centre */}
      <div
        className="absolute top-0 bottom-0 left-0 flex flex-col justify-center pr-8 md:pr-10 pl-6 md:pl-8 text-right"
        style={{ width: '50%' }}
      >
        <h2
          style={{
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            fontWeight: 700,
            lineHeight: 1.0,
            margin: '0 0 12px',
          }}
        >
          <span style={{ display: 'block', color: h1Color, fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
            {t(card.h1Es, card.h1En)}
          </span>
          <span className="we-subtitle-orange" style={{ display: 'block', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
            {t(card.h2Es, card.h2En)}
          </span>
        </h2>
        <p
          style={{
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
            lineHeight: 1.6,
            color: bodyColor,
            margin: 0,
          }}
        >
          {t(card.bodyEs, card.bodyEn)}
        </p>
      </div>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function WeStackSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const lockedRef   = useRef(false)
  const activeRef   = useRef(0)
  const touchStartY = useRef(0)

  const [active, setActive] = useState(0)

  // Responsive card dimensions — landscape, fills most of the section
  const [cardDims, setCardDims] = useState({ w: 1100, h: 620 })
  useEffect(() => {
    function resize() {
      const vw = window.innerWidth
      const vh = window.innerHeight
      if (vw < 640) {
        const w = Math.round(vw * 0.92)
        setCardDims({ w, h: Math.round(w * 0.65) })
      } else {
        const w = Math.round(Math.min(vw * 0.88, 1280))
        const h = Math.round(Math.min(vh - 130, w * 0.58))
        setCardDims({ w, h })
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Returns section rect when visible in viewport, null otherwise
  function sectionRect() {
    const el = sectionRef.current
    if (!el) return null
    const r  = el.getBoundingClientRect()
    const vh = window.innerHeight
    if (r.bottom <= 0 || r.top >= vh) return null
    return r
  }

  // Prevents multiple simultaneous scrollTo calls while snap animation is running
  const snappingRef = useRef(false)

  function advance(dir: 1 | -1) {
    if (lockedRef.current) return
    const next = activeRef.current + dir
    if (next < 0 || next >= TOTAL) return
    lockedRef.current = true
    activeRef.current = next
    setActive(next)
    setTimeout(() => { lockedRef.current = false }, LOCK_MS)
  }

  // Wheel handler:
  //   • Section entering from below (top > 40)  → snap to top; block all scroll
  //   • Section at top (−80 ≤ top ≤ 10)        → card-by-card navigation (500ms lock)
  //   • At last card going down / first going up → release so page can scroll past
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    function onWheel(e: WheelEvent) {
      if (!el) return
      const { top, bottom } = el.getBoundingClientRect()
      const vh = window.innerHeight

      // Section completely outside viewport
      if (bottom <= 0 || top >= vh) return

      const down = e.deltaY > 0
      const cur  = activeRef.current

      // ── Snap to top ──────────────────────────────────────────────────────────
      // Block ALL scroll while section is partially in view from below.
      // snappingRef prevents duplicate scrollTo calls during the animation.
      if (top > 10 && down) {
        e.preventDefault()
        if (!snappingRef.current) {
          snappingRef.current = true
          window.scrollTo({ top: window.scrollY + top, behavior: 'smooth' })
          setTimeout(() => { snappingRef.current = false }, 900)
        }
        return
      }

      // ── Card navigation zone (section is flush at viewport top) ──────────────
      // top ≤ 10  : snap has completed (or nearly so)
      // top ≥ −150: gives 150px buffer for smooth-scroll overshoot before releasing
      if (top <= 10 && top >= -150) {
        if (down  && cur >= TOTAL - 1) return  // last card → release downward
        if (!down && cur <= 0)         return  // first card → release upward
        e.preventDefault()
        advance(down ? 1 : -1)
      }
      // top < −150: section scrolled above viewport → pass through freely
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0]!.clientY
  }
  function onTouchEnd(e: React.TouchEvent) {
    const r = sectionRect()
    if (!r) return
    const dy = touchStartY.current - e.changedTouches[0]!.clientY
    if (Math.abs(dy) < 40) return
    const cur = activeRef.current
    const goingDown = dy > 0
    if (goingDown && cur === TOTAL - 1) return
    if (!goingDown && cur === 0)        return
    advance(goingDown ? 1 : -1)
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-white"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Card stack stage */}
      <div
        className="relative flex-1 flex items-center justify-center w-full"
        style={{ perspective: '1200px' }}
      >
        {CARDS.map((card, i) => {
          const off   = i - active
          const state = cardState(off, cardDims.w)
          return (
            <motion.div
              key={card.id}
              className="absolute rounded-2xl overflow-hidden shadow-2xl"
              style={{
                width:  cardDims.w,
                height: cardDims.h,
                zIndex: off < 0 ? 0 : 90 - off,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                pointerEvents: off === 0 ? 'auto' : 'none',
              }}
              animate={state}
              transition={{ type: 'spring', stiffness: 130, damping: 26, mass: 1.0 }}
            >
              <WeCard card={card} isActive={off === 0} />
            </motion.div>
          )
        })}
      </div>

      {/* Dot navigation */}
      <div className="relative z-50 flex gap-2.5 pb-8" role="tablist" aria-label="We section navigation">
        {CARDS.map((card, i) => (
          <button
            key={card.id}
            role="tab"
            aria-selected={i === active}
            aria-label={`${card.h1En} ${card.h2En}`}
            onClick={() => {
              if (lockedRef.current) return
              lockedRef.current = true
              activeRef.current = i
              setActive(i)
              setTimeout(() => { lockedRef.current = false }, LOCK_MS)
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active
                ? 'w-7 bg-[#1D1D1F]'
                : 'w-2 bg-[#1D1D1F]/20 hover:bg-[#1D1D1F]/45'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

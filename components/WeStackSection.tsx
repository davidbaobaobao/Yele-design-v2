'use client'

// WeStackSection — replaces 6 individual We-* sections with a card-stack animation.
// Scroll down = advance card. At last card, page scroll resumes.
// 250ms lock per transition to prevent accidental double-advance.

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Image from 'next/image'
import { useLang } from '@/context/LanguageContext'

const LOCK_MS = 200
const TOTAL = 6

const CARDS = [
  {
    id: 'design',
    h1Es: 'Diseñamos',   h1En: 'We design',
    h2Es: 'tu visión',   h2En: 'your vision',
    bodyEs: 'De webs que impactan visualmente\na webs de alta conversión\ny todo lo que hay entre medias.',
    bodyEn: 'From bold statement websites\nto high converting websites\nand everything in between.',
    poster: '/media/wedesign/wedesign_poster.jpg',
    webm:   '/media/wedesign/wedesign_hq.webm',
    mp4:    '/media/wedesign/wedesign_hq.mp4',
  },
  {
    id: 'create',
    h1Es: 'Creamos',                        h1En: 'We create',
    h2Es: 'todo el contenido que necesitas', h2En: 'Any content you need',
    bodyEs: 'De fotografía y vídeo a copy e ilustraciones.\nPara que tu web sea impactante y llamativa.',
    bodyEn: 'From photography and video to copy and illustrations.\nSo your website looks stunning and eye-catching.',
    poster: '/media/we%20create/bgvideo_poster2.jpeg',
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

// 3D horizontal stack: active card centre, next cards step right + recede in Z.
// Exiting cards (off < 0) fly out to the left.
function cardState(off: number, cardW: number) {
  const STEP_X = Math.round(cardW * 0.13)
  const STEP_Z = 220
  if (off < 0)   return { x: -cardW * 1.5,  z:   0,           opacity: 0    }
  if (off === 0) return { x: 0,             z:   0,           opacity: 1    }
  if (off === 1) return { x: STEP_X,        z: -STEP_Z,       opacity: 0.78 }
  if (off === 2) return { x: STEP_X * 1.6,  z: -STEP_Z * 1.7, opacity: 0.52 }
  return               { x: STEP_X * 2,     z: -STEP_Z * 2.2, opacity: 0    }
}

// ─── Mobile card (full-screen, natural scroll) ────────────────────────────────

// Cards with light video backgrounds → black text for contrast
const DARK_TEXT_IDS = new Set(['design', 'deliver', 'improve'])

function MobileWeCard({ card }: { card: (typeof CARDS)[number] }) {
  const { t }     = useLang()
  const videoRef  = useRef<HTMLVideoElement>(null)
  const isDark    = DARK_TEXT_IDS.has(card.id)
  const h1Color   = isDark ? '#0a0a0a' : '#ffffff'
  const bodyColor = isDark ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.75)'
  const scrim     = isDark
    ? 'linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.0) 60%)'
    : 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%)'

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.setAttribute('muted', '')
    v.setAttribute('playsinline', '')
    v.muted = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { v.muted = true; v.currentTime = 0; v.play().catch(() => {}) }
        else v.pause()
      },
      { threshold: 0.4 }
    )
    observer.observe(v)
    function onEnded() { v!.currentTime = 0; v!.play().catch(() => {}) }
    v.addEventListener('ended', onEnded)
    return () => { observer.disconnect(); v.removeEventListener('ended', onEnded) }
  }, [])

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '100dvh', minHeight: '100vh' }}>
      <Image src={card.poster} alt="" fill sizes="100vw" className="object-cover" priority={card.id === 'design'} aria-hidden />
      <video ref={videoRef} loop muted playsInline preload="none" poster={card.poster}
        className="absolute inset-0 w-full h-full object-cover">
        <source src={card.webm} type="video/webm" />
        <source src={card.mp4}  type="video/mp4" />
      </video>
      <div className="absolute inset-0 pointer-events-none" style={{ background: scrim }} aria-hidden />
      <div className="absolute inset-0 flex flex-col justify-center px-7 pb-8">
        <h2 style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 700, lineHeight: 1.0, margin: '0 0 14px' }}>
          <span style={{ display: 'block', color: h1Color, fontSize: 'clamp(2.1rem, 9vw, 2.8rem)' }}>
            {t(card.h1Es, card.h1En)}
          </span>
          <span className="we-subtitle-orange" style={{ display: 'block', fontSize: 'clamp(2.1rem, 9vw, 2.8rem)' }}>
            {t(card.h2Es, card.h2En)}
          </span>
        </h2>
        <p style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: 'clamp(0.95rem, 3.8vw, 1.05rem)', lineHeight: 1.6, color: bodyColor, margin: 0, maxWidth: '78vw', whiteSpace: 'pre-line' }}>
          {t(card.bodyEs, card.bodyEn)}
        </p>
      </div>
    </div>
  )
}

// ─── Individual card ──────────────────────────────────────────────────────────

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
            fontFamily:  'Helvetica Neue, Helvetica, Arial, sans-serif',
            fontSize:    'clamp(0.85rem, 1.4vw, 1rem)',
            lineHeight:  1.6,
            color:       bodyColor,
            margin:      0,
            whiteSpace:  'pre-line',
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
  // Chrome: e.preventDefault() can be ignored during active compositor animations (will-change:transform).
  // Snap the page back to its locked position if any drift slips through.
  const snapBackY   = useRef<number | null>(null)

  const [active, setActive] = useState(0)

  // Mouse parallax for 3D depth
  const mouseX       = useMotionValue(0)
  const mouseY       = useMotionValue(0)
  const mouseSpringX = useSpring(mouseX, { damping: 45, stiffness: 180 })
  const mouseSpringY = useSpring(mouseY, { damping: 45, stiffness: 180 })

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

  // Mouse parallax — gentle drift follows cursor over the desktop section
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth  - 0.5) * 18)
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 12)
    }
    el.addEventListener('mousemove', onMove, { passive: true })
    return () => el.removeEventListener('mousemove', onMove)
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    snapBackY.current = window.scrollY
    setTimeout(() => { lockedRef.current = false; snapBackY.current = null }, LOCK_MS)
  }

  // Wheel handler (ComoFunciona engine):
  //   • Section entering from below → snap to full view first, no card advance yet
  //   • Section at top → discrete card nav with 200ms lock
  //   • At first/last card edge → pass through so page scroll resumes
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      const r = sectionRect()
      if (!r) return

      const goingDown = e.deltaY > 0
      const cur       = activeRef.current

      if (r.top > 24 && goingDown) {
        e.preventDefault()
        if (!snappingRef.current) {
          snappingRef.current = true
          window.scrollTo({ top: window.scrollY + r.top, behavior: 'smooth' })
          setTimeout(() => { snappingRef.current = false }, 700)
        }
        return
      }

      if (cur === TOTAL - 1 && goingDown)  return
      if (cur === 0         && !goingDown) return

      e.preventDefault()
      advance(goingDown ? 1 : -1)
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Chrome scroll-drift correction: if any page scroll slips past e.preventDefault(),
  // immediately restore the locked position before the frame is painted.
  useEffect(() => {
    function onScroll() {
      const target = snapBackY.current
      if (target === null) return
      if (Math.abs(window.scrollY - target) > 2) window.scrollTo(0, target)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
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
    <>
      {/* ── Mobile: one full-screen card per "slide", natural vertical scroll ── */}
      <div className="md:hidden">
        {CARDS.map(card => <MobileWeCard key={card.id} card={card} />)}
      </div>

      {/* ── Desktop: 3D horizontal card stack (ComoFunciona engine, horizontal) ── */}
      <section
        ref={sectionRef}
        className="hidden md:flex relative w-full h-screen flex-col items-center justify-center overflow-hidden bg-white"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* 3D perspective stage */}
        <div
          className="absolute inset-0"
          style={{ perspective: '1400px', perspectiveOrigin: '44% 50%' }}
        >
          <motion.div
            className="absolute"
            style={{
              left:           '50%',
              top:            '50%',
              x:              mouseSpringX,
              y:              mouseSpringY,
              transformStyle: 'preserve-3d',
            }}
          >
            {CARDS.map((card, i) => {
              const off      = i - active
              const isActive = off === 0
              const state    = cardState(off, cardDims.w)
              return (
                <motion.div
                  key={card.id}
                  style={{
                    position:                 'absolute',
                    width:                    cardDims.w,
                    height:                   cardDims.h,
                    borderRadius:             20,
                    willChange:               'transform',
                    rotateY:                  -8,
                    backfaceVisibility:       'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    zIndex:                   off < 0 ? 0 : 50 - Math.max(0, off),
                    pointerEvents:            isActive ? 'auto' : 'none',
                  }}
                  animate={{
                    x:         state.x - cardDims.w / 2,
                    y:         -cardDims.h / 2,
                    z:         state.z,
                    opacity:   state.opacity,
                    boxShadow: isActive
                      ? '0 60px 120px rgba(0,0,0,0.28), 0 16px 48px rgba(0,0,0,0.16)'
                      : '0 16px 40px rgba(0,0,0,0.10)',
                  }}
                  transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                >
                  {/* clip-path avoids overflow:hidden 3D rendering artifacts */}
                  <div style={{ position: 'absolute', inset: 0, clipPath: 'inset(0 round 20px)' }}>
                    <WeCard card={card} isActive={isActive} />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

      </section>
    </>
  )
}

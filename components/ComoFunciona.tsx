'use client'

// ComoFunciona — desktop: full-screen sticky section, 4 large 3D cards.
// Discrete card-by-card wheel navigation with 200ms lock.
// Cards fan upper-right; scroll moves each card to front with spring animation.
// Mouse parallax makes the stack float. Border rendered via clip-path (no 3D artifact).

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

const steps = [
  {
    num: '01',
    img: '/media/como2/vid1_poster.jpg',
    video: '/media/como2/vid1_c',
    es: { title: 'Cuéntanos tu negocio', desc: 'Rellenas un formulario breve. Nos dices qué haces, a quién, y cómo quieres que te vean.' },
    en: { title: 'Tell us about your business', desc: 'Fill out a short form. Tell us what you do, who you serve, and how you want to be seen.' },
  },
  {
    num: '02',
    img: '/media/como2/vid2_poster.jpg',
    video: '/media/como2/vid2_c',
    es: { title: 'Diseñamos y construimos', desc: 'En 1 semana tienes un sitio profesional, adaptado a tu sector, con tu contenido real.' },
    en: { title: 'We design and build it', desc: 'Your industry, your content, your site — live in 1 week.' },
  },
  {
    num: '03',
    img: '/media/como2/vid3_poster.jpg',
    video: '/media/como2/vid3_c',
    es: { title: 'Tu web en marcha', desc: 'Apruebas, publicamos. Tu web está live y empieza a trabajar por ti desde el primer día.' },
    en: { title: 'Your website is live', desc: 'You approve, we publish. Your site is live and starts working for you from day one.' },
  },
  {
    num: '04',
    img: '/media/como2/vid4_poster.jpg',
    video: '/media/como2/vid4_c',
    es: { title: 'Soporte y mejora continua', desc: 'Actualizamos, mantenemos y mejoramos tu web. Tú no tocas código. Nunca.' },
    en: { title: 'Always on, always improving', desc: 'We update, maintain, and improve your site continuously. You never touch a thing.' },
  },
]

const N       = steps.length
const LOCK_MS = 200

const STEP_X = 120
const STEP_Y = 100
const STEP_Z = 220
const CARD_W = 820
const CARD_H = 540
const TILT_Y = -22

// Card spatial state relative to active card
function cardState(off: number) {
  if (off < 0)   return { x: -CARD_W * 0.6, y:  CARD_H * 0.5, z:  80, opacity: 0 }
  if (off === 0) return { x: 0,             y:  0,             z:  0,  opacity: 1 }
  if (off === 1) return { x:  STEP_X,       y: -STEP_Y,        z: -STEP_Z,        opacity: 0.60 }
  if (off === 2) return { x:  STEP_X * 2,   y: -STEP_Y * 2,    z: -STEP_Z * 2,   opacity: 0.38 }
  return               { x:  STEP_X * 3,   y: -STEP_Y * 3,    z: -STEP_Z * 3,   opacity: 0 }
}

// ─── Desktop card ─────────────────────────────────────────────────────────────

function StepCard3D({ step, i, off, t }: {
  step: (typeof steps)[0]
  i: number
  off: number
  t: (es: string, en: string) => string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isActive = off === 0
  const state    = cardState(off)

  const numColor = 'rgba(255,255,255,0.80)'

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
      v.play().catch(() => setTimeout(() => v?.paused && v.play().catch(() => {}), 300))
    } else {
      v.pause()
    }
    function onEnded() { if (isActive) { v!.currentTime = 0; v!.play().catch(() => {}) } }
    v.addEventListener('ended', onEnded)
    return () => v.removeEventListener('ended', onEnded)
  }, [isActive])

  return (
    // Outer: 3D position + shadow (no overflow/clip so shadow renders cleanly in 3D)
    <motion.div
      style={{
        position:                   'absolute',
        width:                      CARD_W,
        height:                     CARD_H,
        borderRadius:               16,
        willChange:                 'transform',
        rotateY:                    TILT_Y,
        backfaceVisibility:         'hidden',
        WebkitBackfaceVisibility:   'hidden',
      }}
      animate={{
        x:         state.x - CARD_W / 2,
        y:         state.y - CARD_H / 2,
        z:         state.z,
        opacity:   state.opacity,
        boxShadow: isActive
          ? '0 80px 160px rgba(0,0,0,0.95), 0 24px 64px rgba(0,0,0,0.65), 0 4px 16px rgba(0,0,0,0.5)'
          : '0 24px 48px rgba(0,0,0,0.4)',
      }}
      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
    >
      {/* Content — clip-path gives smooth rounded corners in 3D without overflow-hidden artifact */}
      <div style={{ position: 'absolute', inset: 0, clipPath: 'inset(0 round 16px)' }}>
        <Image
          src={step.img}
          alt={t(step.es.title, step.en.title)}
          fill
          sizes={`${CARD_W}px`}
          className="object-cover"
          priority={i === 0}
        />
        <video
          ref={videoRef}
          loop muted playsInline preload="none"
          poster={step.img}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={`${step.video}.webm`} type="video/webm" />
          <source src={`${step.video}.mp4`}  type="video/mp4" />
        </video>

        {/* Dim overlay — fades on active */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          animate={{ opacity: isActive ? 0 : 0.42 }}
          transition={{ duration: 0.45 }}
          aria-hidden
        />
        {/* Top gradient for text */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.32) 36%, transparent 62%)' }}
          aria-hidden
        />
        {/* Text — top of card */}
        <div className="absolute top-0 left-0 right-0 flex flex-col p-8">
          <h3 className="font-outfit font-semibold text-white text-4xl xl:text-5xl leading-snug mb-3">
            {t(step.es.title, step.en.title)}
          </h3>
          <p className="font-manrope text-white/55 text-base leading-relaxed">
            {t(step.es.desc, step.en.desc)}
          </p>
        </div>
        {/* Oversized step number — bottom-right */}
        <div className="absolute bottom-0 right-0 overflow-hidden leading-none pointer-events-none" aria-hidden>
          <span
            className="font-outfit block"
            style={{
              fontWeight:  900,
              fontSize:    240,
              lineHeight:  0.82,
              color:       numColor,
              paddingRight: 28,
              userSelect:  'none',
            }}
          >
            {i + 1}
          </span>
        </div>
      </div>

      {/* Border ring — outside clip-path so it renders at full resolution */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ borderRadius: 16, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)' }}
        aria-hidden
      />
    </motion.div>
  )
}

// ─── Mobile card ──────────────────────────────────────────────────────────────

function MobileStepCard({ step, index, t }: {
  step: (typeof steps)[0]
  index: number
  t: (es: string, en: string) => string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.muted = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { video.muted = true; video.currentTime = 0; video.play().catch(() => {}) }
        else video.pause()
      },
      { threshold: 0.4 }
    )
    observer.observe(video)
    const onEnded = () => { video.currentTime = 0; video.play().catch(() => {}) }
    video.addEventListener('ended', onEnded)
    return () => { observer.disconnect(); video.removeEventListener('ended', onEnded) }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-20px' }}
      className="rounded-2xl overflow-hidden bg-[#1D1D1F] shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
    >
      <div className="relative h-44 overflow-hidden">
        <Image src={step.img} alt={t(step.es.title, step.en.title)} fill sizes="92vw" className="object-cover object-center" />
        <video ref={videoRef} loop muted playsInline preload="metadata" poster={step.img}
          className="absolute inset-0 w-full h-full object-cover object-center">
          <source src={`${step.video}.webm`} type="video/webm" />
          <source src={`${step.video}.mp4`}  type="video/mp4" />
        </video>
      </div>
      <div className="flex items-start gap-4 px-5 py-4">
        <span className="font-outfit text-2xl font-semibold leading-none text-white/25 mt-0.5 shrink-0">{step.num}</span>
        <div>
          <h3 className="font-outfit font-semibold text-lg text-white leading-snug">{t(step.es.title, step.en.title)}</h3>
          <p className="font-manrope text-base text-white/60 mt-1.5 leading-relaxed">{t(step.es.desc, step.en.desc)}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ComoFunciona(_props: { noBg?: boolean } = {}) {
  const { t }      = useLang()
  const sectionRef  = useRef<HTMLElement>(null)
  const lockedRef   = useRef(false)
  const activeRef   = useRef(0)
  const touchStartY = useRef(0)
  const [activeIdx, setActiveIdx] = useState(0)

  // Mouse parallax — smooth spring follows cursor, whole stack drifts gently
  const mouseX  = useMotionValue(0)
  const mouseY  = useMotionValue(0)
  const springX = useSpring(mouseX, { damping: 45, stiffness: 180 })
  const springY = useSpring(mouseY, { damping: 45, stiffness: 180 })

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth  - 0.5) * 22)
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 15)
    }
    el.addEventListener('mousemove', onMove, { passive: true })
    return () => el.removeEventListener('mousemove', onMove)
  }, [mouseX, mouseY])

  // Prevents rapid-fire snap calls during smooth scroll animation
  const snappingRef = useRef(false)

  // Returns section rect only when section overlaps the viewport
  function sectionRect() {
    const el = sectionRef.current
    if (!el) return null
    const r  = el.getBoundingClientRect()
    const vh = window.innerHeight
    if (r.bottom <= 0 || r.top >= vh) return null
    return { top: r.top, bottom: r.bottom, vh }
  }

  function advance(dir: 1 | -1) {
    if (lockedRef.current) return
    const next = activeRef.current + dir
    if (next < 0 || next >= N) return
    lockedRef.current = true
    activeRef.current = next
    setActiveIdx(next)
    setTimeout(() => { lockedRef.current = false }, LOCK_MS)
  }

  // Wheel handler:
  //  1. Section entering from below → snap to full view first (no card advance yet).
  //  2. Section fully in view      → discrete card navigation with 200ms lock.
  //  3. At first/last card edge    → pass through so page scroll resumes.
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      const r = sectionRect()
      if (!r) return

      const goingDown = e.deltaY > 0
      const cur       = activeRef.current

      // Section not yet at top of viewport — snap it into full view
      if (r.top > 24 && goingDown) {
        e.preventDefault()
        if (!snappingRef.current) {
          snappingRef.current = true
          window.scrollTo({ top: window.scrollY + r.top, behavior: 'smooth' })
          setTimeout(() => { snappingRef.current = false }, 700)
        }
        return
      }

      // Pass through at edges so the page can scroll past the section
      if (cur === N - 1 && goingDown)  return
      if (cur === 0     && !goingDown) return

      e.preventDefault()
      advance(goingDown ? 1 : -1)
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
    const dy        = touchStartY.current - e.changedTouches[0]!.clientY
    if (Math.abs(dy) < 40) return
    const cur       = activeRef.current
    const goingDown  = dy > 0
    if (goingDown  && cur === N - 1) return
    if (!goingDown && cur === 0)     return
    advance(goingDown ? 1 : -1)
  }

  return (
    <section
      ref={sectionRef}
      id="como-funciona"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Desktop ── */}
      <div className="hidden md:block">
        <div className="relative h-screen overflow-hidden bg-[#0a0a0a]">

          {/* Title — right-aligned, positioned near the cards */}
          <div
            className="absolute z-20 pointer-events-none select-none text-right"
            style={{ left: '16px', right: 'calc(34% + 450px)', top: '28%' }}
          >
            <h2 className="font-outfit font-semibold text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-white tracking-tight leading-tight">
              {t('El proceso', 'The process')}<br />
              <span className="we-subtitle-orange">{t('Simplificado', 'Simplified')}</span>
            </h2>
            <p className="font-manrope text-white/40 text-base leading-relaxed mt-3">
              {t('Sin reuniones interminables.', 'No endless meetings.')}<br />
              {t('Sin costes sorpresa.', 'No surprise costs.')}
            </p>
            <div className="flex gap-2 mt-5 justify-end">
              {steps.map((s, i) => (
                <motion.div
                  key={s.num}
                  className="h-[2px] rounded-full"
                  animate={{
                    width:           i === activeIdx ? 28 : 14,
                    backgroundColor: i === activeIdx ? '#e2482f' : 'rgba(255,255,255,0.18)',
                  }}
                  transition={{ duration: 0.4 }}
                />
              ))}
            </div>
          </div>

          {/* 3D perspective stage */}
          <div
            className="absolute inset-0"
            style={{ perspective: '1400px', perspectiveOrigin: '68% 58%' }}
          >
            {/* Track — mouse parallax offsets the whole stack */}
            <motion.div
              className="absolute"
              style={{
                left:           '66%',
                top:            '54%',
                x:              springX,
                y:              springY,
                transformStyle: 'preserve-3d',
              }}
            >
              {steps.map((step, i) => (
                <StepCard3D
                  key={step.num}
                  step={step}
                  i={i}
                  off={i - activeIdx}
                  t={t}
                />
              ))}
            </motion.div>
          </div>

        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden px-4 py-12 bg-[#0a0a0a]">
        <div className="mb-8 text-right">
          <h2 className="font-outfit font-semibold text-4xl text-white tracking-tight mb-3 leading-tight">
            {t('El proceso', 'The process')}<br />
            <span className="we-subtitle-orange">{t('Simplificado', 'Simplified')}</span>
          </h2>
          <p className="font-manrope text-white/45 text-base leading-relaxed">
            {t('Sin reuniones interminables.', 'No endless meetings.')}<br />
            {t('Sin presupuesto sorpresa.', 'No surprise costs.')}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <MobileStepCard key={step.num} step={step} index={i} t={t} />
          ))}
        </div>
      </div>

    </section>
  )
}

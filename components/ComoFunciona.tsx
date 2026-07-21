'use client'

// ComoFunciona — desktop: sticky section, 4 large cards stacked diagonally.
// Scrolling moves cards down-left; each card slides to front in turn.
// Title is pinned top-left. Mobile: vertical card list.

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion'
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
    en: { title: 'We design and build it', desc: 'In 1 week you have a professional site, tailored to your industry, with your real content.' },
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
    en: { title: 'Continuous support and improvement', desc: 'We update, maintain and improve your website. You never touch the code.' },
  },
]

const N = steps.length

// Each card i sits UPPER-RIGHT of card i-1 in the rail.
// As user scrolls, the track moves DOWN-LEFT, bringing each card forward.
const STEP_X  =  120   // rightward spread per card
const STEP_Y  =  100   // upward spread per card (negative CSS y)
const STEP_Z  =  220   // depth per card (behind)
const CARD_W  =  820
const CARD_H  =  540
const TILT_Y  = -22    // rotateY: left side further from viewer

// ─── Desktop card ─────────────────────────────────────────────────────────────

function StepCard3D({
  step,
  i,
  smooth,
  activeIdx,
  t,
}: {
  step: (typeof steps)[0]
  i: number
  smooth: MotionValue<number>
  activeIdx: number
  t: (es: string, en: string) => string
}) {
  const videoRef  = useRef<HTMLVideoElement>(null)
  const isActive  = i === activeIdx

  // Per-card fade: future cards appear dimly, past cards fade to 0
  const seg      = 1 / (N - 1)
  const prevPeak = Math.max(0, (i - 1) * seg)
  const thisPeak = i * seg
  const halfNext = Math.min(1, (i + 0.5) * seg)

  const opacity = useTransform(
    smooth,
    i === 0
      ? [0,         halfNext]
      : i === N - 1
        ? [prevPeak, thisPeak]
        : [prevPeak, thisPeak, halfNext],
    i === 0
      ? [1,    0]
      : i === N - 1
        ? [0.45, 1]
        : [0.45, 1, 0],
  )

  // Video: play only when active
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
    // Outer: 3D position in rail + animated opacity (no overflow so no preserve-3d conflict)
    <motion.div
      style={{
        position:           'absolute',
        width:              CARD_W,
        height:             CARD_H,
        // Card i centred at track origin, then spread upper-right per step
        x:        i * STEP_X - CARD_W / 2,
        y:       -(i * STEP_Y) - CARD_H / 2,
        z:       -(i * STEP_Z),
        rotateY:  TILT_Y,
        opacity,
        backfaceVisibility:        'hidden',
        WebkitBackfaceVisibility:  'hidden',
      }}
    >
      {/* Inner: clipping + shadow animation (separate from preserve-3d parent) */}
      <motion.div
        className="relative w-full h-full overflow-hidden"
        style={{ borderRadius: 16 }}
        animate={{
          boxShadow: isActive
            ? '0 48px 96px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.14)'
            : '0 16px 40px rgba(0,0,0,0.45)',
        }}
        transition={{ duration: 0.45 }}
      >
        {/* Poster */}
        <Image
          src={step.img}
          alt={t(step.es.title, step.en.title)}
          fill
          sizes={`${CARD_W}px`}
          className="object-cover"
          priority={i === 0}
        />
        {/* Video */}
        <video
          ref={videoRef}
          loop muted playsInline preload="none"
          poster={step.img}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={`${step.video}.webm`} type="video/webm" />
          <source src={`${step.video}.mp4`}  type="video/mp4" />
        </video>

        {/* Dim overlay — fades away on active card */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          animate={{ opacity: isActive ? 0 : 0.42 }}
          transition={{ duration: 0.45 }}
          aria-hidden
        />
        {/* Top gradient for text legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.38) 42%, transparent 72%)' }}
          aria-hidden
        />
        {/* Text — top of card */}
        <div className="absolute top-0 left-0 right-0 flex flex-col p-8">
          <h3 className="font-outfit font-semibold text-white text-3xl leading-snug mb-2">
            {t(step.es.title, step.en.title)}
          </h3>
          <p className="font-manrope text-white/55 text-sm leading-relaxed">
            {t(step.es.desc, step.en.desc)}
          </p>
        </div>
        {/* Large oversized step number — bottom-right */}
        <div className="absolute bottom-0 right-0 overflow-hidden pointer-events-none leading-none" aria-hidden>
          <span
            className="font-outfit block"
            style={{
              fontWeight: 900,
              fontSize: 240,
              lineHeight: 0.82,
              color: 'rgba(255,255,255,0.07)',
              paddingRight: 28,
              userSelect: 'none',
            }}
          >
            {i + 1}
          </span>
        </div>
      </motion.div>
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
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start start', 'end end'],
  })

  const smooth = useSpring(scrollYProgress, { mass: 0.1, stiffness: 100, damping: 20 })

  useMotionValueEvent(smooth, 'change', (v) => {
    setActiveIdx(Math.min(N - 1, Math.round(v * (N - 1))))
  })

  // Track slides DOWN-LEFT as scroll increases, pulling each card to the front
  const x = useTransform(smooth, [0, 1], [0, -(N - 1) * STEP_X])
  const y = useTransform(smooth, [0, 1], [0,  (N - 1) * STEP_Y])
  const z = useTransform(smooth, [0, 1], [0,  (N - 1) * STEP_Z])

  return (
    <section ref={sectionRef} id="como-funciona">

      {/* ── Desktop ── */}
      <div className="hidden md:block" style={{ height: '420vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden bg-[#0a0a0a]">

          {/* Title — slightly down and right, near the card stack */}
          <div className="absolute z-20 pointer-events-none select-none" style={{ left: '5%', top: '28%' }}>
            <h2 className="font-outfit font-semibold text-5xl xl:text-6xl text-white tracking-tight leading-tight">
              {t('El proceso', 'The process')}<br />
              <span className="we-subtitle-orange">{t('Simplificado', 'Simplified')}</span>
            </h2>
            <p className="font-manrope text-white/40 text-base leading-relaxed mt-3">
              {t('Sin reuniones interminables.', 'No endless meetings.')}<br />
              {t('Sin costes sorpresa.', 'No surprise costs.')}
            </p>
            {/* Step counter dots */}
            <div className="flex gap-2 mt-5">
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
            {/* Track: anchor right-center so active card fills the right ~70% */}
            <motion.div
              className="absolute"
              style={{
                left: '66%',
                top:  '54%',
                x,
                y,
                z,
                transformStyle: 'preserve-3d',
              }}
            >
              {steps.map((step, i) => (
                <StepCard3D
                  key={step.num}
                  step={step}
                  i={i}
                  smooth={smooth}
                  activeIdx={activeIdx}
                  t={t}
                />
              ))}
            </motion.div>
          </div>

        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden px-4 py-12 bg-[#0a0a0a]">
        <div className="mb-8">
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

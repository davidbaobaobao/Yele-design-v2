'use client'

// ComoFunciona — desktop: sticky 3D scroll-driven card track.
// Mobile: unchanged vertical card list.

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

const N      = steps.length
const CARD_W = 380
const CARD_H = 500
// 3D step per card in the rail
const STEP_X =  80   // slight rightward spread
const STEP_Y =  50   // slight downward spread
const STEP_Z = 300   // depth gap (positive = each card is this far behind previous)

// ─── Desktop card ─────────────────────────────────────────────────────────────

function StepCard3D({
  step,
  i,
  smooth,
  t,
}: {
  step: typeof steps[0]
  i: number
  smooth: MotionValue<number>
  t: (es: string, en: string) => string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isActive, setIsActive] = useState(i === 0)

  // Per-card fade: card i peaks at scrollYProgress = i/(N-1)
  // Past cards fade out; upcoming cards fade in from a dimmer state
  const seg      = 1 / (N - 1)
  const prevPeak = Math.max(0, (i - 1) * seg)
  const thisPeak = i * seg
  const halfNext = Math.min(1, (i + 0.5) * seg)

  const opacity = useTransform(
    smooth,
    i === 0
      ? [0, halfNext]
      : i === N - 1
        ? [prevPeak, thisPeak]
        : [prevPeak, thisPeak, halfNext],
    i === 0
      ? [1, 0]
      : i === N - 1
        ? [0.35, 1]
        : [0.35, 1, 0],
  )

  useMotionValueEvent(smooth, 'change', (v) => {
    setIsActive(Math.abs(v - i * seg) < 0.18)
  })

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
    function onEnded() { if (isActive) { v!.currentTime = 0; v!.play().catch(() => {}) } }
    v.addEventListener('ended', onEnded)
    return () => v.removeEventListener('ended', onEnded)
  }, [isActive])

  return (
    <motion.div
      className="absolute rounded-2xl overflow-hidden shadow-2xl"
      style={{
        width:  CARD_W,
        height: CARD_H,
        // Place card i in 3D rail; offset so card 0 is centred at track origin
        transform: `translate3d(${i * STEP_X}px, ${i * STEP_Y}px, ${-i * STEP_Z}px) rotateY(-12deg)`,
        opacity,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <Image
        src={step.img}
        alt={t(step.es.title, step.en.title)}
        fill
        sizes="380px"
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
      {/* Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.20) 55%, transparent 100%)' }}
        aria-hidden
      />
      {/* Text */}
      <div className="absolute inset-0 flex flex-col justify-end p-7">
        <span className="font-outfit text-white/30 text-xs font-mono tracking-widest mb-2">{step.num}</span>
        <h3 className="font-outfit font-semibold text-white text-2xl leading-snug mb-2">
          {t(step.es.title, step.en.title)}
        </h3>
        <p className="font-manrope text-white/60 text-sm leading-relaxed">
          {t(step.es.desc, step.en.desc)}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Mobile card (unchanged) ──────────────────────────────────────────────────

function MobileStepCard({ step, index, t }: { step: typeof steps[0]; index: number; t: (es: string, en: string) => string }) {
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
      className="rounded-2xl overflow-hidden bg-[#1D1D1F] shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
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
        <span className="font-outfit text-2xl font-semibold leading-none text-white/25 mt-0.5 flex-shrink-0">{step.num}</span>
        <div>
          <h3 className="font-outfit font-semibold text-lg text-white leading-snug">{t(step.es.title, step.en.title)}</h3>
          <p className="font-manrope text-base text-white/60 mt-1.5 leading-relaxed">{t(step.es.desc, step.en.desc)}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function ComoFunciona({ noBg }: { noBg?: boolean } = {}) {
  const { t } = useLang()
  const sectionRef  = useRef<HTMLElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ['start start', 'end end'],
  })

  const smooth = useSpring(scrollYProgress, { mass: 0.1, stiffness: 100, damping: 20 })

  useMotionValueEvent(smooth, 'change', (v) => {
    setActiveIdx(Math.min(N - 1, Math.round(v * (N - 1))))
  })

  // Track moves so each card slides to the front in turn
  const x = useTransform(smooth, [0, 1], [0, -(N - 1) * STEP_X])
  const y = useTransform(smooth, [0, 1], [0, -(N - 1) * STEP_Y])
  const z = useTransform(smooth, [0, 1], [0,  (N - 1) * STEP_Z])

  return (
    <section
      ref={sectionRef}
      id="como-funciona"
      className={noBg ? '' : 'bg-[#F5F5F7]'}
      // Desktop: tall so sticky panel has scroll room; mobile: auto
      style={{ '--section-h': '380vh' } as React.CSSProperties}
    >
      {/* ── Desktop ── */}
      <div className="hidden md:block" style={{ height: '380vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden flex bg-[#F5F5F7]">

          {/* Left: title */}
          <div className="w-[360px] shrink-0 flex flex-col justify-center pl-12 pr-8 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <h2 className="font-outfit font-semibold text-6xl xl:text-7xl text-[#1D1D1F] tracking-tight mb-6 leading-tight">
                {t('El proceso', 'The process')}<br />
                <span className="we-subtitle-orange">{t('Simplificado', 'Simplified')}</span>
              </h2>
              <p className="font-manrope text-[#6B7280] text-xl leading-relaxed">
                {t('Sin reuniones interminables.', 'No endless meetings.')}<br />
                {t('Sin costes sorpresa.', 'No surprise up-costs.')}<br />
                {t('Nos encargamos de todo.', 'We handle everything.')}
              </p>
            </motion.div>

            {/* Progress dots */}
            <div className="flex gap-2 mt-8">
              {steps.map((s, i) => (
                <motion.div
                  key={s.num}
                  className="h-[3px] rounded-full"
                  animate={{
                    width:           i === activeIdx ? 32 : 20,
                    backgroundColor: i === activeIdx ? '#1D1D1F' : 'rgba(29,29,31,0.12)',
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              ))}
            </div>
          </div>

          {/* Right: 3D card rail */}
          <div
            className="flex-1 relative"
            style={{ perspective: '1200px', perspectiveOrigin: '20% 50%' }}
          >
            {/* Track origin centred so card 0 appears centred in the panel */}
            <motion.div
              className="absolute"
              style={{
                left: `calc(50% - ${CARD_W / 2}px)`,
                top:  `calc(50% - ${CARD_H / 2}px)`,
                x,
                y,
                z,
                transformStyle: 'preserve-3d',
              }}
            >
              {steps.map((step, i) => (
                <StepCard3D key={step.num} step={step} i={i} smooth={smooth} t={t} />
              ))}
            </motion.div>
          </div>

        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden px-4 py-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="font-outfit font-semibold text-4xl text-[#1D1D1F] tracking-tight mb-3 leading-tight">
            {t('El proceso', 'The process')}<br />
            <span className="we-subtitle-orange">{t('Simplificado', 'Simplified')}</span>
          </h2>
          <p className="font-manrope text-[#6B7280] text-base leading-relaxed">
            {t('Sin reuniones interminables.', 'No endless meetings.')}<br />
            {t('Sin presupuesto sorpresa.', 'No surprise costs.')}
          </p>
        </motion.div>
        <div className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <MobileStepCard key={step.num} step={step} index={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}

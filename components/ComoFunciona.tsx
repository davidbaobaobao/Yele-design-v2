'use client'

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

const steps = [
  {
    num: '01',
    img: '/como-funciona/step-01.webp',
    video: '/media/como/como1',
    es: { title: 'Cuéntanos tu negocio', desc: 'Rellenas un formulario breve. Nos dices qué haces, a quién, y cómo quieres que te vean.' },
    en: { title: 'Tell us about your business', desc: 'Fill out a short form. Tell us what you do, who you serve, and how you want to be seen.' },
  },
  {
    num: '02',
    img: '/como-funciona/step-02.webp',
    video: '/media/como/como2',
    es: { title: 'Diseñamos y construimos', desc: 'En 1 semana tienes un sitio profesional, adaptado a tu sector, con tu contenido real.' },
    en: { title: 'We design and build it', desc: 'In 1 week you have a professional site, tailored to your industry, with your real content.' },
  },
  {
    num: '03',
    img: '/como-funciona/step-03.webp',
    video: '/media/como/como3',
    es: { title: 'Tu web en marcha', desc: 'Apruebas, publicamos. Tu web está live y empieza a trabajar por ti desde el primer día.' },
    en: { title: 'Your website is live', desc: 'You approve, we publish. Your site is live and starts working for you from day one.' },
  },
  {
    num: '04',
    img: '/como-funciona/step-04.webp',
    video: '/media/como/como4',
    es: { title: 'Soporte y mejora continua', desc: 'Actualizamos, mantenemos y mejoramos tu web. Tú no tocas código. Nunca.' },
    en: { title: 'Continuous support and improvement', desc: 'We update, maintain and improve your website. You never touch the code.' },
  },
]

/* ── Timings ── */
const ANIM_MS = 340
const HOLD_MS = 375
const IMG_H   = 400

/* ── Desktop step card (one expanded at a time) ── */
function StepCard({
  step, expanded, onClick, t,
}: {
  step: typeof steps[0]
  expanded: boolean
  onClick: () => void
  t: (es: string, en: string) => string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.setAttribute('muted', '')
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    if (expanded) {
      v.muted = true
      v.currentTime = 0
      v.play().catch(() => {})
    } else {
      v.pause()
      v.currentTime = 0
    }
    // iOS Safari sometimes ignores `loop` — restart manually on ended.
    const onEnded = () => { if (v && expanded) { v.currentTime = 0; v.play().catch(() => {}) } }
    v.addEventListener('ended', onEnded)
    return () => v.removeEventListener('ended', onEnded)
  }, [expanded])

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl overflow-hidden transition-shadow duration-500 ${
        expanded
          ? 'bg-[#1D1D1F] ring-2 ring-[#e2482f] shadow-[0_20px_56px_rgba(226,72,47,0.25)] cursor-default'
          : 'bg-white border border-black/[0.07] shadow-sm cursor-pointer hover:shadow-md'
      }`}
    >
      <motion.div
        animate={{ height: expanded ? IMG_H : 0 }}
        transition={{ duration: ANIM_MS / 1000, ease: expanded ? [0.16, 1, 0.3, 1] : [0.4, 0, 0.6, 1] }}
        className="relative overflow-hidden"
      >
        <div className="relative" style={{ height: IMG_H }}>
          <Image src={step.img} alt={t(step.es.title, step.en.title)} fill sizes="50vw" className="object-cover object-center" />
          <video
            ref={videoRef}
            loop muted playsInline preload="metadata"
            poster={step.img}
            className="absolute inset-0 w-full h-full object-cover object-center"
          >
            <source src={`${step.video}.mp4`}  type="video/mp4" />
            <source src={`${step.video}.webm`} type="video/webm" />
          </video>
        </div>
      </motion.div>
      <div className={`flex items-center gap-4 px-5 py-4 ${expanded ? 'bg-[#e2482f]' : ''}`}>
        <span className={`font-outfit text-2xl font-semibold leading-none transition-colors duration-500 ${expanded ? 'text-white/70' : 'text-[#6B7280]/30'}`}>
          {step.num}
        </span>
        <h3 className={`font-outfit font-semibold text-lg leading-snug transition-colors duration-500 ${expanded ? 'text-white' : 'text-[#1D1D1F]'}`}>
          {t(step.es.title, step.en.title)}
        </h3>
      </div>
    </div>
  )
}

/* ── Mobile step card — always expanded, fade-in + video plays when in view ── */
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
        if (entry.isIntersecting) {
          video.muted = true
          video.currentTime = 0
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(video)
    // iOS Safari sometimes ignores `loop` — restart manually on ended.
    const onEnded = () => { video.currentTime = 0; video.play().catch(() => {}) }
    video.addEventListener('ended', onEnded)
    return () => {
      observer.disconnect()
      video.removeEventListener('ended', onEnded)
    }
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
        <video
          ref={videoRef}
          loop muted playsInline preload="metadata"
          poster={step.img}
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src={`${step.video}.mp4`}  type="video/mp4" />
          <source src={`${step.video}.webm`} type="video/webm" />
        </video>
      </div>
      <div className="flex items-start gap-4 px-5 py-4">
        <span className="font-outfit text-2xl font-semibold leading-none text-white/25 mt-0.5 flex-shrink-0">
          {step.num}
        </span>
        <div>
          <h3 className="font-outfit font-semibold text-lg text-white leading-snug">
            {t(step.es.title, step.en.title)}
          </h3>
          <p className="font-manrope text-base text-white/60 mt-1.5 leading-relaxed">
            {t(step.es.desc, step.en.desc)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function ComoFunciona({ noBg }: { noBg?: boolean } = {}) {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)

  const [displayCard, setDisplayCard] = useState(0)
  const [activeCard,  setActiveCard]  = useState(0)

  const displayRef = useRef(0)
  const lockedRef  = useRef(false)

  function sectionIsActive() {
    const el = sectionRef.current
    if (!el) return false
    const { top, bottom } = el.getBoundingClientRect()
    const vh = window.innerHeight
    return (Math.min(bottom, vh) - Math.max(top, 0)) / vh > 0.55
  }

  function handleCardClick(i: number) {
    if (lockedRef.current) return
    if (displayRef.current === i) return

    lockedRef.current = true
    setDisplayCard(-1)
    displayRef.current = -1

    setTimeout(() => {
      setDisplayCard(i)
      setActiveCard(i)
      displayRef.current = i
      setTimeout(() => { lockedRef.current = false }, HOLD_MS)
    }, ANIM_MS)
  }

  /* ── Wheel handler (desktop only) ── */
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (window.innerWidth < 768) return
      if (!sectionIsActive()) return

      const cur       = displayRef.current
      const goingDown = e.deltaY > 0

      if (goingDown  && cur === steps.length - 1) return
      if (!goingDown && cur === 0) return

      e.preventDefault()
      if (lockedRef.current) return

      lockedRef.current = true
      const next = goingDown ? cur + 1 : cur - 1

      setDisplayCard(-1)
      displayRef.current = -1

      setTimeout(() => {
        setDisplayCard(next)
        setActiveCard(next)
        displayRef.current = next
        setTimeout(() => { lockedRef.current = false }, HOLD_MS)
      }, ANIM_MS)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  /* ── Auto-snap (desktop only) ── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let snapping = false

    const observer = new IntersectionObserver(([entry]) => {
      if (window.innerWidth < 768) return

      if (entry.isIntersecting && !snapping) {
        const { top, bottom } = el.getBoundingClientRect()
        const vh = window.innerHeight
        const ratio = (Math.min(bottom, vh) - Math.max(top, 0)) / vh

        if (ratio < 0.88) {
          snapping = true
          lockedRef.current = true
          setDisplayCard(0); setActiveCard(0); displayRef.current = 0
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          setTimeout(() => { snapping = false; lockedRef.current = false }, 950)
        } else {
          lockedRef.current = true
          setTimeout(() => { lockedRef.current = false }, 600)
        }
      } else if (!entry.isIntersecting) {
        snapping = false
        lockedRef.current = true
        setDisplayCard(0); setActiveCard(0); displayRef.current = 0
      }
    }, { threshold: 0.12 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="como-funciona"
      className={`md:h-screen md:flex md:items-center ${noBg ? '' : 'bg-[#F5F5F7]'}`}
    >
      {/* ── Desktop layout ── */}
      <div className="hidden md:block max-w-5xl mx-auto px-6 w-full py-0">
        <div className="grid grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <h2 className="font-outfit font-semibold text-6xl xl:text-7xl text-[#1D1D1F] tracking-tight mb-6 leading-tight">
              {t('El proceso', 'The process')}<br /><span className="we-subtitle-orange">{t('Simplificado', 'Simplified')}</span>
            </h2>
            <p className="font-manrope text-[#6B7280] text-xl leading-relaxed max-w-sm">
              {t('Sin reuniones interminables.', 'No endless meetings.')}<br />
              {t('Sin costes sorpresa.', 'No surprise up-costs.')}<br />
              {t('Nos encargamos de todo.', 'We handle everything.')}
            </p>
            <div className="flex gap-2 mt-8">
              {steps.map((s, i) => (
                <motion.div
                  key={s.num}
                  className="h-[3px] rounded-full"
                  animate={{
                    width: i === activeCard ? 32 : 20,
                    backgroundColor: i === activeCard ? '#1D1D1F' : 'rgba(29,29,31,0.12)',
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col gap-3">
            {steps.map((step, i) => (
              <StepCard
                key={step.num}
                step={step}
                expanded={displayCard === i}
                onClick={() => handleCardClick(i)}
                t={t}
              />
            ))}
          </div>

        </div>
      </div>

      {/* ── Mobile layout — all cards expanded with fade-in ── */}
      <div className="md:hidden px-4 py-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="font-outfit font-semibold text-4xl text-[#1D1D1F] tracking-tight mb-3 leading-tight">
            {t('El proceso', 'The process')}<br /><span className="we-subtitle-orange">{t('Simplificado', 'Simplified')}</span>
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

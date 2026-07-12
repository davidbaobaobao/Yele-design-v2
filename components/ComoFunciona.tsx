'use client'

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

const steps = [
  {
    num: '01',
    img: '/como-funciona/step-01.jpg',
    video: '/media/como/como1',
    es: { title: 'Cuéntanos tu negocio', desc: 'Rellenas un formulario breve. Nos dices qué haces, a quién, y cómo quieres que te vean.' },
    en: { title: 'Tell us about your business', desc: 'Fill out a short form. Tell us what you do, who you serve, and how you want to be seen.' },
  },
  {
    num: '02',
    img: '/como-funciona/step-02.jpg',
    video: '/media/como/como2',
    es: { title: 'Nosotros lo diseñamos', desc: 'En 1 semana tienes un sitio profesional, adaptado a tu sector, con tu contenido real.' },
    en: { title: 'We design it', desc: 'In 1 week you have a professional site, tailored to your industry, with your real content.' },
  },
  {
    num: '03',
    img: '/como-funciona/step-03.jpg',
    video: '/media/como/como3',
    es: { title: 'Tu web, en marcha', desc: 'Apruebas, publicamos. Tu web está live y empieza a trabajar por ti desde el primer día.' },
    en: { title: 'Your website, live', desc: 'You approve, we publish. Your site is live and starts working for you from day one.' },
  },
  {
    num: '04',
    img: '/como-funciona/step-04.jpg',
    video: '/media/como/como4',
    es: { title: 'Soporte continuo', desc: 'Actualizamos, mantenemos y mejoramos tu web. Tú no tocas código. Nunca.' },
    en: { title: 'Ongoing support', desc: 'We update, maintain and improve your website. You never touch the code.' },
  },
]

/* ── Timings ── */
const ANIM_MS = 340   // collapse / expand animation
const HOLD_MS = 1000  // lock after each card expand

/* ── Card heights: image 80%, text ~20% ── */
const IMG_H  = 260   // expanded image height px
const TEXT_H = 64    // collapsed text row height px (approx)

function StepCard({
  step, expanded, t,
}: {
  step: typeof steps[0]
  expanded: boolean
  t: (es: string, en: string) => string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  /* Play / pause video when expanded state changes */
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (expanded) {
      v.currentTime = 0
      v.play().catch(() => {})
    } else {
      v.pause()
      v.currentTime = 0
    }
  }, [expanded])

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-colors duration-500 ${
        expanded
          ? 'bg-[#1D1D1F] shadow-[0_20px_56px_rgba(0,0,0,0.2)]'
          : 'bg-white border border-black/[0.07] shadow-sm'
      }`}
    >
      {/* ── Image + video (animated height) ── */}
      <motion.div
        animate={{ height: expanded ? IMG_H : 0 }}
        transition={{
          duration: ANIM_MS / 1000,
          ease: expanded ? [0.16, 1, 0.3, 1] : [0.4, 0, 0.6, 1],
        }}
        className="relative overflow-hidden"
      >
        <div className="relative" style={{ height: IMG_H }}>
          {/* Poster image — always rendered as fallback / first frame */}
          <Image
            src={step.img}
            alt={t(step.es.title, step.en.title)}
            fill
            unoptimized
            className="object-cover object-center"
          />
          {/* Video — overlaid, plays when expanded */}
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="metadata"
            poster={step.img}
            className="absolute inset-0 w-full h-full object-cover object-center"
          >
            <source src={`${step.video}.webm`} type="video/webm" />
            <source src={`${step.video}.mp4`}  type="video/mp4" />
          </video>
        </div>
      </motion.div>

      {/* ── Text label (~20% of total expanded height) ── */}
      <div className="flex items-center gap-3 px-4 py-3">
        <span
          className={`font-outfit text-xl font-semibold leading-none transition-colors duration-500 ${
            expanded ? 'text-white/25' : 'text-[#6B7280]/30'
          }`}
        >
          {step.num}
        </span>
        <h3
          className={`font-outfit font-semibold text-[15px] leading-snug transition-colors duration-500 ${
            expanded ? 'text-white' : 'text-[#1D1D1F]'
          }`}
        >
          {t(step.es.title, step.en.title)}
        </h3>
      </div>
    </div>
  )
}

export default function ComoFunciona({ noBg }: { noBg?: boolean } = {}) {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)

  const [displayCard, setDisplayCard] = useState(0)
  const [activeCard,  setActiveCard]  = useState(0)

  const displayRef = useRef(0)
  const lockedRef  = useRef(false)

  /* ── Section-in-view check ── */
  function sectionIsActive() {
    const el = sectionRef.current
    if (!el) return false
    const { top, bottom } = el.getBoundingClientRect()
    const vh = window.innerHeight
    return (Math.min(bottom, vh) - Math.max(top, 0)) / vh > 0.55
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

  /* ── Auto-snap section to viewport on entry ── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let snapping = false

    const observer = new IntersectionObserver(([entry]) => {
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
      className={`md:h-screen flex items-center py-14 md:py-0 ${noBg ? '' : 'bg-[#F5F5F7]'}`}
    >
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* ── Left: heading ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#6B7280] mb-4 block">
              {t('Cómo funciona', 'How it works')}
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-5 leading-tight">
              {t('Cuatro pasos.', 'Four steps.')}
            </h2>
            <p className="font-manrope text-[#6B7280] text-lg leading-relaxed max-w-sm">
              {t(
                'Sin reuniones interminables. Sin presupuestos sorpresa.',
                'No endless meetings. No surprise costs.'
              )}
            </p>

            {/* Progress pills */}
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

          {/* ── Right: 4 step cards ── */}
          <div className="flex flex-col gap-2.5">
            {steps.map((step, i) => (
              <StepCard
                key={step.num}
                step={step}
                expanded={displayCard === i}
                t={t}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

'use client'

import Image from 'next/image'
import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

const steps = [
  {
    num: '01',
    img: '/como-funciona/step-01.jpg',
    es: { title: 'Cuéntanos tu negocio', desc: 'Rellenas un formulario breve. Nos dices qué haces, a quién, y cómo quieres que te vean.' },
    en: { title: 'Tell us about your business', desc: 'Fill out a short form. Tell us what you do, who you serve, and how you want to be seen.' },
  },
  {
    num: '02',
    img: '/como-funciona/step-02.jpg',
    es: { title: 'Nosotros lo diseñamos', desc: 'En 1 semana tienes un sitio profesional, adaptado a tu sector, con tu contenido real.' },
    en: { title: 'We design it', desc: 'In 1 week you have a professional site, tailored to your industry, with your real content.' },
  },
  {
    num: '03',
    img: '/como-funciona/step-03.jpg',
    es: { title: 'Tu web, en marcha', desc: 'Apruebas, publicamos. Tu web está live y empieza a trabajar por ti desde el primer día.' },
    en: { title: 'Your website, live', desc: 'You approve, we publish. Your site is live and starts working for you from day one.' },
  },
  {
    num: '04',
    img: '/como-funciona/step-04.jpg',
    es: { title: 'Soporte continuo', desc: 'Actualizamos, mantenemos y mejoramos tu web. Tú no tocas código. Nunca.' },
    en: { title: 'Ongoing support', desc: 'We update, maintain and improve your website. You never touch the code.' },
  },
]

type Step = typeof steps[0]

// COLLAPSE_MS: how long to wait for the previous card to collapse before expanding the next.
// Matches the image height animation duration (550ms) but we don't need to wait the full duration —
// 320ms is enough for the collapse to be visually clear before the next card starts opening.
const COLLAPSE_MS = 320

function StepCard({ step, index, t, isExpanded, onActive }: {
  step: Step
  index: number
  t: (es: string, en: string) => string
  isExpanded: boolean
  onActive: (i: number) => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(wrapRef, { once: false, margin: '-35% 0px -35% 0px' })

  useEffect(() => {
    if (isInView) onActive(index)
  }, [isInView, index, onActive])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-80px' }}
    >
      <div
        ref={wrapRef}
        className={`rounded-2xl overflow-hidden cursor-default transition-colors duration-500 ${
          isExpanded
            ? 'bg-[#1D1D1F] shadow-[0_24px_64px_rgba(0,0,0,0.22)]'
            : 'bg-white border border-black/[0.07] shadow-sm'
        }`}
      >
        {/* Image: expands/contracts with the card */}
        <motion.div
          animate={{ height: isExpanded ? 210 : 0 }}
          transition={{ duration: 0.55, ease: [0.32, 0, 0.24, 1] }}
          className="relative overflow-hidden"
          style={{ willChange: 'height' }}
        >
          <div className="relative" style={{ height: 210 }}>
            <Image
              src={step.img}
              alt={t(step.es.title, step.en.title)}
              fill
              unoptimized
              className="object-cover object-center"
            />
          </div>
        </motion.div>

        {/* Content */}
        <div className={`transition-all duration-500 ${isExpanded ? 'p-7' : 'p-5'}`}>
          <span className={`font-outfit text-5xl font-semibold block mb-3 leading-none transition-colors duration-500 ${
            isExpanded ? 'text-white/20' : 'text-[#6B7280]/30'
          }`}>
            {step.num}
          </span>
          <h3 className={`font-outfit font-semibold text-xl transition-colors duration-500 ${
            isExpanded ? 'text-white' : 'text-[#1D1D1F]'
          }`}>
            {t(step.es.title, step.en.title)}
          </h3>

          {/* Description only visible when expanded */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.p
                key="desc"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="font-manrope text-base leading-relaxed text-white/60 overflow-hidden"
              >
                {t(step.es.desc, step.en.desc)}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default function ComoFunciona({ noBg }: { noBg?: boolean } = {}) {
  const { t } = useLang()

  // displayStep: which card is visually expanded (-1 = none, during collapse gap)
  const [displayStep, setDisplayStep] = useState(0)
  // activeStep: tracks the current in-view step for the progress pills
  const [activeStep, setActiveStep] = useState(0)

  const prevInViewRef = useRef(-1)
  const isFirstRef   = useRef(true)
  const collapseTimer = useRef<ReturnType<typeof setTimeout>>()

  const handleStepActive = useCallback((index: number) => {
    if (index === prevInViewRef.current) return
    prevInViewRef.current = index
    setActiveStep(index)

    // First activation: expand immediately, no collapse gap
    if (isFirstRef.current) {
      isFirstRef.current = false
      setDisplayStep(index)
      return
    }

    // Subsequent: collapse current card first, then expand the new one
    setDisplayStep(-1)
    clearTimeout(collapseTimer.current)
    collapseTimer.current = setTimeout(() => setDisplayStep(index), COLLAPSE_MS)
  }, [])

  useEffect(() => () => clearTimeout(collapseTimer.current), [])

  return (
    <section id="como-funciona" className={`py-24 md:py-32 ${noBg ? '' : 'bg-[#F5F5F7]'}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* Sticky left */}
          <div className="md:sticky md:top-[30%]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              viewport={{ once: true, margin: '-80px' }}
            >
              <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#6B7280] mb-4 block">
                {t('Cómo funciona', 'How it works')}
              </span>
              <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-6 leading-tight">
                {t('Cuatro pasos.', 'Four steps.')}
              </h2>
              <p className="font-manrope text-[#6B7280] text-lg leading-relaxed">
                {t(
                  'Sin reuniones interminables. Sin presupuestos sorpresa.',
                  'No endless meetings. No surprise costs.'
                )}
              </p>

              {/* Animated progress pills */}
              <div className="flex gap-2 mt-8">
                {steps.map((s, i) => (
                  <motion.div
                    key={s.num}
                    className="h-1 w-8 rounded-full"
                    animate={{
                      backgroundColor: i === activeStep ? '#1D1D1F' : 'rgba(29, 29, 31, 0.1)',
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <StepCard
                key={step.num}
                step={step}
                index={i}
                t={t}
                isExpanded={displayStep === i}
                onActive={handleStepActive}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

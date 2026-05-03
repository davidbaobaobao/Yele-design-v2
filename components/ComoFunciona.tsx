'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

const steps = [
  {
    num: '01',
    es: { title: 'Cuéntanos tu negocio', desc: 'Rellenas un formulario breve. Nos dices qué haces, a quién, y cómo quieres que te vean.' },
    en: { title: 'Tell us about your business', desc: 'Fill out a short form. Tell us what you do, who you serve, and how you want to be seen.' },
  },
  {
    num: '02',
    es: { title: 'Nosotros lo diseñamos', desc: 'En 3–5 días tienes un sitio profesional, adaptado a tu sector, con tu contenido real.' },
    en: { title: 'We design it', desc: 'In 3–5 days you have a professional site, tailored to your industry, with your real content.' },
  },
  {
    num: '03',
    es: { title: 'Tu web, en marcha', desc: 'Apruebas, publicamos. Tu web está live y empieza a trabajar por ti desde el primer día.' },
    en: { title: 'Your website, live', desc: 'You approve, we publish. Your site is live and starts working for you from day one.' },
  },
  {
    num: '04',
    es: { title: 'Soporte continuo', desc: 'Actualizamos, mantenemos y mejoramos tu web. Tú no tocas código. Nunca.' },
    en: { title: 'Ongoing support', desc: 'We update, maintain and improve your website. You never touch the code.' },
  },
]

type Step = typeof steps[0]

function StepCard({ step, index, t }: { step: Step; index: number; t: (es: string, en: string) => string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const isActive = useInView(wrapRef, { once: false, margin: '-35% 0px -35% 0px' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-80px' }}
    >
      <div
        ref={wrapRef}
        className={`rounded-2xl p-8 cursor-default transition-all duration-500 ${
          isActive
            ? 'bg-[#1D1D1F] shadow-[0_20px_60px_rgba(0,0,0,0.18)]'
            : 'bg-[#F5F5F7] shadow-none'
        }`}
      >
        <span className={`font-outfit text-5xl font-semibold block mb-4 leading-none transition-colors duration-500 ${
          isActive ? 'text-white/20' : 'text-[#86868B]/40'
        }`}>
          {step.num}
        </span>
        <h3 className={`font-outfit font-semibold text-xl mb-3 transition-colors duration-500 ${
          isActive ? 'text-white' : 'text-[#1D1D1F]'
        }`}>
          {t(step.es.title, step.en.title)}
        </h3>
        <p className={`font-manrope text-base leading-relaxed transition-colors duration-500 ${
          isActive ? 'text-white/60' : 'text-[#86868B]'
        }`}>
          {t(step.es.desc, step.en.desc)}
        </p>
      </div>
    </motion.div>
  )
}

export default function ComoFunciona() {
  const { t } = useLang()

  return (
    <section id="como-funciona" className="py-24 md:py-32 bg-white">
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
              <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#86868B] mb-4 block">
                {t('Cómo funciona', 'How it works')}
              </span>
              <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-6 leading-tight">
                {t('Cuatro pasos. Tú hablas, nosotros construimos y lo mantenemos.', 'Four steps. You talk, we build and maintain it.')}
              </h2>
              <p className="font-manrope text-[#86868B] text-lg leading-relaxed">
                {t(
                  'Sin reuniones interminables. Sin presupuestos sorpresa.',
                  'No endless meetings. No surprise costs.'
                )}
              </p>

              {/* Progress pills */}
              <div className="flex gap-2 mt-8">
                {steps.map((s) => (
                  <div key={s.num} className="h-1 w-8 rounded-full bg-[#1D1D1F]/10" />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <StepCard key={step.num} step={step} index={i} t={t} />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

'use client'

import { motion, type Transition } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

// H1 is the LCP element — keep it visible on first paint (no opacity: 0)
const slideUp = (delay: number) => ({
  initial: { opacity: 1, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' } as Transition,
})

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' } as Transition,
})

export default function Hero() {
  const { t } = useLang()

  return (
    <section className="h-[80vh] flex items-center justify-center pt-20">
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 w-full text-center">
        <motion.h1
          className="font-outfit font-bold text-[#1D1D1F] leading-[1.05] tracking-tighter mb-7"
          style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}
          {...slideUp(0)}
        >
          <span className="block">{t('Tu web lista en 1 semana.', 'Your website ready in 1 week.')}</span>
          <span className="block text-[#6B7280]">{t('Por 29€ al mes.', 'For €29/month.')}</span>
          <span className="block">{t('Sin complicaciones.', 'No hassle.')}</span>
        </motion.h1>

        <motion.div className="flex items-center justify-center gap-4 flex-wrap" {...fadeUp(0.2)}>
          <motion.a
            href="/registro"
            className="relative overflow-hidden inline-flex items-center gap-2 font-manrope font-medium text-base bg-[#1D1D1F] text-white px-7 py-3.5 rounded-2xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC]"
            whileHover="hover"
            whileTap={{ scale: 0.97, transition: { duration: 0.15 } as Transition }}
            initial="rest"
          >
            <motion.span
              className="absolute inset-0 bg-black"
              variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
              transition={{ duration: 0.3, ease: 'easeOut' } as Transition}
              style={{ originX: 0 }}
              aria-hidden="true"
            />
            <span className="relative z-10">{t('Empezar', 'Get started')}</span>
            <span className="relative z-10" aria-hidden="true">→</span>
          </motion.a>

          <button
            onClick={() => document.querySelector('#trabajos')?.scrollIntoView({ behavior: 'smooth' })}
            className="font-manrope text-base text-[#6B7280] hover:text-[#1D1D1F] transition-colors cursor-pointer focus-visible:outline-none focus-visible:underline"
          >
            {t('Ver ejemplos', 'See examples')}
          </button>
        </motion.div>
      </div>
    </section>
  )
}

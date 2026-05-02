'use client'

import { motion, type Transition } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' } as Transition,
})

export default function Hero() {
  const { t } = useLang()

  return (
    <section
      className="relative min-h-screen flex items-end overflow-hidden pt-20"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 60% 0%, rgba(220,240,255,0.5) 0%, rgba(255,255,255,0) 70%), radial-gradient(ellipse 50% 40% at 90% 20%, rgba(200,255,220,0.25) 0%, transparent 60%), #ffffff',
      }}
    >
      <div className="relative max-w-6xl mx-auto px-6 pb-24 md:pb-32 w-full">
        <div className="max-w-xl">
          <motion.h1
            className="font-outfit font-bold text-[#1D1D1F] leading-[1.05] tracking-tighter mb-7"
            style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}
            {...fadeUp(0)}
          >
            <span className="block">{t('Tu web lista en 3 días.', 'Your website ready in 3 days.')}</span>
            <span className="block text-[#86868B]">{t('Por 29€ al mes.', 'For €29/month.')}</span>
            <span className="block">{t('Sin complicaciones.', 'No hassle.')}</span>
          </motion.h1>

          <motion.div className="flex items-center gap-4 flex-wrap" {...fadeUp(0.2)}>
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
              className="font-manrope text-base text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer focus-visible:outline-none focus-visible:underline"
            >
              {t('Ver ejemplos', 'See examples')}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

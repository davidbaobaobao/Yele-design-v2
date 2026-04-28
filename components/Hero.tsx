'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, type Transition } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' } as Transition,
})

export default function Hero() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -30])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 60% 0%, rgba(220,240,255,0.5) 0%, rgba(255,255,255,0) 70%), radial-gradient(ellipse 50% 40% at 90% 20%, rgba(200,255,220,0.25) 0%, transparent 60%), #ffffff',
      }}
    >
      <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 w-full">
        <div className="max-w-3xl">
          {/* Headline */}
          <motion.h1
            className="font-outfit font-bold text-[#1D1D1F] leading-[1.05] tracking-tighter mb-7"
            style={{ fontSize: 'clamp(44px, 6.5vw, 88px)' }}
            {...fadeUp(0)}
          >
            <span className="block">{t('Tu web a medida,', 'Your website, custom-made,')}</span>
            <span className="block text-[#86868B]">{t('desde 20€ al mes,', 'from €20/month,')}</span>
            <span className="block">{t('sin letra pequeña.', 'no fine print.')}</span>
          </motion.h1>

          {/* CTAs */}
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

        {/* Floating badges */}
        <motion.div
          className="absolute top-1/3 right-8 hidden lg:block"
          style={{ y: badgeY }}
        >
          <motion.div className="flex flex-col gap-3" {...fadeUp(0.45)}>
            {[
              { label: t('⚡ Entrega en 3–5 días', '⚡ Delivered in 3–5 days') },
              { label: t('✓ Sin permanencia', '✓ No lock-in') },
              { label: '€20 / mes' },
            ].map((b, i) => (
              <motion.div
                key={i}
                className="bg-white/80 backdrop-blur-md border border-black/[0.07] rounded-2xl px-4 py-2.5 text-sm font-manrope text-[#1D1D1F] shadow-[0_4px_20px_rgba(0,0,0,0.07)] whitespace-nowrap"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 } as Transition}
              >
                {b.label}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

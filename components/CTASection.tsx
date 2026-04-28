'use client'

import { motion, type Transition } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

export default function CTASection() {
  const { t } = useLang()

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' } as Transition}
          viewport={{ once: true, margin: '-80px' }}
          className="relative overflow-hidden rounded-3xl bg-[#1D1D1F] px-8 py-16 md:px-16 md:py-20 text-center"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(52,199,89,0.12) 0%, transparent 60%), #1D1D1F',
          }}
        >
          {/* Decorative green glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-[#34C759]/40 to-transparent" aria-hidden="true" />

          <span className="font-manrope text-xs tracking-[0.15em] uppercase text-white/40 mb-5 block">
            {t('Último paso', 'Last step')}
          </span>

          <h2 className="font-outfit font-semibold text-4xl md:text-6xl text-white tracking-tight mb-6 leading-tight">
            {t('Estás a un paso', "You're one step away")}<br />
            <span className="text-white/50">{t('de la web que mereces.', 'from the website you deserve.')}</span>
          </h2>

          <p className="font-manrope text-white/50 text-lg mb-10 max-w-lg mx-auto">
            {t(
              'Cuéntanos tu negocio y ten tu web lista en menos de una semana.',
              'Tell us about your business and have your website ready in less than a week.'
            )}
          </p>

          <motion.a
            href="/registro"
            className="relative overflow-hidden inline-flex items-center gap-2 font-manrope font-medium text-base bg-white text-[#1D1D1F] px-8 py-4 rounded-2xl cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            whileHover="hover"
            whileTap={{ scale: 0.97, transition: { duration: 0.15 } as Transition }}
            initial="rest"
          >
            <motion.span
              className="absolute inset-0 bg-[#F5F5F7]"
              variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
              transition={{ duration: 0.3, ease: 'easeOut' } as Transition}
              style={{ originX: 0 }}
              aria-hidden="true"
            />
            <span className="relative z-10">{t('Quiero mi web', 'I want my website')}</span>
            <span className="relative z-10" aria-hidden="true">→</span>
          </motion.a>

          <p className="font-manrope text-xs text-white/30 mt-5">
            {t('Sin permanencia · Respuesta en 24h', 'No lock-in · Response within 24h')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

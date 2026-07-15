'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

export default function MissionSection() {
  const { t } = useLang()

  function scrollToFeatures() {
    document.getElementById('showcase-cards')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="bg-white px-6 md:px-16 lg:px-28 py-20 md:py-28">
      <div className="max-w-5xl">

        {/* Heading */}
        <h2
          className="font-outfit font-bold leading-[1.08] tracking-tight mb-8"
          style={{ fontSize: 'clamp(36px, 5.5vw, 76px)' }}
        >
          {t('Diseño web de', 'We deliver')}{' '}
          <span className="inline-block bg-[#1D1D1F] text-white px-3 py-1 mx-1 rounded-sm">
            {t('última generación', 'state-of-the-art')}
          </span>{' '}
          {t('como servicio de suscripción', 'website design')}{' '}
          <span className="text-[#9CA3AF]">
            {t('para tu negocio.', 'subscription service for your business.')}
          </span>
        </h2>

        {/* Subtitle */}
        <p className="font-manrope text-[#6B7280] text-lg mb-10 max-w-xl">
          {t(
            'Una web que nunca deja de mejorar, sin barreras de entrada.',
            'A website that never stops improving, with zero entry barriers.'
          )}
        </p>

        {/* CTA — interactive down arrow */}
        <button
          onClick={scrollToFeatures}
          className="group flex items-center gap-2 font-manrope font-semibold text-sm tracking-[0.18em] uppercase text-[#1D1D1F] border-b border-[#1D1D1F] pb-0.5 hover:text-[#e2482f] hover:border-[#e2482f] transition-colors duration-200"
        >
          {t('Empezar', 'Get Started')}
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            ↓
          </motion.span>
        </button>

      </div>
    </section>
  )
}

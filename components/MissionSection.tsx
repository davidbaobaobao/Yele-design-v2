'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

export default function MissionSection() {
  const { t } = useLang()

  function scrollToFeatures() {
    document.getElementById('showcase-cards')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="bg-white px-6 md:px-16 lg:px-28 py-14 md:py-20">
      <div className="max-w-5xl">

        {/* Heading — sized and weighted to match reference */}
        <h2
          className="font-outfit font-semibold leading-[1.12] tracking-tight mb-5"
          style={{ fontSize: 'clamp(24px, 3.2vw, 46px)' }}
        >
          {t('Diseño web de', 'We deliver')}{' '}
          <span className="inline bg-[#1D1D1F] text-white px-1.5 py-0.5">
            {t('última generación', 'state-of-the-art')}
          </span>{' '}
          {t('como servicio', 'website design')}{' '}
          <span className="text-[#ABABAB]">
            {t('de suscripción para tu negocio.', 'subscription service for your business.')}
          </span>
        </h2>

        {/* Subtitle */}
        <p className="font-manrope text-[#9CA3AF] text-sm mb-7">
          {t(
            'Una web que nunca deja de mejorar, sin barreras de entrada.',
            'A website that never stops improving, with zero entry barriers.'
          )}
        </p>

        {/* GET STARTED ↓ */}
        <button
          onClick={scrollToFeatures}
          className="flex items-center gap-1.5 font-manrope font-medium text-[11px] tracking-[0.2em] uppercase text-[#1D1D1F] border-b border-[#1D1D1F] pb-px hover:text-[#e2482f] hover:border-[#e2482f] transition-colors duration-200"
        >
          {t('Empezar', 'Get Started')}
          <motion.span
            animate={{ y: [0, 4, 0] }}
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

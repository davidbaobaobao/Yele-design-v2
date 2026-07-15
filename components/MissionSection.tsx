'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

export default function MissionSection() {
  const { t } = useLang()

  function scrollToFeatures() {
    document.getElementById('showcase-cards')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="bg-white px-6 md:px-16 py-20 md:py-[120px]">
      <div className="max-w-[820px]">

        {/* Heading — exact specs from reference: 700 weight, 56px, -0.01em tracking */}
        <h2
          className="font-outfit m-0 mb-7"
          style={{
            fontSize: 'clamp(28px, 3.8vw, 56px)',
            lineHeight: 1.12,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#000000',
          }}
        >
          {t('Diseño web de', 'We deliver')}{' '}
          <span style={{ color: '#ffffff', backgroundColor: '#000000' }} className="px-1">
            {t('última generación', 'state-of-the-art')}
          </span>
          {/* Force line break after highlight on desktop; flows inline on mobile */}
          <br className="hidden md:block" />
          {t('como servicio', 'website design')}{' '}
          <span style={{ color: '#898484' }}>
            {t('de suscripción', 'subscription service')}{' '}
            <br className="hidden md:block" />
            {t('para tu negocio.', 'for your business.')}
          </span>
        </h2>

        {/* Subtitle — 22px, #5c5c5c */}
        <p
          className="font-manrope m-0 mb-6"
          style={{
            fontSize: 'clamp(14px, 1.1vw, 18px)',
            lineHeight: 1.6,
            fontWeight: 400,
            color: '#5c5c5c',
            maxWidth: '620px',
          }}
        >
          {t(
            'Una web que nunca deja de mejorar, sin barreras de entrada.',
            'A website that never stops improving, with zero entry barriers.'
          )}
        </p>

        {/* GET STARTED ↓ — 14px, 0.04em tracking, underline */}
        <button
          onClick={scrollToFeatures}
          className="inline-flex items-center gap-2 font-manrope font-semibold uppercase text-[#111111] border-b border-[#111111] pb-1 hover:text-[#e2482f] hover:border-[#e2482f] transition-colors duration-200"
          style={{ fontSize: '14px', letterSpacing: '0.04em' }}
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

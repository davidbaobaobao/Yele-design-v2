'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

export default function MissionSection() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      const overlay = overlayRef.current
      if (!el || !overlay) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when section enters from bottom, 1 when section top hits viewport top
      const pct = Math.min(1, Math.max(0, (vh - rect.top) / vh))
      overlay.style.clipPath = `inset(0 ${(1 - pct) * 100}% 0 0)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToFeatures() {
    document.getElementById('showcase-cards')?.scrollIntoView({ behavior: 'smooth' })
  }

  const headingStyle: React.CSSProperties = {
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    fontSize: 'clamp(40px, 5vw, 72px)',
    lineHeight: 1.08,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    margin: '0 0 32px 0',
  }

  return (
    <section ref={sectionRef} className="bg-white px-6 md:px-16 py-20 md:py-[120px]">

      {/* Heading — grey base + scroll-driven black fill left→right */}
      <div style={{ position: 'relative' }}>

        {/* Grey base layer — always visible, sets layout height */}
        <h2 style={{ ...headingStyle, color: '#c8c8c8' }}>
          {t('Diseño web de', 'We deliver')}{' '}
          <span style={{ color: '#c8c8c8', backgroundColor: '#ffffff' }} className="px-1">
            {t('última generación', 'state-of-the-art')}
          </span>
          <br className="hidden md:block" />
          {t('como servicio', 'website design')}{' '}
          <span style={{ color: '#c8c8c8' }}>
            {t('de suscripción', 'subscription service')}{' '}
            <br className="hidden md:block" />
            {t('para tu negocio.', 'for your business.')}
          </span>
        </h2>

        {/* Black overlay — clipped to reveal from left as page scrolls */}
        <h2
          ref={overlayRef}
          aria-hidden="true"
          style={{
            ...headingStyle,
            color: '#000000',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            clipPath: 'inset(0 100% 0 0)',
          }}
        >
          {t('Diseño web de', 'We deliver')}{' '}
          <span style={{ color: '#ffffff', backgroundColor: '#000000' }} className="px-1">
            {t('última generación', 'state-of-the-art')}
          </span>
          <br className="hidden md:block" />
          {t('como servicio', 'website design')}{' '}
          <span style={{ color: '#898484' }}>
            {t('de suscripción', 'subscription service')}{' '}
            <br className="hidden md:block" />
            {t('para tu negocio.', 'for your business.')}
          </span>
        </h2>

      </div>

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

    </section>
  )
}

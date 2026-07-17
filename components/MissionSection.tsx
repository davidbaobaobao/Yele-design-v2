'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

export default function MissionSection() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const o0 = useRef<HTMLDivElement>(null)
  const o1 = useRef<HTMLDivElement>(null)
  const o2 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const overlays = [o0.current, o1.current, o2.current]

    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // Progress starts the moment section enters viewport from below (rect.top = vh),
      // reaches 1 when section leaves viewport at the bottom (end of sticky).
      const total = Math.min(1, Math.max(0, (vh - rect.top) / el.offsetHeight))

      overlays.forEach((overlay, i) => {
        if (!overlay) return
        const lp = Math.min(1, Math.max(0, (total - i * 0.20) / 0.60))
        overlay.style.clipPath = `inset(0 ${(1 - lp) * 100}% 0 0)`
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToFeatures() {
    document.getElementById('showcase-cards')?.scrollIntoView({ behavior: 'smooth' })
  }

  const ts = {
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    fontSize: 'clamp(52px, 6.5vw, 94px)',
    lineHeight: 1.05,
    fontWeight: 700,
    letterSpacing: '-0.02em',
  }

  return (
    <section ref={sectionRef} className="bg-white" style={{ height: '450vh' }}>
      <div
        className="sticky top-0 h-screen flex flex-col overflow-hidden"
        style={{ padding: 'clamp(56px, 7vh, 96px) clamp(8px, 1.5vw, 24px) 0' }}
      >

        {/* Line 1 */}
        <div style={{ position: 'relative' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>
            {t('Diseño web de última generación', 'We deliver state-of-the-art')}
          </div>
          <div
            ref={o0}
            aria-hidden="true"
            style={{ ...ts, color: '#000', position: 'absolute', inset: 0, clipPath: 'inset(0 100% 0 0)' }}
          >
            {t('Diseño web de', 'We deliver')}{' '}
            <span style={{ color: '#ffffff', backgroundColor: '#000000', padding: '0 6px' }}>
              {t('última generación', 'state-of-the-art')}
            </span>
          </div>
        </div>

        {/* Line 2 */}
        <div style={{ position: 'relative', marginTop: '0.07em' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>
            {t('como servicio de suscripción', 'website design subscription')}
          </div>
          <div
            ref={o1}
            aria-hidden="true"
            style={{ ...ts, color: '#000', position: 'absolute', inset: 0, clipPath: 'inset(0 100% 0 0)' }}
          >
            {t('como servicio de suscripción', 'website design subscription')}
          </div>
        </div>

        {/* Line 3 */}
        <div style={{ position: 'relative', marginTop: '0.07em' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>
            {t('para tu negocio.', 'service for your business.')}
          </div>
          <div
            ref={o2}
            aria-hidden="true"
            style={{ ...ts, color: '#000', position: 'absolute', inset: 0, clipPath: 'inset(0 100% 0 0)' }}
          >
            {t('para tu negocio.', 'service for your business.')}
          </div>
        </div>

        {/* Large scroll arrow */}
        <div style={{ marginTop: 'clamp(32px, 4vh, 56px)' }}>
          <motion.button
            onClick={scrollToFeatures}
            aria-label={t('Bajar', 'Scroll down')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}
            animate={{ y: [0, 14, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <svg width="110" height="74" viewBox="0 0 110 74" aria-hidden="true">
              <polygon points="0,0 55,68 110,0 86,0 55,44 24,0" fill="#000000" />
            </svg>
          </motion.button>
        </div>

      </div>
    </section>
  )
}

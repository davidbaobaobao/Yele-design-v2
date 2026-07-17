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
  const o3 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const overlays = [o0.current, o1.current, o2.current, o3.current]

    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const scrollable = el.offsetHeight - vh
      const total = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0

      overlays.forEach((overlay, i) => {
        if (!overlay) return
        // 4 lines: stagger starts at 0, 0.15, 0.30, 0.45 — each fills over 0.55
        // so line 4 completes exactly at total = 1.0
        const lp = Math.min(1, Math.max(0, (total - i * 0.15) / 0.55))
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
    fontSize: 'clamp(42px, 5.6vw, 80px)',
    lineHeight: 1.05,
    fontWeight: 700,
    letterSpacing: '-0.02em',
  }

  const line = (grey: string, ref: React.RefObject<HTMLDivElement>, black?: React.ReactNode) => (
    <div style={{ position: 'relative', marginTop: '0.08em' }}>
      <div style={{ ...ts, color: '#c8c8c8' }}>{grey}</div>
      <div
        ref={ref}
        aria-hidden="true"
        style={{ ...ts, color: '#000', position: 'absolute', inset: 0, clipPath: 'inset(0 100% 0 0)' }}
      >
        {black ?? grey}
      </div>
    </div>
  )

  return (
    <section ref={sectionRef} className="bg-white" style={{ height: '480vh' }}>
      <div
        className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden"
        style={{ padding: '0 clamp(24px, 4vw, 64px)' }}
      >

        {/* Line 1 — first line has no marginTop */}
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

        {line(
          t('como servicio de suscripción', 'website design subscription'),
          o1
        )}

        {line(
          t('para tu negocio.', 'service for your business.'),
          o2
        )}

        {line(
          t('Una web que nunca deja de mejorar, sin barreras de entrada.', 'A website that never stops improving, with zero entry barriers.'),
          o3
        )}

        {/* CTA */}
        <div style={{ marginTop: 48 }}>
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

      </div>
    </section>
  )
}

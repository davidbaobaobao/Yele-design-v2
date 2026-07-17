'use client'

import { useRef, useEffect } from 'react'
import { useLang } from '@/context/LanguageContext'

export default function MissionSection() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef  = useRef<HTMLDivElement>(null)

  // Line wrapper refs — fontSize injected by JS
  const lw0 = useRef<HTMLDivElement>(null)
  const lw1 = useRef<HTMLDivElement>(null)
  const lw2 = useRef<HTMLDivElement>(null)

  // Off-screen spans for reliable text-width measurement (not inside overflow:hidden)
  const m0 = useRef<HTMLSpanElement>(null)
  const m1 = useRef<HTMLSpanElement>(null)
  const m2 = useRef<HTMLSpanElement>(null)

  // Overlay refs — clip-path animated
  const o0 = useRef<HTMLDivElement>(null)
  const o1 = useRef<HTMLDivElement>(null)
  const o2 = useRef<HTMLDivElement>(null)

  // Auto-fit each line to full viewport width
  useEffect(() => {
    function fitLines() {
      // clientWidth excludes scrollbar — matches 100vw block element width
      const vw = document.documentElement.clientWidth

      ;[
        [lw0.current, m0.current],
        [lw1.current, m1.current],
        [lw2.current, m2.current],
      ].forEach(([wrap, meas]) => {
        if (!wrap || !meas) return
        // getBoundingClientRect on a position:fixed off-screen span = true text width
        const textW = meas.getBoundingClientRect().width
        if (textW > 0) wrap.style.fontSize = `${Math.floor((vw / textW) * 100)}px`
      })

      if (stickyRef.current) stickyRef.current.style.visibility = 'visible'
    }

    fitLines()
    window.addEventListener('resize', fitLines)
    return () => window.removeEventListener('resize', fitLines)
  }, [])

  // Scroll-driven clip-path fill — starts as section enters viewport
  useEffect(() => {
    const overlays = [o0.current, o1.current, o2.current]

    function onScroll() {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
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

  const ts = {
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    lineHeight: 1.0,
    fontWeight: 700,
    letterSpacing: '-0.03em',
    whiteSpace: 'nowrap' as const,
  }

  // Measurement spans: same font properties at 100px, positioned off-screen
  const measStyle = {
    position: 'fixed' as const,
    left: '-9999px',
    top: '0',
    pointerEvents: 'none' as const,
    visibility: 'hidden' as const,
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    fontSize: '100px',
    fontWeight: 700,
    letterSpacing: '-0.03em',
    whiteSpace: 'nowrap' as const,
  }

  const l1 = t('Diseño web de última generación', 'We deliver state-of-the-art')
  const l2 = t('como servicio de suscripción', 'website design subscription')
  const l3 = t('para tu negocio.', 'service for your business.')

  return (
    <section ref={sectionRef} className="bg-white" style={{ height: '450vh' }}>

      {/* Off-screen measurement spans — fixed position, not inside overflow:hidden */}
      <span ref={m0} aria-hidden="true" style={measStyle}>{l1}</span>
      <span ref={m1} aria-hidden="true" style={measStyle}>{l2}</span>
      <span ref={m2} aria-hidden="true" style={measStyle}>{l3}</span>

      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden"
        style={{ visibility: 'hidden' }}
      >

        {/* Line 1 */}
        <div ref={lw0} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l1}</div>
          <div ref={o0} aria-hidden="true"
            style={{ ...ts, color: '#000', position: 'absolute', inset: 0, clipPath: 'inset(0 100% 0 0)' }}>
            {l1}
          </div>
        </div>

        {/* Line 2 */}
        <div ref={lw1} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l2}</div>
          <div ref={o1} aria-hidden="true"
            style={{ ...ts, color: '#000', position: 'absolute', inset: 0, clipPath: 'inset(0 100% 0 0)' }}>
            {l2}
          </div>
        </div>

        {/* Line 3 */}
        <div ref={lw2} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l3}</div>
          <div ref={o2} aria-hidden="true"
            style={{ ...ts, color: '#000', position: 'absolute', inset: 0, clipPath: 'inset(0 100% 0 0)' }}>
            {l3}
          </div>
        </div>

      </div>
    </section>
  )
}

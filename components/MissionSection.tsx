'use client'

import { useRef, useEffect } from 'react'
import { useLang } from '@/context/LanguageContext'

// All lines share the same font size.
// The longest line fills FILL fraction of the content area — not 100%,
// matching the reference image where text fills ~88% of the container width.
const LEFT_PAD = 48
const FILL     = 0.88

export default function MissionSection() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef  = useRef<HTMLDivElement>(null)

  const lw0 = useRef<HTMLDivElement>(null)
  const lw1 = useRef<HTMLDivElement>(null)
  const lw2 = useRef<HTMLDivElement>(null)
  const lw3 = useRef<HTMLDivElement>(null)

  const m0 = useRef<HTMLSpanElement>(null)
  const m1 = useRef<HTMLSpanElement>(null)
  const m2 = useRef<HTMLSpanElement>(null)
  const m3 = useRef<HTMLSpanElement>(null)

  const o0 = useRef<HTMLDivElement>(null)
  const o1 = useRef<HTMLDivElement>(null)
  const o2 = useRef<HTMLDivElement>(null)
  const o3 = useRef<HTMLDivElement>(null)

  // Fit: find the widest line at 100px, scale so it fills FILL × content width.
  // Every line uses the same resulting font size.
  useEffect(() => {
    function fitLines() {
      const contentW = document.documentElement.clientWidth - LEFT_PAD

      const widths = [m0, m1, m2, m3].map(
        ref => ref.current?.getBoundingClientRect().width ?? 0
      )
      const maxW = Math.max(...widths)
      if (maxW <= 0) return

      const fs = Math.floor((contentW * FILL / maxW) * 100)

      ;[lw0, lw1, lw2, lw3].forEach(ref => {
        if (ref.current) ref.current.style.fontSize = `${fs}px`
      })

      if (stickyRef.current) stickyRef.current.style.visibility = 'visible'
    }

    fitLines()
    window.addEventListener('resize', fitLines)
    return () => window.removeEventListener('resize', fitLines)
  }, [])

  // Scroll-driven clip-path fill — fast cascade
  useEffect(() => {
    const overlays = [o0.current, o1.current, o2.current, o3.current]

    function onScroll() {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = Math.min(1, Math.max(0, (vh - rect.top) / el.offsetHeight))

      overlays.forEach((overlay, i) => {
        if (!overlay) return
        const lp = Math.min(1, Math.max(0, (total - i * 0.12) / 0.18))
        overlay.style.clipPath = `inset(0 ${(1 - lp) * 100}% 0 0)`
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const ts = {
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    lineHeight: 1.05,
    fontWeight: 700,
    letterSpacing: '-0.025em',
    whiteSpace: 'nowrap' as const,
  }

  const measStyle = {
    position: 'fixed' as const,
    left: '-9999px',
    top: '0',
    pointerEvents: 'none' as const,
    visibility: 'hidden' as const,
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    fontSize: '100px',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    whiteSpace: 'nowrap' as const,
  }

  const l0 = t('Diseño web de última generación', 'We deliver state-of-the-art')
  const l1 = t('diseño web', 'website design')
  const l2 = t('como suscripción', 'subscription service')
  const l3 = t('para tu negocio.', 'for your business.')

  return (
    <section ref={sectionRef} className="bg-white" style={{ height: '450vh' }}>

      <span ref={m0} aria-hidden="true" style={measStyle}>{l0}</span>
      <span ref={m1} aria-hidden="true" style={measStyle}>{l1}</span>
      <span ref={m2} aria-hidden="true" style={measStyle}>{l2}</span>
      <span ref={m3} aria-hidden="true" style={measStyle}>{l3}</span>

      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden"
        style={{ paddingLeft: LEFT_PAD, visibility: 'hidden' }}
      >

        <div ref={lw0} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l0}</div>
          <div ref={o0} aria-hidden="true"
            style={{ ...ts, color: '#000', position: 'absolute', inset: 0, clipPath: 'inset(0 100% 0 0)' }}>
            {l0}
          </div>
        </div>

        <div ref={lw1} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l1}</div>
          <div ref={o1} aria-hidden="true"
            style={{ ...ts, color: '#000', position: 'absolute', inset: 0, clipPath: 'inset(0 100% 0 0)' }}>
            {l1}
          </div>
        </div>

        <div ref={lw2} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l2}</div>
          <div ref={o2} aria-hidden="true"
            style={{ ...ts, color: '#000', position: 'absolute', inset: 0, clipPath: 'inset(0 100% 0 0)' }}>
            {l2}
          </div>
        </div>

        <div ref={lw3} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l3}</div>
          <div ref={o3} aria-hidden="true"
            style={{ ...ts, color: '#000', position: 'absolute', inset: 0, clipPath: 'inset(0 100% 0 0)' }}>
            {l3}
          </div>
        </div>

      </div>
    </section>
  )
}

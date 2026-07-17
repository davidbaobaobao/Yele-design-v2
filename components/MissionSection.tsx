'use client'

import { useRef, useEffect } from 'react'
import { useLang } from '@/context/LanguageContext'

const LEFT_PAD = 48
const FILL     = 0.88

// 4 scroll-progress thresholds — one per line.
// progress = (vh - rect.top) / sectionHeight
// 0.22 ≈ when the section first pins (sticky starts).
// Each subsequent trigger is spaced ~1 viewport-height of scroll apart.
const TRIGGERS = [0.22, 0.44, 0.66, 0.88]

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

  // Shared font size — longest line drives the size, all lines use it
  useEffect(() => {
    function fitLines() {
      const contentW = document.documentElement.clientWidth - LEFT_PAD
      const widths = [m0, m1, m2, m3].map(r => r.current?.getBoundingClientRect().width ?? 0)
      const maxW = Math.max(...widths)
      if (maxW <= 0) return
      const fs = Math.floor((contentW * FILL / maxW) * 100)
      ;[lw0, lw1, lw2, lw3].forEach(r => {
        if (r.current) r.current.style.fontSize = `${fs}px`
      })
      if (stickyRef.current) stickyRef.current.style.visibility = 'visible'
    }
    fitLines()
    window.addEventListener('resize', fitLines)
    return () => window.removeEventListener('resize', fitLines)
  }, [])

  // Scroll-trigger animation:
  // Each line has its own threshold. Once crossed, a CSS transition plays
  // the fill from left to right at its own pace — does not depend on scroll speed.
  useEffect(() => {
    const overlays = [o0.current, o1.current, o2.current, o3.current]
    const fired = new Set<number>()

    function onScroll() {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = Math.min(1, Math.max(0, (vh - rect.top) / el.offsetHeight))

      TRIGGERS.forEach((threshold, i) => {
        if (fired.has(i) || total < threshold) return
        fired.add(i)
        const ov = overlays[i]
        if (!ov) return
        // Pin starting state, force reflow so browser registers it,
        // then enable transition and jump to the end state.
        ov.style.clipPath = 'inset(0 100% 0 0)'
        void ov.getBoundingClientRect()
        ov.style.transition = 'clip-path 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        ov.style.clipPath = 'inset(0 0% 0 0)'
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

  const overlayBase = {
    ...ts,
    color: '#000',
    position: 'absolute' as const,
    inset: 0,
    clipPath: 'inset(0 100% 0 0)',
    transition: 'none',   // no accidental transitions before trigger
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
          <div ref={o0} aria-hidden="true" style={overlayBase}>{l0}</div>
        </div>

        <div ref={lw1} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l1}</div>
          <div ref={o1} aria-hidden="true" style={overlayBase}>{l1}</div>
        </div>

        <div ref={lw2} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l2}</div>
          <div ref={o2} aria-hidden="true" style={overlayBase}>{l2}</div>
        </div>

        <div ref={lw3} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l3}</div>
          <div ref={o3} aria-hidden="true" style={overlayBase}>{l3}</div>
        </div>
      </div>

    </section>
  )
}

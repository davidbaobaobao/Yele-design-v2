'use client'

import { useRef, useEffect } from 'react'
import { useLang } from '@/context/LanguageContext'

const LEFT_PAD = 48
const FILL     = 0.78   // longest line fills 78% — leaves natural breathing room

// Triggers at 40/50/60/70% of section height — fires well before the end.
const TRIGGERS = [0.40, 0.50, 0.60, 0.70]

// Badge style: black pill, tight padding & letter-spacing
const BADGE: React.CSSProperties = {
  backgroundColor: '#000000',
  color: '#ffffff',
  padding: '0.04em 0.16em',
  letterSpacing: '-0.05em',
  display: 'inline-block',
  lineHeight: 1,
}

export default function MissionSection() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef  = useRef<HTMLDivElement>(null)

  const lw0 = useRef<HTMLDivElement>(null)
  const lw1 = useRef<HTMLDivElement>(null)
  const lw2 = useRef<HTMLDivElement>(null)
  const lw3 = useRef<HTMLDivElement>(null)

  // Off-screen measurement spans
  const m0 = useRef<HTMLSpanElement>(null)
  const m1 = useRef<HTMLSpanElement>(null)
  const m2 = useRef<HTMLSpanElement>(null)
  const m3 = useRef<HTMLSpanElement>(null)

  const o0 = useRef<HTMLDivElement>(null)
  const o1 = useRef<HTMLDivElement>(null)
  const o2 = useRef<HTMLDivElement>(null)
  const o3 = useRef<HTMLDivElement>(null)

  // Shared font size — sized so longest line fills FILL fraction of content width
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

  // 4 scroll triggers → each fires a self-playing CSS transition
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

  const ts: React.CSSProperties = {
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    lineHeight: 1.05,
    fontWeight: 700,
    letterSpacing: '-0.025em',
    whiteSpace: 'nowrap',
  }

  // Measurement span base — same font properties at 100px, off-screen
  const ms: React.CSSProperties = {
    position: 'fixed',
    left: '-9999px',
    top: '0',
    pointerEvents: 'none',
    visibility: 'hidden',
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    fontSize: '100px',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    whiteSpace: 'nowrap',
  }

  const overlayBase: React.CSSProperties = {
    ...ts,
    color: '#000',
    position: 'absolute',
    inset: 0,
    clipPath: 'inset(0 100% 0 0)',
    transition: 'none',
  }

  // Content strings
  const l0pre    = t('Diseño web de ', 'We deliver ')
  const l0tag    = t('última generación', 'state-of-the-art')
  const l1       = t('diseño web y marketing', 'website design & marketing')
  const l2       = t('como suscripción', 'subscription service')
  const l3       = t('para tu negocio.', 'for your business.')

  return (
    <section ref={sectionRef} className="bg-white" style={{ height: '200vh' }}>

      {/* m0 mirrors the badge structure so measured width matches the overlay */}
      <span ref={m0} aria-hidden="true" style={ms}>
        {l0pre}<span style={{ padding: '0.04em 0.16em', display: 'inline-block', letterSpacing: '-0.05em' }}>{l0tag}</span>
      </span>
      <span ref={m1} aria-hidden="true" style={ms}>{l1}</span>
      <span ref={m2} aria-hidden="true" style={ms}>{l2}</span>
      <span ref={m3} aria-hidden="true" style={ms}>{l3}</span>

      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden"
        style={{ paddingLeft: LEFT_PAD, visibility: 'hidden' }}
      >

        {/* Line 0: both grey and overlay use identical span layout so they align pixel-perfect.
            Grey: transparent bg, inherits grey. Black overlay: #000 bg, white text. */}
        <div ref={lw0} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>
            {l0pre}
            <span style={{ display: 'inline-block', letterSpacing: '-0.05em', padding: '0.04em 0.16em', lineHeight: 1 }}>
              {l0tag}
            </span>
          </div>
          <div ref={o0} aria-hidden="true" style={overlayBase}>
            {l0pre}
            <span style={BADGE}>{l0tag}</span>
          </div>
        </div>

        {/* Line 1 */}
        <div ref={lw1} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l1}</div>
          <div ref={o1} aria-hidden="true" style={overlayBase}>{l1}</div>
        </div>

        {/* Line 2 */}
        <div ref={lw2} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l2}</div>
          <div ref={o2} aria-hidden="true" style={overlayBase}>{l2}</div>
        </div>

        {/* Line 3 */}
        <div ref={lw3} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l3}</div>
          <div ref={o3} aria-hidden="true" style={overlayBase}>{l3}</div>
        </div>

      </div>
    </section>
  )
}

'use client'

import { useRef, useEffect } from 'react'
import { useLang } from '@/context/LanguageContext'

const LEFT_PAD = 48
const FILL     = 0.78
const N        = 4
const EDGE     = 5   // % — soft gradient transition width at mask edge

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

  const m0 = useRef<HTMLSpanElement>(null)
  const m1 = useRef<HTMLSpanElement>(null)
  const m2 = useRef<HTMLSpanElement>(null)
  const m3 = useRef<HTMLSpanElement>(null)

  const o0 = useRef<HTMLDivElement>(null)
  const o1 = useRef<HTMLDivElement>(null)
  const o2 = useRef<HTMLDivElement>(null)
  const o3 = useRef<HTMLDivElement>(null)

  // Auto-fit: all lines share the same font size so the longest fills FILL% of content width
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

  // Scroll-linked fill: directly tracks scroll position with no easing or autoplay.
  // Each line fills sequentially in reading order. Reversing scroll recedes the fill in reverse.
  useEffect(() => {
    const overlays = [o0.current, o1.current, o2.current, o3.current]
    let rafId: number | null = null

    function setMask(el: HTMLDivElement, lp: number) {
      // lp 0→1 moves the fill point from off-screen-left (-10%) to off-screen-right (110%).
      // EDGE% soft gradient zone gives an ink-bleed feel at the boundary.
      const pt = lp * 120 - 10
      const mask = `linear-gradient(to right, black ${pt - EDGE}%, transparent ${pt + EDGE}%)`
      el.style.setProperty('-webkit-mask-image', mask)
      el.style.setProperty('mask-image', mask)
    }

    function update() {
      rafId = null
      const sec = sectionRef.current
      if (!sec) return
      const scrolled = -sec.getBoundingClientRect().top
      const range    = sec.offsetHeight - window.innerHeight
      const p        = range > 0 ? Math.min(1, Math.max(0, scrolled / range)) : 0

      // Each line occupies 1/N of the total scroll range, sequentially
      overlays.forEach((ov, i) => {
        if (!ov) return
        setMask(ov, Math.min(1, Math.max(0, (p - i / N) * N)))
      })
    }

    function onScroll() {
      if (rafId === null) rafId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update() // set correct initial state on mount
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  const ts: React.CSSProperties = {
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    lineHeight: 1.05,
    fontWeight: 700,
    letterSpacing: '-0.025em',
    whiteSpace: 'nowrap',
  }

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

  // Overlay starts fully masked (transparent). JS sets the real mask on mount via update().
  const overlayBase: React.CSSProperties = {
    ...ts,
    color: '#000',
    position: 'absolute',
    inset: 0,
    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 100%)',
    maskImage: 'linear-gradient(to right, transparent 0%, transparent 100%)',
  }

  const l0pre = t('Diseño web de ', 'We deliver ')
  const l0tag  = t('última generación', 'state-of-the-art')
  const l1     = t('diseño web y marketing', 'website design & marketing')
  const l2     = t('como suscripción', 'subscription service')
  const l3     = t('para tu negocio.', 'for your business.')

  return (
    // 300vh = 200vh of scroll range for 4 lines × 50vh each; section releases after all lines fill
    <section ref={sectionRef} className="bg-white" style={{ height: '300vh' }}>

      {/* Off-screen measurement spans — m0 mirrors badge span so width matches overlay exactly */}
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
        {/* Spinning scroll-hint arrow */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="scroll-arrow-bounce">
            <svg
              className="scroll-arrow-spin"
              width="38" height="38" viewBox="0 0 24 24"
              fill="none" stroke="#e2482f" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
        {/* Line 0 */}
        <div ref={lw0} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>
            {l0pre}
            <span style={{ display: 'inline-block', letterSpacing: '-0.05em', padding: '0.04em 0.16em', lineHeight: 1 }}>
              {l0tag}
            </span>
          </div>
          <div ref={o0} aria-hidden="true" style={overlayBase}>
            {l0pre}<span style={BADGE}>{l0tag}</span>
          </div>
        </div>

        {/* Line 1 */}
        <div ref={lw1} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l1}</div>
          <div ref={o1} aria-hidden="true" style={overlayBase}>{l1}</div>
        </div>

        {/* Line 2 — orange on reveal */}
        <div ref={lw2} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l2}</div>
          <div ref={o2} aria-hidden="true" style={overlayBase}>
            <span className="we-subtitle-orange">{l2}</span>
          </div>
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

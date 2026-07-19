'use client'

import { useRef, useEffect } from 'react'
import { useLang } from '@/context/LanguageContext'

const LEFT_PAD = 48
const FILL     = 0.59
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

  // Responsive section height: fewer scrolls on mobile
  useEffect(() => {
    function setHeight() {
      if (sectionRef.current) {
        sectionRef.current.style.height = window.innerWidth < 768 ? '240vh' : '360vh'
      }
    }
    setHeight()
    window.addEventListener('resize', setHeight)
    return () => window.removeEventListener('resize', setHeight)
  }, [])

  // Auto-fit: all lines share the same font size so the longest fills FILL% of content width
  useEffect(() => {
    let rafId: number
    function fitLines() {
      const isMobile = window.innerWidth < 768
      const fill = isMobile ? 0.74 : FILL
      const contentW = document.documentElement.clientWidth - LEFT_PAD
      // Batch all reads before any writes to prevent forced reflow
      const widths = [m0, m1, m2, m3].map(r => r.current?.getBoundingClientRect().width ?? 0)
      const maxW = Math.max(...widths)
      if (maxW <= 0) return
      const fs = Math.floor((contentW * fill / maxW) * 100)
      ;[lw0, lw1, lw2, lw3].forEach(r => {
        if (r.current) r.current.style.fontSize = `${fs}px`
      })
      if (stickyRef.current) stickyRef.current.style.visibility = 'visible'
    }
    function scheduleFitLines() {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(fitLines)
    }
    scheduleFitLines()
    window.addEventListener('resize', scheduleFitLines)
    return () => {
      window.removeEventListener('resize', scheduleFitLines)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Scroll-linked fill
  useEffect(() => {
    const overlays = [o0.current, o1.current, o2.current, o3.current]
    let rafId: number | null = null

    function setMask(el: HTMLDivElement, lp: number) {
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

      overlays.forEach((ov, i) => {
        if (!ov) return
        setMask(ov, Math.min(1, Math.max(0, (p - i / N) * N)))
      })
    }

    function onScroll() {
      if (rafId === null) rafId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  const ts: React.CSSProperties = {
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    lineHeight: 1.15,
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

  const overlayBase: React.CSSProperties = {
    ...ts,
    color: '#000',
    position: 'absolute',
    inset: 0,
    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 100%)',
    maskImage: 'linear-gradient(to right, transparent 0%, transparent 100%)',
  }

  const l0 = t('Entregamos', 'We deliver')
  const l1 = t('Diseño web y Marketing', 'Website design & Marketing')
  const l2 = t('De última generación', 'State-of-the-art')
  const l3 = t('por suscripción', 'Subscription service')

  function scrollPast() {
    const sec = sectionRef.current
    if (!sec) return
    const bottom = sec.getBoundingClientRect().bottom + window.scrollY
    window.scrollTo({ top: bottom, behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} className="bg-white" style={{ height: '360vh' }}>

      {/* Off-screen measurement spans */}
      <span ref={m0} aria-hidden="true" style={ms}>{l0}</span>
      <span ref={m1} aria-hidden="true" style={ms}>{l1}</span>
      <span ref={m2} aria-hidden="true" style={ms}>
        <span style={{ padding: '0.04em 0.16em', display: 'inline-block', letterSpacing: '-0.05em' }}>{l2}</span>
      </span>
      <span ref={m3} aria-hidden="true" style={ms}>{l3}</span>

      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden"
        style={{ paddingLeft: LEFT_PAD, visibility: 'hidden' }}
      >
        {/* Scroll-hint arrow — click skips past the whole section */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <button onClick={scrollPast} aria-label="Scroll to next section" className="cursor-pointer bg-transparent border-0 p-0">
            <div className="scroll-arrow-wrap">
              <div className="scroll-arrow-spin">
                <svg width="52" height="52" viewBox="0 0 120 120" fill="none" stroke="#e2482f" strokeWidth="14" strokeLinecap="butt" strokeLinejoin="miter" aria-hidden="true">
                  <polyline points="30,42 60,78 90,42" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Line 0 — plain */}
        <div ref={lw0} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l0}</div>
          <div ref={o0} aria-hidden="true" style={overlayBase}>{l0}</div>
        </div>

        {/* Line 1 — plain */}
        <div ref={lw1} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l1}</div>
          <div ref={o1} aria-hidden="true" style={overlayBase}>{l1}</div>
        </div>

        {/* Line 2 — badge on reveal */}
        <div ref={lw2} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>
            <span style={{ display: 'inline-block', letterSpacing: '-0.05em', padding: '0.04em 0.16em', lineHeight: 1 }}>{l2}</span>
          </div>
          <div ref={o2} aria-hidden="true" style={overlayBase}>
            <span style={BADGE}>{l2}</span>
          </div>
        </div>

        {/* Line 3 — orange on reveal */}
        <div ref={lw3} style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ ...ts, color: '#c8c8c8' }}>{l3}</div>
          <div ref={o3} aria-hidden="true" style={overlayBase}>
            <span className="we-subtitle-orange">{l3}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

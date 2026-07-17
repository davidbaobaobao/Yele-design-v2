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

  // Grey base refs — measured for width fitting
  const lb0 = useRef<HTMLDivElement>(null)
  const lb1 = useRef<HTMLDivElement>(null)
  const lb2 = useRef<HTMLDivElement>(null)

  // Overlay refs — clip-path animated
  const o0 = useRef<HTMLDivElement>(null)
  const o1 = useRef<HTMLDivElement>(null)
  const o2 = useRef<HTMLDivElement>(null)

  // Auto-fit each line to fill the sticky container width
  useEffect(() => {
    function fitLines() {
      const sticky = stickyRef.current
      if (!sticky) return
      const cw = sticky.clientWidth

      const entries = [
        { wrap: lw0.current, base: lb0.current },
        { wrap: lw1.current, base: lb1.current },
        { wrap: lw2.current, base: lb2.current },
      ]

      entries.forEach(({ wrap, base }) => {
        if (!wrap || !base) return
        // Set sentinel size to measure, then scale proportionally
        wrap.style.fontSize = '100px'
        const sw = base.scrollWidth // forces sync reflow
        if (sw > 0) wrap.style.fontSize = `${Math.floor((cw / sw) * 100)}px`
      })

      sticky.style.visibility = 'visible'
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
      // 0 when section top enters viewport bottom, 1 when fully scrolled
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

  return (
    <section ref={sectionRef} className="bg-white" style={{ height: '450vh' }}>
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden"
        style={{ padding: '0 clamp(8px, 1.5vw, 24px)', visibility: 'hidden' }}
      >

        {/* Line 1 */}
        <div ref={lw0} style={{ position: 'relative', overflow: 'hidden' }}>
          <div ref={lb0} style={{ ...ts, color: '#c8c8c8' }}>
            {t('Diseño web de última generación', 'We deliver state-of-the-art')}
          </div>
          <div ref={o0} aria-hidden="true"
            style={{ ...ts, color: '#000', position: 'absolute', inset: 0, clipPath: 'inset(0 100% 0 0)' }}>
            {t('Diseño web de última generación', 'We deliver state-of-the-art')}
          </div>
        </div>

        {/* Line 2 */}
        <div ref={lw1} style={{ position: 'relative', overflow: 'hidden', marginTop: '0.04em' }}>
          <div ref={lb1} style={{ ...ts, color: '#c8c8c8' }}>
            {t('como servicio de suscripción', 'website design subscription')}
          </div>
          <div ref={o1} aria-hidden="true"
            style={{ ...ts, color: '#000', position: 'absolute', inset: 0, clipPath: 'inset(0 100% 0 0)' }}>
            {t('como servicio de suscripción', 'website design subscription')}
          </div>
        </div>

        {/* Line 3 */}
        <div ref={lw2} style={{ position: 'relative', overflow: 'hidden', marginTop: '0.04em' }}>
          <div ref={lb2} style={{ ...ts, color: '#c8c8c8' }}>
            {t('para tu negocio.', 'service for your business.')}
          </div>
          <div ref={o2} aria-hidden="true"
            style={{ ...ts, color: '#000', position: 'absolute', inset: 0, clipPath: 'inset(0 100% 0 0)' }}>
            {t('para tu negocio.', 'service for your business.')}
          </div>
        </div>

      </div>
    </section>
  )
}

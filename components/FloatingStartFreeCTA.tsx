'use client'

import { useEffect, useState } from 'react'
import { CTAButton } from '@/components/ui/cta-button'

// Visible only while scrollY is within [top of #tryforfree, bottom of
// #faq] — hidden on every section above TryForFreeSection and below FAQ.
// Looked up by id rather than refs since the two anchor sections live in
// unrelated components; same cross-component-anchor pattern Nav.tsx already
// uses (querySelectorAll on a data attribute) just with getElementById
// since there's exactly one of each here.
export default function FloatingStartFreeCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let startTop = 0
    let endBottom = 0

    const measure = () => {
      const start = document.getElementById('tryforfree')
      const end = document.getElementById('faq')
      if (start) {
        const r = start.getBoundingClientRect()
        startTop = r.top + window.scrollY
      }
      if (end) {
        const r = end.getBoundingClientRect()
        endBottom = r.top + window.scrollY + r.height
      }
    }

    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)

    const onScroll = () => {
      const y = window.scrollY
      setVisible(y >= startTop && y <= endBottom)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
      window.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [])

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!visible}
    >
      <CTAButton href="/start" variant="pink" className="shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
        Start for free
      </CTAButton>
    </div>
  )
}

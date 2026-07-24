'use client'

import { useRef } from 'react'
import { useReducedMotion, useScroll } from 'framer-motion'
import MissionFillText from './MissionFillText'

const STATEMENT =
  'Other agencies build your website and disappear. We build it — and stay. Design, content, maintenance and growth, handled forever.'

export default function Mission() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const label = (
    <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">Why Yele exists</p>
  )

  // ---- Reduced-motion fallback: fully static, no fill ----
  if (reduceMotion) {
    return (
      <section className="bg-[#0A0A0A] py-40 px-6">
        <div className="max-w-4xl mx-auto">
          {label}
          <p
            className="font-display font-bold text-bone leading-[1.15] tracking-tight max-w-[85vw] indent-[3ch]"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 4rem)' }}
          >
            Other agencies build your website and disappear. We build it —{' '}
            <span className="text-[#E8A05C]">and stay</span>. Design, content, maintenance and
            growth, handled forever.
          </p>
        </div>
      </section>
    )
  }

  // ---- Scroll-linked character fill ----
  return (
    <section ref={sectionRef} className="relative h-[180vh] md:h-[220vh] bg-[#0A0A0A]">
      <div className="sticky top-0 h-screen flex items-center px-6">
        <div className="max-w-4xl mx-auto w-full">
          {label}
          <MissionFillText text={STATEMENT} amberPhrase="and stay" scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </section>
  )
}

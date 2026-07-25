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

  // ---- Reduced-motion fallback: fully static, no fill ----
  if (reduceMotion) {
    return (
      <section className="bg-base min-h-screen flex items-center justify-center px-6">
        <p
          className="font-display font-bold text-ink leading-[1.3] tracking-tight max-w-[80vw] text-center"
          style={{ fontSize: 'clamp(1.75rem, 3vw, 3rem)' }}
        >
          Other agencies build your website and disappear. We build it —{' '}
          <span className="text-[#C97F3D]">and stay</span>. Design, content, maintenance and
          growth, handled forever.
        </p>
      </section>
    )
  }

  // ---- Scroll-linked character fill, pinned like hi-tide — the 160vh
  // outer height gives the fill real scroll distance to run through while
  // the inner sticky container holds the text centered on screen for the
  // whole section, so it reads as a short, tight section despite the fill
  // needing room. See MissionFillText for the fill math. ----
  return (
    <section ref={sectionRef} className="relative h-[160vh] bg-base">
      <div className="sticky top-0 h-screen flex items-center justify-center px-6 bg-base">
        <MissionFillText text={STATEMENT} amberPhrase="and stay" scrollYProgress={scrollYProgress} />
      </div>
    </section>
  )
}

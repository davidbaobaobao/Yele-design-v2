'use client'

import { useRef } from 'react'
import { useScroll } from 'framer-motion'
import MissionFillText from './MissionFillText'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const STATEMENT =
  'Other agencies build your website and disappear. We build it — and stay. Design, content, maintenance and growth, handled forever.'

export default function Mission() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useHydratedReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // ---- Reduced-motion fallback: fully static, no fill ----
  if (reduceMotion) {
    return (
      <section data-nav-dark className="bg-[#0A0A0A] min-h-[70vh] flex items-center justify-center py-16 px-6">
        <p
          className="font-display font-bold text-bone leading-[1.3] tracking-tight max-w-[80vw] text-center"
          style={{ fontSize: 'clamp(1.75rem, 3vw, 3rem)' }}
        >
          Other agencies build your website and disappear. We build it —{' '}
          <span className="text-[#C97F3D]">and stay</span>. Design, content, maintenance and
          growth, handled forever.
        </p>
      </section>
    )
  }

  // ---- Scroll-linked character fill, pinned like hi-tide — short and
  // tight: the 110vh outer height gives the fill a little real scroll
  // distance to run through while the inner sticky block (70vh, not full
  // screen) holds the text pinned only briefly before releasing straight
  // into What we do. See MissionFillText for the fill math — it's driven
  // by normalized scrollYProgress (0-1), so it adapts to this shorter
  // range automatically with no separate remap needed. ----
  return (
    <section ref={sectionRef} data-nav-dark className="relative h-[110vh] bg-[#0A0A0A]">
      <div className="sticky top-0 min-h-[70vh] flex items-center justify-center py-16 px-6 bg-[#0A0A0A]">
        <MissionFillText text={STATEMENT} amberPhrase="and stay" scrollYProgress={scrollYProgress} />
      </div>
    </section>
  )
}

'use client'

import { useReducedMotion } from 'framer-motion'
import MissionFillText from './MissionFillText'

const STATEMENT =
  'Other agencies build your website and disappear. We build it — and stay. Design, content, maintenance and growth, handled forever.'

export default function Mission() {
  const reduceMotion = useReducedMotion()

  const label = (
    <p className="font-mono text-xs uppercase tracking-widest text-muted mb-8">Why Yele exists</p>
  )

  // ---- Reduced-motion fallback: fully static, no fill ----
  if (reduceMotion) {
    return (
      <section className="bg-base py-40 px-6">
        <div className="max-w-[80vw] mx-auto">
          {label}
          <p
            className="font-display font-bold text-ink leading-[1.25] tracking-tight"
            style={{ fontSize: 'clamp(1.75rem, 3.2vw, 3.25rem)' }}
          >
            Other agencies build your website and disappear. We build it —{' '}
            <span className="text-[#C97F3D]">and stay</span>. Design, content, maintenance and
            growth, handled forever.
          </p>
        </div>
      </section>
    )
  }

  // ---- Scroll-linked per-word ink fill — text scrolls normally; each
  // word's own viewport position drives its color, not one section-level
  // progress (see MissionFillText). No sticky pin here on purpose.
  //
  // The gap above the statement (not the label) is deliberately huge
  // (~60-70vh): Hero's sticky pin releases right at this section's top
  // edge, so without real lead-in space the first line would already be
  // sitting above the "45% = fully filled" mark the very first frame it's
  // visible, showing solid ink instantly instead of entering from the
  // bottom. The label itself isn't part of the fill mechanic, so it stays
  // near the top with normal spacing. ----
  return (
    <section className="bg-base pt-24 md:pt-32 pb-40 md:pb-56 px-6">
      <div className="max-w-[80vw] mx-auto">
        {label}
        <div className="mt-[80vh] md:mt-[85vh]">
          <MissionFillText text={STATEMENT} amberPhrase="and stay" />
        </div>
      </div>
    </section>
  )
}

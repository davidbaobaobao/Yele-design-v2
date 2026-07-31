'use client'

import { useRef } from 'react'
import { useScroll } from 'framer-motion'
import TextReveal from './TextReveal'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const STATEMENT =
  "Getting a professional website shouldn't mean big bills, long waits or being left on your own. We design, build and run yours for one flat monthly price — live in a week, no upfront cost, cancel anytime. You run your business; we take care of the website."
const HIGHLIGHT = 'we take care of the website'

// Matches the other sections' own header size/weight/leading (e.g. WhyYele,
// BeyondWebsite: font-display, no explicit weight utility — the font-display
// face only ships 700/800/900, so it renders bold by nearest-weight
// fallback anyway — leading-tight, clamp(1.75rem,2.5vw,2.5rem)). Centered
// now (was left-aligned), so the old left-align-only first-line text-indent
// is gone too.
const textClass = 'font-display text-center leading-tight max-w-4xl mx-auto text-[clamp(1.75rem,2.5vw,2.5rem)]'
const sectionClass = 'relative bg-[#0D0E12] min-h-[65vh] flex items-center px-6 py-10'
// ~3 lines of empty space after the text at this size/leading (2.5rem *
// 1.25 leading * 3 lines), before the next section.
const spacerStyle = { height: '9.375rem' }
// Blends the hero video's dominant edge (deep blue/purple twilight) down
// into the mission's own dark bg over ~240px, so the boundary between them
// reads as a gradient rather than a hard line.
const topBlendStyle = { background: 'linear-gradient(to bottom, #1A1B2E 0%, #0D0E12 100%)', height: '240px' }

export default function Mission() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useHydratedReducedMotion()

  // Not pinned — the reveal is driven purely by the section's own position
  // as it scrolls through the viewport like a normal paragraph (hi-tide
  // style): progress 0 when its top is 90% down the viewport (just
  // entering), 1 when its top reaches 35% down (comfortably on screen).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.9', 'start 0.35'],
  })

  // ---- Reduced-motion fallback: fully static, no reveal animation ----
  if (reduceMotion) {
    return (
      <section data-nav-dark className={sectionClass}>
        <div className="absolute top-0 inset-x-0 pointer-events-none" style={topBlendStyle} aria-hidden="true" />
        <div className="w-full">
          <p className={textClass} style={{ color: '#F2F0EB' }}>
            {STATEMENT.split(HIGHLIGHT).map((chunk, i, arr) => (
              <span key={i}>
                {chunk}
                {i < arr.length - 1 && <span style={{ color: '#D46FC8' }}>{HIGHLIGHT}</span>}
              </span>
            ))}
          </p>
          <div aria-hidden="true" style={spacerStyle} />
        </div>
      </section>
    )
  }

  // ---- Scroll-linked word-by-word reveal (custom build standing in for
  // Skiper UI's skiper70, a paid component we don't have a license for —
  // see TextReveal.tsx) — a short, tight band right after the hero, not a
  // pinned/full-screen section. Driven by normalized scrollYProgress (0-1)
  // from the offset above, so it adapts automatically to this non-pinned
  // scroll pattern. ----
  return (
    <section ref={sectionRef} data-nav-dark className={sectionClass}>
      <div className="absolute top-0 inset-x-0 pointer-events-none" style={topBlendStyle} aria-hidden="true" />
      <div className="w-full">
        <TextReveal highlight={HIGHLIGHT} scrollYProgress={scrollYProgress} className={textClass}>
          {STATEMENT}
        </TextReveal>
        <div aria-hidden="true" style={spacerStyle} />
      </div>
    </section>
  )
}

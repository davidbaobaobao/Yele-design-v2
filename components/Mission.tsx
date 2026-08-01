'use client'

import { useRef } from 'react'
import { useScroll } from 'framer-motion'
import TextReveal from './TextReveal'
import { TextGradient } from '@/components/ui/text-gradient'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

// Three explicit lines, joined with a standalone " \n " token — split(' ')
// turns that into an isolated "\n" word TextReveal renders as a <br/>, so
// the scroll reveal sweeps continuously across all three lines in one pass
// instead of needing three separate reveal instances.
const STATEMENT_LINES = [
  'In Yele, we design, build and maintain your website for one monthly subscription price. Live in a week, no upfront cost, cancel anytime.',
  "Getting a professional website shouldn't mean big bills, long waits or being left on your own.",
  'You run your business; we take care of the website.',
]
const STATEMENT = STATEMENT_LINES.join(' \n ')

// Matches the other sections' own header size/weight/leading, one step up
// from the previous clamp (1.75rem,2.5vw,2.5rem). Centered as a block
// (mx-auto) but the text itself stays left-justified within it. max-w-5xl
// (was 4xl) — a touch wider, while staying narrower than WhatWeDo's first
// card just below it.
const textClass = 'font-display text-left leading-tight max-w-5xl mx-auto text-[clamp(2rem,2.75vw,2.75rem)]'
// py-24 both top and bottom — was pt-10/pb-32, too tight against Hero above
// and WhatWeDo below.
const sectionClass = 'relative bg-[#0D0E12] min-h-[65vh] flex items-center px-6 py-24'
// Blends the hero video's dominant edge (deep blue/purple twilight) down
// into the mission's own dark bg over ~240px, so the boundary between them
// reads as a gradient rather than a hard line.
const topBlendStyle = { background: 'linear-gradient(to bottom, #1A1B2E 0%, #0D0E12 100%)', height: '240px' }

export default function Mission() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useHydratedReducedMotion()

  // Not pinned — the reveal is driven purely by the section's own position
  // as it scrolls through the viewport like a normal paragraph (hi-tide
  // style): progress 0 when its top is 95% down the viewport (just
  // entering), 1 when its top reaches 10% down. Widened from the previous
  // 0.9->0.35 so the whole reveal spans more real scroll distance — combined
  // with TextReveal's own REVEAL_START delay, the fill both starts later and
  // takes appreciably longer.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.95', 'start 0.1'],
  })

  // ---- Reduced-motion fallback: fully static, no reveal animation ----
  if (reduceMotion) {
    return (
      <section data-nav-dark className={sectionClass}>
        <div className="absolute top-0 inset-x-0 pointer-events-none" style={topBlendStyle} aria-hidden="true" />
        <div className="w-full">
          <p className={textClass} style={{ color: '#F2F0EB' }}>
            {STATEMENT_LINES.map((line, i) => (
              <span key={i}>
                {/* Line 0 is the only one containing "subscription" — split
                    around it once so the reduced-motion fallback still shows
                    the same highlighted word as the animated reveal below. */}
                {i === 0 ? (
                  <>
                    {line.split('subscription')[0]}
                    <TextGradient as="span">subscription</TextGradient>
                    {line.split('subscription')[1]}
                  </>
                ) : (
                  line
                )}
                {i < STATEMENT_LINES.length - 1 && <br />}
              </span>
            ))}
          </p>
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
        <TextReveal scrollYProgress={scrollYProgress} className={textClass} highlight="subscription">
          {STATEMENT}
        </TextReveal>
      </div>
    </section>
  )
}

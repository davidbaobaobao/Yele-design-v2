'use client'

import { useRef } from 'react'
import { useScroll } from 'framer-motion'
import MissionFillText from './MissionFillText'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const STATEMENT =
  'Other agencies build your website and disappear. We build it — and stay. Design, content, maintenance and growth, handled forever.'

// Matches the other sections' own header size/weight/leading (e.g. WhyYele,
// BeyondWebsite: font-display, no explicit weight utility — the font-display
// face only ships 700/800/900, so it renders bold by nearest-weight
// fallback anyway — leading-tight, clamp(1.75rem,2.5vw,2.5rem)).
const textClass = 'font-display text-left leading-tight max-w-[85%] text-[clamp(1.75rem,2.5vw,2.5rem)]'
const textIndentStyle = { textIndent: '3ch' }
const sectionClass = 'relative bg-[#0D0E12] min-h-[65vh] flex items-center px-6 py-10'
// ~3 lines of empty space after the text at this size/leading (2.5rem *
// 1.25 leading * 3 lines), before the next section.
const spacerStyle = { height: '9.375rem' }
// Blends the hero video's dominant edge (deep blue/purple twilight) down
// into the mission's own dark bg over 200px, so the boundary between them
// reads as a gradient rather than a hard line.
const topBlendStyle = { background: 'linear-gradient(to bottom, #1A1B2E 0%, #0D0E12 100%)', height: '200px' }

export default function Mission() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useHydratedReducedMotion()

  // Not pinned — the fill is driven purely by the section's own position as
  // it scrolls through the viewport like a normal paragraph (hi-tide style):
  // progress 0 when its top is 90% down the viewport (just entering), 1 when
  // its top reaches 35% down (comfortably on screen).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.9', 'start 0.35'],
  })

  // ---- Reduced-motion fallback: fully static, no fill ----
  if (reduceMotion) {
    return (
      <section data-nav-dark className={sectionClass}>
        <div className="absolute top-0 inset-x-0 pointer-events-none" style={topBlendStyle} aria-hidden="true" />
        <div className="w-full">
          <p className={textClass} style={{ ...textIndentStyle, color: '#F2F0EB' }}>
            Other agencies build your website and disappear. We build it —{' '}
            <span className="text-[#C97F3D]">and stay</span>. Design, content, maintenance and
            growth, handled forever.
          </p>
          <div aria-hidden="true" style={spacerStyle} />
        </div>
      </section>
    )
  }

  // ---- Scroll-linked character fill — a short, tight band right after the
  // hero, not a pinned/full-screen section. See MissionFillText for the fill
  // math; it's driven by normalized scrollYProgress (0-1) from the offset
  // above, so it adapts automatically to this non-pinned scroll pattern. ----
  return (
    <section ref={sectionRef} data-nav-dark className={sectionClass}>
      <div className="absolute top-0 inset-x-0 pointer-events-none" style={topBlendStyle} aria-hidden="true" />
      <div className="w-full">
        <MissionFillText
          text={STATEMENT}
          amberPhrase="and stay"
          scrollYProgress={scrollYProgress}
          className={textClass}
          style={textIndentStyle}
        />
        <div aria-hidden="true" style={spacerStyle} />
      </div>
    </section>
  )
}

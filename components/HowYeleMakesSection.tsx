'use client'

import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { TypewriterWord } from '@/components/ui/typewriter-word'

const WORDS = ['Professional?', 'Unforgettable?', 'Intuitive?', 'Standout?', 'Credible?', 'Welcoming?', 'Reliable?']

// Short (not full-screen) text beat right after TryForFreeSection — same
// #0D0E12 as that video section, and the exact same heading typography as
// WhyYele's own title (font-display, leading-tight, max-w-4xl,
// text-[clamp(1.5rem,2.6vw,2.75rem)], left-aligned) so the two read in the
// same voice. Reuses the hero's own TypewriterWord component for the
// rotating pink word, unchanged.
export default function HowYeleMakesSection() {
  const reduceMotion = !!useHydratedReducedMotion()

  return (
    <section data-nav-dark className="py-24 md:py-32 px-6" style={{ backgroundColor: '#0D0E12' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display leading-tight max-w-4xl text-[clamp(1.5rem,2.6vw,2.75rem)]">
          <span className="sr-only">
            How Yele can make your web professional, unforgettable, intuitive, standout, credible, welcoming, reliable.
          </span>
          <span aria-hidden="true" style={{ color: '#F2F0EB' }}>
            How Yele can make your web
            <br />
            <TypewriterWord words={WORDS} reduceMotion={reduceMotion} />
          </span>
        </h2>
      </div>
    </section>
  )
}

'use client'

import { useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { TypewriterWord } from '@/components/ui/typewriter-word'

const WORDS = ['Professional?', 'Unforgettable?', 'Intuitive?', 'Standout?', 'Credible?', 'Welcoming?', 'Reliable?']

// Spacious (not full-screen, but generously padded) text beat right after
// TryForFreeSection — same #0D0E12 as that video section. Centered,
// hero-size type (same clamp as Hero's own headline) rather than WhyYele's
// smaller title scale. Reuses the hero's own TypewriterWord component for
// the rotating pink word, and the same bottom scroll-bounce chevron pattern
// as Hero (heroScrollBounce keyframe in globals.css).
export default function HowYeleMakesSection() {
  const reduceMotion = !!useHydratedReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} data-nav-dark className="py-40 md:py-56 px-6" style={{ backgroundColor: '#0D0E12' }}>
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <h2 className="font-display leading-tight" style={{ fontSize: 'clamp(1.6rem, 3.75vw, 3.75rem)' }}>
          <span className="sr-only">
            How Yele can make your website professional, unforgettable, intuitive, standout, credible, welcoming, reliable.
          </span>
          <span aria-hidden="true" style={{ color: '#F2F0EB' }}>
            How Yele can make your website
            <br />
            <TypewriterWord words={WORDS} reduceMotion={reduceMotion} />
          </span>
        </h2>

        <button
          type="button"
          onClick={() => sectionRef.current?.nextElementSibling?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="mt-16 text-white/70 hover:text-white transition-colors cursor-pointer focus-visible:outline-none motion-safe:animate-[heroScrollBounce_1.5s_ease-in-out_infinite]"
          aria-label="Scroll to next section"
        >
          <ChevronDown size={28} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

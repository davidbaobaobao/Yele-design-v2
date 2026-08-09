'use client'

import { useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

// Pure breathing-room beat between TryForFreeSection and the next full-
// screen section — was centered text (moved to WhatWeDo.tsx's new title,
// see AgencyIntro-style "at your reach" copy there) — now just a tall,
// quiet gap with a bouncing down-arrow so the page doesn't feel like it
// jump-cuts from one full-screen section straight into the next. Same
// #0D0E12 as both neighbors so there's no seam.
const CHEVRONS = [0, 1, 2]

export default function ScrollDownSpacer() {
  const reduceMotion = !!useHydratedReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const scrollToNext = () => {
    sectionRef.current?.nextElementSibling?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      data-nav-dark
      className="min-h-[80vh] flex items-center justify-center"
      style={{ backgroundColor: '#0D0E12' }}
    >
      <button
        type="button"
        onClick={scrollToNext}
        className="flex flex-col items-center gap-1 py-4 px-8 cursor-pointer focus-visible:outline-none"
        aria-label="Scroll to next section"
      >
        {CHEVRONS.map(i => (
          <motion.span
            key={i}
            animate={reduceMotion ? {} : { opacity: [0.15, 0.6, 0.15], y: [-4, 6, -4] }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }
            }
            style={reduceMotion ? { opacity: 0.4 } : undefined}
          >
            <ChevronDown size={26} style={{ color: 'rgba(255,255,255,0.6)' }} aria-hidden="true" />
          </motion.span>
        ))}
      </button>
    </section>
  )
}

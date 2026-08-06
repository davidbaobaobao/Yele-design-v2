'use client'

import { motion } from 'framer-motion'
import { TextGradient } from '@/components/ui/text-gradient'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

// Short transition beat between WhyYele and the work carousel — same dark
// bg as both neighbors (#0D0E12) so it reads as continuous, not a section
// break. Typography deliberately matches WhyYele's own headline exactly
// (font-display, leading-tight, max-w-4xl, text-[clamp(1.5rem,2.6vw,2.75rem)],
// left-aligned, one continuous paragraph with an inline pink TextGradient
// accent) rather than the old big-heading/small-subtext/centered-pink
// layout, so the two read as one consistent voice back to back. The pink
// phrase keeps a subtle pulse (opacity 1 -> 0.55 -> 1, 2.4s loop, same
// treatment as StatsBold's "∞") but at the identical size as the rest of
// the line — no separate type scale.
export default function AgencyIntro() {
  const reduceMotion = !!useHydratedReducedMotion()

  return (
    <section data-nav-dark className="bg-[#0D0E12] py-16 md:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display leading-tight max-w-4xl text-[clamp(1.5rem,2.6vw,2.75rem)]">
          <span style={{ color: '#F2F0EB' }}>
            An entire agency in your hands. All the web design services you need,
            in one monthly fee.{' '}
          </span>
          <motion.span
            animate={reduceMotion ? {} : { opacity: [1, 0.55, 1] }}
            transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <TextGradient as="span">From $99/mo.</TextGradient>
          </motion.span>
        </h2>
      </div>
    </section>
  )
}

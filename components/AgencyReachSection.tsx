'use client'

import { motion } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { TextGradient } from '@/components/ui/text-gradient'

// Breathing-room beat between TryForFreeSection and HowYeleAnimations —
// not full-screen, just centered text with generous padding. Same
// #0D0E12 as both neighbors so there's no seam.
export default function AgencyReachSection() {
  const reduceMotion = !!useHydratedReducedMotion()

  return (
    <section data-nav-dark className="py-32 md:py-40 px-6 text-center" style={{ backgroundColor: '#0D0E12' }}>
      <h2 className="font-display leading-tight max-w-3xl mx-auto" style={{ fontSize: 'clamp(1.6rem, 3.75vw, 3.75rem)', color: '#F2F0EB' }}>
        All the design resources of an Agency
        <br />
        <motion.span
          animate={reduceMotion ? {} : { opacity: [1, 0.55, 1] }}
          transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <TextGradient as="span">at your reach.</TextGradient>
        </motion.span>
      </h2>
    </section>
  )
}

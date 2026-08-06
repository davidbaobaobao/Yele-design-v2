'use client'

import { motion } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

// Short transition beat between WhyYele and the work carousel — same dark
// bg as both neighbors (#0D0E12) so it reads as continuous, not a section
// break. "From $99/mo" pulses the same way StatsBold's "∞" does (opacity
// 1 -> 0.55 -> 1, 2.4s loop) — the established "soft pulse" treatment for a
// pink accent on this site, not a blurred glow.
export default function AgencyIntro() {
  const reduceMotion = !!useHydratedReducedMotion()

  return (
    <section data-nav-dark className="py-20 px-6 text-center" style={{ backgroundColor: '#0D0E12' }}>
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display font-semibold text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight text-bone">
          An entire Agency in your hands.
        </h2>
        <p className="font-body mt-4 text-base md:text-lg" style={{ color: 'rgba(242, 240, 235, 0.6)' }}>
          All the web design services you need, in one monthly fee.
        </p>
        <motion.p
          className="font-display font-semibold text-xl md:text-2xl mt-5"
          style={{ color: '#D46FC8' }}
          animate={reduceMotion ? {} : { opacity: [1, 0.55, 1] }}
          transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          From $99/mo
        </motion.p>
      </div>
    </section>
  )
}

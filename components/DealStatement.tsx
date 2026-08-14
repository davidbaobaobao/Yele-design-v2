'use client'

import { motion } from 'framer-motion'
import { TextGradient } from '@/components/ui/text-gradient'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

// Fixed dark section — no fade of its own anymore. It sits right after
// LatestFeaturedWork, which now owns the white->black flip shared with
// BeyondWebsite and StatsBold (see DealFadeContext); by the time a visitor
// scrolls this far the page is already dark, so this section just matches
// that state permanently instead of re-deriving its own trigger.
const BG = '#0D0E12'
const TEXT = '#FFFFFF'

export default function DealStatement() {
  const reduceMotion = !!useHydratedReducedMotion()

  return (
    <section data-nav-dark className="relative py-32 px-6" style={{ backgroundColor: BG }}>
      <motion.p
        className="font-display text-left max-w-4xl mx-auto leading-tight text-[clamp(1.75rem,3vw,3rem)]"
        style={{ color: TEXT }}
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
      >
        Here&apos;s the <TextGradient as="span">deal</TextGradient>:
        <br />
        we become your website team. We design it, fill
        it with content, keep it fast and secure — <TextGradient as="span">month after month</TextGradient>,
        for one flat price.
        <br />
        You run your business. We run the website.
      </motion.p>
    </section>
  )
}

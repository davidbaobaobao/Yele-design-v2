'use client'

import { motion, type Transition, type Variants } from 'framer-motion'
import { TextGradient } from '@/components/ui/text-gradient'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

// Fixed dark section — no fade of its own anymore. It sits right after
// LatestFeaturedWork, which now owns the white->black flip shared with
// BeyondWebsite and StatsBold (see DealFadeContext); by the time a visitor
// scrolls this far the page is already dark, so this section just matches
// that state permanently instead of re-deriving its own trigger.
const BG = '#0D0E12'
const TEXT = '#FFFFFF'

// Each phrase is its own block-level line so the stagger reads as "one line
// at a time" regardless of viewport width, rather than relying on the
// browser's own text-wrap points. staggerChildren on the container is what
// spaces the per-line reveals out; each line's own transition controls its
// individual fade+rise.
const LINE_TRANSITION: Transition = { duration: 0.45, ease: 'easeOut' }
const LINE_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: LINE_TRANSITION },
}
const CONTAINER_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export default function DealStatement() {
  const reduceMotion = !!useHydratedReducedMotion()

  const lineClass = 'font-display text-left leading-tight text-[clamp(1.75rem,3vw,3rem)]'

  if (reduceMotion) {
    return (
      <section data-nav-dark className="relative py-32 px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-4xl mx-auto" style={{ color: TEXT }}>
          <p className={lineClass}>
            Here&apos;s the <TextGradient as="span">deal</TextGradient>:
          </p>
          <p className={lineClass}>we become your website team.</p>
          <p className={lineClass}>We design it, fill it with content, keep it fast and secure —</p>
          <p className={lineClass}>
            <TextGradient as="span">month after month</TextGradient>, for one flat price.
          </p>
          <p className={lineClass}>You run your business. We run the website.</p>
        </div>
      </section>
    )
  }

  return (
    <section data-nav-dark className="relative py-32 px-6" style={{ backgroundColor: BG }}>
      <motion.div
        className="max-w-4xl mx-auto"
        style={{ color: TEXT }}
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.p className={lineClass} variants={LINE_VARIANTS}>
          Here&apos;s the <TextGradient as="span">deal</TextGradient>:
        </motion.p>
        <motion.p className={lineClass} variants={LINE_VARIANTS}>
          we become your website team.
        </motion.p>
        <motion.p className={lineClass} variants={LINE_VARIANTS}>
          We design it, fill it with content, keep it fast and secure —
        </motion.p>
        <motion.p className={lineClass} variants={LINE_VARIANTS}>
          <TextGradient as="span">month after month</TextGradient>, for one flat price.
        </motion.p>
        <motion.p className={lineClass} variants={LINE_VARIANTS}>
          You run your business. We run the website.
        </motion.p>
      </motion.div>
    </section>
  )
}

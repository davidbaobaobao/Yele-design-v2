'use client'

import { motion } from 'framer-motion'
import { TextGradient } from '@/components/ui/text-gradient'

// White bg, ink text — seamless from BeyondWebsite (also white) now that
// it's the section right before this one.
export default function DealStatement() {
  return (
    <section className="py-32 px-6" style={{ backgroundColor: '#FFFFFF' }}>
      <motion.p
        className="font-display text-left max-w-4xl mx-auto leading-tight text-[clamp(1.75rem,3vw,3rem)]"
        style={{ color: '#16161A' }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        Here&apos;s the <TextGradient as="span">deal</TextGradient>:
        <br />
        we become your website team. We design it, fill
        it with content, keep it fast and secure, and market it — <TextGradient as="span">month after month</TextGradient>,
        for one flat price.
        <br />
        You run your business. We run the website.
      </motion.p>
    </section>
  )
}

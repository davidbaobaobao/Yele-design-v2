'use client'

import { motion } from 'framer-motion'

const STATEMENT =
  "Here's the deal: we become your website team. We design it, fill it with content, keep it fast and secure, and market it — month after month, for one flat price. You run your business. We run the website."

// White bg — continues straight from ContentShowcase, which ends on the same
// #FFFFFF, so the boundary between them reads as one continuous surface.
export default function DealStatement() {
  return (
    <section className="py-32 px-6" style={{ backgroundColor: '#FFFFFF' }}>
      <motion.p
        className="font-display text-center leading-tight max-w-4xl mx-auto text-[clamp(1.75rem,3vw,3rem)]"
        style={{ color: '#16161A' }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {STATEMENT}
      </motion.p>
    </section>
  )
}

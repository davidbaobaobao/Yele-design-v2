'use client'

import { motion } from 'framer-motion'

export default function Mission() {
  return (
    <section className="bg-base py-32 md:py-48 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="font-mono text-xs uppercase tracking-widest text-muted mb-8"
        >
          Why Yele exists
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="font-display font-bold text-ink leading-[1.15] tracking-tight"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 3.5rem)' }}
        >
          Other agencies build your website and disappear. We build it — and stay. Design, content, maintenance and growth, handled forever.
        </motion.h2>
      </div>
    </section>
  )
}

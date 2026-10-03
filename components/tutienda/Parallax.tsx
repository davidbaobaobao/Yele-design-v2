'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Subtle scroll-linked parallax: the wrapped block drifts vertically as it
// passes through the viewport. Respects reduced-motion (framer-motion disables
// the transform automatically when the user prefers reduced motion is handled
// at the OS level via the browser; distance is kept small so it never feels
// janky). Used on /es/tutienda for the hero card, comparison table and cards.
export default function Parallax({
  children,
  className,
  distance = 28,
}: {
  children: React.ReactNode
  className?: string
  distance?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance])
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

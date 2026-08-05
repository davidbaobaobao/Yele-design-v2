'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, type Transition } from 'framer-motion'
import { TextGradient } from '@/components/ui/text-gradient'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

// Same one-shot ~500ms flip mechanic as HowWeWork (see that file's own
// comment for the full rationale): loads LIGHT (white bg, ink text) and
// flips to DARK once this section's own paragraph crosses the top of the
// viewport, reversible on scroll up. Reports through the shared
// 'nav:fademode' event so the nav's text color tracks whichever fading
// section is currently on screen.
const DARK_BG = '#0D0E12'
const LIGHT_BG = '#FFFFFF'
const DARK_TEXT = '#FFFFFF'
const LIGHT_TEXT = '#16161A'
const FLIP_TRANSITION: Transition = { duration: 0.5, ease: 'easeInOut' }

export default function DealStatement() {
  const reduceMotion = !!useHydratedReducedMotion()
  const textRef = useRef<HTMLParagraphElement>(null)
  const textPageTopRef = useRef(0)
  const [pastThreshold, setPastThreshold] = useState(false)

  // Anchored on the paragraph itself (its first line is "Here's the
  // deal:") — re-measured on resize/load/body mutation since content above
  // this section can still be reflowing the page after mount.
  useEffect(() => {
    if (reduceMotion) return
    const measure = () => {
      const el = textRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      textPageTopRef.current = rect.top + window.scrollY
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
      ro.disconnect()
    }
  }, [reduceMotion])

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', v => {
    if (reduceMotion) return
    const past = v >= textPageTopRef.current
    setPastThreshold(prev => (prev === past ? prev : past))
  })

  const bgColor = pastThreshold ? DARK_BG : LIGHT_BG
  const textColor = pastThreshold ? DARK_TEXT : LIGHT_TEXT

  useEffect(() => {
    if (reduceMotion) return
    window.dispatchEvent(new CustomEvent('nav:fademode', { detail: { dark: pastThreshold } }))
  }, [pastThreshold, reduceMotion])

  if (reduceMotion) {
    return (
      <section className="py-32 px-6" style={{ backgroundColor: LIGHT_BG }}>
        <p
          className="font-display text-left max-w-4xl mx-auto leading-tight text-[clamp(1.75rem,3vw,3rem)]"
          style={{ color: LIGHT_TEXT }}
        >
          Here&apos;s the <TextGradient as="span">deal</TextGradient>:
          <br />
          we become your website team. We design it, fill
          it with content, keep it fast and secure, and market it — <TextGradient as="span">month after month</TextGradient>,
          for one flat price.
          <br />
          You run your business. We run the website.
        </p>
      </section>
    )
  }

  return (
    <section data-nav-fade className="relative py-32 px-6">
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ backgroundColor: bgColor }}
        transition={FLIP_TRANSITION}
        aria-hidden="true"
      />
      <motion.p
        ref={textRef}
        className="font-display text-left max-w-4xl mx-auto leading-tight text-[clamp(1.75rem,3vw,3rem)]"
        animate={{ color: textColor }}
        transition={FLIP_TRANSITION}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
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

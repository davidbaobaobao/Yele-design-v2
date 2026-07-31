'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

// Adapted from the "Text Loop" component (21st.dev / motion) — static text
// followed by a rotating word inside a soft wash box with a blinking cursor.
// Uses plain `motion.span` + AnimatePresence rather than LazyMotion's `m`
// component: LazyMotion's value is trimming the animation bundle when it's
// the only motion usage on a page, but this app already loads the full
// `framer-motion` API everywhere else, so there's nothing left to trim here
// — matching the rest of the codebase's own idiom keeps this consistent.

interface TextLoopProps {
  staticText?: string
  rotatingTexts: string[]
  interval?: number
  className?: string
  staticTextClassName?: string
  rotatingTextClassName?: string
  cursorClassName?: string
  boxClassName?: string
}

export function TextLoop({
  staticText,
  rotatingTexts,
  interval = 2000,
  className,
  staticTextClassName,
  rotatingTextClassName,
  cursorClassName,
  boxClassName,
}: TextLoopProps) {
  const [index, setIndex] = useState(0)
  const reduceMotion = !!useHydratedReducedMotion()

  useEffect(() => {
    if (reduceMotion) return
    const id = window.setInterval(() => setIndex(i => (i + 1) % rotatingTexts.length), interval)
    return () => window.clearInterval(id)
  }, [interval, rotatingTexts.length, reduceMotion])

  const word = rotatingTexts[index]

  return (
    <span className={cn('inline-flex items-center flex-wrap gap-x-3 gap-y-1', className)}>
      {staticText && <span className={staticTextClassName}>{staticText}</span>}
      <motion.span
        layout
        transition={{ layout: { duration: 0.35, ease: 'easeInOut' } }}
        className={cn(
          'relative inline-flex items-center overflow-hidden rounded-xl px-3 py-1',
          boxClassName
        )}
        style={{ backgroundColor: 'rgba(212, 111, 200, 0.12)' }}
      >
        {reduceMotion ? (
          <span className={rotatingTextClassName}>{word}</span>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className={cn('inline-block', rotatingTextClassName)}
            >
              {word}
            </motion.span>
          </AnimatePresence>
        )}
        {!reduceMotion && (
          <span
            aria-hidden="true"
            className={cn('inline-block ml-1 animate-pulse align-middle', cursorClassName)}
            style={{ width: '3px', height: '0.85em' }}
          />
        )}
      </motion.span>
    </span>
  )
}

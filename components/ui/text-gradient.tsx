'use client'

import { type ElementType, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

// Adapted from the "Text Gradient" component (21st.dev / Cnippet) — an
// animated background-clip gradient flowing through the text. Recolored to
// the site's own pink -> light-pink -> white shine/gloss shimmer (was
// pink -> purple -> blue).

interface TextGradientProps {
  children: ReactNode
  as?: ElementType
  colors?: string[]
  duration?: number
  className?: string
}

export function TextGradient({
  children,
  as = 'span',
  colors = ['#D46FC8', '#F0A8DE', '#FFFFFF', '#F0A8DE', '#D46FC8'],
  duration = 5,
  className,
}: TextGradientProps) {
  const reduceMotion = !!useHydratedReducedMotion()
  const MotionTag = motion[as as 'span'] ?? motion.span
  const gradient = `linear-gradient(90deg, ${colors.join(', ')})`

  return (
    <MotionTag
      className={cn('inline-block bg-clip-text text-transparent', className)}
      style={{
        backgroundImage: gradient,
        backgroundSize: '300% auto',
        WebkitTextFillColor: 'transparent',
      }}
      animate={reduceMotion ? undefined : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      {children}
    </MotionTag>
  )
}

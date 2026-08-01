'use client'

import { type ElementType, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

// Adapted from the "Text Gradient" component (21st.dev / Cnippet) — an
// animated background-clip gradient flowing through the text. Recolored to
// the site's own pink shine/gloss shimmer (was pink -> purple -> blue, then
// pink -> light-pink -> white). The lightest stop is a faint pink, never
// pure white, so the shine stays subtle rather than flashing bright white.

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
  colors = ['#D46FC8', '#E08AD0', '#F3D0EA', '#E08AD0', '#D46FC8'],
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

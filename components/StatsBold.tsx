'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { TextGradient } from '@/components/ui/text-gradient'

const BONE = '#F2F0EB'
const MUTED = '#8A8A92'
const ACCENT_GRADIENT_CSS = 'linear-gradient(135deg, #D46FC8 0%, #5B4B9E 50%, #7B8CDE 100%)'

const bigNumberClass = 'block font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none'
const labelClass = 'block font-mono text-xs md:text-sm uppercase tracking-wide mt-3'

// True only for devices that can actually hover with a precise pointer —
// same detection used by WhatWeDo's aurora parallax, copied rather than
// shared since it's a one-line hook with no other cross-component surface.
function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return fine
}

// Animates 0 -> target once the element scrolls into view, formatting the
// live value with the same prefix/suffix as the final resting string (e.g.
// "7" -> "7 days", "0" -> "from $99") so it never looks like a different
// stat mid-count. Reduced motion skips straight to the final value.
function CountUpNumber({
  target,
  prefix = '',
  suffix = '',
  duration = 1.4,
  className,
  style,
}: {
  target: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduceMotion = !!useHydratedReducedMotion()
  const [value, setValue] = useState(reduceMotion ? target : 0)

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setValue(target)
      return
    }
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: v => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, reduceMotion, target, duration])

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {value}
      {suffix}
    </span>
  )
}

// Pointer-driven tilt + gradient-follow for the featured panel: rawX/rawY
// track cursor position as a 0-100 percentage (for the radial gradient's
// center), rawRX/rawRY derive a few degrees of rotateX/rotateY from the same
// position, and hoverT is a simple 0/1 spring used to fade in the radial
// overlay and brighten the panel. Everything is sprung, not snapped, and the
// mousemove handler is rAF-throttled — same pattern as WhatWeDo's aurora
// parallax hook.
function usePanelTilt(disabled: boolean) {
  const rawX = useMotionValue(50)
  const rawY = useMotionValue(50)
  const rawRX = useMotionValue(0)
  const rawRY = useMotionValue(0)
  const rawHover = useMotionValue(0)
  const spring = { stiffness: 120, damping: 20, mass: 0.6 }
  const x = useSpring(rawX, spring)
  const y = useSpring(rawY, spring)
  const rx = useSpring(rawRX, spring)
  const ry = useSpring(rawRY, spring)
  const hoverT = useSpring(rawHover, { stiffness: 150, damping: 22 })

  const rafRef = useRef<number | null>(null)
  const pendingRef = useRef<{ px: number; py: number } | null>(null)

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) return
      const rect = e.currentTarget.getBoundingClientRect()
      pendingRef.current = {
        px: (e.clientX - rect.left) / rect.width,
        py: (e.clientY - rect.top) / rect.height,
      }
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null
          const p = pendingRef.current
          if (!p) return
          rawX.set(p.px * 100)
          rawY.set(p.py * 100)
          rawRY.set((p.px - 0.5) * 14)
          rawRX.set((0.5 - p.py) * 14)
          rawHover.set(1)
        })
      }
    },
    [disabled, rawX, rawY, rawRX, rawRY, rawHover]
  )

  const onMouseLeave = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    rawX.set(50)
    rawY.set(50)
    rawRX.set(0)
    rawRY.set(0)
    rawHover.set(0)
  }, [rawX, rawY, rawRX, rawRY, rawHover])

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { x, y, rx, ry, hoverT, onMouseMove, onMouseLeave }
}

function GradientPanel({ disabled }: { disabled: boolean }) {
  const { x, y, rx, ry, hoverT, onMouseMove, onMouseLeave } = usePanelTilt(disabled)
  const brightness = useTransform(hoverT, v => 1 + v * 0.12)

  const transform = useMotionTemplate`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`
  const filter = useMotionTemplate`brightness(${brightness})`
  const overlayBackground = useMotionTemplate`radial-gradient(circle at ${x}% ${y}%, rgba(212,111,200,0.85) 0%, rgba(91,75,158,0.45) 40%, transparent 72%)`

  return (
    <motion.div
      className="relative w-full md:w-[45%] aspect-video rounded-2xl overflow-hidden"
      style={disabled ? undefined : { transform, filter, willChange: 'transform, filter' }}
      onMouseMove={disabled ? undefined : onMouseMove}
      onMouseLeave={disabled ? undefined : onMouseLeave}
    >
      <div className="absolute inset-0" style={{ background: ACCENT_GRADIENT_CSS }} aria-hidden="true" />
      {!disabled && (
        <motion.div
          className="absolute inset-0"
          style={{ background: overlayBackground, opacity: hoverT, willChange: 'opacity' }}
          aria-hidden="true"
        />
      )}
    </motion.div>
  )
}

const SMALL_STATS: Array<{ label: string; node: (reduceMotion: boolean) => React.ReactNode }> = [
  {
    label: 'FLAT MONTHLY PRICE',
    node: () => (
      <span className="inline-flex items-baseline justify-center gap-2">
        <span className="font-mono text-sm md:text-base uppercase" style={{ color: MUTED }}>
          from
        </span>
        <CountUpNumber prefix="$" target={99} className={bigNumberClass} style={{ color: BONE }} />
      </span>
    ),
  },
  {
    label: 'MONITORING & SUPPORT',
    node: () => <CountUpNumber target={24} suffix="/7" className={bigNumberClass} style={{ color: BONE }} />,
  },
  {
    label: 'UPDATES & CHANGES INCLUDED',
    node: reduceMotion => (
      <motion.span
        className={bigNumberClass}
        style={{ color: BONE }}
        animate={reduceMotion ? undefined : { opacity: [1, 0.55, 1] }}
        transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        &#8734;
      </motion.span>
    ),
  },
]

export default function StatsBold() {
  const reduceMotion = !!useHydratedReducedMotion()
  const finePointer = useFinePointer()
  const panelDisabled = reduceMotion || !finePointer

  return (
    <section data-nav-dark className="relative py-28 px-6" style={{ backgroundColor: '#0D0E12' }}>
      <div className="max-w-6xl mx-auto">
        {/* Top row — featured stat + interactive gradient panel */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center gap-10 md:gap-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="flex-1">
            <TextGradient as="span" className="font-display text-[clamp(3rem,7vw,7rem)] leading-none">
              <CountUpNumber target={7} suffix=" days" />
            </TextGradient>
            <p className="font-body mt-4 max-w-md" style={{ color: MUTED }}>
              From first brief to a live website — in a single week, not months.
            </p>
          </div>

          <GradientPanel disabled={panelDisabled} />
        </motion.div>

        <div className="border-t mt-16 pt-16" style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}>
          {/* Bottom row — 3 smaller stats */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            {SMALL_STATS.map(stat => (
              <div key={stat.label}>
                {stat.node(reduceMotion)}
                <span className={labelClass} style={{ color: MUTED }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

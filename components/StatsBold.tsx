'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  animate,
} from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useVideoAutoplay } from '@/hooks/useVideoAutoplay'
import { TextGradient } from '@/components/ui/text-gradient'

const ACCENT_GRADIENT_CSS = 'linear-gradient(135deg, #D46FC8 0%, #5B4B9E 50%, #7B8CDE 100%)'
const BOLDSTATS_DIR = '/media/boldstats'

const bigNumberClass = 'block font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-bone'
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
}: {
  target: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
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
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  )
}

// Pointer-driven tilt for the featured panel: rawRX/rawRY derive a few
// degrees of rotateX/rotateY straight from cursor position within the
// panel. Sprung, not snapped, and the mousemove handler is rAF-throttled —
// same pattern as WhatWeDo's aurora parallax hook. (Used to also drive a
// cursor-follow radial "spotlight" highlight and a brightness bump; both
// removed — this panel now shows the video plainly, tilt only.)
function usePanelTilt(disabled: boolean) {
  const rawRX = useMotionValue(0)
  const rawRY = useMotionValue(0)
  const spring = { stiffness: 120, damping: 20, mass: 0.6 }
  const rx = useSpring(rawRX, spring)
  const ry = useSpring(rawRY, spring)

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
          rawRY.set((p.px - 0.5) * 14)
          rawRX.set((0.5 - p.py) * 14)
        })
      }
    },
    [disabled, rawRX, rawRY]
  )

  const onMouseLeave = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    rawRX.set(0)
    rawRY.set(0)
  }, [rawRX, rawRY])

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { rx, ry, onMouseMove, onMouseLeave }
}

function GradientPanel({ disabled }: { disabled: boolean }) {
  const { rx, ry, onMouseMove, onMouseLeave } = usePanelTilt(disabled)
  const videoRef = useRef<HTMLVideoElement>(null)
  useVideoAutoplay(videoRef)

  const transform = useMotionTemplate`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`

  return (
    <motion.div
      className="relative w-full md:w-[45%] aspect-video rounded-2xl overflow-hidden"
      style={disabled ? undefined : { transform, willChange: 'transform' }}
      onMouseMove={disabled ? undefined : onMouseMove}
      onMouseLeave={disabled ? undefined : onMouseLeave}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        poster={`${BOLDSTATS_DIR}/boldstats_poster.jpg`}
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src={`${BOLDSTATS_DIR}/boldstats_hq.webm`} type="video/webm" />
        <source src={`${BOLDSTATS_DIR}/boldstats_hq.mp4`} type="video/mp4" />
      </video>
      {/* Same pink/purple/blue accent as the rest of the panel, blended over
          the video as a tint rather than a flat cover. */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-70"
        style={{ background: ACCENT_GRADIENT_CSS }}
        aria-hidden="true"
      />
    </motion.div>
  )
}

const SMALL_STATS = [
  {
    label: 'FLAT MONTHLY PRICE',
    node: () => (
      <span className="inline-flex items-baseline justify-center gap-2">
        <span className="font-mono text-sm md:text-base uppercase text-[#8A8A92]">from</span>
        <CountUpNumber prefix="$" target={99} className={bigNumberClass} />
      </span>
    ),
  },
  {
    label: 'MONITORING & SUPPORT',
    node: () => <CountUpNumber target={24} suffix="/7" className={bigNumberClass} />,
  },
  {
    label: 'UPDATES & CHANGES INCLUDED',
    node: (reduceMotion: boolean) => (
      <motion.span
        className={bigNumberClass}
        animate={reduceMotion ? {} : { opacity: [1, 0.55, 1] }}
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
    <section data-nav-dark className="py-28 px-6" style={{ backgroundColor: '#0D0E12' }}>
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
            <p className="font-body mt-4 max-w-md text-[rgba(242,240,235,0.7)]">
              From first brief to a live website — in a single week, not months.
            </p>
          </div>

          <GradientPanel disabled={panelDisabled} />
        </motion.div>

        <div className="border-t mt-16 pt-16 border-[rgba(255,255,255,0.12)]">
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
                <span className={`${labelClass} text-[#8A8A92]`}>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

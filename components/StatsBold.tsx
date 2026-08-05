'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  animate,
  type Transition,
} from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useVideoAutoplay } from '@/hooks/useVideoAutoplay'
import { TextGradient } from '@/components/ui/text-gradient'

// Same one-shot ~500ms flip mechanic as HowWeWork (see that file's own
// comment for the full rationale), reversed: HowWeWork starts dark and
// flips to light; this starts LIGHT (bg white, ink text) and flips to DARK
// once its own header crosses the top of the viewport. Both report through
// the same 'nav:fademode' event so the nav's text color tracks whichever
// of the two is currently on screen.
const DARK_BG = '#0D0E12'
const LIGHT_BG = '#FFFFFF'
const BONE = '#F2F0EB'
const INK = '#16161A'
const MUTED = '#8A8A92'
const MUTED_LIGHT = 'rgba(22, 22, 26, 0.6)'
const DARK_HAIRLINE = 'rgba(255, 255, 255, 0.12)'
const LIGHT_HAIRLINE = 'rgba(0, 0, 0, 0.1)'
const FLIP_TRANSITION: Transition = { duration: 0.5, ease: 'easeInOut' }
const ACCENT_GRADIENT_CSS = 'linear-gradient(135deg, #D46FC8 0%, #5B4B9E 50%, #7B8CDE 100%)'
const BOLDSTATS_DIR = '/media/boldstats'

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

function buildSmallStats(primaryColor: string, secondaryColor: string) {
  return [
    {
      label: 'FLAT MONTHLY PRICE',
      node: () => (
        <span className="inline-flex items-baseline justify-center gap-2">
          <span className="font-mono text-sm md:text-base uppercase" style={{ color: secondaryColor }}>
            from
          </span>
          <CountUpNumber prefix="$" target={99} className={bigNumberClass} style={{ color: primaryColor }} />
        </span>
      ),
    },
    {
      label: 'MONITORING & SUPPORT',
      node: () => (
        <CountUpNumber target={24} suffix="/7" className={bigNumberClass} style={{ color: primaryColor }} />
      ),
    },
    {
      label: 'UPDATES & CHANGES INCLUDED',
      node: (reduceMotion: boolean) => (
        <motion.span
          className={bigNumberClass}
          animate={reduceMotion ? { color: primaryColor } : { opacity: [1, 0.55, 1], color: primaryColor }}
          transition={
            reduceMotion
              ? FLIP_TRANSITION
              : { opacity: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }, color: FLIP_TRANSITION }
          }
        >
          &#8734;
        </motion.span>
      ),
    },
  ]
}

export default function StatsBold() {
  const reduceMotion = !!useHydratedReducedMotion()
  const finePointer = useFinePointer()
  const panelDisabled = reduceMotion || !finePointer

  const topRowRef = useRef<HTMLDivElement>(null)
  const topRowPageTopRef = useRef(0)
  // Starts light (pastThreshold=false) for everyone — reduced-motion users
  // just never flip past that, see the effect below.
  const [pastThreshold, setPastThreshold] = useState(false)

  // Same measurement approach as HowWeWork: anchored on this section's own
  // "header" (the featured stat row), re-measured on resize/load/body
  // mutation since content above this section can still be reflowing the
  // page after mount.
  useEffect(() => {
    if (reduceMotion) return
    const measure = () => {
      const el = topRowRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      topRowPageTopRef.current = rect.top + window.scrollY
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
    const past = v >= topRowPageTopRef.current
    setPastThreshold(prev => (prev === past ? prev : past))
  })

  // Reversed from HowWeWork: light (white/ink) BEFORE the threshold, dark
  // (black/bone) after.
  const bgColor = pastThreshold ? DARK_BG : LIGHT_BG
  const primaryColor = pastThreshold ? BONE : INK
  const secondaryColor = pastThreshold ? MUTED : MUTED_LIGHT
  const hairlineColor = pastThreshold ? DARK_HAIRLINE : LIGHT_HAIRLINE
  const smallStats = buildSmallStats(primaryColor, secondaryColor)

  useEffect(() => {
    if (reduceMotion) return
    window.dispatchEvent(new CustomEvent('nav:fademode', { detail: { dark: pastThreshold } }))
  }, [pastThreshold, reduceMotion])

  return (
    <section className="relative py-28 px-6">
      {/* Single full-section background layer behind the content — same
          approach as HowWeWork, keeps the color transform isolated from the
          content's own layout. */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ backgroundColor: bgColor }}
        transition={FLIP_TRANSITION}
        aria-hidden="true"
      />
      <div className="max-w-6xl mx-auto">
        {/* Top row — featured stat + interactive gradient panel */}
        <motion.div
          ref={topRowRef}
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
            <motion.p
              className="font-body mt-4 max-w-md"
              animate={{ color: secondaryColor }}
              transition={FLIP_TRANSITION}
            >
              From first brief to a live website — in a single week, not months.
            </motion.p>
          </div>

          <GradientPanel disabled={panelDisabled} />
        </motion.div>

        <motion.div className="border-t mt-16 pt-16" animate={{ borderColor: hairlineColor }} transition={FLIP_TRANSITION}>
          {/* Bottom row — 3 smaller stats */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            {smallStats.map(stat => (
              <div key={stat.label}>
                {stat.node(reduceMotion)}
                <motion.span
                  className={labelClass}
                  animate={{ color: secondaryColor }}
                  transition={FLIP_TRANSITION}
                >
                  {stat.label}
                </motion.span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValueEvent, useScroll, type Transition } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useCappedVideoPlayback } from '@/hooks/useCappedVideoPlayback'
import { useEarlyLoad } from '@/hooks/useEarlyLoad'
import PosterVideo from '@/components/ui/poster-video'
import { useDealFade } from '@/components/DealFadeContext'

// Structure/spacing/behavior mirrors the reference bundle exactly (track
// padding 40px 40px 0, 16px gaps, calc(50% - 8px) stack cells, 52px title,
// 90px edge-hover zones, 52px round nudge buttons, etc.) — only the fonts
// are swapped for the site's own (Archivo/IBM Plex Mono/Instrument Sans in
// place of the reference's Instrument Serif/Inter Tight). Loads white and
// owns the white->black flip for HomePage.tsx's DealFadeProvider group
// (shared with BeyondWebsite before it and StatsBold after), using the
// exact same scroll-position mechanic "Here's the deal" (DealStatement)
// used to own: fires once this section's own top has scrolled up to
// roughly TRIGGER_VIEWPORT_FRACTION down the viewport (while it's still
// mostly below the fold, right as it enters), reversible only by
// scrolling back up above that page position. DealStatement, sandwiched
// between this section and StatsBold, no longer participates — it has its
// own fixed dark background instead of re-deriving one from this trigger.
const TRIGGER_VIEWPORT_FRACTION = 0.7
const DARK_BG = '#0D0E12'
const LIGHT_BG = '#FFFFFF'
const DARK_TITLE = '#f2f1ee'
const LIGHT_TITLE = '#16161A'
const DARK_SECONDARY = '#9a9a96'
const LIGHT_SECONDARY = 'rgba(22, 22, 26, 0.55)'
const DARK_BLURB = '#c9c8c4'
const LIGHT_BLURB = 'rgba(22, 22, 26, 0.75)'
const DARK_BORDER = '#3a3a38'
const LIGHT_BORDER = 'rgba(22, 22, 26, 0.25)'
const CELL_BG = '#222222'
const FLIP_TRANSITION: Transition = { duration: 0.5, ease: 'easeInOut' }
const EDGE_HOVER_SPEED = 10
// Small pink filled circle (soft ring for contrast against both light and
// dark thumbnails) replacing the default w-/e-resize cursor on the edge-hover
// pan zones only — the rest of the section keeps normal cursor behavior.
const PAN_CURSOR =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Ccircle cx='14' cy='14' r='9' fill='%23D46FC8' fill-opacity='.85' stroke='white' stroke-width='2'/%3E%3C/svg%3E") 14 14, pointer`

type FeaturedColumn =
  | { type: 'stack'; top: string; bottom: string }
  | { type: 'tall'; image: string }
  | { type: 'video'; video: string; poster: string }

type FeaturedProject = {
  name: string
  subtitle: string
  blurb: string
  mediaDir: string
  columns: FeaturedColumn[]
}

// Restoration Bros loads first (position 1 / default activeIndex 0); Duna
// is second, Shinsetsu third. The counter + nudge arrows cycle activeIndex
// (next from the last project wraps to the first, and vice versa) and
// reset scroll position; add another project by just appending an entry.
const PROJECTS: FeaturedProject[] = [
  {
    name: 'Restoration Bros',
    subtitle: 'Website',
    blurb:
      "Tampa's leading water-damage and disaster-restoration specialists — reachable 24/7, when every minute counts.",
    mediaDir: '/media/renovationbros',
    columns: [
      { type: 'stack', top: '1', bottom: '2' },
      { type: 'tall', image: '3' },
      { type: 'video', video: '4', poster: '4_poster' },
      { type: 'tall', image: '5' },
      { type: 'stack', top: '6', bottom: '7' },
    ],
  },
  {
    name: 'Duna',
    subtitle: 'Product Mock-up',
    blurb: 'Complete product branding for Duna. Organic medjool dates.',
    mediaDir: '/media/duna',
    columns: [
      { type: 'stack', top: '2', bottom: '4' },
      { type: 'tall', image: '3' },
      { type: 'video', video: '1', poster: '1_poster' },
      { type: 'tall', image: '5' },
      { type: 'stack', top: '6', bottom: '7' },
    ],
  },
  {
    name: 'Shinsetsu',
    subtitle: 'Travel Agency',
    blurb:
      "A boutique travel agency crafting tailor-made ski journeys across Hokkaido — from Niseko's legendary powder to quiet backcountry runs and onsen nights.",
    mediaDir: '/media/hokkaido',
    columns: [
      { type: 'stack', top: '1', bottom: '2' },
      { type: 'tall', image: '3' },
      { type: 'video', video: '4', poster: '4_poster' },
      { type: 'tall', image: '5' },
      { type: 'stack', top: '6', bottom: '7' },
    ],
  },
]

function ImageCell({
  mediaDir,
  file,
  alt,
  sizes,
  className,
}: {
  mediaDir: string
  file: string
  alt: string
  sizes: string
  className: string
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[10px] ${className}`}
      style={{ backgroundColor: CELL_BG }}
    >
      <Image
        src={`${mediaDir}/${file}.webp`}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.04]"
      />
    </div>
  )
}

function NudgeButton({
  direction,
  disabled,
  onClick,
  borderColor,
  textColor,
  bgColor,
  pulse,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
  borderColor: string
  textColor: string
  bgColor: string
  pulse?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const filled = hovered && !disabled
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={direction === 'prev' ? 'Scroll left' : 'Scroll right'}
      className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border text-[18px] transition-colors duration-[250ms] disabled:opacity-30 disabled:pointer-events-none"
      style={{
        borderColor: filled ? textColor : borderColor,
        backgroundColor: filled ? textColor : 'transparent',
        color: filled ? bgColor : textColor,
      }}
      // "Come click me" invite: gentle opacity+scale pulse, only while
      // pulse is true (right arrow, before the visitor has navigated).
      // Pointer events are untouched — opacity/scale don't affect hit
      // testing, so the button stays clickable throughout the pulse.
      animate={pulse ? { opacity: [1, 0.55, 1], scale: [1, 1.08, 1] } : { opacity: 1, scale: 1 }}
      transition={pulse ? { duration: 1.6, ease: 'easeInOut', repeat: Infinity } : { duration: 0.2 }}
    >
      {direction === 'prev' ? '←' : '→'}
    </motion.button>
  )
}

export default function LatestFeaturedWork() {
  const reduceMotion = !!useHydratedReducedMotion()
  const { pastThreshold, setPastThreshold } = useDealFade()

  const [activeIndex, setActiveIndex] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const project = PROJECTS[activeIndex]

  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  useCappedVideoPlayback([videoRef], { reduceMotion })
  useEarlyLoad(videoRef)

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 })
    // Every project shares the same physical <video> element (only the
    // <source> child's src changes) — a plain prop/DOM update alone
    // doesn't make an already-mounted <video> notice a new source, so
    // switching projects needs an explicit reload + replay.
    const v = videoRef.current
    if (v) {
      v.load()
      v.play().catch(() => {})
    }
  }, [activeIndex])

  // Owns the shared flip. Anchored on this section's own top (re-measured
  // on resize/load/body mutation since content above can still be
  // reflowing the page after mount) — same measurement pattern
  // DealStatement used to own, just pointed at this section instead of an
  // inner paragraph. Skipped entirely under reduced motion, so the shared
  // boolean just stays false and the group stays permanently light.
  const sectionTopRef = useRef(0)
  useEffect(() => {
    if (reduceMotion) return
    const measure = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      sectionTopRef.current = rect.top + window.scrollY
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
    // Fires as soon as the section's top has scrolled up to
    // ~TRIGGER_VIEWPORT_FRACTION down the viewport (i.e. while it's still
    // mostly below the fold, right as it enters) rather than waiting for
    // its top to reach the very top of the viewport.
    const past = v >= sectionTopRef.current - window.innerHeight * TRIGGER_VIEWPORT_FRACTION
    setPastThreshold(prev => (prev === past ? prev : past))
  })

  useEffect(() => {
    if (reduceMotion) return
    window.dispatchEvent(new CustomEvent('nav:fademode', { detail: { dark: pastThreshold } }))
  }, [pastThreshold, reduceMotion])

  // Edge-hover auto-pan: cursor within EDGE_HOVER_ZONE px of either edge
  // scrolls that direction continuously (~EDGE_HOVER_SPEED px/frame) while
  // hovered, same mouseenter/mouseleave-driven rAF loop as the reference.
  const dirRef = useRef(0)
  const rafRef = useRef(0)
  useEffect(() => {
    const step = () => {
      const el = trackRef.current
      if (el && dirRef.current !== 0) {
        el.scrollLeft += dirRef.current * EDGE_HOVER_SPEED
      }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const startHover = (dir: number) => {
    if (reduceMotion) return
    dirRef.current = dir
  }
  const stopHover = () => {
    dirRef.current = 0
  }

  const bgColor = pastThreshold ? DARK_BG : LIGHT_BG
  const titleColor = pastThreshold ? DARK_TITLE : LIGHT_TITLE
  const secondaryColor = pastThreshold ? DARK_SECONDARY : LIGHT_SECONDARY
  const blurbColor = pastThreshold ? DARK_BLURB : LIGHT_BLURB
  const borderColor = pastThreshold ? DARK_BORDER : LIGHT_BORDER

  return (
    <section
      ref={sectionRef}
      id="trabajos"
      data-nav-fade
      className="relative h-screen w-full overflow-hidden flex flex-col scroll-mt-24"
    >
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ backgroundColor: bgColor }}
        transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
        aria-hidden="true"
      />

      {/* Track — flex:1 1 auto, min-height:0, padding 40px 40px 0 */}
      <div
        ref={trackRef}
        className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden pt-10 px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex h-full w-max gap-4">
          {project.columns.map((col, i) => {
            if (col.type === 'stack') {
              return (
                <div key={i} className="flex h-full flex-col items-start gap-4">
                  <ImageCell
                    mediaDir={project.mediaDir}
                    file={col.top}
                    alt={`${project.name} — project photo`}
                    sizes="30vh"
                    className="h-[calc(50%-8px)] aspect-[3/4]"
                  />
                  <ImageCell
                    mediaDir={project.mediaDir}
                    file={col.bottom}
                    alt={`${project.name} — project photo`}
                    sizes="30vh"
                    className="h-[calc(50%-8px)] aspect-[3/4]"
                  />
                </div>
              )
            }
            if (col.type === 'tall') {
              return (
                <ImageCell
                  key={i}
                  mediaDir={project.mediaDir}
                  file={col.image}
                  alt={`${project.name} — project photo`}
                  sizes="45vh"
                  className="h-full aspect-[1/2]"
                />
              )
            }
            return (
              <div
                key={i}
                className="relative h-full aspect-video overflow-hidden rounded-[10px]"
                style={{ backgroundColor: CELL_BG }}
              >
                <PosterVideo
                  videoRef={videoRef}
                  poster={`${project.mediaDir}/${col.poster}.webp`}
                  posterAlt={`${project.name} — project video`}
                  className="absolute inset-0 h-full w-full object-cover"
                  resetKey={activeIndex}
                >
                  <source src={`${project.mediaDir}/${col.video}.mp4`} type="video/mp4" />
                </PosterVideo>
                <div className="pointer-events-none absolute left-4 bottom-[14px] flex items-center gap-2 text-white/85">
                  <span className="h-2 w-2 rounded-full bg-white" aria-hidden="true" />
                  <span className="font-mono text-[12px] uppercase tracking-[0.08em]">Showreel</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Edge-hover zones — absolute, 90px, gradient hint, custom pink-circle cursor */}
      <div
        onMouseEnter={() => startHover(-1)}
        onMouseLeave={stopHover}
        className="pointer-events-auto absolute inset-y-0 left-0 z-[5] w-[90px] opacity-0 transition-opacity duration-300 hover:opacity-100"
        style={{ background: `linear-gradient(to right, ${bgColor}CC, transparent)`, cursor: PAN_CURSOR }}
        aria-hidden="true"
      />
      <div
        onMouseEnter={() => startHover(1)}
        onMouseLeave={stopHover}
        className="pointer-events-auto absolute inset-y-0 right-0 z-[5] w-[90px] opacity-0 transition-opacity duration-300 hover:opacity-100"
        style={{ background: `linear-gradient(to left, ${bgColor}CC, transparent)`, cursor: PAN_CURSOR }}
        aria-hidden="true"
      />

      {/* Bottom bar — padding 40px 48px 48px, gap 64px, align-items:flex-end */}
      <div className="flex shrink-0 items-end justify-between gap-16 px-12 pb-12 pt-10">
        <div>
          <motion.div
            className="mb-3 font-mono text-xs uppercase tracking-[0.14em]"
            animate={{ color: secondaryColor }}
            transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
          >
            Latest featured work
          </motion.div>
          <motion.div
            className="font-display text-[52px] leading-[1.05]"
            animate={{ color: titleColor }}
            transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
          >
            {project.name}
          </motion.div>
          <motion.div
            className="mt-[10px] font-body text-base"
            animate={{ color: secondaryColor }}
            transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
          >
            {project.subtitle}
          </motion.div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <motion.span
            className="mr-2 font-mono text-[13px] uppercase tracking-[0.08em]"
            animate={{ color: secondaryColor }}
            transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
          >
            {activeIndex + 1} / {PROJECTS.length}
          </motion.span>
          <NudgeButton
            direction="prev"
            disabled={PROJECTS.length <= 1}
            onClick={() => {
              setHasInteracted(true)
              setActiveIndex(i => (i - 1 + PROJECTS.length) % PROJECTS.length)
            }}
            borderColor={borderColor}
            textColor={titleColor}
            bgColor={bgColor}
          />
          <NudgeButton
            direction="next"
            disabled={PROJECTS.length <= 1}
            onClick={() => {
              setHasInteracted(true)
              setActiveIndex(i => (i + 1) % PROJECTS.length)
            }}
            borderColor={borderColor}
            textColor={titleColor}
            bgColor={bgColor}
            pulse={!hasInteracted && !reduceMotion && PROJECTS.length > 1}
          />
        </div>

        <motion.div
          className="max-w-[520px] shrink-0 font-body text-base leading-[1.55] [text-wrap:pretty]"
          animate={{ color: blurbColor }}
          transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
        >
          {project.blurb}
        </motion.div>
      </div>
    </section>
  )
}

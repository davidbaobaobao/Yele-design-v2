'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, type Transition } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useCappedVideoPlayback } from '@/hooks/useCappedVideoPlayback'
import { useEarlyLoad } from '@/hooks/useEarlyLoad'
import PosterVideo from '@/components/ui/poster-video'
import { useDealFade } from '@/components/DealFadeContext'

// One-screen (100vh), full-bleed (100vw) horizontal-pan gallery matching
// yele.design's featuredwork.html: a flex row of STACK/TALL/VIDEO columns,
// each exactly the track's own height, wider in total than the viewport and
// scrolled horizontally inside its own overflow-x container. Sits between
// BeyondWebsite and DealStatement in HomePage.tsx's DealFadeProvider group,
// so it reads the SAME shared pastThreshold those two (and StatsBold) do —
// all four flip white->black at the exact same scroll instant, as one
// continuous surface, rather than on an independent timer of its own.
const DARK_BG = '#0D0E12'
const LIGHT_BG = '#FFFFFF'
const DARK_TEXT = '#FFFFFF'
const LIGHT_TEXT = '#16161A'
const DARK_SECONDARY = 'rgba(242, 240, 235, 0.7)'
const LIGHT_SECONDARY = 'rgba(22, 22, 26, 0.6)'
const DARK_BORDER = '#3a3a38'
const LIGHT_BORDER = 'rgba(22, 22, 26, 0.25)'
const CELL_BG = '#222222'
const FLIP_TRANSITION: Transition = { duration: 0.5, ease: 'easeInOut' }
// Cursor must be within this many px of the scroll area's edge to trigger
// auto-pan; px/frame speed for that auto-pan.
const EDGE_HOVER_ZONE = 90
const EDGE_HOVER_SPEED = 10

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

// One project for now — kept as an array so a future project just adds
// another entry here; the counter + nudge arrows already switch activeIndex
// and reset scroll position, they're only disabled while there's nothing to
// switch to.
const PROJECTS: FeaturedProject[] = [
  {
    name: 'Restoration Bros',
    subtitle: 'Website',
    blurb:
      "Tampa's leading water-damage and disaster-restoration specialists — reachable 24/7, when every minute counts.",
    mediaDir: '/media/renovationbros',
    columns: [
      { type: 'stack', top: '7', bottom: '3' },
      { type: 'tall', image: '2' },
      { type: 'video', video: '1', poster: '1_poster' },
      { type: 'stack', top: '6', bottom: '4' },
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
    <div className={`group relative overflow-hidden rounded-[10px] ${className}`} style={{ backgroundColor: CELL_BG }}>
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
  accentColor,
  bgColor,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
  accentColor: string
  bgColor: string
}) {
  const [hovered, setHovered] = useState(false)
  const filled = hovered && !disabled
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={direction === 'prev' ? 'Previous project' : 'Next project'}
      className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border transition-colors duration-300 disabled:opacity-30 disabled:pointer-events-none"
      style={{ borderColor: accentColor, backgroundColor: filled ? accentColor : 'transparent' }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        style={{ transform: direction === 'prev' ? 'rotate(180deg)' : undefined }}
      >
        <path
          d="M6 3l5 5-5 5"
          stroke={filled ? bgColor : accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export default function LatestFeaturedWork() {
  const reduceMotion = !!useHydratedReducedMotion()
  const { pastThreshold } = useDealFade()

  const [activeIndex, setActiveIndex] = useState(0)
  const project = PROJECTS[activeIndex]

  const scrollRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  useCappedVideoPlayback([videoRef], { reduceMotion })
  useEarlyLoad(videoRef)

  // Switching projects resets the pan back to the start — see PROJECTS'
  // own comment on why this is wired up even though there's only one entry.
  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 0 })
  }, [activeIndex])

  // Horizontal pan: native trackpad/touch horizontal scroll and mouse-drag
  // both work via plain overflow-x-auto with no JS. This effect only adds
  // the "on top" behaviors: click-and-drag panning, and edge-hover
  // auto-scroll (cursor within EDGE_HOVER_ZONE px of either edge pans that
  // direction continuously, ~EDGE_HOVER_SPEED px/frame, with the cursor
  // itself swapping to w-resize/e-resize while in a zone).
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const updateEdges = () => {
      setAtStart(el.scrollLeft <= 1)
      setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 1)
    }
    updateEdges()
    el.addEventListener('scroll', updateEdges, { passive: true })

    let dragging = false
    let dragStartX = 0
    let dragStartScrollLeft = 0
    const onPointerDown = (e: PointerEvent) => {
      dragging = true
      dragStartX = e.clientX
      dragStartScrollLeft = el.scrollLeft
      el.setPointerCapture(e.pointerId)
      el.style.cursor = 'grabbing'
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      el.scrollLeft = dragStartScrollLeft - (e.clientX - dragStartX)
    }
    const endDrag = (e: PointerEvent) => {
      dragging = false
      el.style.cursor = 'grab'
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
    }
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', endDrag)
    el.addEventListener('pointercancel', endDrag)
    const preventGhostDrag = (e: DragEvent) => e.preventDefault()
    el.addEventListener('dragstart', preventGhostDrag)

    let hoverDir = 0
    let rafId = 0
    const step = () => {
      if (hoverDir !== 0) el.scrollLeft += hoverDir * EDGE_HOVER_SPEED
      rafId = requestAnimationFrame(step)
    }
    const onPointerMoveForHover = (e: PointerEvent) => {
      if (reduceMotion || dragging) {
        hoverDir = 0
        return
      }
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      if (x < EDGE_HOVER_ZONE) hoverDir = -1
      else if (x > rect.width - EDGE_HOVER_ZONE) hoverDir = 1
      else hoverDir = 0
      el.style.cursor = hoverDir === -1 ? 'w-resize' : hoverDir === 1 ? 'e-resize' : 'grab'
    }
    const onPointerLeave = () => {
      hoverDir = 0
      el.style.cursor = 'grab'
    }
    if (!reduceMotion) {
      el.addEventListener('pointermove', onPointerMoveForHover)
      el.addEventListener('pointerleave', onPointerLeave)
      rafId = requestAnimationFrame(step)
    }

    return () => {
      el.removeEventListener('scroll', updateEdges)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', endDrag)
      el.removeEventListener('pointercancel', endDrag)
      el.removeEventListener('dragstart', preventGhostDrag)
      el.removeEventListener('pointermove', onPointerMoveForHover)
      el.removeEventListener('pointerleave', onPointerLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [reduceMotion])

  const bgColor = pastThreshold ? DARK_BG : LIGHT_BG
  const textColor = pastThreshold ? DARK_TEXT : LIGHT_TEXT
  const secondaryColor = pastThreshold ? DARK_SECONDARY : LIGHT_SECONDARY
  const borderColor = pastThreshold ? DARK_BORDER : LIGHT_BORDER

  return (
    <section
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

      {/* Horizontal-pan gallery track — fills the remaining section height
          (min-h-0 lets a flex child actually shrink to that instead of
          overflowing based on its content's natural size). The inner row is
          w-max (shrink-to-fit) so it can be WIDER than the viewport and
          trigger this wrapper's overflow-x. */}
      <div className="relative flex-1 min-h-0">
        <div
          ref={scrollRef}
          className="h-full w-full overflow-x-auto overflow-y-hidden cursor-grab pt-10 px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                      className="flex-1 aspect-[4/3]"
                    />
                    <ImageCell
                      mediaDir={project.mediaDir}
                      file={col.bottom}
                      alt={`${project.name} — project photo`}
                      sizes="30vh"
                      className="flex-1 aspect-[4/3]"
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
                  >
                    <source src={`${project.mediaDir}/${col.video}.mp4`} type="video/mp4" />
                  </PosterVideo>
                  <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
                    <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-white/85">Showreel</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Edge fades hinting more content — fade out once fully panned to
            that side. Purely visual, sit above the gallery but under the
            bottom bar. */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[90px] transition-opacity duration-300"
          style={{
            background: `linear-gradient(to right, transparent, ${bgColor})`,
            transition: 'background 0.5s ease-in-out, opacity 0.3s ease-out',
            opacity: atEnd ? 0 : 1,
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[90px] transition-opacity duration-300"
          style={{
            background: `linear-gradient(to left, transparent, ${bgColor})`,
            transition: 'background 0.5s ease-in-out, opacity 0.3s ease-out',
            opacity: atStart ? 0 : 1,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Bottom bar — eyebrow/title/subtitle, project counter + nudge
          arrows, and the blurb. A normal flex sibling below the track (not
          an overlay), so it shares the section's own background. */}
      <div className="flex shrink-0 items-end justify-between gap-16 px-12 pb-12 pt-10">
        <div className="flex min-w-0 flex-col gap-3">
          <motion.span
            className="font-mono text-xs uppercase tracking-[0.14em]"
            animate={{ color: secondaryColor }}
            transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
          >
            Latest featured work
          </motion.span>
          <motion.h3
            className="font-display text-[52px] leading-[1.05]"
            animate={{ color: textColor }}
            transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
          >
            {project.name}
          </motion.h3>
          <motion.p
            className="font-body text-base"
            animate={{ color: secondaryColor }}
            transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
          >
            {project.subtitle}
          </motion.p>
        </div>

        <div className="flex shrink-0 items-center gap-6">
          <motion.span
            className="font-mono text-xs uppercase tracking-[0.08em]"
            animate={{ color: secondaryColor }}
            transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
          >
            {activeIndex + 1} / {PROJECTS.length}
          </motion.span>
          <div className="flex items-center gap-3">
            <NudgeButton
              direction="prev"
              disabled={PROJECTS.length <= 1 || activeIndex === 0}
              onClick={() => setActiveIndex(i => Math.max(0, i - 1))}
              accentColor={borderColor}
              bgColor={bgColor}
            />
            <NudgeButton
              direction="next"
              disabled={PROJECTS.length <= 1 || activeIndex === PROJECTS.length - 1}
              onClick={() => setActiveIndex(i => Math.min(PROJECTS.length - 1, i + 1))}
              accentColor={borderColor}
              bgColor={bgColor}
            />
          </div>
        </div>

        <motion.p
          className="font-body max-w-[520px] shrink-0 text-base leading-[1.55]"
          animate={{ color: secondaryColor }}
          transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
        >
          {project.blurb}
        </motion.p>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { TextGradient } from '@/components/ui/text-gradient'

// Recreates the described behavior of Skiper UI's skiper32 "3D perspective
// scroll gallery" (https://skiper-ui.com/v1/skiper32) — a paid Pro component
// we don't have a license for (confirmed: `shadcn add @skiper-ui/skiper32`
// fails with "Missing license key", same as skiper70/72 before it — this
// Skiper UI tier appears to be paid across the board for its scroll-effect
// components). Built directly with framer-motion, which the rest of this
// app already depends on for identical per-tile scroll-driven transform
// patterns (WhatWeDo's cards, WhySubs' reason list).

const IMAGE_DIR = '/media/animationimages'
const VIDEO_DIR = '/media/animationvideos'
// 20 (not all 21 available) so the grid divides into a clean, fully-aligned
// 5x4 with zero empty/mismatched cells — the previous 5x5 (25 slots for 21
// images) left an asymmetric, mostly-empty last row.
const IMAGE_COUNT = 20
const IMAGE_COLS = 5
const IMAGE_ROWS = 4
const VIDEO_COUNT = 20
const VIDEO_COLS = 5
const VIDEO_ROWS = 4

// Image filenames are a mix of .jpeg/.jpg — resolved once up front rather
// than guessed per-tile.
const IMAGE_EXT: Record<number, string> = {
  1: 'jpeg', 2: 'jpeg', 3: 'jpeg', 4: 'jpeg', 5: 'jpg', 6: 'jpeg', 7: 'jpg',
  8: 'jpeg', 9: 'jpeg', 10: 'jpeg', 11: 'jpeg', 12: 'jpeg', 13: 'jpg', 14: 'jpg',
  15: 'jpeg', 16: 'jpg', 17: 'jpeg', 18: 'jpeg', 19: 'jpeg', 20: 'jpeg',
}

function linearMap(inMin: number, inMax: number, outMin: number, outMax: number) {
  return (v: number) => {
    if (v <= inMin) return outMin
    if (v >= inMax) return outMax
    return outMin + ((outMax - outMin) * (v - inMin)) / (inMax - inMin)
  }
}

function easeOutCubic(t: number) {
  const k = Math.max(0, Math.min(1, t))
  return 1 - Math.pow(1 - k, 3)
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function mixHex(from: string, to: string, t: number) {
  const k = Math.max(0, Math.min(1, t))
  const [r1, g1, b1] = hexToRgb(from)
  const [r2, g2, b2] = hexToRgb(to)
  const r = Math.round(r1 + (r2 - r1) * k)
  const g = Math.round(g1 + (g2 - g1) * k)
  const b = Math.round(b1 + (b2 - b1) * k)
  return `rgb(${r}, ${g}, ${b})`
}

// Center point (in % of viewport) of the grid cell for tile `index`.
function gridTarget(index: number, cols: number, rows: number) {
  const col = index % cols
  const row = Math.floor(index / cols)
  return {
    x: ((col + 0.5) / cols) * 100,
    y: ((row + 0.5) / rows) * 100,
  }
}

// Tiles occupy this fraction of their grid cell — very close to 1 so only a
// tiny gutter separates tiles, for a dense full-bleed mosaic.
const GRID_GAP_FACTOR = 0.985
function tileSize(cols: number, rows: number) {
  return { width: `${(100 / cols) * GRID_GAP_FACTOR}vw`, height: `${(100 / rows) * GRID_GAP_FACTOR}vh` }
}

// Phase 1 entry: every tile starts just below the viewport (positive
// translateY) and rises straight up its own column into its grid slot.
// IMAGE_START_Y is in the same 0-100 "% of viewport" scale as gridTarget's
// output — 104 is only just past the 100 (bottom edge) mark, so tiles start
// entering frame almost immediately instead of spending a chunk of the
// phase invisibly below the fold.
const IMAGE_START_Y = 104
const IMAGE_START_SCALE = 0.94
// Extra, transient vertical offset added to outer columns during the rise
// (per column-step away from center, faded out via (1 - t) so every tile
// still settles into the same flat grid row) — this is what makes the
// in-progress formation read as a pyramid/triangle peaking at the center
// columns rather than a flat sheet rising evenly.
const PYRAMID_COLUMN_GAP = 22
// Per-tile start delay: symmetric around the center column (so center and
// outer columns rise in a matching V-shape, not a left-to-right cascade)
// plus a small per-row offset for a gentle wave. Column term dominates.
const COL_STAGGER = 0.035
const ROW_STAGGER = 0.02

// ---- Phase boundaries, in overall section scroll progress (0-1). Total
// section height is 750vh, so each fraction below still spans a lot more
// real scroll distance than the numbers alone suggest. ----
const PHASE1_END = 0.24
// Image grid EXIT: scrolls straight up and off the top (no fade) as the
// text arrives, instead of the old opacity fade-out.
const IMAGE_EXIT_START = 0.24
const IMAGE_EXIT_END = 0.34
// Headline scrolls through as one continuous translateY move: below the
// viewport at TEXT_RANGE_START, through center, off the top by TEXT_RANGE_END.
const TEXT_RANGE_START = 0.3
const TEXT_RANGE_END = 0.62
// Video tiles start arriving right as the text has fully cleared the top.
const PHASE3_START = 0.62
const IMAGE_SPAN = 0.55
const VIDEO_STAGGER = 0.008
const VIDEO_SPAN = 0.22
// Section bg fades white -> black over this window, timed so it's well
// underway by the time video tiles are substantially visible, and doesn't
// overlap the headline's own visible (centered, ink-on-white) moment.
const BG_DARK_START = 0.6
const BG_DARK_END = 0.72

// Below this width, the desktop 5x4 image grid produces awkward cells —
// swap to a 4x5 layout instead (clean factor pair of 20, taller/narrower
// cells suiting a narrow viewport).
const NARROW_BREAKPOINT = 640

function useIsNarrowViewport() {
  const [isNarrow, setIsNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${NARROW_BREAKPOINT}px)`)
    setIsNarrow(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isNarrow
}

function ImageTile({
  index,
  progress,
  cols,
  rows,
  tileWidth,
  tileHeight,
}: {
  index: number
  progress: MotionValue<number>
  cols: number
  rows: number
  tileWidth: string
  tileHeight: string
}) {
  const target = gridTarget(index, cols, rows)
  const col = index % cols
  const row = Math.floor(index / cols)
  const centerCol = (cols - 1) / 2
  const colDistance = Math.abs(col - centerCol)
  const tileStart = colDistance * COL_STAGGER + row * ROW_STAGGER
  const tileEnd = tileStart + IMAGE_SPAN

  const t = useTransform(progress, v => {
    const local = linearMap(0, PHASE1_END, 0, 1)(v)
    return easeOutCubic(linearMap(tileStart, tileEnd, 0, 1)(local))
  })

  // Straight vertical rise — the column never moves horizontally, only up.
  const x = `${target.x - 50}vw`
  const y = useTransform(t, tv => {
    const base = IMAGE_START_Y + (target.y - IMAGE_START_Y) * tv
    const pyramidLift = colDistance * PYRAMID_COLUMN_GAP * (1 - tv)
    return `${base + pyramidLift - 50}vh`
  })
  const scale = useTransform(t, tv => IMAGE_START_SCALE + (1 - IMAGE_START_SCALE) * tv)
  const opacity = t

  const n = index + 1
  const ext = IMAGE_EXT[n] ?? 'jpeg'

  return (
    <motion.div
      className="absolute overflow-hidden pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        width: tileWidth,
        height: tileHeight,
        x,
        y,
        scale,
        opacity,
      }}
    >
      <Image
        src={`${IMAGE_DIR}/${n}.${ext}`}
        alt=""
        fill
        sizes="20vw"
        className="object-cover"
      />
    </motion.div>
  )
}

function VideoTile({
  index,
  progress,
  mounted,
}: {
  index: number
  progress: MotionValue<number>
  mounted: boolean
}) {
  const target = gridTarget(index, VIDEO_COLS, VIDEO_ROWS)
  const tileStart = PHASE3_START + index * VIDEO_STAGGER
  const tileEnd = tileStart + VIDEO_SPAN

  const t = useTransform(progress, v => easeOutCubic(linearMap(tileStart, tileEnd, 0, 1)(v)))
  const scale = useTransform(t, tv => 0.55 + 0.45 * tv)
  const opacity = t

  const videoRef = useRef<HTMLVideoElement>(null)
  const n = index + 1
  const poster = `${VIDEO_DIR}/${n}_poster.jpg`
  const { width, height } = tileSize(VIDEO_COLS, VIDEO_ROWS)

  useEffect(() => {
    if (!mounted) return
    const v = videoRef.current
    if (!v) return

    v.setAttribute('muted', '')
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    v.muted = true

    const play = () => {
      if (!v.paused && !v.ended) return
      v.muted = true
      if (v.networkState === HTMLMediaElement.NETWORK_EMPTY) v.load()
      v.play().catch(() => {})
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) play()
          else v.pause()
        })
      },
      { threshold: 0.3 }
    )
    observer.observe(v)

    return () => observer.disconnect()
  }, [mounted])

  return (
    <motion.div
      className="absolute overflow-hidden pointer-events-none bg-[#16171C]"
      style={{
        left: `${target.x}%`,
        top: `${target.y}%`,
        x: '-50%',
        y: '-50%',
        width,
        height,
        scale,
        opacity,
      }}
    >
      {mounted ? (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src={`${VIDEO_DIR}/${n}_hq.mp4`} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
    </motion.div>
  )
}

function ContentShowcaseReduced() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    const videos = videoRefs.current.filter((v): v is HTMLVideoElement => !!v)
    if (videos.length === 0) return

    videos.forEach(v => {
      v.setAttribute('muted', '')
      v.setAttribute('playsinline', '')
      v.muted = true
    })

    const play = (v: HTMLVideoElement) => {
      if (!v.paused && !v.ended) return
      v.muted = true
      v.play().catch(() => {})
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const v = entry.target as HTMLVideoElement
          if (entry.isIntersecting) play(v)
          else v.pause()
        })
      },
      { threshold: 0.3 }
    )
    videos.forEach(v => observer.observe(v))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <section className="relative py-24 px-6" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-4 md:grid-cols-5 gap-1 mb-24"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {Array.from({ length: IMAGE_COUNT }, (_, i) => {
              const n = i + 1
              return (
                <div key={n} className="relative aspect-video overflow-hidden">
                  <Image src={`${IMAGE_DIR}/${n}.${IMAGE_EXT[n] ?? 'jpeg'}`} alt="" fill sizes="20vw" className="object-cover" />
                </div>
              )
            })}
          </motion.div>

          <motion.h2
            className="font-display text-center leading-tight text-[clamp(1.75rem,3.5vw,3.5rem)]"
            style={{ color: '#16161A' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            Want content?
            <br />
            We create <TextGradient as="span">any</TextGradient> content you need
          </motion.h2>
        </div>
      </section>

      <section className="relative py-24 px-6" style={{ backgroundColor: '#0D0E12' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-1"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {Array.from({ length: VIDEO_COUNT }, (_, i) => {
              const n = i + 1
              return (
                <div key={n} className="relative aspect-[4/5] overflow-hidden bg-[#16171C]">
                  <video
                    ref={el => {
                      videoRefs.current[i] = el
                    }}
                    muted
                    loop
                    playsInline
                    preload="none"
                    poster={`${VIDEO_DIR}/${n}_poster.jpg`}
                    className="absolute inset-0 w-full h-full object-cover"
                    aria-hidden="true"
                  >
                    <source src={`${VIDEO_DIR}/${n}_hq.mp4`} type="video/mp4" />
                  </video>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default function ContentShowcase() {
  const reduceMotion = !!useHydratedReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [videosMounted, setVideosMounted] = useState(false)
  const isNarrow = useIsNarrowViewport()
  const imageCols = isNarrow ? 4 : IMAGE_COLS
  const imageRows = isNarrow ? 5 : IMAGE_ROWS
  const { width: imageTileWidth, height: imageTileHeight } = tileSize(imageCols, imageRows)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (v > 0.58) setVideosMounted(mounted => mounted || true)
  })

  // Image grid EXIT — scrolls straight up and off-screen (no fade) once
  // Phase 1 has settled, making room for the text to scroll up into place.
  const imageLayerY = useTransform(scrollYProgress, v => `${linearMap(IMAGE_EXIT_START, IMAGE_EXIT_END, 0, -100)(v)}vh`)
  // Enters from below (100vh), passes through center (0), exits off the top
  // (-100vh) — one continuous scroll-through move, not a fade.
  const textY = useTransform(scrollYProgress, v => `${linearMap(TEXT_RANGE_START, TEXT_RANGE_END, 100, -100)(v)}vh`)
  // White while images/text are on screen, fading to black as the video
  // grid takes over — so the videos sit on black, seamlessly.
  const bgColor = useTransform(scrollYProgress, v => mixHex('#FFFFFF', '#0D0E12', linearMap(BG_DARK_START, BG_DARK_END, 0, 1)(v)))

  if (reduceMotion) return <ContentShowcaseReduced />

  return (
    <section ref={sectionRef} className="relative" style={{ height: '750vh' }}>
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ backgroundColor: bgColor, perspective: '1000px' }}
      >
        {/* Phase 1 — images rise from below into a pyramid -> 5x4 grid, then
            scroll straight up off-screen as a single group (no fade). */}
        <motion.div className="absolute inset-0" style={{ y: imageLayerY, transformStyle: 'preserve-3d' }} aria-hidden="true">
          {Array.from({ length: IMAGE_COUNT }, (_, i) => (
            <ImageTile
              key={i}
              index={i}
              progress={scrollYProgress}
              cols={imageCols}
              rows={imageRows}
              tileWidth={imageTileWidth}
              tileHeight={imageTileHeight}
            />
          ))}
        </motion.div>

        {/* Phase 3 — video grid fills in, underneath the scrolling headline */}
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }} aria-hidden="true">
          {Array.from({ length: VIDEO_COUNT }, (_, i) => (
            <VideoTile key={i} index={i} progress={scrollYProgress} mounted={videosMounted} />
          ))}
        </div>

        {/* Phase 2 — headline scrolls up through center and off the top */}
        <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none" aria-hidden="true">
          <motion.h2
            className="font-display text-center leading-tight text-[clamp(2rem,4.5vw,4.5rem)] max-w-4xl"
            style={{ color: '#16161A', y: textY }}
          >
            Want content?
            <br />
            We create <TextGradient as="span">any</TextGradient> content you need
          </motion.h2>
        </div>
        <h2 className="sr-only">Want content? We create any content you need</h2>
      </motion.div>
    </section>
  )
}

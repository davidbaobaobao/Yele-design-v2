'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useVideoAutoplay } from '@/hooks/useVideoAutoplay'
import { TextGradient } from '@/components/ui/text-gradient'

// Image numbers (1-indexed, matching the filenames) rendered in black &
// white instead of color — a deliberate accent among the color tiles.
const GRAYSCALE_IMAGE_NUMBERS = new Set([4, 5, 12, 14])
const PIZZA_DIR = '/media/pizza'

// Large decorative video sitting ABOVE the "Want content?" headline (a
// concrete example of "any content" rather than an abstract claim) — a
// normal-flow block (not absolutely overlapping the text), with a clear
// margin-bottom gap before the heading below it. No card frame: no
// border/radius/shadow, just a radial mask so its own rectangular edges
// dissolve into the white section background instead of reading as a
// floating tile. -webkit-mask-image is required for Safari; mask-image
// alone is unsupported there as of this writing.
function PizzaVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  useVideoAutoplay(ref)
  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={`${PIZZA_DIR}/pizza_poster.jpg`}
      className="w-full max-w-2xl aspect-video object-cover pointer-events-none mb-10 md:mb-14"
      style={{
        WebkitMaskImage: 'radial-gradient(ellipse 55% 55% at 50% 50%, black 30%, transparent 78%)',
        maskImage: 'radial-gradient(ellipse 55% 55% at 50% 50%, black 30%, transparent 78%)',
      }}
      aria-hidden="true"
    >
      <source src={`${PIZZA_DIR}/pizza_hq.webm`} type="video/webm" />
      <source src={`${PIZZA_DIR}/pizza_hq.mp4`} type="video/mp4" />
    </video>
  )
}

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

// Every tile's box, entirely in %-of-parent-container units (left/top/
// width/height) — never vw/vh. vw in particular runs a few pixels wider
// than the container's own true width whenever the page has a vertical
// scrollbar (Chrome/Firefox include the scrollbar in 100vw; the container's
// own 100%-wide box never does), which was silently misaligning the vw/vh
// image grid against the already %-based video grid.
//
// GAP_PCT is the gap BETWEEN adjacent tiles, in % of the container — edge
// tiles lose it only on their INNER side, so the grid still runs flush to
// the screen edge with zero gap there (matching a native CSS-grid `gap`,
// which is interior-only) instead of the old approach of shrinking every
// tile uniformly around its own center, which left a gap at the edges too.
const GAP_PCT = 0.3
function tileGeometry(index: number, cols: number, rows: number) {
  const col = index % cols
  const row = Math.floor(index / cols)
  const cellW = 100 / cols
  const cellH = 100 / rows
  const left = col * cellW + (col === 0 ? 0 : GAP_PCT / 2)
  const right = (col + 1) * cellW - (col === cols - 1 ? 0 : GAP_PCT / 2)
  const top = row * cellH + (row === 0 ? 0 : GAP_PCT / 2)
  const bottom = (row + 1) * cellH - (row === rows - 1 ? 0 : GAP_PCT / 2)
  return {
    width: right - left,
    height: bottom - top,
    centerX: (left + right) / 2,
    centerY: (top + bottom) / 2,
  }
}

// Phase 1 entry: every tile starts just below the viewport (positive
// translateY) and rises straight up its own column into its grid slot.
// IMAGE_START_Y is in the same 0-100 "% of parent" scale as tileGeometry's
// centerY — 100 is right at the bottom edge, so tiles start entering frame
// immediately instead of spending any of the phase invisibly below the
// fold.
const IMAGE_START_Y = 100
const IMAGE_START_SCALE = 0.94
// Per-tile start delay, straight left-to-right by column index (was
// symmetric-around-center for a pyramid shape) plus a small per-row offset
// for a gentle wave — columns now visibly reveal left to right instead of
// peaking in the middle.
const COL_STAGGER = 0.035
const ROW_STAGGER = 0.02

// ---- Phase boundaries, in overall section scroll progress (0-1). Total
// section height is 630vh (was 750vh — see below), so each fraction below
// still spans a lot more real scroll distance than the numbers alone
// suggest.
//
// The text phase used to run 240vh (0.32 of the old 750vh total) and felt
// like too much empty scrolling for a two-line headline, so it's now
// halved to 120vh. Every boundary from TEXT_RANGE_END onward is
// recalculated so its ABSOLUTE vh position — and so the video phase's own
// pacing — stays exactly what it was before; only the text phase itself,
// and the total height it removed, actually changed:
//   old total 750vh -> new total 630vh (-120vh, exactly the text-phase cut)
//   every *_new fraction below = (old fraction * 750 [+/- the 120vh cut if
//   it falls after the cut]) / 630 ----
const PHASE1_END = 180 / 630 // was 0.24 of 750vh -> same 180vh of 630vh
// Image grid EXIT: scrolls straight up and off the top (no fade) as the
// text arrives, instead of the old opacity fade-out.
const IMAGE_EXIT_START = 180 / 630 // was 0.24 of 750vh -> same 180vh
const IMAGE_EXIT_END = 255 / 630 // was 0.34 of 750vh -> same 255vh
// Headline scrolls through as one continuous translateY move: below the
// viewport at TEXT_RANGE_START, through center, off the top by
// TEXT_RANGE_END — that span is now 120vh (was 240vh).
const TEXT_RANGE_START = 225 / 630 // was 0.3 of 750vh -> same 225vh
const TEXT_RANGE_END = 345 / 630 // 225vh + the new (halved) 120vh span
// Video tiles start arriving right as the text has fully cleared the top.
const PHASE3_START = 345 / 630 // matches TEXT_RANGE_END, same as before
const IMAGE_SPAN = 0.55
const VIDEO_STAGGER = 6 / 630 // was 0.008 of 750vh (6vh) -> same 6vh
const VIDEO_SPAN = 165 / 630 // was 0.22 of 750vh (165vh) -> same 165vh
// Section bg fades white -> black over this window, timed so it's well
// underway by the time video tiles are substantially visible, and doesn't
// overlap the headline's own visible (centered, ink-on-white) moment.
const BG_DARK_START = 330 / 630 // was 0.6 of 750vh (450vh) -> same 330vh
const BG_DARK_END = 420 / 630 // was 0.72 of 750vh (540vh) -> same 420vh

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
}: {
  index: number
  progress: MotionValue<number>
  cols: number
  rows: number
}) {
  const { width, height, centerX, centerY } = tileGeometry(index, cols, rows)
  const col = index % cols
  const row = Math.floor(index / cols)
  const tileStart = col * COL_STAGGER + row * ROW_STAGGER
  const tileEnd = tileStart + IMAGE_SPAN

  const t = useTransform(progress, v => {
    const local = linearMap(0, PHASE1_END, 0, 1)(v)
    return easeOutCubic(linearMap(tileStart, tileEnd, 0, 1)(local))
  })

  // Straight vertical rise — the column never moves horizontally, only up.
  // left/top are %-of-parent (never vw/vh — see tileGeometry); x/y here are
  // the standard translate(-50%,-50%) self-centering trick, which IS
  // relative to the tile's own box, not the viewport.
  const top = useTransform(t, tv => `${IMAGE_START_Y + (centerY - IMAGE_START_Y) * tv}%`)
  const scale = useTransform(t, tv => IMAGE_START_SCALE + (1 - IMAGE_START_SCALE) * tv)
  const opacity = t

  const n = index + 1
  const ext = IMAGE_EXT[n] ?? 'jpeg'
  const grayscale = GRAYSCALE_IMAGE_NUMBERS.has(n)

  return (
    <motion.div
      className="absolute overflow-hidden pointer-events-none"
      style={{
        left: `${centerX}%`,
        top,
        width: `${width}%`,
        height: `${height}%`,
        x: '-50%',
        y: '-50%',
        scale,
        opacity,
      }}
    >
      <Image
        src={`${IMAGE_DIR}/${n}.${ext}`}
        alt=""
        fill
        sizes="20vw"
        className={grayscale ? 'object-cover grayscale' : 'object-cover'}
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
  const { width, height, centerX, centerY } = tileGeometry(index, VIDEO_COLS, VIDEO_ROWS)
  const tileStart = PHASE3_START + index * VIDEO_STAGGER
  const tileEnd = tileStart + VIDEO_SPAN

  const t = useTransform(progress, v => easeOutCubic(linearMap(tileStart, tileEnd, 0, 1)(v)))
  const scale = useTransform(t, tv => 0.55 + 0.45 * tv)
  const opacity = t

  const videoRef = useRef<HTMLVideoElement>(null)
  const n = index + 1
  const poster = `${VIDEO_DIR}/${n}_poster.jpg`

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
        left: `${centerX}%`,
        top: `${centerY}%`,
        x: '-50%',
        y: '-50%',
        width: `${width}%`,
        height: `${height}%`,
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
                  <Image
                    src={`${IMAGE_DIR}/${n}.${IMAGE_EXT[n] ?? 'jpeg'}`}
                    alt=""
                    fill
                    sizes="20vw"
                    className={GRAYSCALE_IMAGE_NUMBERS.has(n) ? 'object-cover grayscale' : 'object-cover'}
                  />
                </div>
              )
            })}
          </motion.div>

          <motion.div
            className="flex flex-col items-center py-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <PizzaVideo />
            <h2
              className="font-display text-center leading-tight text-[clamp(1.75rem,3.5vw,3.5rem)]"
              style={{ color: '#16161A' }}
            >
              Want content?
              <br />
              We create <TextGradient as="span">any</TextGradient> content
              <br />
              you need
            </h2>
          </motion.div>
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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Mount videos ~30vh before PHASE3_START so they have a head start loading
  // before they need to animate in (315/630 == old 30vh-before-PHASE3_START
  // gap, preserved after the text-phase rescale above).
  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (v > 315 / 630) setVideosMounted(mounted => mounted || true)
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
    <section ref={sectionRef} className="relative" style={{ height: '630vh' }}>
      {/* data-nav-hide: Nav watches for this attribute and hides itself
          (opacity 0) for as long as this pinned section is on screen,
          restoring once it scrolls past — the fixed header would otherwise
          sit awkwardly on top of this section's own full-bleed content. */}
      <motion.div
        data-nav-hide
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ backgroundColor: bgColor, perspective: '1000px' }}
      >
        {/* Phase 1 — images rise from below into a pyramid -> 5x4 grid, then
            scroll straight up off-screen as a single group (no fade). */}
        <motion.div className="absolute inset-0" style={{ y: imageLayerY, transformStyle: 'preserve-3d' }} aria-hidden="true">
          {Array.from({ length: IMAGE_COUNT }, (_, i) => (
            <ImageTile key={i} index={i} progress={scrollYProgress} cols={imageCols} rows={imageRows} />
          ))}
        </motion.div>

        {/* Phase 3 — video grid fills in, underneath the scrolling headline */}
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }} aria-hidden="true">
          {Array.from({ length: VIDEO_COUNT }, (_, i) => (
            <VideoTile key={i} index={i} progress={scrollYProgress} mounted={videosMounted} />
          ))}
        </div>

        {/* Phase 2 — video, headline, and arrow scroll up through center and
            off the top together as one stacked column, sharing the same
            textY. */}
        <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none" aria-hidden="true">
          <motion.div className="flex flex-col items-center" style={{ y: textY }}>
            <PizzaVideo />
            <h2 className="font-display text-center leading-tight text-[clamp(1.75rem,3.75vw,3.75rem)] max-w-4xl" style={{ color: '#16161A' }}>
              Want content?
              <br />
              We create <TextGradient as="span">any</TextGradient> content
              <br />
              you need
            </h2>
            <motion.svg
              className="mt-10"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16161A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path d="M6 9l6 6 6-6" />
            </motion.svg>
          </motion.div>
        </div>
        <h2 className="sr-only">Want content? We create any content you need</h2>
      </motion.div>
    </section>
  )
}

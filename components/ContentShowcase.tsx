'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useVideoAutoplay } from '@/hooks/useVideoAutoplay'
import { TextGradient } from '@/components/ui/text-gradient'

// Image numbers (1-indexed, matching the filenames) rendered in black &
// white instead of color — a deliberate accent among the color tiles.
const GRAYSCALE_IMAGE_NUMBERS = new Set([4, 5, 12, 14])
const PIZZA_DIR = '/media/pizza'
const SECTION_BG = '#0D0E12'

// Large decorative video sitting ABOVE the "Want content?" headline (a
// concrete example of "any content" rather than an abstract claim) — a
// normal-flow block (not absolutely overlapping the text), with a clear
// margin-bottom gap before the heading below it. No card frame: no
// border/radius/shadow, just a radial mask so its own rectangular edges
// dissolve into the section background instead of reading as a floating
// tile. -webkit-mask-image is required for Safari; mask-image alone is
// unsupported there as of this writing.
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

const IMAGE_DIR = '/media/animationimages'
const VIDEO_DIR = '/media/animationvideos'
// 20 (not all 21 available) so the grid divides into a clean, fully-aligned
// 5x4 with zero empty/mismatched cells — a 5x5 (25 slots for 21 images)
// would leave an asymmetric, mostly-empty last row.
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

// Every tile's box, entirely in %-of-parent-container units (left/top/
// width/height) — never vw/vh. vw in particular runs a few pixels wider
// than the container's own true width whenever the page has a vertical
// scrollbar (Chrome/Firefox include the scrollbar in 100vw; the container's
// own 100%-wide box never does), which would silently misalign a vw/vh grid.
//
// GAP_PCT is the gap BETWEEN adjacent tiles, in % of the container — edge
// tiles lose it only on their INNER side, so the grid still runs flush to
// the screen edge with zero gap there (matching a native CSS-grid `gap`,
// which is interior-only).
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

// ---- Reveal timing, all expressed as fractions of EACH wrapper's OWN
// local scroll progress (0-1) — not the old design's shared 630vh timeline.
// REVEAL_END spans nearly the WHOLE wrapper range (not a short early burst)
// so the first tile (tileStart=0) starts moving on the very first pixel of
// scroll and the rest cascade in continuously as you keep scrolling, with
// the last tile settling a little before the wrapper releases — no idle
// dead zone before it starts and no early-burst-then-long-static-hold
// after. Same constants drive both the image and video grids so the two
// reveals feel identical.
const REVEAL_END = 1
const START_Y = 100 // tiles start just below the viewport, in tileGeometry's 0-100 scale
const START_SCALE = 0.94
const COL_STAGGER = 0.035
const ROW_STAGGER = 0.02
const TILE_SPAN = 0.6

// Below this width, the desktop 5x4 grid produces awkward cells — swap to
// a 4x5 layout instead (clean factor pair of 20, taller/narrower cells
// suiting a narrow viewport).
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

// Shared rise-from-below-into-grid-slot transform, used by both image and
// video tiles so the two reveals move identically. `progress` is the
// wrapper's own local 0-1 scroll fraction (not a global timeline).
function useTileReveal(progress: MotionValue<number>, index: number, cols: number, rows: number) {
  const { width, height, centerX, centerY } = tileGeometry(index, cols, rows)
  const col = index % cols
  const row = Math.floor(index / cols)
  const tileStart = col * COL_STAGGER + row * ROW_STAGGER
  const tileEnd = tileStart + TILE_SPAN

  const t = useTransform(progress, v => {
    const local = linearMap(0, REVEAL_END, 0, 1)(v)
    return easeOutCubic(linearMap(tileStart, tileEnd, 0, 1)(local))
  })

  const top = useTransform(t, tv => `${START_Y + (centerY - START_Y) * tv}%`)
  const scale = useTransform(t, tv => START_SCALE + (1 - START_SCALE) * tv)

  return { width, height, centerX, top, scale, opacity: t }
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
  const { width, height, centerX, top, scale, opacity } = useTileReveal(progress, index, cols, rows)
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
  const { width, height, centerX, top, scale, opacity } = useTileReveal(progress, index, VIDEO_COLS, VIDEO_ROWS)
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
        top,
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

// Text bridge between the two pinned grids — plain scroll flow (not
// pinned), same simple whileInView treatment used by the reduced-motion
// fallback. Deliberately white/ink against the black grids on either side
// for a strong contrast beat (black -> white text moment -> black), not a
// seamless transition.
function WantContentHeadline() {
  return (
    <section className="relative py-24 px-6" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <motion.div
          className="flex flex-col items-center"
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
  )
}

// One tall (~190vh) wrapper + sticky inner + its OWN useScroll progress —
// the shared shape behind both PinnedImageGrid and PinnedVideoGrid below.
// Sticky naturally releases once the wrapper's remaining height runs out,
// which is the "exit" — no custom exit transform needed, unlike the old
// single-630vh design which had to scroll the image layer off-screen by
// hand to make room for what came next.
function PinnedReveal({
  count,
  renderTile,
}: {
  count: number
  renderTile: (index: number, progress: MotionValue<number>) => React.ReactNode
}) {
  const wrapperRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end end'] })

  return (
    <section ref={wrapperRef} className="relative" style={{ height: '190vh' }}>
      {/* data-nav-hide: Nav watches for this attribute and hides itself
          (opacity 0) for as long as a pinned section is on screen,
          restoring once it scrolls past — the fixed header would otherwise
          sit awkwardly on top of this full-bleed grid. */}
      <div data-nav-hide className="sticky top-0 h-screen w-full overflow-hidden" style={{ backgroundColor: SECTION_BG }}>
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }} aria-hidden="true">
          {Array.from({ length: count }, (_, i) => renderTile(i, scrollYProgress))}
        </div>
      </div>
    </section>
  )
}

function PinnedImageGrid() {
  const isNarrow = useIsNarrowViewport()
  const cols = isNarrow ? 4 : IMAGE_COLS
  const rows = isNarrow ? 5 : IMAGE_ROWS
  return (
    <PinnedReveal
      count={IMAGE_COUNT}
      renderTile={(i, progress) => <ImageTile key={i} index={i} progress={progress} cols={cols} rows={rows} />}
    />
  )
}

function PinnedVideoGrid() {
  const [mounted, setMounted] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  // Mounts videos once this grid is getting close to view (rootMargin
  // preloads slightly ahead) — decoupled from the old shared-timeline
  // hack now that this is its own independent section.
  useEffect(() => {
    const el = anchorRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) setMounted(true)
      },
      { rootMargin: '200px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={anchorRef}>
      <PinnedReveal
        count={VIDEO_COUNT}
        renderTile={(i, progress) => <VideoTile key={i} index={i} progress={progress} mounted={mounted} />}
      />
    </div>
  )
}

// Static fallback for prefers-reduced-motion — no pin, no scroll-driven
// reveal, just the finished grids and text in normal document flow.
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
      <section className="relative py-24 px-6" style={{ backgroundColor: SECTION_BG }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 md:grid-cols-5 gap-1">
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
          </div>
        </div>
      </section>

      <section className="relative py-24 px-6" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto flex flex-col items-center">
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
        </div>
      </section>

      <section className="relative py-24 px-6" style={{ backgroundColor: SECTION_BG }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-1">
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
          </div>
        </div>
      </section>
    </>
  )
}

export default function ContentShowcase() {
  const reduceMotion = !!useHydratedReducedMotion()
  if (reduceMotion) return <ContentShowcaseReduced />

  return (
    <>
      <PinnedImageGrid />
      <WantContentHeadline />
      <PinnedVideoGrid />
    </>
  )
}

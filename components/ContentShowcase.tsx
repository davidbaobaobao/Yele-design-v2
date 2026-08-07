'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

// Image numbers (1-indexed, matching the filenames) rendered in black &
// white instead of color — a deliberate accent among the color tiles.
const GRAYSCALE_IMAGE_NUMBERS = new Set([4, 5, 12, 14])
const SECTION_BG = '#0D0E12'

// Flat brand pink (not TextGradient) with the same soft opacity pulse used
// elsewhere on the site (StatsBold's "∞", AgencyIntro's "From $99/mo.") —
// shared by the "*" separators and "any" in the marquee below.
function PinkPulse({ children, reduceMotion }: { children: React.ReactNode; reduceMotion: boolean }) {
  return (
    <motion.span
      style={{ color: '#D46FC8' }}
      animate={reduceMotion ? {} : { opacity: [1, 0.55, 1] }}
      transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.span>
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

// ---- Pyramid-staggered reveal. Instead of every tile starting fully
// hidden and snapping into place during a short early burst, each column
// (image grid) / row (video grid) starts at its OWN partial-reveal
// baseline — the center column / top row already mostly resolved — so
// something is on screen the instant the section is entered. As the user
// keeps scrolling, every tile's `t` (0 = still at its starting offset, 1 =
// settled in its final grid slot) rises from that baseline to 1, so the
// whole grid resolves smoothly and continuously over the section's (long)
// pinned scroll range instead of jumping in on one fast flick.
const START_Y = 100 // both grids: tiles start below the viewport, tileGeometry's 0-100 scale
const START_SCALE = 0.94

// Column pyramid — center column already 80% resolved at entry, tapering
// linearly to 20% at the outermost columns. Derived from distance-to-center
// (not a fixed lookup table) so the narrow 4-col mobile image layout gets
// the same shape as the 5-col desktop one. Shared by both grids — both rise
// from below using this baseline as-is.
function columnInitialReveal(col: number, cols: number) {
  const centerCol = (cols - 1) / 2
  const maxDist = centerCol
  if (maxDist === 0) return 0.8
  const dist = Math.abs(col - centerCol)
  return 0.8 - 0.6 * (dist / maxDist)
}

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

// Image grid: vertical rise, staggered by COLUMN.
function useVerticalTileReveal(progress: MotionValue<number>, index: number, cols: number, rows: number) {
  const { width, height, centerX, centerY } = tileGeometry(index, cols, rows)
  const col = index % cols
  const base = columnInitialReveal(col, cols)

  const t = useTransform(progress, v => base + (1 - base) * easeOutCubic(v))
  const top = useTransform(t, tv => `${START_Y + (centerY - START_Y) * tv}%`)
  const scale = useTransform(t, tv => START_SCALE + (1 - START_SCALE) * tv)

  return { width, height, left: centerX, top, scale, opacity: t }
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
  const { width, height, left, top, scale, opacity } = useVerticalTileReveal(progress, index, cols, rows)
  const n = index + 1
  const ext = IMAGE_EXT[n] ?? 'jpeg'
  const grayscale = GRAYSCALE_IMAGE_NUMBERS.has(n)

  return (
    <motion.div
      className="absolute overflow-hidden pointer-events-none"
      style={{
        left: `${left}%`,
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
  const { width, height, left, top, scale, opacity } = useVerticalTileReveal(progress, index, VIDEO_COLS, VIDEO_ROWS)
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
      // preload="none" means nothing is buffered until this fires, so iOS is
      // more likely to reject the first attempt — retry once the load has
      // had a moment to start, same as every other video on the site.
      v.play().catch(() => {
        setTimeout(() => {
          if (v.paused || v.ended) {
            v.muted = true
            v.play().catch(err => console.warn('[video autoplay] rejected after retry:', err?.name, err?.message, v.currentSrc))
          }
        }, 300)
      })
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
        left: `${left}%`,
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
          autoPlay
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

// Big centered overlay text sitting IN FRONT of a tile grid, on a fully
// transparent background — no wash/mask of any kind, so the grid stays
// visible through the letters at all times. Bold, strong white at a high
// fixed alpha (not scroll-tied) — solid enough to dominate, with just a
// little of the media showing through. Sized to dominate the screen (the
// big word alone runs up to 22rem/22vw).
function GridOverlay({ small, big }: { small: string; big: string }) {
  const textColor = 'rgba(255, 255, 255, 0.85)'
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
      aria-hidden="true"
    >
      <span
        className="font-display font-black uppercase tracking-tight text-[clamp(1.5rem,5vw,3rem)] leading-none mb-1 md:mb-2"
        style={{ color: textColor }}
      >
        {small}
      </span>
      <span
        className="font-display font-black uppercase tracking-tighter text-[clamp(6rem,22vw,22rem)] leading-[0.82]"
        style={{ color: textColor }}
      >
        {big}
      </span>
    </div>
  )
}

// One repeating "Want content? * We create any content *" block — rendered
// twice back-to-back inside a track that animates translateX(0 -> -50%),
// the same seamless-loop marquee trick as ContactForm's "CONTACT US *" run
// and LogoMarquee (hero-marquee-track / marqueeLeft in globals.css). Never
// pauses on hover.
function WantContentRun({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="flex items-center shrink-0">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-center shrink-0">
          <span className="font-display font-bold whitespace-nowrap text-[clamp(1.75rem,4.5vw,3.5rem)]" style={{ color: '#F2F0EB' }}>
            Want content?
          </span>
          <span className="font-display font-bold mx-6 md:mx-10 text-[clamp(1.75rem,4.5vw,3.5rem)]">
            <PinkPulse reduceMotion={reduceMotion}>*</PinkPulse>
          </span>
          <span className="font-display font-bold whitespace-nowrap text-[clamp(1.75rem,4.5vw,3.5rem)]" style={{ color: '#F2F0EB' }}>
            We create <PinkPulse reduceMotion={reduceMotion}>any</PinkPulse> content
          </span>
          <span className="font-display font-bold mx-6 md:mx-10 text-[clamp(1.75rem,4.5vw,3.5rem)]">
            <PinkPulse reduceMotion={reduceMotion}>*</PinkPulse>
          </span>
        </div>
      ))}
    </div>
  )
}

// Sits after the video grid now (moved from between the two grids) — same
// #0D0E12 as every other dark section, so it flows straight off the video
// grid instead of reading as its own light beat. want-content-marquee-track
// is the same marqueeLeft loop as hero-marquee-track, just ~22% slower.
function WantContentMarquee() {
  const reduceMotion = !!useHydratedReducedMotion()
  return (
    <section className="relative overflow-hidden py-16 md:py-20" style={{ backgroundColor: SECTION_BG }}>
      <div className="want-content-marquee-track flex items-center" style={{ width: 'max-content' }}>
        <WantContentRun reduceMotion={reduceMotion} />
        <WantContentRun reduceMotion={reduceMotion} />
      </div>
    </section>
  )
}

// One tall (~320vh) wrapper + sticky inner + its OWN useScroll progress —
// the shared shape behind both PinnedImageGrid and PinnedVideoGrid below.
// Long enough that the pyramid reveal takes several controlled scrolls to
// resolve rather than being jumpable in one fast flick. Sticky naturally
// releases once the wrapper's remaining height runs out, which is the
// "exit" — no custom exit transform needed, unlike the old single-630vh
// design which had to scroll the image layer off-screen by hand to make
// room for what came next.
function PinnedReveal({
  count,
  renderTile,
  overlay,
}: {
  count: number
  renderTile: (index: number, progress: MotionValue<number>) => React.ReactNode
  overlay?: (progress: MotionValue<number>) => React.ReactNode
}) {
  const wrapperRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end end'] })

  return (
    <section ref={wrapperRef} className="relative" style={{ height: '320vh' }}>
      {/* data-nav-hide: Nav watches for this attribute and hides itself
          (opacity 0) for as long as a pinned section is on screen,
          restoring once it scrolls past — the fixed header would otherwise
          sit awkwardly on top of this full-bleed grid. */}
      <div data-nav-hide className="sticky top-0 h-screen w-full overflow-hidden" style={{ backgroundColor: SECTION_BG }}>
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }} aria-hidden="true">
          {Array.from({ length: count }, (_, i) => renderTile(i, scrollYProgress))}
        </div>
        {overlay?.(scrollYProgress)}
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
      overlay={() => <GridOverlay small="WE CREATE" big="IMAGES" />}
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
        overlay={() => <GridOverlay small="AND" big="VIDEOS" />}
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
      v.setAttribute('webkit-playsinline', '')
      v.muted = true
    })

    const play = (v: HTMLVideoElement) => {
      if (!v.paused && !v.ended) return
      v.muted = true
      v.play().catch(() => {
        setTimeout(() => {
          if (v.paused || v.ended) {
            v.muted = true
            v.play().catch(err => console.warn('[video autoplay] rejected after retry:', err?.name, err?.message, v.currentSrc))
          }
        }, 300)
      })
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

      {/* Static (no scrolling) stand-in for the marquee above — same
          wrapped-row treatment LogoMarquee uses for reduced motion. Sits
          after the video grid now, matching the animated version. */}
      <section className="relative py-16 px-6" style={{ backgroundColor: SECTION_BG }}>
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <span className="font-display font-bold text-[clamp(1.5rem,3.5vw,2.5rem)]" style={{ color: '#F2F0EB' }}>
            Want content?
          </span>
          <span className="font-display font-bold text-[clamp(1.5rem,3.5vw,2.5rem)]" style={{ color: '#D46FC8' }}>
            *
          </span>
          <span className="font-display font-bold text-[clamp(1.5rem,3.5vw,2.5rem)]" style={{ color: '#F2F0EB' }}>
            We create <span style={{ color: '#D46FC8' }}>any</span> content
          </span>
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
      <PinnedVideoGrid />
      <WantContentMarquee />
    </>
  )
}

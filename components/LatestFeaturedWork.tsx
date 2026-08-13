'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValueEvent, useScroll, type Transition } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useCappedVideoPlayback } from '@/hooks/useCappedVideoPlayback'
import { useEarlyLoad } from '@/hooks/useEarlyLoad'
import PosterVideo from '@/components/ui/poster-video'

// One-screen (100vh), full-bleed (100vw) Superside-style horizontal-pan
// gallery: a 2-row CSS grid (grid-auto-flow-free — every tile gets an
// EXPLICIT col/row so the mixed row/col spans below place predictably)
// that's wider than the viewport, scrolled horizontally inside its own
// overflow-x container while the rest of the page stays put. Self-contained
// white->black flip (same one-shot ~500ms tween mechanic as HowWeWork/
// DealStatement), anchored on the SECTION's own bottom edge (not a content
// element, since the name/description bar is now an absolute overlay, not
// part of normal document flow) — fires once the section is mostly
// scrolled past so it reads as fully black before it's gone. NOT shared
// with DealStatement/BeyondWebsite/StatsBold's own DealFadeContext group.
const DARK_BG = '#0D0E12'
const LIGHT_BG = '#FFFFFF'
const DARK_TEXT = '#FFFFFF'
const LIGHT_TEXT = '#16161A'
const DARK_SECONDARY = 'rgba(242, 240, 235, 0.7)'
const LIGHT_SECONDARY = 'rgba(22, 22, 26, 0.6)'
const DARK_CARD_BG = 'rgba(255, 255, 255, 0.06)'
const LIGHT_CARD_BG = '#F7F6F3'
const DARK_BAR_BG = 'rgba(13, 14, 18, 0.9)'
const LIGHT_BAR_BG = 'rgba(255, 255, 255, 0.9)'
const MEDIA_BG = '#EEEDE9'
const FLIP_TRANSITION: Transition = { duration: 0.5, ease: 'easeInOut' }
// Lead time (as a fraction of one viewport height) before the section is
// fully scrolled past — the fade starts once less than this fraction of a
// full viewport remains, since the section's own height equals exactly one
// viewport height.
const FADE_LEAD_FRACTION = 0.35
// Cursor must be within this many px of the scroll area's edge to trigger
// auto-pan; px/frame speed for that auto-pan.
const EDGE_HOVER_ZONE = 90
const EDGE_HOVER_SPEED = 14

type FeaturedProject = {
  name: string
  description: string
  bullets: string[]
  mediaDir: string
  // Filenames (no extension) per gallery slot — see the grid below for
  // what each one renders as.
  col1Video: string
  col2TallImage: string
  col3TopImage: string
  col3BottomImage: string
  col45Video: string
  col4BottomImage: string
  col5BottomImage: string
}

// One project for now — structured as an array with a single active entry
// (PROJECTS[0]) so a future slideshow/carousel only needs to add
// activeIndex state + nav arrows/dots here, not rework this layout.
const PROJECTS: FeaturedProject[] = [
  {
    name: 'Restoration Bros',
    description:
      "Tampa's leading water-damage and disaster-restoration specialists — reachable 24/7, when every minute counts.",
    bullets: [
      'Instant AI quotes — pricing, availability and timelines on the spot.',
      'Self-scheduling on a synced calendar — booked and confirmed instantly.',
      'AI chat answering pricing, damage, timing and booking, 24/7.',
      'Local SEO for their service area — more qualified leads.',
    ],
    mediaDir: '/media/renovationbros',
    col1Video: '1',
    col2TallImage: '2',
    col3TopImage: '3',
    col3BottomImage: '4',
    col45Video: '5',
    col4BottomImage: '6',
    col5BottomImage: '7',
  },
]

// h-full so every tile fills its own row (or row-span-2 area); width comes
// purely from aspect-ratio × that fixed height, via grid-auto-columns:
// max-content on the grid itself — nothing stretches, nothing overlaps.
const TILE_CLASS = 'relative h-full rounded-2xl overflow-hidden'

export default function LatestFeaturedWork() {
  const reduceMotion = !!useHydratedReducedMotion()
  const project = PROJECTS[0]

  const sectionRef = useRef<HTMLElement>(null)
  const sectionBottomRef = useRef(0)
  const [pastThreshold, setPastThreshold] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const col1VideoRef = useRef<HTMLVideoElement>(null)
  const col45VideoRef = useRef<HTMLVideoElement>(null)
  useCappedVideoPlayback([col1VideoRef, col45VideoRef], { reduceMotion })
  useEarlyLoad(col1VideoRef)
  useEarlyLoad(col45VideoRef)

  // Anchored on the SECTION's own bottom edge — re-measured on
  // resize/load/body mutation since content above this section can still
  // be reflowing the page after mount, same as HowWeWork/DealStatement's
  // own version of this pattern.
  useEffect(() => {
    const measure = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      sectionBottomRef.current = rect.top + window.scrollY + rect.height
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
  }, [])

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', v => {
    // Fires once fewer than FADE_LEAD_FRACTION of a viewport-height remain
    // before the section (exactly one viewport tall) has fully scrolled
    // past, so it reads as fully black well before it actually leaves.
    const past = v >= sectionBottomRef.current - window.innerHeight * FADE_LEAD_FRACTION
    setPastThreshold(prev => (prev === past ? prev : past))
  })

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('nav:fademode', { detail: { dark: pastThreshold } }))
  }, [pastThreshold])

  // Horizontal pan: native trackpad/touch horizontal scroll and mouse-drag
  // both work via plain overflow-x-auto with no JS. This effect only adds
  // the two "on top" behaviors: (1) forwarding a plain vertical wheel
  // gesture into horizontal scroll while there's still unrevealed content
  // in that direction (falls through to normal page scroll once fully
  // panned, or when scrolling back the other way past the start), and
  // (2) click-and-drag panning for mouse users. atStart/atEnd track scroll
  // position for the edge-fade hint and to gate the wheel handoff.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const updateEdges = () => {
      setAtStart(el.scrollLeft <= 1)
      setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 1)
    }
    updateEdges()
    el.addEventListener('scroll', updateEdges, { passive: true })

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return // already a horizontal gesture — let the browser handle it natively
      const goingRight = e.deltaY > 0
      const canGoRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 1
      const canGoLeft = el.scrollLeft > 1
      if ((goingRight && !canGoRight) || (!goingRight && !canGoLeft)) return // exhausted in this direction — let the page scroll vertically instead
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    el.addEventListener('wheel', onWheel, { passive: false })

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

    // Optional edge-hover auto-scroll: cursor near either edge pans that
    // direction continuously (skipped entirely under reduced motion — an
    // ambient effect the user didn't directly drive).
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
    }
    const onPointerLeave = () => {
      hoverDir = 0
    }
    if (!reduceMotion) {
      el.addEventListener('pointermove', onPointerMoveForHover)
      el.addEventListener('pointerleave', onPointerLeave)
      rafId = requestAnimationFrame(step)
    }

    return () => {
      el.removeEventListener('scroll', updateEdges)
      el.removeEventListener('wheel', onWheel)
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
  const cardBg = pastThreshold ? DARK_CARD_BG : LIGHT_CARD_BG
  const barBg = pastThreshold ? DARK_BAR_BG : LIGHT_BAR_BG

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

      <motion.span
        className="block shrink-0 font-mono text-sm px-3 md:px-4 pt-8 pb-4"
        animate={{ color: secondaryColor }}
        transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
      >
        LATEST FEATURED WORK
      </motion.span>

      {/* Horizontal-pan gallery — fills the remaining section height
          (min-h-0 lets a flex child actually shrink to that, instead of
          overflowing based on its content's natural size). The grid
          itself is w-max (shrink-to-fit its own content) so it can be
          WIDER than the viewport and trigger this wrapper's overflow-x. */}
      <div className="relative flex-1 min-h-0">
        <div
          ref={scrollRef}
          className="h-full w-full overflow-x-auto overflow-y-hidden cursor-grab [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div
            className="grid h-full w-max gap-3 px-3 md:px-4 grid-rows-2"
            style={{ gridTemplateColumns: 'repeat(5, max-content)' }}
          >
            {/* 1 — video, row 1 */}
            <div className={`${TILE_CLASS} aspect-[4/3]`} style={{ gridColumn: 1, gridRow: 1, backgroundColor: MEDIA_BG }}>
              <PosterVideo
                videoRef={col1VideoRef}
                poster={`${project.mediaDir}/${project.col1Video}_poster.webp`}
                posterAlt={`${project.name} — project video`}
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={`${project.mediaDir}/${project.col1Video}.mp4`} type="video/mp4" />
              </PosterVideo>
            </div>

            {/* bullets card, row 2 — same column as the video above it */}
            <motion.div
              className="h-full aspect-[4/3] rounded-2xl p-5 flex flex-col justify-center overflow-y-auto"
              style={{ gridColumn: 1, gridRow: 2 }}
              animate={{ backgroundColor: cardBg }}
              transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
            >
              <ul className="flex flex-col gap-2.5">
                {project.bullets.map(b => (
                  <motion.li
                    key={b}
                    className="font-body text-[13px] leading-snug flex gap-2"
                    animate={{ color: textColor }}
                    transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
                  >
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D46FC8]" />
                    <span>{b}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* 2 — tall 1:2 image, spans both rows */}
            <div
              className={`${TILE_CLASS} aspect-[1/2]`}
              style={{ gridColumn: 2, gridRow: '1 / span 2', backgroundColor: MEDIA_BG }}
            >
              <Image
                src={`${project.mediaDir}/${project.col2TallImage}.webp`}
                alt={`${project.name} — project photo`}
                fill
                sizes="40vh"
                className="object-cover"
              />
            </div>

            {/* 3 — image, row 1 */}
            <div className={`${TILE_CLASS} aspect-[4/3]`} style={{ gridColumn: 3, gridRow: 1, backgroundColor: MEDIA_BG }}>
              <Image src={`${project.mediaDir}/${project.col3TopImage}.webp`} alt="" fill sizes="35vh" className="object-cover" />
            </div>

            {/* 4 — image, row 2, same column as 3 */}
            <div className={`${TILE_CLASS} aspect-[4/3]`} style={{ gridColumn: 3, gridRow: 2, backgroundColor: MEDIA_BG }}>
              <Image src={`${project.mediaDir}/${project.col3BottomImage}.webp`} alt="" fill sizes="35vh" className="object-cover" />
            </div>

            {/* 5 — landscape video, row 1, spanning cols 4-5 */}
            <div
              className={`${TILE_CLASS} aspect-video`}
              style={{ gridColumn: '4 / span 2', gridRow: 1, backgroundColor: MEDIA_BG }}
            >
              <PosterVideo
                videoRef={col45VideoRef}
                poster={`${project.mediaDir}/${project.col45Video}_poster.webp`}
                posterAlt={`${project.name} — project video`}
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={`${project.mediaDir}/${project.col45Video}.mp4`} type="video/mp4" />
              </PosterVideo>
            </div>

            {/* 6 — image, row 2, col 4 */}
            <div className={`${TILE_CLASS} aspect-[4/3]`} style={{ gridColumn: 4, gridRow: 2, backgroundColor: MEDIA_BG }}>
              <Image src={`${project.mediaDir}/${project.col4BottomImage}.webp`} alt="" fill sizes="35vh" className="object-cover" />
            </div>

            {/* 7 — image, row 2, col 5 */}
            <div className={`${TILE_CLASS} aspect-[4/3]`} style={{ gridColumn: 5, gridRow: 2, backgroundColor: MEDIA_BG }}>
              <Image src={`${project.mediaDir}/${project.col5BottomImage}.webp`} alt="" fill sizes="35vh" className="object-cover" />
            </div>
          </div>
        </div>

        {/* Right-edge fade hinting more content — fades out once fully
            panned. Left-edge twin only shows once you've panned away from
            the start. Plain CSS transition (not framer-motion) since both
            states are structurally-identical gradients, just a different
            end color — browsers interpolate that natively. */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-24 transition-opacity duration-300"
          style={{
            background: `linear-gradient(to right, transparent, ${bgColor})`,
            transition: 'background 0.5s ease-in-out, opacity 0.3s ease-out',
            opacity: atEnd ? 0 : 1,
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-24 transition-opacity duration-300"
          style={{
            background: `linear-gradient(to left, transparent, ${bgColor})`,
            transition: 'background 0.5s ease-in-out, opacity 0.3s ease-out',
            opacity: atStart ? 0 : 1,
          }}
          aria-hidden="true"
        />

        {/* Name + description — pinned to the bottom, overlaying the
            gallery, staying put while the tiles pan underneath it. */}
        <motion.div
          className="absolute inset-x-0 bottom-0 flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 px-3 md:px-4 py-4 backdrop-blur-sm"
          animate={{ backgroundColor: barBg }}
          transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
        >
          <motion.h3
            className="font-display text-lg md:text-xl"
            animate={{ color: textColor }}
            transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
          >
            {project.name}
          </motion.h3>
          <motion.p
            className="font-body text-xs md:text-sm max-w-md md:text-right"
            animate={{ color: secondaryColor }}
            transition={reduceMotion ? { duration: 0 } : FLIP_TRANSITION}
          >
            {project.description}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

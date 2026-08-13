'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValueEvent, useScroll, type Transition } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useCappedVideoPlayback } from '@/hooks/useCappedVideoPlayback'
import { useEarlyLoad } from '@/hooks/useEarlyLoad'
import PosterVideo from '@/components/ui/poster-video'

// Self-contained white->black flip (same one-shot 500ms tween mechanic as
// HowWeWork/DealStatement — see either file's own comment for the full
// rationale) — NOT shared with DealStatement/BeyondWebsite/StatsBold's own
// DealFadeContext group below. This section owns its own scroll trigger so
// it's fully black by the time it scrolls out of view, independent of
// whatever "Here's the deal" is doing beneath it. Anchored on the
// name+description row at the BOTTOM of the section (its own "lower
// portion") rather than the section's top edge, so the flip fires once
// that row reaches the top of the viewport — late enough that the grid
// above has mostly scrolled past already. Media tiles (bg-[#EEEDE9]) stay
// fixed regardless, same convention as BeyondWebsite's video panels —
// they're media, not text/background.
const DARK_BG = '#0D0E12'
const LIGHT_BG = '#FFFFFF'
const DARK_TEXT = '#FFFFFF'
const LIGHT_TEXT = '#16161A'
const DARK_SECONDARY = 'rgba(242, 240, 235, 0.7)'
const LIGHT_SECONDARY = 'rgba(22, 22, 26, 0.6)'
const DARK_CARD_BG = 'rgba(255, 255, 255, 0.06)'
const LIGHT_CARD_BG = '#F7F6F3'
const MEDIA_BG = '#EEEDE9'
const FLIP_TRANSITION: Transition = { duration: 0.5, ease: 'easeInOut' }

type FeaturedProject = {
  name: string
  description: string
  bullets: string[]
  mediaDir: string
  // Filenames (no extension) per bento slot — see the grid below for what
  // each one renders as.
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

// object-cover tile shared by every grid slot — the aspect-ratio class each
// caller adds (aspect-[4/3]/aspect-[9/16]/aspect-video) governs its height
// on both mobile (single-column stack) and desktop (md:self-start keeps it
// pinned to that real aspect instead of stretching to match a taller
// sibling in the same auto row).
const TILE_CLASS = 'relative rounded-2xl overflow-hidden'

export default function LatestFeaturedWork() {
  const reduceMotion = !!useHydratedReducedMotion()
  const project = PROJECTS[0]

  const sectionRef = useRef<HTMLElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const footerPageTopRef = useRef(0)
  const [pastThreshold, setPastThreshold] = useState(false)

  const col1VideoRef = useRef<HTMLVideoElement>(null)
  const col45VideoRef = useRef<HTMLVideoElement>(null)
  useCappedVideoPlayback([col1VideoRef, col45VideoRef], { reduceMotion })
  useEarlyLoad(col1VideoRef)
  useEarlyLoad(col45VideoRef)

  // Anchored on the name+description row (this section's own "lower
  // portion") — re-measured on resize/load/body mutation since content
  // above this section can still be reflowing the page after mount, same
  // as HowWeWork/DealStatement's own version of this pattern.
  useEffect(() => {
    if (reduceMotion) return
    const measure = () => {
      const el = footerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      footerPageTopRef.current = rect.top + window.scrollY
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
    // Fires once the name+description row's top has scrolled up to the
    // very top of the viewport — i.e. once the grid above it has mostly
    // scrolled past, so the section reads as fully black well before it
    // actually leaves view.
    const past = v >= footerPageTopRef.current
    setPastThreshold(prev => (prev === past ? prev : past))
  })

  useEffect(() => {
    if (reduceMotion) return
    window.dispatchEvent(new CustomEvent('nav:fademode', { detail: { dark: pastThreshold } }))
  }, [pastThreshold, reduceMotion])

  if (reduceMotion) {
    return (
      <section id="trabajos" className="relative bg-white py-28 scroll-mt-24">
        <span className="block font-mono text-sm text-muted mb-4 px-3 md:px-4">LATEST FEATURED WORK</span>

        <div className="grid grid-cols-1 gap-3 mt-10 px-3 md:px-4">
          <div className={`${TILE_CLASS} aspect-[4/3]`} style={{ backgroundColor: MEDIA_BG }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${project.mediaDir}/${project.col1Video}_poster.webp`}
              alt={`${project.name} — project photo`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="rounded-2xl p-5" style={{ backgroundColor: LIGHT_CARD_BG }}>
            <ul className="flex flex-col gap-2.5">
              {project.bullets.map(b => (
                <li key={b} className="font-body text-[13px] leading-snug text-ink flex gap-2">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D46FC8]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${TILE_CLASS} aspect-[9/16]`} style={{ backgroundColor: MEDIA_BG }}>
            <Image src={`${project.mediaDir}/${project.col2TallImage}.webp`} alt={`${project.name} — project photo`} fill sizes="100vw" className="object-cover" />
          </div>
          <div className={`${TILE_CLASS} aspect-[4/3]`} style={{ backgroundColor: MEDIA_BG }}>
            <Image src={`${project.mediaDir}/${project.col3TopImage}.webp`} alt="" fill sizes="100vw" className="object-cover" />
          </div>
          <div className={`${TILE_CLASS} aspect-[4/3]`} style={{ backgroundColor: MEDIA_BG }}>
            <Image src={`${project.mediaDir}/${project.col3BottomImage}.webp`} alt="" fill sizes="100vw" className="object-cover" />
          </div>
          <div className={`${TILE_CLASS} aspect-[4/3]`} style={{ backgroundColor: MEDIA_BG }}>
            <Image src={`${project.mediaDir}/${project.col4BottomImage}.webp`} alt="" fill sizes="100vw" className="object-cover" />
          </div>
          <div className={`${TILE_CLASS} aspect-[4/3]`} style={{ backgroundColor: MEDIA_BG }}>
            <Image src={`${project.mediaDir}/${project.col5BottomImage}.webp`} alt="" fill sizes="100vw" className="object-cover" />
          </div>
          <div className={`${TILE_CLASS} aspect-video`} style={{ backgroundColor: MEDIA_BG }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${project.mediaDir}/${project.col45Video}_poster.webp`}
              alt={`${project.name} — project photo`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 px-3 md:px-4">
          <h3 className="font-display text-2xl text-ink">{project.name}</h3>
          <p className="font-body text-sm text-muted max-w-md">{project.description}</p>
        </div>
      </section>
    )
  }

  const bgColor = pastThreshold ? DARK_BG : LIGHT_BG
  const textColor = pastThreshold ? DARK_TEXT : LIGHT_TEXT
  const secondaryColor = pastThreshold ? DARK_SECONDARY : LIGHT_SECONDARY
  const cardBg = pastThreshold ? DARK_CARD_BG : LIGHT_CARD_BG

  return (
    <section ref={sectionRef} id="trabajos" data-nav-fade className="relative py-28 scroll-mt-24">
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ backgroundColor: bgColor }}
        transition={FLIP_TRANSITION}
        aria-hidden="true"
      />
      <motion.span
        className="block font-mono text-sm mb-4 px-3 md:px-4"
        animate={{ color: secondaryColor }}
        transition={FLIP_TRANSITION}
      >
        LATEST FEATURED WORK
      </motion.span>

      {/* Full-bleed edge to edge — no outer max-width container, just a
          small px-3/md:px-4 gutter (same size as the inter-tile gap) so
          the outer tiles sit right at the viewport edge instead of having
          a large empty side margin like the rest of the page's max-w-6xl
          sections.

          5-col / 2-row bento grid on desktop; a single flowing column on
          mobile via `order-*` (each item also carries md:col-start/
          md:row-start, which fully determines its desktop position —
          order has no effect on grid items with explicit placement, so
          the two schemes coexist without needing separate markup).
          Mobile order follows the brief: video1 -> bullets -> images ->
          landscape video.

          Rows are `auto`, not a fixed split height — each small tile
          keeps its own real aspect ratio (aspect-[4/3]/aspect-video) and
          `self-start` so it never stretches to match a taller sibling
          (e.g. the wide landscape video, or the bullets card growing past
          a single image's natural height); only the tall 9:16 column
          (which spans both rows) is left to stretch, filling whatever
          height the two auto rows resolve to. */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 mt-10 px-3 md:px-4">
          <div
            className={`${TILE_CLASS} order-1 md:order-none md:col-start-1 md:row-start-1 aspect-[4/3] md:self-start`}
            style={{ backgroundColor: MEDIA_BG }}
          >
            <PosterVideo
              videoRef={col1VideoRef}
              poster={`${project.mediaDir}/${project.col1Video}_poster.webp`}
              posterAlt={`${project.name} — project video`}
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={`${project.mediaDir}/${project.col1Video}.mp4`} type="video/mp4" />
            </PosterVideo>
          </div>

          <motion.div
            className="order-2 md:order-none md:col-start-1 md:row-start-2 md:self-start rounded-2xl p-5 flex flex-col justify-center"
            animate={{ backgroundColor: cardBg }}
            transition={FLIP_TRANSITION}
          >
            <ul className="flex flex-col gap-2.5">
              {project.bullets.map(b => (
                <motion.li
                  key={b}
                  className="font-body text-[13px] leading-snug flex gap-2"
                  animate={{ color: textColor }}
                  transition={FLIP_TRANSITION}
                >
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#D46FC8]" />
                  <span>{b}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <div
            className={`${TILE_CLASS} order-3 md:order-none md:col-start-2 md:row-start-1 md:row-span-2 aspect-[9/16] md:h-full`}
            style={{ backgroundColor: MEDIA_BG }}
          >
            <Image
              src={`${project.mediaDir}/${project.col2TallImage}.webp`}
              alt={`${project.name} — project photo`}
              fill
              sizes="(min-width: 768px) 20vw, 100vw"
              className="object-cover"
            />
          </div>

          <div
            className={`${TILE_CLASS} order-4 md:order-none md:col-start-3 md:row-start-1 aspect-[4/3] md:self-start`}
            style={{ backgroundColor: MEDIA_BG }}
          >
            <Image
              src={`${project.mediaDir}/${project.col3TopImage}.webp`}
              alt=""
              fill
              sizes="(min-width: 768px) 20vw, 100vw"
              className="object-cover"
            />
          </div>

          <div
            className={`${TILE_CLASS} order-5 md:order-none md:col-start-3 md:row-start-2 aspect-[4/3] md:self-start`}
            style={{ backgroundColor: MEDIA_BG }}
          >
            <Image
              src={`${project.mediaDir}/${project.col3BottomImage}.webp`}
              alt=""
              fill
              sizes="(min-width: 768px) 20vw, 100vw"
              className="object-cover"
            />
          </div>

          <div
            className={`${TILE_CLASS} order-6 md:order-none md:col-start-4 md:row-start-2 aspect-[4/3] md:self-start`}
            style={{ backgroundColor: MEDIA_BG }}
          >
            <Image
              src={`${project.mediaDir}/${project.col4BottomImage}.webp`}
              alt=""
              fill
              sizes="(min-width: 768px) 20vw, 100vw"
              className="object-cover"
            />
          </div>

          <div
            className={`${TILE_CLASS} order-7 md:order-none md:col-start-5 md:row-start-2 aspect-[4/3] md:self-start`}
            style={{ backgroundColor: MEDIA_BG }}
          >
            <Image
              src={`${project.mediaDir}/${project.col5BottomImage}.webp`}
              alt=""
              fill
              sizes="(min-width: 768px) 20vw, 100vw"
              className="object-cover"
            />
          </div>

          <div
            className={`${TILE_CLASS} order-8 md:order-none md:col-start-4 md:col-span-2 md:row-start-1 aspect-video md:self-start`}
            style={{ backgroundColor: MEDIA_BG }}
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
        </div>

      <div ref={footerRef} className="mt-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4 px-3 md:px-4">
        <motion.h3
          className="font-display text-2xl"
          animate={{ color: textColor }}
          transition={FLIP_TRANSITION}
        >
          {project.name}
        </motion.h3>
        <motion.p
          className="font-body text-sm max-w-md md:text-right"
          animate={{ color: secondaryColor }}
          transition={FLIP_TRANSITION}
        >
          {project.description}
        </motion.p>
      </div>
    </section>
  )
}

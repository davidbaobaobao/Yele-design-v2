'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, type Transition } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useCappedVideoPlayback } from '@/hooks/useCappedVideoPlayback'
import { useEarlyLoad } from '@/hooks/useEarlyLoad'
import PosterVideo from '@/components/ui/poster-video'
import { useDealFade } from '@/components/DealFadeContext'

// Shares DealFadeContext with BeyondWebsite (directly above) and
// DealStatement/StatsBold (directly below) — same white->black flip, same
// instant, same 500ms transition, so this section reads as one continuous
// surface turning dark alongside the other three, not an independently
// timed fade. Media tiles (bg-[#EEEDE9]) stay fixed regardless, same
// convention as BeyondWebsite's video panels — they're media, not
// text/background.
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
      'Instant AI quotes — customers get pricing, availability and repair timelines on the spot, lifting conversion when speed matters most.',
      'Self-scheduling on a synced calendar — visits booked and confirmed instantly, no human back-and-forth.',
      'Smart AI chat that answers anything — pricing, damage types, repair timelines, scheduling and confirmation, 24/7.',
      'Local SEO targeted to their service area, driving a steady stream of qualified leads.',
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

// object-cover tile shared by every grid slot — aspect ratio governs its
// own standalone height on mobile (single-column stack); md:aspect-auto +
// md:h-full instead fills whatever the desktop grid cell resolves to.
const TILE_CLASS = 'relative rounded-2xl overflow-hidden'

export default function LatestFeaturedWork() {
  const reduceMotion = !!useHydratedReducedMotion()
  const { pastThreshold } = useDealFade()
  const project = PROJECTS[0]

  const col1VideoRef = useRef<HTMLVideoElement>(null)
  const col45VideoRef = useRef<HTMLVideoElement>(null)
  useCappedVideoPlayback([col1VideoRef, col45VideoRef], { reduceMotion })
  useEarlyLoad(col1VideoRef)
  useEarlyLoad(col45VideoRef)

  if (reduceMotion) {
    return (
      <section className="relative bg-white py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <span className="block font-mono text-sm text-muted mb-4">LATEST FEATURED WORK</span>

          <div className="grid grid-cols-1 gap-3 mt-10">
            <div className={`${TILE_CLASS} aspect-[4/3]`} style={{ backgroundColor: MEDIA_BG }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${project.mediaDir}/${project.col1Video}_poster.webp`}
                alt={`${project.name} — project photo`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl p-6" style={{ backgroundColor: LIGHT_CARD_BG }}>
              <ul className="flex flex-col gap-3">
                {project.bullets.map(b => (
                  <li key={b} className="font-body text-sm leading-relaxed text-ink flex gap-2.5">
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

          <div className="mt-8 flex flex-col gap-4">
            <h3 className="font-display text-2xl text-ink">{project.name}</h3>
            <p className="font-body text-sm text-muted max-w-md">{project.description}</p>
          </div>
        </div>
      </section>
    )
  }

  const bgColor = pastThreshold ? DARK_BG : LIGHT_BG
  const textColor = pastThreshold ? DARK_TEXT : LIGHT_TEXT
  const secondaryColor = pastThreshold ? DARK_SECONDARY : LIGHT_SECONDARY
  const cardBg = pastThreshold ? DARK_CARD_BG : LIGHT_CARD_BG

  return (
    <section data-nav-fade className="relative py-28 px-6">
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ backgroundColor: bgColor }}
        transition={FLIP_TRANSITION}
        aria-hidden="true"
      />
      <div className="max-w-6xl mx-auto">
        <motion.span
          className="block font-mono text-sm mb-4"
          animate={{ color: secondaryColor }}
          transition={FLIP_TRANSITION}
        >
          LATEST FEATURED WORK
        </motion.span>

        {/* 5-col / 2-row bento grid on desktop; a single flowing column on
            mobile via `order-*` (each item also carries md:col-start/
            md:row-start, which fully determines its desktop position —
            order has no effect on grid items with explicit placement, so
            the two schemes coexist without needing separate markup).
            Mobile order follows the brief: video1 -> bullets -> images ->
            landscape video. */}
        <div className="grid grid-cols-1 md:grid-cols-5 md:grid-rows-2 gap-3 md:gap-4 mt-10 md:h-[560px] lg:h-[640px]">
          <div
            className={`${TILE_CLASS} order-1 md:order-none md:col-start-1 md:row-start-1 aspect-[4/3] md:aspect-auto md:h-full`}
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
            className="order-2 md:order-none md:col-start-1 md:row-start-2 rounded-2xl p-6 flex flex-col justify-center"
            animate={{ backgroundColor: cardBg }}
            transition={FLIP_TRANSITION}
          >
            <ul className="flex flex-col gap-3">
              {project.bullets.map(b => (
                <motion.li
                  key={b}
                  className="font-body text-[13px] leading-relaxed flex gap-2.5"
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
            className={`${TILE_CLASS} order-3 md:order-none md:col-start-2 md:row-start-1 md:row-span-2 aspect-[9/16] md:aspect-auto md:h-full`}
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
            className={`${TILE_CLASS} order-4 md:order-none md:col-start-3 md:row-start-1 aspect-[4/3] md:aspect-auto md:h-full`}
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
            className={`${TILE_CLASS} order-5 md:order-none md:col-start-3 md:row-start-2 aspect-[4/3] md:aspect-auto md:h-full`}
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
            className={`${TILE_CLASS} order-6 md:order-none md:col-start-4 md:row-start-2 aspect-[4/3] md:aspect-auto md:h-full`}
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
            className={`${TILE_CLASS} order-7 md:order-none md:col-start-5 md:row-start-2 aspect-[4/3] md:aspect-auto md:h-full`}
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
            className={`${TILE_CLASS} order-8 md:order-none md:col-start-4 md:col-span-2 md:row-start-1 aspect-video md:aspect-auto md:h-full`}
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

        <div className="mt-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
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
      </div>
    </section>
  )
}

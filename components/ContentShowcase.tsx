'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

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
const IMAGE_COUNT = 21
const IMAGE_COLS = 7
const IMAGE_ROWS = 3
const VIDEO_COUNT = 20
const VIDEO_COLS = 5
const VIDEO_ROWS = 4

// Image filenames are a mix of .jpeg/.jpg — resolved once up front rather
// than guessed per-tile.
const IMAGE_EXT: Record<number, string> = {
  1: 'jpeg', 2: 'jpeg', 3: 'jpeg', 4: 'jpeg', 5: 'jpg', 6: 'jpeg', 7: 'jpg',
  8: 'jpeg', 9: 'jpeg', 10: 'jpeg', 11: 'jpeg', 12: 'jpeg', 13: 'jpg', 14: 'jpg',
  15: 'jpeg', 16: 'jpg', 17: 'jpeg', 18: 'jpeg', 19: 'jpeg', 20: 'jpeg', 21: 'jpeg',
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

// Center point (in % of viewport) of the grid cell for tile `index`.
function gridTarget(index: number, cols: number, rows: number) {
  const col = index % cols
  const row = Math.floor(index / cols)
  return {
    x: ((col + 0.5) / cols) * 100,
    y: ((row + 0.5) / rows) * 100,
  }
}

// Scattered, distant cluster position for the pre-scroll "pyramid" — low in
// the viewport, loosely circular scatter so tiles don't stack exactly on
// top of each other, small scale + heavy negative Z (far from camera).
function pyramidStart(index: number, count: number) {
  const angle = (index / count) * Math.PI * 2.4
  const radius = 6 + (index % 5) * 2.2
  return {
    x: 50 + Math.cos(angle) * radius,
    y: 86 + Math.sin(angle) * radius * 0.4,
    z: -900,
    scale: 0.22,
  }
}

// Phase boundaries, in overall section scroll progress (0-1).
const PHASE1_END = 0.38
const TEXT_IN_START = 0.4
const TEXT_IN_END = 0.48
const TEXT_OUT_START = 0.54
const TEXT_OUT_END = 0.6
const PHASE3_START = 0.58
const IMAGE_STAGGER = 0.017
const IMAGE_SPAN = 0.55
const VIDEO_STAGGER = 0.016
const VIDEO_SPAN = 0.5

// Below this width, the desktop 7x3 image grid produces tall narrow slivers
// (12.5vw x 28vh on a 390px phone ≈ 49x236px, ~1:4.8 aspect) — swap to a
// 3x7 layout instead. 21 = 7x3 = 3x7 either way, so it's a clean transpose.
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
  const start = pyramidStart(index, IMAGE_COUNT)
  const tileStart = index * IMAGE_STAGGER
  const tileEnd = tileStart + IMAGE_SPAN

  const t = useTransform(progress, v => {
    const local = linearMap(0, PHASE1_END, 0, 1)(v)
    return easeOutCubic(linearMap(tileStart, tileEnd, 0, 1)(local))
  })

  const x = useTransform(t, tv => `${start.x + (target.x - start.x) * tv - 50}vw`)
  const y = useTransform(t, tv => `${start.y + (target.y - start.y) * tv - 50}vh`)
  const z = useTransform(t, tv => start.z + (0 - start.z) * tv)
  const scale = useTransform(t, tv => start.scale + (1 - start.scale) * tv)
  const opacity = t

  const n = index + 1
  const ext = IMAGE_EXT[n] ?? 'jpeg'

  return (
    <motion.div
      className="absolute rounded-lg overflow-hidden pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        width: tileWidth,
        height: tileHeight,
        x,
        y,
        z,
        scale,
        opacity,
      }}
    >
      <Image
        src={`${IMAGE_DIR}/${n}.${ext}`}
        alt=""
        fill
        sizes="13vw"
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
      className="absolute rounded-lg overflow-hidden pointer-events-none bg-[#16171C]"
      style={{
        left: `${target.x}%`,
        top: `${target.y}%`,
        x: '-50%',
        y: '-50%',
        width: '17vw',
        height: '21vh',
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
    <section data-nav-dark className="relative py-24 px-6" style={{ backgroundColor: '#0D0E12' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2 mb-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {Array.from({ length: IMAGE_COUNT }, (_, i) => {
            const n = i + 1
            return (
              <div key={n} className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <Image src={`${IMAGE_DIR}/${n}.${IMAGE_EXT[n] ?? 'jpeg'}`} alt="" fill sizes="15vw" className="object-cover" />
              </div>
            )
          })}
        </motion.div>

        <motion.h2
          className="font-display text-center leading-tight text-[clamp(1.75rem,3.5vw,3.5rem)] mb-24"
          style={{ color: '#F2F0EB' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          Want content? We create any content you need.
        </motion.h2>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {Array.from({ length: VIDEO_COUNT }, (_, i) => {
            const n = i + 1
            return (
              <div key={n} className="relative aspect-[4/5] rounded-lg overflow-hidden bg-[#16171C]">
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
  )
}

export default function ContentShowcase() {
  const reduceMotion = !!useHydratedReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [videosMounted, setVideosMounted] = useState(false)
  const isNarrow = useIsNarrowViewport()
  const imageCols = isNarrow ? 3 : IMAGE_COLS
  const imageRows = isNarrow ? 7 : IMAGE_ROWS
  const imageTileWidth = isNarrow ? '28vw' : '12.5vw'
  const imageTileHeight = isNarrow ? '12vh' : '28vh'

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', v => {
    if (v > 0.5) setVideosMounted(mounted => mounted || true)
  })

  const imageLayerOpacity = useTransform(scrollYProgress, linearMap(0.34, 0.44, 1, 0))
  const textOpacity = useTransform(scrollYProgress, v => {
    if (v < TEXT_IN_START) return 0
    if (v < TEXT_IN_END) return linearMap(TEXT_IN_START, TEXT_IN_END, 0, 1)(v)
    if (v < TEXT_OUT_START) return 1
    return linearMap(TEXT_OUT_START, TEXT_OUT_END, 1, 0)(v)
  })
  const textScale = useTransform(scrollYProgress, v => {
    if (v < TEXT_IN_START) return 0.9
    if (v < TEXT_IN_END) return linearMap(TEXT_IN_START, TEXT_IN_END, 0.9, 1)(v)
    return 1
  })

  if (reduceMotion) return <ContentShowcaseReduced />

  return (
    <section ref={sectionRef} data-nav-dark className="relative" style={{ height: '300vh' }}>
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ backgroundColor: '#0D0E12', perspective: '1000px' }}
      >
        {/* Phase 1 — image pyramid -> 3x7 grid */}
        <motion.div className="absolute inset-0" style={{ opacity: imageLayerOpacity, transformStyle: 'preserve-3d' }} aria-hidden="true">
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

        {/* Phase 2 — centered headline */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none"
          style={{ opacity: textOpacity }}
          aria-hidden="true"
        >
          <motion.h2
            className="font-display text-center leading-tight text-[clamp(2rem,4.5vw,4.5rem)] max-w-4xl"
            style={{ color: '#F2F0EB', scale: textScale }}
          >
            Want content? We create any content you need.
          </motion.h2>
        </motion.div>
        <h2 className="sr-only">Want content? We create any content you need.</h2>

        {/* Phase 3 — video grid fills in */}
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }} aria-hidden="true">
          {Array.from({ length: VIDEO_COUNT }, (_, i) => (
            <VideoTile key={i} index={i} progress={scrollYProgress} mounted={videosMounted} />
          ))}
        </div>
      </div>
    </section>
  )
}

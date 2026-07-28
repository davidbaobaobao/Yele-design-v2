'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useVideoAlwaysAutoplay } from '@/hooks/useVideoAlwaysAutoplay'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const VIDEO_DIR = '/media/hero2'
const POSTER = `${VIDEO_DIR}/hero2_poster.jpg`
const PINK = '#D46FC8'
const SECTION_BG = '#0D0E12'

// Vertical-only stretch applied identically to both text layers — this is
// a styling choice (very tall glyphs at a fixed line width), not a mask
// mechanism, so it needs no special handling beyond a shared transform.
const HEADLINE_SCALE_Y = 1.6

const RISE_PERCENT = 6 // gentle parallax rise, video moves up by this % of its own height at max
// The video is scaled up just enough that even at max rise its bottom edge
// never lifts above the container's bottom — scaling around center pushes
// the bottom edge down by half the added height, so this must be >= 2x the
// rise percentage (with margin) to guarantee no gap at any scroll position.
const VIDEO_SCALE_MAX = 1 + (RISE_PERCENT * 2.2) / 100

const CARD_CLEARANCE_PX = 24

function linearMap(inMin: number, inMax: number, outMin: number, outMax: number) {
  return (v: number) => {
    if (v <= inMin) return outMin
    if (v >= inMax) return outMax
    return outMin + ((outMax - outMin) * (v - inMin)) / (inMax - inMin)
  }
}

const headlineClass = 'font-display font-black uppercase whitespace-nowrap leading-[0.85]'

// Both text layers (knockout white + solid pink) render this exact same
// markup — same font-size, tracking, line-height and scaleY — so they can
// never drift apart the way a canvas-drawn approximation could.
function HeadlineWords() {
  return (
    <>
      BUILD TO<br className="md:hidden" /> STAY.
    </>
  )
}

const headlineStyle = {
  // Tracking loosened from the previous -0.03em to a touch of positive
  // spacing; font-size trimmed slightly from the previous clamp so the
  // line still spans ~96vw total instead of growing wider.
  fontSize: 'clamp(4.5rem, 11.5vw, 16.5rem)',
  letterSpacing: '0.01em',
}

const headlineStyleMobile = {
  fontSize: 'clamp(3.25rem, 14vw, 4.25rem)',
  letterSpacing: '0.01em',
}

function SwarmSources() {
  return (
    <>
      <source media="(max-width: 767px)" src={`${VIDEO_DIR}/hero2_mobile.webm`} type="video/webm" />
      <source media="(max-width: 767px)" src={`${VIDEO_DIR}/hero2_mobile.mp4`} type="video/mp4" />
      <source src={`${VIDEO_DIR}/hero2_hq.webm`} type="video/webm" />
      <source src={`${VIDEO_DIR}/hero2_hq.mp4`} type="video/mp4" />
    </>
  )
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const pinkHeadlineRef = useRef<HTMLHeadingElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)

  const [isMobile, setIsMobile] = useState(false)
  const [maxDescentVh, setMaxDescentVh] = useState(50)

  const reduceMotion = useHydratedReducedMotion()

  useVideoAlwaysAutoplay(videoRef)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Video parallax: rises gently, scaled up in lockstep so its bottom edge
  // never lifts off the container's bottom at any point during the rise.
  const riseProgress = useTransform(scrollYProgress, linearMap(0, 0.6, 0, 1))
  const videoY = useTransform(riseProgress, v => `${-RISE_PERCENT * v}%`)
  const videoScale = useTransform(riseProgress, v => 1 + (VIDEO_SCALE_MAX - 1) * v)

  // Both text layers share this same descent, so they can never drift out
  // of alignment with each other — clamped so the headline's bottom edge
  // always stays CARD_CLEARANCE_PX above the caption card.
  const headlineY = useTransform(scrollYProgress, v => `${linearMap(0, 0.85, 0, maxDescentVh)(v)}vh`)

  // Solid pink fades out over the first ~35% of hero scroll, revealing the
  // knockout layer (darkened video showing through the same letter shapes)
  // beneath it.
  const pinkOpacity = useTransform(scrollYProgress, linearMap(0, 0.35, 1, 0))

  const cardY = useTransform(scrollYProgress, linearMap(0.55, 0.8, 40, 0))
  const cardOpacity = useTransform(scrollYProgress, linearMap(0.55, 0.8, 0, 1))
  const sceneOpacity = useTransform(scrollYProgress, linearMap(0.8, 1, 1, 0.85))

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Measures the headline's resting box and the caption card's rendered
  // height so the descent transform above can be clamped precisely —
  // measured directly off the real rendered pink headline now (no phantom
  // canvas-measurement element needed).
  const measureDescentLimit = useCallback(() => {
    const headlineEl = pinkHeadlineRef.current
    const captionEl = captionRef.current
    if (!headlineEl || !captionEl) return
    const vh = window.innerHeight
    const headlineBottom = headlineEl.getBoundingClientRect().bottom
    const captionHeight = captionEl.getBoundingClientRect().height
    const allowedBottom = vh - captionHeight - CARD_CLEARANCE_PX
    const maxDescentPx = Math.max(0, allowedBottom - headlineBottom)
    setMaxDescentVh((maxDescentPx / vh) * 100)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    measureDescentLimit()
  }, [measureDescentLimit, reduceMotion, isMobile])

  useEffect(() => {
    if (reduceMotion) return
    let timer: number | undefined
    const recompute = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(measureDescentLimit, 150)
    }
    window.addEventListener('resize', recompute)
    let ro: ResizeObserver | undefined
    if (pinkHeadlineRef.current && 'ResizeObserver' in window) {
      ro = new ResizeObserver(recompute)
      ro.observe(pinkHeadlineRef.current)
    }
    return () => {
      window.removeEventListener('resize', recompute)
      ro?.disconnect()
      window.clearTimeout(timer)
    }
  }, [measureDescentLimit, reduceMotion])

  const captionText =
    'Websites for small businesses — designed, built and maintained by Yele. You run the business. We run the website.'

  // Flush against the viewport's right edge (no rounding needed there — it
  // reads as the true edge); the left side floats inward, so both its
  // corners are rounded, and the bottom stays flush/sharp into the mission
  // section beneath (see Mission.tsx's matching bg) so the card reads as
  // attached rather than floating above it.
  const captionCardClass =
    'absolute bottom-0 inset-x-0 md:inset-x-auto md:right-0 font-body text-bone leading-snug bg-[#0A0A0A] p-10 text-xl md:text-2xl max-w-md w-full md:w-auto rounded-t-2xl rounded-b-none md:rounded-tl-3xl md:rounded-tr-none md:rounded-bl-3xl md:rounded-br-none'

  const currentHeadlineStyle = isMobile ? headlineStyleMobile : headlineStyle
  // Plain elements (the reduced-motion h1) can take a raw transform string,
  // but motion components compose `transform` themselves from individual
  // shorthand keys (x, y, scale, scaleY, ...) — mixing in a raw transform
  // string alongside `y` gets silently dropped, so the two motion.h1 layers
  // below use the scaleY key form instead of this one.
  const scaleYTransform = { transform: `scaleY(${HEADLINE_SCALE_Y})`, transformOrigin: 'center' }

  // ---- Reduced-motion fallback: static poster, solid pink, no fade/parallax ----
  if (reduceMotion) {
    return (
      <section id="hero" className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: SECTION_BG }}>
        <div className="absolute inset-0">
          <Image src={POSTER} alt="" fill sizes="100vw" priority className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
        <h1
          className={`${headlineClass} absolute inset-x-0 top-20 text-center px-4`}
          style={{ ...currentHeadlineStyle, ...scaleYTransform, color: PINK }}
        >
          <HeadlineWords />
        </h1>
        <div className={`${captionCardClass} z-10`}>{captionText}</div>
      </section>
    )
  }

  // ---- Full scroll-driven reveal ----
  return (
    <section ref={sectionRef} id="hero" className="relative h-[200vh] w-full" style={{ backgroundColor: SECTION_BG }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div style={{ opacity: sceneOpacity }} className="absolute inset-0">
          {/* Video + dark overlay + knockout text, isolated into their own
              stacking group so the knockout's mix-blend-mode only ever
              blends against these two layers — never the page behind. */}
          <div className="absolute inset-0 overflow-hidden isolate">
            <motion.video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              preload="auto"
              poster={POSTER}
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ y: videoY, scale: videoScale }}
              aria-hidden="true"
            >
              <SwarmSources />
            </motion.video>

            {/* Dark mask over the raw video — sits above the video, below
                the knockout text, so the video reads through the letters
                already darkened rather than at full brightness. */}
            <div className="absolute inset-0 bg-black/45 pointer-events-none" aria-hidden="true" />

            {/* Knockout layer: near-black bg + white text, mix-blend:multiply.
                White * backdrop = backdrop unchanged (video shows through
                exactly inside the letters); near-black * backdrop ≈ black
                everywhere else. The letters ARE the mask — there is nothing
                to separately align. */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: SECTION_BG, mixBlendMode: 'multiply' }}
              aria-hidden="true"
            >
              <motion.h1
                className={`${headlineClass} absolute inset-x-0 top-20 text-center px-4`}
                style={{ ...currentHeadlineStyle, scaleY: HEADLINE_SCALE_Y, color: '#FFFFFF', y: headlineY }}
              >
                <HeadlineWords />
              </motion.h1>
            </div>
          </div>

          {/* Solid pink layer — fully opaque at rest (hides the knockout
              entirely: no video/darkening visible at scroll 0), fading out
              over the first ~35% of scroll via pinkOpacity to reveal the
              darkened video through the exact same letter shapes above. */}
          <motion.h1
            ref={pinkHeadlineRef}
            className={`${headlineClass} absolute inset-x-0 top-20 text-center px-4`}
            style={{ ...currentHeadlineStyle, scaleY: HEADLINE_SCALE_Y, color: PINK, opacity: pinkOpacity, y: headlineY, willChange: 'opacity' }}
          >
            <HeadlineWords />
          </motion.h1>

          {/* Real semantic heading for SEO/a11y — visually hidden. */}
          <h1 className="sr-only">BUILD TO STAY.</h1>

          {/* Caption card — flush to the bottom-right corner on desktop,
              full-width bottom sheet on mobile. Marks the end of the hero. */}
          <motion.div
            ref={captionRef}
            style={{ y: cardY, opacity: cardOpacity }}
            className={`${captionCardClass} z-30`}
          >
            {captionText}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

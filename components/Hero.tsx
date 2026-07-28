'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useVideoAlwaysAutoplay } from '@/hooks/useVideoAlwaysAutoplay'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const VIDEO_DIR = '/media/hero3'
const POSTER = `${VIDEO_DIR}/hero_poster.jpg`
const WHITE = '#F2F0EB'
const SECTION_BG = '#0D0E12'

// Vertical-only stretch applied identically to the white h1 AND the mask
// (drawn from that same h1's own metrics) — a styling choice, not part of
// the mask mechanism.
const HEADLINE_SCALE_Y = 1.6

// Canvas fillText() and the browser's native text layout never rasterize a
// glyph identically pixel-for-pixel. With a single shared mask (see the
// mix-blend rebuild this replaced) that's a non-issue — but this design
// calls for a SEPARATE solid white <h1> layered over an independently
// canvas-masked video, which is the same two-renderer setup that caused a
// visible color rim last time. Per-character positioning (below) removes
// the dominant drift; this small inset removes the residual sub-pixel one.
const MASK_INSET = 0.96

// Extra vh of height on top of the sticky viewport's own 100vh, so the
// video group's bottom edge never lifts off the container's bottom even at
// full rise (see videoGroupY below).
const RISE_SAFETY_VH = 20
const VIDEO_GROUP_HEIGHT_VH = 100 + RISE_SAFETY_VH

// Fixed black spacing between the (measured) bottom of the headline and
// where the video group's resting top edge sits.
const SPACING_BELOW_HEADLINE_VH = 8

function linearMap(inMin: number, inMax: number, outMin: number, outMax: number) {
  return (v: number) => {
    if (v <= inMin) return outMin
    if (v >= inMax) return outMax
    return outMin + ((outMax - outMin) * (v - inMin)) / (inMax - inMin)
  }
}

const headlineClass = 'font-display font-black uppercase whitespace-nowrap leading-[0.85]'

function HeadlineWords() {
  return (
    <>
      BUILD TO<br className="md:hidden" /> STAY
    </>
  )
}

const headlineStyle = {
  fontSize: 'clamp(4.5rem, 11.5vw, 16.5rem)',
  letterSpacing: '0.01em',
}

const headlineStyleMobile = {
  fontSize: 'clamp(3.25rem, 14vw, 4.25rem)',
  letterSpacing: '0.01em',
}

function DarkSources() {
  return (
    <>
      <source media="(max-width: 767px)" src={`${VIDEO_DIR}/hero_dark_mobile.webm`} type="video/webm" />
      <source media="(max-width: 767px)" src={`${VIDEO_DIR}/hero_dark_mobile.mp4`} type="video/mp4" />
      <source src={`${VIDEO_DIR}/hero_dark_hq.webm`} type="video/webm" />
      <source src={`${VIDEO_DIR}/hero_dark_hq.mp4`} type="video/mp4" />
    </>
  )
}

function BrightSources() {
  return (
    <>
      <source media="(max-width: 767px)" src={`${VIDEO_DIR}/hero_bright_mobile.webm`} type="video/webm" />
      <source media="(max-width: 767px)" src={`${VIDEO_DIR}/hero_bright_mobile.mp4`} type="video/mp4" />
      <source src={`${VIDEO_DIR}/hero_bright_hq.webm`} type="video/webm" />
      <source src={`${VIDEO_DIR}/hero_bright_hq.mp4`} type="video/mp4" />
    </>
  )
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const darkVideoRef = useRef<HTMLVideoElement>(null)
  const brightVideoRef = useRef<HTMLVideoElement>(null)
  const whiteHeadlineRef = useRef<HTMLHeadingElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)

  const [maskUrl, setMaskUrl] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  // How far below the sticky container's top the video group's resting top
  // edge sits — measured from the real headline's own bottom edge plus a
  // fixed spacing constant, so it adapts to whatever the headline actually
  // renders at (font load, viewport size) instead of a guessed number.
  const [videoRestTopVh, setVideoRestTopVh] = useState(42)

  const reduceMotion = useHydratedReducedMotion()

  useVideoAlwaysAutoplay(darkVideoRef)
  useVideoAlwaysAutoplay(brightVideoRef)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Phase 1 (0 → 0.4): the video group rises from its resting position
  // (pushed down by videoRestTopVh, leaving the headline's black band empty
  // above it) up to y:0, so it fills in behind the headline just as the
  // white layer finishes fading.
  const riseProgress = useTransform(scrollYProgress, linearMap(0, 0.4, 0, 1))
  const videoGroupYVh = useTransform(riseProgress, v => videoRestTopVh * (1 - v))
  const videoGroupY = useTransform(videoGroupYVh, v => `${v}vh`)
  // The mask lives inside the same group as the video it's masking (required
  // for the two to share pixel-for-pixel alignment), so as the group
  // translates, the mask's own position must counter-shift by the exact
  // same amount to stay visually pinned to the static headline above it.
  const maskPosition = useTransform(videoGroupYVh, v => `0px ${-v}vh`)

  // Solid white fades out over the first ~35% of hero scroll, revealing the
  // masked bright video (inside the letters) over the dark video (outside).
  const whiteOpacity = useTransform(scrollYProgress, linearMap(0, 0.35, 1, 0))

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

  // Draws "BUILD TO STAY" onto an offscreen canvas at the headline's exact
  // on-screen font/position — this becomes the mask-image that lets the
  // bright video show through only where the letters sit. Walks the real
  // DOM character-by-character (via one-character Range objects) rather
  // than handing the whole string to canvas's own text layout, since
  // canvas/CSS letter-spacing and kerning never match closely enough at
  // this scale — each glyph is stamped at its own true measured position,
  // so canvas is only ever used for glyph SHAPE, never for positioning.
  const drawMask = useCallback(() => {
    const el = whiteHeadlineRef.current
    if (!el) return
    const w = window.innerWidth
    const h = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const canvas = document.createElement('canvas')
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)

    const cs = getComputedStyle(el)
    ctx.fillStyle = '#fff'
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'

    el.childNodes.forEach(node => {
      if (node.nodeType !== Node.TEXT_NODE) return
      const text = node.textContent ?? ''
      for (let i = 0; i < text.length; i++) {
        const range = document.createRange()
        range.setStart(node, i)
        range.setEnd(node, i + 1)
        const rects = Array.from(range.getClientRects()).filter(r => r.width > 0 && r.height > 0)
        rects.forEach(rect => {
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          ctx.save()
          ctx.translate(cx, cy)
          ctx.scale(MASK_INSET, HEADLINE_SCALE_Y * MASK_INSET)
          ctx.fillText(text[i], 0, 0)
          ctx.restore()
        })
      }
    })

    setMaskUrl(canvas.toDataURL())
  }, [])

  // Measures the real headline's rendered bottom edge (plus fixed spacing)
  // to position the video group's resting state precisely below it.
  const measureLayout = useCallback(() => {
    const headlineEl = whiteHeadlineRef.current
    if (!headlineEl) return
    const vh = window.innerHeight
    const headlineBottom = headlineEl.getBoundingClientRect().bottom
    setVideoRestTopVh((headlineBottom / vh) * 100 + SPACING_BELOW_HEADLINE_VH)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    let cancelled = false
    document.fonts.ready.then(() => {
      if (cancelled) return
      drawMask()
      measureLayout()
    })
    return () => {
      cancelled = true
    }
  }, [drawMask, measureLayout, reduceMotion])

  // Recompute on resize only (debounced) or a headline box change (font
  // swap, layout shift) — never per scroll frame, which was the source of
  // the old lag.
  useEffect(() => {
    if (reduceMotion) return
    let timer: number | undefined
    const recompute = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        drawMask()
        measureLayout()
      }, 150)
    }
    window.addEventListener('resize', recompute)
    let ro: ResizeObserver | undefined
    if (whiteHeadlineRef.current && 'ResizeObserver' in window) {
      ro = new ResizeObserver(recompute)
      ro.observe(whiteHeadlineRef.current)
    }
    return () => {
      window.removeEventListener('resize', recompute)
      ro?.disconnect()
      window.clearTimeout(timer)
    }
  }, [drawMask, measureLayout, reduceMotion])

  // Keep the bright (follower) video in lockstep with the dark (driver) —
  // corrected on an interval (never per frame) plus immediately on the
  // driver's own play/seeked events, so a seek or restart doesn't have to
  // wait for the next interval tick to resync.
  useEffect(() => {
    if (reduceMotion) return
    const driver = darkVideoRef.current
    const follower = brightVideoRef.current
    if (!driver || !follower) return

    const sync = () => {
      if (Math.abs(driver.currentTime - follower.currentTime) > 0.05) {
        follower.currentTime = driver.currentTime
      }
    }

    const id = window.setInterval(sync, 400)
    driver.addEventListener('play', sync)
    driver.addEventListener('seeked', sync)
    return () => {
      window.clearInterval(id)
      driver.removeEventListener('play', sync)
      driver.removeEventListener('seeked', sync)
    }
  }, [reduceMotion])

  const captionText =
    'Websites for small businesses — designed, built and maintained by Yele. You run the business. We run the website.'

  const captionCardClass =
    'absolute bottom-0 inset-x-0 md:inset-x-auto md:right-0 font-body text-bone leading-snug bg-[#0A0A0A] p-10 text-xl md:text-2xl max-w-md w-full md:w-auto rounded-t-2xl rounded-b-none md:rounded-tl-3xl md:rounded-tr-none md:rounded-bl-3xl md:rounded-br-none'

  const currentHeadlineStyle = isMobile ? headlineStyleMobile : headlineStyle
  const scaleYTransform = { transform: `scaleY(${HEADLINE_SCALE_Y})`, transformOrigin: 'center' }

  // ---- Reduced-motion fallback: static poster, solid white, no reveal ----
  if (reduceMotion) {
    return (
      <section id="hero" className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: SECTION_BG }}>
        <h1
          className={`${headlineClass} absolute inset-x-0 top-28 md:top-32 text-center px-4`}
          style={{ ...currentHeadlineStyle, ...scaleYTransform, color: WHITE }}
        >
          <HeadlineWords />
        </h1>
        <div className="absolute inset-0">
          <Image src={POSTER} alt="" fill sizes="100vw" priority className="object-cover" />
        </div>
        <div className={`${captionCardClass} z-10`}>{captionText}</div>
      </section>
    )
  }

  // ---- Full scroll-driven reveal ----
  return (
    <section ref={sectionRef} id="hero" className="relative h-[200vh] w-full" style={{ backgroundColor: SECTION_BG }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div style={{ opacity: sceneOpacity }} className="absolute inset-0">
          {/* Video group — rests pushed down by videoRestTopVh (leaving the
              headline's black band empty above it) and rises to y:0 as the
              user scrolls. Both video layers and the mask live inside this
              one group so they always share pixel-for-pixel alignment. */}
          <motion.div
            className="absolute inset-x-0 top-0 overflow-hidden"
            style={{ height: `${VIDEO_GROUP_HEIGHT_VH}vh`, y: videoGroupY }}
          >
            {/* Layer A — dark grade, full-bleed, always visible outside the
                letters (and everywhere, before the mask has loaded). */}
            <video
              ref={darkVideoRef}
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              preload="auto"
              poster={POSTER}
              className="absolute inset-0 w-full h-full object-cover object-center"
              aria-hidden="true"
            >
              <DarkSources />
            </video>

            {/* Layer B — bright grade, masked to the exact letter shapes via
                the canvas-generated mask above. Same footage as Layer A, so
                inside vs. outside the letters lines up seamlessly — only
                the color grade differs. */}
            <motion.div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                opacity: maskUrl ? 1 : 0,
                WebkitMaskImage: maskUrl ? `url(${maskUrl})` : 'none',
                maskImage: maskUrl ? `url(${maskUrl})` : 'none',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: '100% 100%',
                maskSize: '100% 100%',
                WebkitMaskPosition: maskPosition,
                maskPosition: maskPosition,
              }}
            >
              <video
                ref={brightVideoRef}
                muted
                loop
                playsInline
                disablePictureInPicture
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover object-center"
                aria-hidden="true"
              >
                <BrightSources />
              </video>
            </motion.div>
          </motion.div>

          {/* Solid white headline — fully opaque at rest (hides the masked
              layer beneath entirely: no video visible at scroll 0, just
              white letters on the black band). Fades out over the first
              ~35% of scroll via whiteOpacity to reveal the video underneath
              through the exact same letter shapes it was measured from. */}
          <motion.h1
            ref={whiteHeadlineRef}
            className={`${headlineClass} absolute inset-x-0 top-28 md:top-32 text-center px-4`}
            style={{ ...currentHeadlineStyle, scaleY: HEADLINE_SCALE_Y, color: WHITE, opacity: whiteOpacity, willChange: 'opacity' }}
          >
            <HeadlineWords />
          </motion.h1>

          {/* Real semantic heading for SEO/a11y — visually hidden. */}
          <h1 className="sr-only">BUILD TO STAY</h1>

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

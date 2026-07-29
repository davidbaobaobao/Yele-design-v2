'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useVideoAlwaysAutoplay } from '@/hooks/useVideoAlwaysAutoplay'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const VIDEO_DIR = '/media/hero3'
const DARK_POSTER = `${VIDEO_DIR}/Hero_dark-3_poster.jpg`
const BRIGHT_POSTER = `${VIDEO_DIR}/Hero_bright-3_poster.jpg`
const WHITE = '#F2F0EB'
const SECTION_BG = '#0D0E12'
const CARD_CLEARANCE_PX = 24
const MASK_ID = 'heroTextMask'
const GLYPHS_ID = 'heroHeadlineGlyphs'
const LINES = ['BUILD', 'TO', 'LAST']

function linearMap(inMin: number, inMax: number, outMin: number, outMax: number) {
  return (v: number) => {
    if (v <= inMin) return outMin
    if (v >= inMax) return outMax
    return outMin + ((outMax - outMin) * (v - inMin)) / (inMax - inMin)
  }
}

function clampNum(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max)
}

// ffmpeg -i in.mp4 -vf "scale=-2:1280" -c:v libx264 -crf 26 -preset slow
//   -movflags +faststart -an -pix_fmt yuv420p out.mp4  (portrait 9:16 source)
function DarkSources() {
  return (
    <>
      <source src={`${VIDEO_DIR}/Hero_dark-3_hq.webm`} type="video/webm" />
      <source src={`${VIDEO_DIR}/Hero_dark-3_hq.mp4`} type="video/mp4" />
    </>
  )
}

function BrightSources() {
  // MP4-first here specifically: for this footage H.264 came out smaller
  // than VP9 at matched quality (1.7MB vs 1.9MB) — verified by comparing
  // actual output file sizes, not assumed from the usual webm-first default.
  return (
    <>
      <source src={`${VIDEO_DIR}/Hero_bright-3_hq.mp4`} type="video/mp4" />
      <source src={`${VIDEO_DIR}/Hero_bright-3_hq.webm`} type="video/webm" />
    </>
  )
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const darkVideoRef = useRef<HTMLVideoElement>(null)
  const brightVideoRef = useRef<HTMLVideoElement>(null)
  const glyphsRef = useRef<SVGGElement>(null)
  const whitePaintRef = useRef<SVGUseElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  const [viewport, setViewport] = useState({ width: 1440, height: 900 })
  const [maxDescentPx, setMaxDescentPx] = useState(300)

  const reduceMotion = useHydratedReducedMotion()

  useVideoAlwaysAutoplay(darkVideoRef)
  useVideoAlwaysAutoplay(brightVideoRef)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Headline descends from its rest position (top-left) down to a clamped
  // maximum — measured (see measureLayout) so its bottom edge lands right at
  // the caption card's own top edge, never past it.
  const headlineY = useTransform(scrollYProgress, v => linearMap(0, 0.9, 0, maxDescentPx)(v))
  // Solid white fades out over the first ~35% of scroll, revealing the
  // masked bright video (inside the letters) over the dark video (outside).
  const whiteOpacity = useTransform(scrollYProgress, linearMap(0, 0.35, 1, 0))
  // Small parallax rise — the video group's own box is oversized (12%
  // taller than the viewport) so this translate never exposes an edge.
  const videoY = useTransform(scrollYProgress, v => `${linearMap(0, 1, 0, -6)(v)}%`)
  const cardY = useTransform(scrollYProgress, linearMap(0.55, 0.8, 40, 0))
  const cardOpacity = useTransform(scrollYProgress, linearMap(0.55, 0.8, 0, 1))
  const sceneOpacity = useTransform(scrollYProgress, linearMap(0.85, 1, 1, 0.9))

  // Imperative transform application — this codebase's proven pattern
  // (see MissionFillText.tsx) for driving a raw DOM node from a MotionValue
  // without relying on a typed motion.* wrapper for less-common SVG tags.
  // getBBox() on the <g> excludes the g's OWN transform, so it always
  // reports the REST geometry regardless of current scroll position.
  useEffect(() => {
    const el = glyphsRef.current
    if (el) el.setAttribute('transform', `translate(0, ${headlineY.get()})`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useMotionValueEvent(headlineY, 'change', v => {
    const el = glyphsRef.current
    if (el) el.setAttribute('transform', `translate(0, ${v})`)
  })

  useEffect(() => {
    const el = whitePaintRef.current
    if (el) el.setAttribute('opacity', String(whiteOpacity.get()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useMotionValueEvent(whiteOpacity, 'change', v => {
    const el = whitePaintRef.current
    if (el) el.setAttribute('opacity', String(v))
  })

  const measureLayout = useCallback(() => {
    const g = glyphsRef.current
    const captionEl = captionRef.current
    if (!g || !captionEl) return
    const bbox = g.getBBox()
    const vh = window.innerHeight
    const captionHeight = captionEl.getBoundingClientRect().height
    const allowedBottom = vh - captionHeight - CARD_CLEARANCE_PX
    const restBottom = bbox.y + bbox.height
    setMaxDescentPx(Math.max(0, allowedBottom - restBottom))
  }, [])

  // ResizeObserver on the sticky container itself rather than a window
  // 'resize' listener — ties viewport state directly to the actual rendered
  // box (what the SVG viewBox/mask width/height must match), immune to a
  // stale window.innerWidth/innerHeight read racing a mobile viewport
  // transition (observed on Playwright's mobile emulation: an early read
  // returned ~2x the real size with no subsequent 'resize' event to correct
  // it — this self-corrects regardless of what caused the initial mismatch).
  useEffect(() => {
    const el = stickyRef.current
    if (!el || !('ResizeObserver' in window)) {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
      return
    }
    let timer: number | undefined
    const ro = new ResizeObserver(entries => {
      const entry = entries[0]
      if (!entry) return
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        setViewport({ width: entry.contentRect.width, height: entry.contentRect.height })
      }, 100)
    })
    ro.observe(el)
    return () => {
      ro.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    let cancelled = false
    document.fonts.ready.then(() => {
      if (!cancelled) measureLayout()
    })
    return () => {
      cancelled = true
    }
    // Re-measure whenever viewport size changes (font/glyph geometry and the
    // caption box both scale with it).
  }, [measureLayout, reduceMotion, viewport])

  // Keep the bright (follower) video in lockstep with the dark (driver) —
  // corrected on an interval (never per frame) plus immediately on the
  // driver's own play/seeked events.
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

  // iOS only autoplays muted + playsInline video — belt-and-suspenders on
  // top of useVideoAlwaysAutoplay: force `.muted = true` in JS and retry
  // play() on loadedmetadata specifically.
  useEffect(() => {
    if (reduceMotion) return
    const videos = [darkVideoRef.current, brightVideoRef.current].filter((v): v is HTMLVideoElement => !!v)
    const onLoadedMetadata = (e: Event) => {
      const v = e.target as HTMLVideoElement
      v.muted = true
      if (v.paused) v.play().catch(() => {})
    }
    videos.forEach(v => {
      v.muted = true
      v.addEventListener('loadedmetadata', onLoadedMetadata)
    })
    return () => {
      videos.forEach(v => v.removeEventListener('loadedmetadata', onLoadedMetadata))
    }
  }, [reduceMotion])

  const captionText =
    'Websites for small businesses — designed, built and maintained by Yele. You run the business. We run the website.'

  // One step smaller than before: p-10 -> p-8, text-xl/2xl -> text-lg/xl.
  const captionCardClass =
    'absolute bottom-0 inset-x-0 md:inset-x-auto md:right-0 font-body text-bone leading-snug bg-[#0A0A0A] p-8 text-lg md:text-xl max-w-sm w-full md:w-auto rounded-t-2xl rounded-b-none md:rounded-tl-3xl md:rounded-tr-none md:rounded-bl-3xl md:rounded-br-none'

  const { width: vw, height: vh } = viewport
  const oneThirdVw = vw / 3
  // Chosen so "BUILD" (the widest line, 5 caps) is already close to
  // oneThirdVw at its natural width — the textLength forcing below then only
  // needs a small corrective nudge rather than a heavy stretch/squash.
  const fontSizePx = clampNum(oneThirdVw / 3.1, 40, 200)
  const leftInset = Math.max(24, vw * 0.045)
  const topInset = Math.max(64, vh * 0.1)
  const lineHeight = fontSizePx * 0.98
  const baselineOffset = fontSizePx * 0.82

  // ---- Reduced-motion fallback: static poster, solid white, no reveal ----
  if (reduceMotion) {
    return (
      <section id="hero" className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: SECTION_BG }}>
        <div
          className="absolute top-16 left-6 md:top-24 md:left-8 z-10 font-display font-black uppercase leading-[0.95]"
          style={{ fontSize: 'clamp(2.25rem, 8vw, 5rem)', width: '33vw', minWidth: '180px', color: WHITE }}
        >
          BUILD
          <br />
          TO
          <br />
          LAST
        </div>
        <div className="absolute inset-0">
          <Image src={DARK_POSTER} alt="" fill sizes="100vw" priority className="object-cover" />
        </div>
        <div className={`${captionCardClass} z-20`}>{captionText}</div>
      </section>
    )
  }

  // ---- Full scroll-driven reveal ----
  return (
    <section ref={sectionRef} id="hero" className="relative h-[200vh] w-full" style={{ backgroundColor: SECTION_BG }}>
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden" style={{ backgroundColor: SECTION_BG }}>
        <motion.div style={{ opacity: sceneOpacity }} className="absolute inset-0">
          {/* Video group — ONE shared parallax transform. Positioned at
              top-0 (its OWN untransformed origin coincides exactly with the
              viewport/SVG coordinate space — critical, since a CSS mask's
              userSpaceOnUse is anchored to the masked element's own
              UNTRANSFORMED layout position; an earlier version used
              top:-6%/bottom:-6% here, which shifted that origin and threw
              the bright video's mask reveal out of alignment with the
              headline). Oversized via height (112%, overshooting only
              downward) rather than position, so the small rise (applied
              purely as a `transform`, which does NOT move the mask's
              coordinate origin) never exposes an edge. Both layers are
              IDENTICAL absolute inset-0 w-full h-full object-cover children
              of this single translating box, so they stay pixel-aligned
              with each other. */}
          <motion.div className="absolute inset-x-0 top-0 h-[112%]" style={{ y: videoY }}>
            {/* Layer DARK — background, plain, always visible outside the
                letters. No overlay/scrim on top of it. */}
            <video
              ref={darkVideoRef}
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              preload="auto"
              poster={DARK_POSTER}
              className="absolute inset-0 w-full h-full object-cover object-center"
              aria-hidden="true"
            >
              <DarkSources />
            </video>

            {/* Layer BRIGHT — masked by the SAME SVG glyph geometry the
                white paint layer uses (via the <mask> below), so it's
                revealed only inside the letter shapes. */}
            <video
              ref={brightVideoRef}
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              preload="auto"
              poster={BRIGHT_POSTER}
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ WebkitMaskImage: `url(#${MASK_ID})`, maskImage: `url(#${MASK_ID})` }}
              aria-hidden="true"
            >
              <BrightSources />
            </video>
          </motion.div>

          {/* Headline — SVG <text> mask approach: ONE <g> of glyphs
              (GLYPHS_ID) is reused via <use> for both the visible white
              paint layer and the video mask, so the two can never drift —
              they're literally the same geometry. viewBox matches real
              viewport pixels 1:1, so text sizing/position math below is
              plain px, no unit conversion. */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${vw} ${vh}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <g id={GLYPHS_ID} ref={glyphsRef}>
                {LINES.map((line, i) => (
                  <text
                    key={line}
                    x={leftInset}
                    y={topInset + baselineOffset + i * lineHeight}
                    fontSize={fontSizePx}
                    className="font-display font-black uppercase"
                    textLength={line === 'BUILD' ? oneThirdVw : undefined}
                    lengthAdjust={line === 'BUILD' ? 'spacingAndGlyphs' : undefined}
                  >
                    {line}
                  </text>
                ))}
              </g>
              <mask id={MASK_ID} maskUnits="userSpaceOnUse" x={0} y={0} width={vw} height={vh}>
                <rect width="100%" height="100%" fill="black" />
                <use href={`#${GLYPHS_ID}`} fill="white" />
              </mask>
            </defs>
            {/* Visible white paint layer — solid at rest, fades to fully
                transparent over the first ~35% of scroll. */}
            <use ref={whitePaintRef} href={`#${GLYPHS_ID}`} fill={WHITE} />
          </svg>

          {/* Real semantic heading for SEO/a11y — visually hidden. */}
          <h1 className="sr-only">BUILD TO LAST</h1>

          {/* Caption card — marks the end of the hero. The headline above is
              clamped (via maxDescentPx) to always stop CARD_CLEARANCE_PX
              above this card's top edge. */}
          <motion.div ref={captionRef} style={{ y: cardY, opacity: cardOpacity }} className={`${captionCardClass} z-30`}>
            {captionText}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

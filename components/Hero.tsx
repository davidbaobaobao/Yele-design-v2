'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useVideoAlwaysAutoplay } from '@/hooks/useVideoAlwaysAutoplay'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const VIDEO_DIR = '/media/hero4'
const POSTER = `${VIDEO_DIR}/hero4_poster.jpg`
const WHITE = '#F2F0EB'
const SECTION_BG = '#0D0E12'

// Vertical-only stretch applied identically to the white h1 AND the mask
// (drawn from that same h1's own metrics) — a styling choice, not part of
// the mask mechanism.
const HEADLINE_SCALE_Y = 1.6

// Canvas fillText() and the browser's native text layout never rasterize a
// glyph identically pixel-for-pixel. A small inset keeps the mask safely
// inside the solid white layer's edges regardless.
const MASK_INSET = 0.96

// Video's own height within the shared block — generous overrun below the
// viewport so the block's later descent (toward the caption card) never
// exposes a gap at the bottom.
const VIDEO_HEIGHT_VH = 130
// Visible black gap between the headline's bottom edge and where the
// "always-clean" video area begins (halved from the previous 8vh).
const SPACING_BELOW_HEADLINE_VH = 4
const CARD_CLEARANCE_PX = 24

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
      BUILD TO<br className="md:hidden" /> LAST
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

// ffmpeg -i in.mp4 -vf scale=1280:-2 -c:v libx264 -crf 27 -preset slow
//   -movflags +faststart -an out.mp4
// (see public/media/hero4 for the actual per-file crop/scale/crf used —
// dark graded slightly more since it's the always-visible base layer)
function DarkSources() {
  return (
    <>
      <source media="(max-width: 767px)" src={`${VIDEO_DIR}/hero4_dark_mobile.webm`} type="video/webm" />
      <source media="(max-width: 767px)" src={`${VIDEO_DIR}/hero4_dark_mobile.mp4`} type="video/mp4" />
      <source src={`${VIDEO_DIR}/hero4_dark_hq.webm`} type="video/webm" />
      <source src={`${VIDEO_DIR}/hero4_dark_hq.mp4`} type="video/mp4" />
    </>
  )
}

function BrightSources() {
  // MP4-first here specifically: for this footage VP9 came out LARGER than
  // H.264 (2.1MB vs 871KB at hq) rather than smaller as usual — verified by
  // comparing actual output file sizes, not assumed from the general
  // webm-first convention used elsewhere on this site.
  return (
    <>
      <source media="(max-width: 767px)" src={`${VIDEO_DIR}/hero4_bright_mobile.mp4`} type="video/mp4" />
      <source media="(max-width: 767px)" src={`${VIDEO_DIR}/hero4_bright_mobile.webm`} type="video/webm" />
      <source src={`${VIDEO_DIR}/hero4_bright_hq.mp4`} type="video/mp4" />
      <source src={`${VIDEO_DIR}/hero4_bright_hq.webm`} type="video/webm" />
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
  // The <video> elements themselves start flush with the headline's own
  // TOP edge (not below it) — they need to extend behind the headline's
  // whole bounding box for the letters to have video content to reveal.
  // What actually keeps that region reading as clean black at rest is
  // textZoneCoverHeightVh below, not the video's own position.
  const [videoTopVh, setVideoTopVh] = useState(12)
  // Height of the opaque cover spanning the headline's own box plus the
  // (halved) spacing gap below it — fades in lockstep with the headline
  // (same whiteOpacity value) so the two arrive at the same "video with
  // letter-shaped color contrast" end state together, with no seam.
  const [textZoneCoverHeightVh, setTextZoneCoverHeightVh] = useState(24)
  // How far the shared block is allowed to descend before the headline's
  // bottom edge would land within CARD_CLEARANCE_PX of the caption card.
  const [maxDescentVh, setMaxDescentVh] = useState(50)

  const reduceMotion = useHydratedReducedMotion()

  useVideoAlwaysAutoplay(darkVideoRef)
  useVideoAlwaysAutoplay(brightVideoRef)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // ONE shared translateY for the whole block — headline, its text mask,
  // and both video layers all live inside it and move together as a single
  // rigid unit. This is the fix for the old drift: previously the video
  // group had its own transform and the mask had a SEPARATE counter-
  // transform to keep the two in sync, which left room for them to ever
  // disagree. With everything nested inside one translating parent, the
  // mask's position relative to the headline (and the video's position
  // relative to both) never changes at all during scroll — there is
  // nothing left that COULD drift.
  const blockY = useTransform(scrollYProgress, v => `${linearMap(0, 0.85, 0, maxDescentVh)(v)}vh`)

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

  // Draws "BUILD TO LAST" onto an offscreen canvas at the headline's exact
  // on-screen font/position — this becomes the mask-image that lets the
  // bright video show through only where the letters sit. Walks the real
  // DOM character-by-character (via one-character Range objects) rather
  // than handing the whole string to canvas's own text layout, since
  // canvas/CSS letter-spacing and kerning never match closely enough at
  // this scale — each glyph is stamped at its own true measured position,
  // so canvas is only ever used for glyph SHAPE, never for positioning.
  // Measured once (fonts ready / resize) — never per scroll frame, which
  // was the source of the old lag.
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

  // Measures the headline's rendered box (at rest, block y:0). The video
  // starts flush with the headline's own TOP (so it has content behind the
  // whole letter area); the text-zone cover spans from there down through
  // the (halved) spacing gap below the headline's bottom. Together with
  // the caption card's height, this also sets how far the block may descend.
  const measureLayout = useCallback(() => {
    const headlineEl = whiteHeadlineRef.current
    const captionEl = captionRef.current
    if (!headlineEl || !captionEl) return
    const vh = window.innerHeight
    const headlineRect = headlineEl.getBoundingClientRect()
    const headlineTopVh = (headlineRect.top / vh) * 100
    const headlineBottomVh = (headlineRect.bottom / vh) * 100
    setVideoTopVh(headlineTopVh)
    setTextZoneCoverHeightVh(headlineBottomVh - headlineTopVh + SPACING_BELOW_HEADLINE_VH)

    const captionHeight = captionEl.getBoundingClientRect().height
    const allowedBottom = vh - captionHeight - CARD_CLEARANCE_PX
    const maxDescentPx = Math.max(0, allowedBottom - headlineRect.bottom)
    setMaxDescentVh((maxDescentPx / vh) * 100)
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
  // swap, layout shift) — never per scroll frame.
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
  // play() on loadedmetadata specifically (in addition to that hook's own
  // canplay/loadeddata/visibility retries).
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
          {/* THE shared block — headline, its text mask, and both video
              layers all live in here and move via this ONE y:blockY
              transform. Nothing inside has its own independent position
              transform, so nothing can drift relative to anything else. */}
          <motion.div className="absolute inset-0 overflow-hidden" style={{ y: blockY }}>
            {/* Layer A — dark grade, always visible outside the letters
                (and everywhere the text-zone cover below doesn't hide it).
                Starts flush with the headline's own TOP edge — it needs to
                extend behind the whole headline for the letters to have
                video content to reveal — and is tall enough to always
                reach the block's own bottom with margin to spare. */}
            <video
              ref={darkVideoRef}
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              preload="auto"
              poster={POSTER}
              className="absolute inset-x-0 w-full object-cover object-center"
              style={{ top: `${videoTopVh}vh`, height: `${VIDEO_HEIGHT_VH}vh` }}
              aria-hidden="true"
            >
              <DarkSources />
            </video>

            {/* Mask wrapper — sized to the WHOLE block (inset-0), matching
                the viewport-sized coordinate space the mask bitmap was
                generated in. Because this wrapper is a rigid child of the
                same translating block as the headline it was measured
                from, mask-position never needs to move: the letters stay
                exactly where they were drawn, and the block's own
                transform carries them (and the headline) together. */}
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
              }}
            >
              {/* Layer B — bright grade, masked to the exact letter shapes.
                  Same top/height as Layer A so the two share pixel-for-
                  pixel framing — only the color grade differs. */}
              <video
                ref={brightVideoRef}
                muted
                loop
                playsInline
                disablePictureInPicture
                preload="auto"
                className="absolute inset-x-0 w-full object-cover object-center"
                style={{ top: `${videoTopVh}vh`, height: `${VIDEO_HEIGHT_VH}vh` }}
                aria-hidden="true"
              >
                <BrightSources />
              </video>
            </motion.div>

            {/* Text-zone cover — opaque, spans the headline's own bounding
                box plus the (halved) spacing gap below it. Both video
                layers already extend behind this whole region (see Layer A
                above), so without this cover the inter-letter gaps and
                letter counters would show dark video peeking through while
                the headline is still supposed to read as solid white on
                black. Fades via the SAME whiteOpacity value as the
                headline itself, so cover and text arrive at "gone" in the
                same instant — the reveal underneath (already fully
                rendered, just hidden) needs no timing of its own. */}
            <motion.div
              className="absolute inset-x-0 pointer-events-none"
              style={{ top: `${videoTopVh}vh`, height: `${textZoneCoverHeightVh}vh`, backgroundColor: SECTION_BG, opacity: whiteOpacity }}
              aria-hidden="true"
            />

            {/* Solid white headline — fully opaque at rest (its own glyph
                ink, on top of the text-zone cover above, reads as clean
                white on black). Fades out over the first ~35% of scroll
                via whiteOpacity — in lockstep with the cover — to reveal
                the video underneath through the exact same letter shapes
                it was measured from. Rigid child of the same block as the
                video/mask/cover above, so it descends with them together. */}
            <motion.h1
              ref={whiteHeadlineRef}
              className={`${headlineClass} absolute inset-x-0 top-28 md:top-32 text-center px-4`}
              style={{ ...currentHeadlineStyle, scaleY: HEADLINE_SCALE_Y, color: WHITE, opacity: whiteOpacity, willChange: 'opacity' }}
            >
              <HeadlineWords />
            </motion.h1>
          </motion.div>

          {/* Real semantic heading for SEO/a11y — visually hidden. */}
          <h1 className="sr-only">BUILD TO LAST</h1>

          {/* Caption card — flush to the bottom-right corner on desktop,
              full-width bottom sheet on mobile. Marks the end of the hero.
              The block above is clamped (via maxDescentVh) to always stop
              CARD_CLEARANCE_PX above this card's top edge. */}
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

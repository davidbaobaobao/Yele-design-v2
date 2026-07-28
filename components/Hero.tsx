'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useVideoAlwaysAutoplay } from '@/hooks/useVideoAlwaysAutoplay'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const VIDEO_DIR = '/media/hero2'
const POSTER = `${VIDEO_DIR}/hero2_poster.jpg`

const headlineClass = 'font-display font-black uppercase whitespace-nowrap leading-[0.8]'

// Headline letters are stretched 70% taller vertically only (scaleY), width
// unchanged — the visible solid layer and the phantom mask-reference div
// both apply this so the mask lines up with the rendered glyphs.
const HEADLINE_SCALE_Y = 1.7

// Both the solid-at-rest fill and the color-video reveal are drawn through
// the SAME mask bitmap (see the shared mask wrapper below), so there is no
// second independently-rendered layer for it to drift out of alignment
// with — this stays at 1 (no erosion needed) as a result.
const MASK_INSET = 1

// Both videos now start at top:0 — full viewport coverage from the very
// first frame, so the mask always has color-video content to reveal behind
// the letters (no more "blank before the video rises" phase).
const RISE_VH = { desktop: 25, mobile: 15 }
const CARD_CLEARANCE_PX = 24

// Linear-map helper for scroll-linked values. framer-motion's range-array
// form of useTransform (mv, [in], [out]) doesn't track live scroll updates
// reliably in this app (verified in isolation — the derived value freezes
// mid-scroll); the function form does, so every transform below is built on
// this instead.
function linearMap(inMin: number, inMax: number, outMin: number, outMax: number) {
  return (v: number) => {
    if (v <= inMin) return outMin
    if (v >= inMax) return outMax
    return outMin + ((outMax - outMin) * (v - inMin)) / (inMax - inMin)
  }
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
  const colorVideoRef = useRef<HTMLVideoElement>(null)
  const bwVideoRef = useRef<HTMLVideoElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)

  const [maskUrl, setMaskUrl] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  // How far the headline is allowed to descend (in vh) before its bottom
  // edge would reach the caption card — measured from the real DOM so it
  // adapts to however tall the caption card's wrapped text turns out to be.
  // The conservative default only matters for the first paint before layout
  // measurement runs.
  const [maxDescentVh, setMaxDescentVh] = useState(50)

  const reduceMotion = useHydratedReducedMotion()

  useVideoAlwaysAutoplay(colorVideoRef)
  useVideoAlwaysAutoplay(bwVideoRef)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Phase 1 (0 → 0.6): the swarm continues rising/flowing (it already fully
  // covers the viewport at rest — this just keeps the content moving).
  const riseVh = isMobile ? RISE_VH.mobile : RISE_VH.desktop
  const videoY = useTransform(scrollYProgress, v => `${-riseVh * linearMap(0, 0.6, 0, 1)(v)}vh`)
  const videoScale = isMobile ? 1.15 : 1
  // The video is taller than the sticky viewport by exactly the max rise
  // distance — that overrun is the buffer that keeps the video's bottom
  // edge flush with the section bottom even after the group translates up
  // by riseVh during phase 1 (a shorter fixed buffer used to run out before
  // the rise finished, exposing an empty gap below the video).
  const videoHeightVh = 100 + riseVh

  // The mask reveals the color video at the headline's OWN independent
  // on-screen position (headlineDescentVh), but the mask lives inside the
  // same videoY-transformed group as the video it's masking (required so
  // the color layer and B&W layer share pixel-for-pixel alignment — see the
  // shared video group below). Since that group already moved by videoY,
  // the mask's local position needs the *difference* between where the
  // headline should appear and where the group itself has drifted to, so
  // mask-position offsets by (headlineDescent − videoY), not by
  // headlineDescent alone.
  const maskPosition = useTransform(scrollYProgress, v => {
    const headlineDescent = linearMap(0, 0.85, 0, maxDescentVh)(v)
    const videoRise = riseVh * linearMap(0, 0.6, 0, 1)(v)
    return `0px ${headlineDescent + videoRise}vh`
  })

  // Solid bone headline starts fully opaque (hiding the color-masked layer
  // beneath it entirely) and fades out over the first ~35% of hero scroll,
  // letting the particle video show through the letter shapes underneath.
  const solidHeadlineOpacity = useTransform(scrollYProgress, linearMap(0, 0.35, 1, 0))

  // Phase 2 (0.55 → 0.8): caption card slides in bottom-right/bottom-sheet.
  const cardY = useTransform(scrollYProgress, linearMap(0.55, 0.8, 40, 0))
  const cardOpacity = useTransform(scrollYProgress, linearMap(0.55, 0.8, 0, 1))

  // Phase 3 (0.8 → 1): whole scene eases out as the next section arrives.
  const sceneOpacity = useTransform(scrollYProgress, linearMap(0.8, 1, 1, 0.85))

  // Track the mobile breakpoint for the rise distance / scale.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Draw the headline glyphs onto an offscreen canvas — this becomes the
  // mask-image that lets the color video show through only where the
  // letters sit. White fill on a transparent canvas works for both alpha-
  // and luminance-mode mask compositing. Measured from the invisible
  // (text-transparent) phantom headline div at its resting position — the
  // mask is repositioned for scroll via the animated mask-position transform
  // above, not by redrawing this bitmap.
  const drawMask = useCallback(() => {
    const el = headlineRef.current
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

    // Canvas's own text-layout engine (width/letter-spacing/kerning) never
    // matches the browser's exactly — drawing a whole string with
    // ctx.fillText and centering it via textAlign left a consistent
    // horizontal drift once the 1.7x vertical stretch made it visible
    // against the solid h1 on top. Sidestep canvas layout entirely: walk
    // every character in the DOM, get ITS OWN true on-screen position via a
    // one-character Range, and stamp just that glyph there. Canvas is only
    // used for glyph shape now, never for positioning — so letter-spacing,
    // kerning and canvas/CSS width differences can't cause any drift.
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

  // Measures the headline's resting box and the caption card's rendered
  // height to compute how far (in vh) the headline can descend before its
  // bottom edge would land within CARD_CLEARANCE_PX of the card's top.
  const measureDescentLimit = useCallback(() => {
    const headlineEl = headlineRef.current
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
    let cancelled = false
    document.fonts.ready.then(() => {
      if (cancelled) return
      drawMask()
      measureDescentLimit()
    })
    return () => {
      cancelled = true
    }
  }, [drawMask, measureDescentLimit, reduceMotion])

  // Recompute on ANY box change to the headline (not just a window resize —
  // a font swap or layout shift can change its size/position too) via
  // ResizeObserver, plus a plain resize listener as a fallback for browsers
  // without it and to re-measure the caption card's height.
  useEffect(() => {
    if (reduceMotion) return
    let timer: number | undefined
    const recompute = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        drawMask()
        measureDescentLimit()
      }, 150)
    }

    window.addEventListener('resize', recompute)

    let ro: ResizeObserver | undefined
    if (headlineRef.current && 'ResizeObserver' in window) {
      ro = new ResizeObserver(recompute)
      ro.observe(headlineRef.current)
    }

    return () => {
      window.removeEventListener('resize', recompute)
      ro?.disconnect()
      window.clearTimeout(timer)
    }
  }, [drawMask, measureDescentLimit, reduceMotion])

  // Keep the two videos in lockstep — checked once a second, corrected only
  // past a small drift threshold (not every frame).
  useEffect(() => {
    if (reduceMotion) return
    const id = window.setInterval(() => {
      const driver = colorVideoRef.current
      const follower = bwVideoRef.current
      if (!driver || !follower) return
      if (Math.abs(driver.currentTime - follower.currentTime) > 0.05) {
        follower.currentTime = driver.currentTime
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [reduceMotion])

  // Mobile gets its own smaller clamp — the desktop 5rem floor is too wide
  // for "BUILD TO" to fit one line on narrow phones without clipping (the
  // whole point of clamp's min/preferred/max only works within one
  // continuous range; mobile needs a genuinely different range, not just a
  // smaller point on the same curve).
  const headlineStyle = {
    fontSize: isMobile ? 'clamp(3.5rem, 15vw, 4.5rem)' : 'clamp(5rem, 12.3vw, 18rem)',
    letterSpacing: '-0.03em',
  }

  // Vertical-only stretch, shared by every rendered/measured copy of the
  // headline (visible solid layer + phantom mask reference) so they all
  // stay pixel-aligned.
  const headlineTransformStyle = {
    transform: `scaleY(${HEADLINE_SCALE_Y})`,
    transformOrigin: 'center',
  }

  const captionText =
    'Websites for small businesses — designed, built and maintained by Yele. You run the business. We run the website.'

  // Card is flush against the viewport's right edge (no rounding needed on
  // that side — it reads as the true edge); the left side floats inward, so
  // both its corners are rounded. Bottom stays flush/sharp against the
  // mission section beneath (see Mission.tsx bg match) so the card reads as
  // attached rather than floating above it.
  const captionCardClass =
    'absolute bottom-0 inset-x-0 md:inset-x-auto md:right-0 font-body text-bone leading-snug bg-[#0A0A0A] p-10 text-xl md:text-2xl max-w-md w-full md:w-auto rounded-t-2xl rounded-b-none md:rounded-tl-3xl md:rounded-tr-none md:rounded-bl-3xl md:rounded-br-none'

  // ---- Reduced-motion fallback: static layout, no parallax, no mask ----
  if (reduceMotion) {
    return (
      <section id="hero" className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]">
        <h1
          className={`${headlineClass} absolute inset-x-0 top-20 text-center text-bone px-4`}
          style={{ ...headlineStyle, ...headlineTransformStyle }}
        >
          BUILD TO<br className="md:hidden" /> STAY
        </h1>
        <div className="absolute inset-0 overflow-hidden">
          <Image src={POSTER} alt="" fill sizes="100vw" priority className="object-cover" />
        </div>
        <div className={`${captionCardClass} z-10`}>{captionText}</div>
      </section>
    )
  }

  // ---- Full scroll-driven reveal ----
  return (
    <section ref={sectionRef} id="hero" className="relative h-[250vh] w-full bg-[#0A0A0A]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div style={{ opacity: sceneOpacity }} className="absolute inset-0">
          {/* Shared video group — the B&W background and the masked color
              layer both live in here and share this ONE y:videoY transform,
              so they move pixel-for-pixel together (this is what fixes the
              old offset: previously the masked video had its own nested y
              transform stacked on top of the mask wrapper's, drifting away
              from the B&W layer as scroll progressed). */}
          <motion.div style={{ y: videoY }} className="absolute inset-0 overflow-hidden z-0">
            {/* 1. B&W video — bottom layer, full coverage from frame one.
                Height overruns the viewport by riseVh so the bottom edge
                stays flush with the section bottom through the whole rise
                (see videoHeightVh above) — object-bottom keeps the video's
                own bottom content the anchor point within that taller box. */}
            <video
              ref={bwVideoRef}
              className="absolute inset-x-0 top-0 w-full object-cover object-bottom origin-center"
              style={{ height: `${videoHeightVh}vh`, scale: videoScale, filter: 'grayscale(1) contrast(1.05)' }}
              muted
              loop
              playsInline
              preload="auto"
              poster={POSTER}
              aria-hidden="true"
            >
              <SwarmSources />
            </video>

            {/* 2. Single mask wrapper — the color video AND the solid bone
                fill both live inside this ONE mask, so they always share
                exactly the same letter-shaped cutout and the same animated
                mask-position. A separate solid <h1> layered on top with its
                own CSS transform was tried first, but two different text
                renderers (canvas fillText vs native CSS text) never
                rasterize a glyph identically, and the 1.7x vertical stretch
                turned that normally-invisible mismatch into a visible color
                rim — putting both fills through one mask makes any mismatch
                a non-issue, since there's only one shape now, not two to
                align. */}
            <motion.div
              className="absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-300"
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
                ref={colorVideoRef}
                className="absolute inset-x-0 top-0 w-full object-cover object-bottom origin-center"
                style={{ height: `${videoHeightVh}vh`, scale: videoScale }}
                muted
                loop
                playsInline
                preload="auto"
                poster={POSTER}
                aria-hidden="true"
              >
                <SwarmSources />
              </video>

              {/* Solid bone fill — fully opaque at rest (hides the color
                  video beneath entirely through the same cutout: no
                  particles show at scroll 0). Fades out over the first
                  ~35% of hero scroll via solidHeadlineOpacity, revealing
                  the video through the exact same letter shapes as it
                  goes — same mask, so it can't drift out of alignment. */}
              <motion.div style={{ opacity: solidHeadlineOpacity }} className="absolute inset-0 bg-bone" />
            </motion.div>
          </motion.div>

          {/* Phantom measurement headline — fully transparent, never
              scroll-transformed (its resting box is the mask's reference
              frame; the animated mask-position above handles the apparent
              scroll movement instead). This is the only rendered copy of
              the headline glyphs — both the solid-at-rest and revealed-on-
              scroll states are just different fills shown through the one
              mask generated from this element. */}
          <div
            ref={headlineRef}
            aria-hidden="true"
            className={`${headlineClass} absolute inset-x-0 top-20 text-center text-transparent select-none px-4 pointer-events-none z-10`}
            style={{ ...headlineStyle, ...headlineTransformStyle }}
          >
            BUILD TO<br className="md:hidden" /> STAY
          </div>

          {/* Real semantic heading for SEO/a11y — visually hidden (the
              masked fill above is the visual representation). */}
          <h1 className="sr-only">BUILD TO STAY</h1>

          {/* Caption card — phase 2, flush to the bottom-right corner (no
              floating margin) on desktop, full-width bottom sheet on mobile.
              Marks the end of the hero. */}
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

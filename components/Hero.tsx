'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useVideoAutoplay } from '@/hooks/useVideoAutoplay'

const POSTER = '/media/hero/hero2_poster.jpg'

const headlineClass =
  'font-display font-black uppercase whitespace-nowrap leading-[0.9] tracking-tight'

// Video sits low at rest (top: 55vh) and rises by the same distance during
// phase 1, landing exactly at top:0 — see the resting offset below.
const REST_TOP_VH = 55
const RISE_VH = { desktop: 55, mobile: 30 }

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
      <source media="(max-width: 767px)" src="/media/hero/hero2_mobile.webm" type="video/webm" />
      <source media="(max-width: 767px)" src="/media/hero/hero2_mobile.mp4" type="video/mp4" />
      <source src="/media/hero/hero2_hq.webm" type="video/webm" />
      <source src="/media/hero/hero2_hq.mp4" type="video/mp4" />
    </>
  )
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const colorVideoRef = useRef<HTMLVideoElement>(null)
  const bwVideoRef = useRef<HTMLVideoElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  const [maskUrl, setMaskUrl] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const reduceMotion = useReducedMotion()

  useVideoAutoplay(colorVideoRef)
  useVideoAutoplay(bwVideoRef)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Phase 1 (0 → 0.6): the swarm rises from its low resting position and
  // slides behind the pinned headline.
  const riseVh = isMobile ? RISE_VH.mobile : RISE_VH.desktop
  const videoY = useTransform(scrollYProgress, v => `${-riseVh * linearMap(0, 0.6, 0, 1)(v)}vh`)
  const videoScale = isMobile ? 1.15 : 1

  // Subline fades out early, over the first third of phase 1.
  const sublineOpacity = useTransform(scrollYProgress, linearMap(0.3, 0.5, 1, 0))

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
  // and luminance-mode mask compositing. The mask is generated at the
  // headline's live, fixed screen position and never moves.
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
    if ('letterSpacing' in ctx) {
      try {
        ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing
      } catch {
        // letterSpacing on Canvas2D isn't universally supported — safe to skip.
      }
    }

    // The headline is a single text run with one hard <br> (mobile-only via
    // CSS). getClientRects() naturally returns one rect on desktop (br
    // hidden) or two on mobile (br active) — matching the two known strings.
    const range = document.createRange()
    range.selectNodeContents(el)
    const rects = Array.from(range.getClientRects())
    const lines = rects.length >= 2 ? ['BUILD TO', 'STAY.'] : ['BUILD TO STAY.']

    rects.forEach((rect, i) => {
      const text = lines[i] ?? lines[lines.length - 1]
      ctx.fillText(text, rect.left + rect.width / 2, rect.top + rect.height / 2)
    })

    setMaskUrl(canvas.toDataURL())
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    let cancelled = false
    document.fonts.ready.then(() => {
      if (!cancelled) drawMask()
    })
    return () => {
      cancelled = true
    }
  }, [drawMask, reduceMotion])

  useEffect(() => {
    if (reduceMotion) return
    let timer: number | undefined
    const onResize = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(drawMask, 200)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(timer)
    }
  }, [drawMask, reduceMotion])

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

  const headline = (
    <h1
      ref={headlineRef}
      className={`${headlineClass} absolute inset-x-0 top-[27vh] md:top-[30vh] text-center text-bone px-4`}
      style={{ fontSize: 'clamp(2.75rem, 9.8vw, 210px)' }}
    >
      BUILD TO<br className="md:hidden" /> STAY.
    </h1>
  )

  const captionText =
    'Websites for small businesses — designed, built and maintained by Yele. You run the business. We run the website.'

  // ---- Reduced-motion fallback: static layout, no parallax, no mask ----
  if (reduceMotion) {
    return (
      <section id="hero" className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]">
        {headline}
        <div className="absolute inset-x-0 bottom-0 top-[55vh] overflow-hidden">
          <Image src={POSTER} alt="" fill sizes="100vw" priority className="object-cover" />
        </div>
        <p className="absolute bottom-24 left-6 md:bottom-10 md:left-10 z-10 font-body text-bone/90 text-base max-w-sm">
          Design, content &amp; maintenance — one subscription. From $99/mo.
        </p>
        <div className="absolute bottom-6 inset-x-4 md:inset-x-auto md:right-6 z-10 font-body text-bone leading-relaxed bg-[#0A0A0A]/90 rounded-2xl p-6 max-w-sm">
          {captionText}
        </div>
      </section>
    )
  }

  // ---- Full scroll-driven reveal ----
  return (
    <section ref={sectionRef} id="hero" className="relative h-[250vh] w-full bg-[#0A0A0A]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div style={{ opacity: sceneOpacity }} className="absolute inset-0">
          {/* 1. B&W video — bottom layer */}
          <div className="absolute inset-0 overflow-hidden z-0">
            <motion.video
              ref={bwVideoRef}
              className="absolute inset-x-0 w-full h-[110vh] object-cover origin-center"
              style={{
                top: `${REST_TOP_VH}vh`,
                y: videoY,
                scale: videoScale,
                filter: 'grayscale(1) contrast(1.05)',
              }}
              muted
              loop
              playsInline
              preload="auto"
              poster={POSTER}
              aria-hidden="true"
            >
              <SwarmSources />
            </motion.video>
          </div>

          {/* 2. Visible bone headline — sits above the B&W layer so it's
              legible against the swarm as soon as the video reaches it. */}
          <div className="absolute inset-0 z-10 pointer-events-none">{headline}</div>

          {/* 3. Masked color video — topmost. The wrapper (mask carrier)
              never moves and stays glued to the headline's fixed screen
              position; only the video inside it translates. Until the
              rising video reaches the headline's height, this layer has no
              pixels there at all, so the bone headline underneath is all
              that's visible — exactly matching "bone h1 only fully visible
              while the video is still below the text". */}
          <div
            className="absolute inset-0 overflow-hidden z-20 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: maskUrl ? 1 : 0,
              WebkitMaskImage: maskUrl ? `url(${maskUrl})` : 'none',
              maskImage: maskUrl ? `url(${maskUrl})` : 'none',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
              WebkitMaskPosition: '0 0',
              maskPosition: '0 0',
            }}
          >
            <motion.video
              ref={colorVideoRef}
              className="absolute inset-x-0 w-full h-[110vh] object-cover origin-center"
              style={{ top: `${REST_TOP_VH}vh`, y: videoY, scale: videoScale }}
              muted
              loop
              playsInline
              preload="auto"
              poster={POSTER}
              aria-hidden="true"
            >
              <SwarmSources />
            </motion.video>
          </div>

          {/* Subline — bottom-left, fades out early in phase 1, hidden on mobile */}
          <motion.p
            style={{ opacity: sublineOpacity }}
            className="hidden md:block absolute bottom-10 left-10 z-30 font-body text-bone/90 text-base max-w-sm"
          >
            Design, content &amp; maintenance — one subscription. From $99/mo.
          </motion.p>

          {/* Caption card — phase 2, bottom-right on desktop, full-width
              bottom sheet (flush, flat bottom corners) on mobile */}
          <motion.div
            style={{ y: cardY, opacity: cardOpacity }}
            className="absolute bottom-0 inset-x-0 md:inset-x-auto md:bottom-8 md:right-8 z-30 font-body text-bone leading-relaxed bg-[#0A0A0A]/90 p-6 max-w-sm w-full md:w-auto rounded-t-2xl rounded-b-none md:rounded-2xl"
          >
            {captionText}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

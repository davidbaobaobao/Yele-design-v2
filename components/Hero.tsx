'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useVideoAutoplay } from '@/hooks/useVideoAutoplay'

const POSTER = '/media/Hero/chrome_poster.jpg'

const CHIPS = ['No upfront payment', 'Cancel anytime', 'Live in 1 week', 'Fixed monthly price']

const headlineClass =
  'font-display font-black uppercase whitespace-nowrap leading-[0.92] tracking-tight'

function ChromeSources() {
  return (
    <>
      <source src="/media/Hero/chrome_color.webm" type="video/webm" />
      <source src="/media/Hero/chrome_color.mp4" type="video/mp4" />
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

  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', isMobile ? '-15%' : '-35%'])
  const chipsOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0])

  // Track the mobile breakpoint to pick the parallax amount.
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
  // and luminance-mode mask compositing.
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
      timer = window.setTimeout(drawMask, 150)
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

  const scrollToHowItWorks = () => {
    document.querySelector('#como-funciona')?.scrollIntoView({ behavior: 'smooth' })
  }

  // ---- Reduced-motion fallback: static poster, no parallax, solid headline ----
  if (reduceMotion) {
    return (
      <section id="hero" className="relative h-screen w-full overflow-hidden bg-dark">
        <Image src={POSTER} alt="" fill priority sizes="100vw" className="object-cover" />
        <h1
          className={`${headlineClass} absolute inset-x-0 top-[20%] text-center text-bone px-4`}
          style={{ fontSize: 'clamp(2.75rem, 9.5vw, 190px)' }}
        >
          BUILD TO<br className="md:hidden" /> STAY.
        </h1>
        <div className="absolute bottom-0 inset-x-0 pb-10 md:pb-14 px-6 md:px-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div className="max-w-md">
            <p className="font-body text-bone/90 text-base md:text-lg leading-relaxed mb-6">
              Design, content &amp; maintenance — one subscription. Live in 1 week. From $99/mo.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <a href="/registro" className="font-body font-medium text-sm bg-bone text-ink px-6 py-3 rounded-full">
                Start for free
              </a>
              <button
                onClick={scrollToHowItWorks}
                className="font-body font-medium text-sm border border-hairlineDark text-bone px-6 py-3 rounded-full cursor-pointer"
              >
                See how it works
              </button>
            </div>
          </div>
          <div className="hidden md:flex flex-wrap gap-2 justify-end max-w-sm">
            {CHIPS.map(c => (
              <span
                key={c}
                className="font-mono text-[10px] uppercase tracking-widest text-bone/80 border border-hairlineDark rounded-full px-3 py-1.5"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // ---- Full scroll-driven reveal ----
  return (
    <section ref={sectionRef} id="hero" className="relative h-[250vh] w-full bg-dark">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 1. B&W video — bottom layer, always fully visible */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.video
            ref={bwVideoRef}
            className="absolute inset-x-0 top-0 w-full h-[170%] object-cover"
            style={{ y: videoY, filter: 'grayscale(1) contrast(1.05)' }}
            muted
            loop
            playsInline
            preload="auto"
            poster={POSTER}
            aria-hidden="true"
          >
            <ChromeSources />
          </motion.video>
        </div>

        {/* 2. Masked color video — shows through only where the headline sits.
            The wrapper (mask carrier) never moves; only the video inside it
            translates, so the mask stays glued to the fixed headline. */}
        <div
          className="absolute inset-0 overflow-hidden transition-opacity duration-300"
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
            className="absolute inset-x-0 top-0 w-full h-[170%] object-cover"
            style={{ y: videoY }}
            muted
            loop
            playsInline
            preload="auto"
            poster={POSTER}
            aria-hidden="true"
          >
            <ChromeSources />
          </motion.video>
        </div>

        {/* 3. Headline — invisible driver for the mask, present in the DOM
            (opacity:0, not display:none) for SEO/a11y. Stays pinned simply
            by not receiving the video parallax transform. */}
        <h1
          ref={headlineRef}
          className={`${headlineClass} absolute inset-x-0 top-[20%] text-center text-bone opacity-0 px-4 pointer-events-none`}
          style={{ fontSize: 'clamp(2.75rem, 9.5vw, 190px)' }}
        >
          BUILD TO<br className="md:hidden" /> STAY.
        </h1>

        {/* Bottom row: subline + CTAs (left), trust chips (right) */}
        <div className="absolute bottom-0 inset-x-0 pb-10 md:pb-14 px-6 md:px-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 z-10">
          <div className="max-w-md">
            <p className="font-body text-bone/90 text-base md:text-lg leading-relaxed mb-6">
              Design, content &amp; maintenance — one subscription. Live in 1 week. From $99/mo.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="/registro"
                className="font-body font-medium text-sm bg-bone text-ink px-6 py-3 rounded-full transition-transform active:scale-95"
              >
                Start for free
              </a>
              <button
                onClick={scrollToHowItWorks}
                className="font-body font-medium text-sm border border-hairlineDark text-bone px-6 py-3 rounded-full cursor-pointer transition-colors hover:bg-white/5"
              >
                See how it works
              </button>
            </div>
          </div>

          <motion.div
            style={{ opacity: chipsOpacity }}
            className="hidden md:flex flex-wrap gap-2 justify-end max-w-sm"
          >
            {CHIPS.map(c => (
              <span
                key={c}
                className="font-mono text-[10px] uppercase tracking-widest text-bone/80 border border-hairlineDark rounded-full px-3 py-1.5"
              >
                {c}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

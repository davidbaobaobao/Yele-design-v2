'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useIsLowPowerDevice } from '@/hooks/useIsLowPowerDevice'
import { TextGradient } from '@/components/ui/text-gradient'

const SRC = '/media/howwefind/8cubesfollow.html'
// No portrait variant shot yet — same poster serves both the always-on
// base layer (desktop, under the iframe) and the mobile/coarse-pointer
// stand-in (isLowPower below never mounts the iframe at all).
const POSTER = '/media/howwefind/poster.jpeg'

// Same-origin only — reaches into the iframe's own contentWindow, purely
// to forward wheel so the page scrolls over the iframe instead of the
// artifact trapping it (same shape as how-yele-animations' tuneSubsection
// and the old ConveyorCards tuner). This artifact has no #hint or other
// DOM to hide, so that's the only thing this needs to do.
function tuneCubeScene(iframe: HTMLIFrameElement) {
  const w = iframe.contentWindow
  if (!w) return
  w.addEventListener(
    'wheel',
    (e: WheelEvent) => {
      window.scrollBy(0, e.deltaY)
    },
    { passive: true }
  )
}

// Standard non-hero section-header size (matches WhyYele.tsx/
// AgencyIntro.tsx/HowYeleAnimations' shared h2 token), not the larger
// hero-scale sizing.
function Headline({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <h2
      className="font-display leading-tight text-center text-[clamp(1.5rem,2.6vw,2.75rem)]"
      style={{ color: '#F2F0EB' }}
    >
      <span className="sr-only">We create the best design for your.</span>
      <span aria-hidden="true">
        <span className="block">We create</span>
        <motion.span
          className="block"
          animate={reduceMotion ? {} : { opacity: [1, 0.55, 1] }}
          transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <TextGradient as="span">the best design</TextGradient>
        </motion.span>
        <span className="block">for your</span>
      </span>
    </h2>
  )
}

// Sits right after the try-for-free video section. min-h-[150vh] wrapper
// with a sticky, exactly-100vh inner — the cubes stay pinned to the
// viewport for that extra half-viewport of scroll, then release like any
// other sticky section (same shape as ContentShowcase's PinnedReveal,
// just without a scroll-driven reveal transform: this is a plain CSS
// sticky pin, not a scrollYProgress-tracked animation). The 1.5x is scroll
// LENGTH only — the iframe itself always renders at a fixed 100vh, and the
// artifact's own renderer is capped at DPR 1.25 internally (patched in
// public/media/howwefind/8cubesfollow.html to match CubesScene.tsx's own
// cap), so there's no 1.5x-resolution cost.
//
// Poster-first, no pop: poster.jpeg is an always-mounted base layer (never
// removed, so there's never a black frame even mid-load), and the iframe
// fades in on top of it once it's had a moment to actually paint a WebGL
// frame — same 150ms-after-onLoad approximation as how-yele-animations'
// glass section (no readiness signal is reachable from the parent for
// either artifact).
//
// Lazy-loads ~600px before view, unloads (src="") once well past — same
// near/far IntersectionObserver pair as how-yele-animations/hero cubes.
// Only one WebGL-hosting section is ever "near" the viewport at once by
// design (see useIsLowPowerDevice's own comment) since these sections are
// all full-height and spread apart on the page.
export default function CubeFollowSection() {
  const ref = useRef<HTMLElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const isLowPower = useIsLowPowerDevice()
  const reduceMotion = !!useHydratedReducedMotion()
  const [tabHidden, setTabHidden] = useState(false)
  const [near, setNear] = useState(false)
  const [far, setFar] = useState(true)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden)
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (isLowPower || !el || !('IntersectionObserver' in window)) return
    const loadIO = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) setNear(true)
      },
      { rootMargin: '600px 0px' }
    )
    const unloadIO = new IntersectionObserver(
      entries => setFar(!entries[0]?.isIntersecting),
      { rootMargin: '100% 0px' }
    )
    loadIO.observe(el)
    unloadIO.observe(el)
    return () => {
      loadIO.disconnect()
      unloadIO.disconnect()
    }
  }, [isLowPower])

  const showScene = near && !far && !tabHidden && !isLowPower

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    if (showScene) {
      if (iframe.getAttribute('src') !== SRC) iframe.src = SRC
    } else if (iframe.getAttribute('src')) {
      iframe.src = ''
      setLive(false)
    }
  }, [showScene])

  return (
    <section ref={ref} data-nav-dark className="relative w-full min-h-[150vh]" style={{ backgroundColor: '#0D0E12' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* z-0 + loading="eager" (not the next/image default "lazy") — this
            sits inside a position:sticky container, and a handful of
            browsers miscalculate a lazy <img>'s viewport-intersection while
            it's still in its pre-stuck resting position, so it can fail to
            ever trigger. Eager-loading it removes that ambiguity entirely;
            it's mounted well before the section is scrolled into view
            regardless, so this doesn't cost an above-the-fold LCP slot. */}
        <Image
          src={POSTER}
          alt=""
          fill
          loading="eager"
          quality={85}
          sizes="100vw"
          className="z-0 object-cover"
          aria-hidden="true"
        />

        {!isLowPower && (
          <iframe
            ref={iframeRef}
            title="Cursor-following cubes"
            scrolling="no"
            loading="lazy"
            onLoad={e => {
              if (!e.currentTarget.getAttribute('src')) return
              tuneCubeScene(e.currentTarget)
              window.setTimeout(() => setLive(true), 150)
            }}
            className="absolute inset-0 z-[1] h-full w-full transition-opacity duration-500"
            style={{ border: 0, opacity: live ? 1 : 0 }}
          />
        )}

        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
          <Headline reduceMotion={reduceMotion} />
        </div>
      </div>
    </section>
  )
}

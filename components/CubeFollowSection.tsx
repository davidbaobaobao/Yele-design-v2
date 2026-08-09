'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
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

// Sits right after the try-for-free video section. min-h-[225vh] wrapper
// with a sticky, exactly-100vh inner — the cubes stay pinned to the
// viewport for that extra 1.25 viewports of scroll, then release like any
// other sticky section (same shape as ContentShowcase's PinnedReveal, just
// a plain CSS sticky pin for the cubes/poster themselves — only the TEXT
// tracks scrollYProgress, sliding up ~120px over the section's full scroll
// range so it reads as drifting past the pinned cubes rather than sitting
// static on top of them). The extra wrapper height is scroll LENGTH only —
// the iframe itself always renders at a fixed 100vh, and the artifact's
// own renderer is capped at DPR 1.25 internally (patched in
// public/media/howwefind/8cubesfollow.html to match CubesScene.tsx's own
// cap), so there's no extra-resolution cost.
//
// Poster-first, no pop: poster.jpeg mounts once the section is `near`
// (~600px out, never on initial page load — this section is many screens
// below the fold and its poster is ~1.3MB, not worth competing with the
// hero's own critical assets) and, once mounted, never unmounts again —
// so from that point on there's never a black frame even mid-load — and
// the iframe (transparent: alpha renderer + scene.background=null in
// public/media/howwefind/8cubesfollow.html) fades in on top of it once
// it's had a moment to actually paint a WebGL frame — same
// 150ms-after-onLoad approximation as how-yele-animations' glass section
// (no readiness signal is reachable from the parent for either artifact).
// Because the iframe is transparent, the poster keeps showing continuously
// behind/around the cubes even once it's "live" — nothing blocks it.
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

  // Runs on every device, including low-power — this also gates the poster
  // below (near, not isLowPower, decides when it mounts), so mobile still
  // needs an accurate "~600px away" signal even though it never loads the
  // iframe itself.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // No IntersectionObserver support — fall back to just showing the
    // poster immediately rather than never at all.
    if (!('IntersectionObserver' in window)) {
      setNear(true)
      return
    }
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
  }, [])

  // Text slide-up parallax: tracks scroll progress across the WHOLE 150vh
  // (well, 225vh now) wrapper, not just the sticky window — 0 at the
  // section's very top, 1 at its very bottom, so the text drifts a full
  // 120px over the entire pinned-scroll range while the cubes themselves
  // stay put, giving a "moving past them" feel rather than the text just
  // sitting static over the pin.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const textY = useTransform(scrollYProgress, [0, 1], [60, -60])

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
    <section ref={ref} data-nav-dark className="relative w-full min-h-[225vh]" style={{ backgroundColor: '#0D0E12' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Mounted only once `near` (~600px out) — not on initial page load
            regardless of scroll position. Was loading="eager" and always
            mounted, which fetched this ~1.3MB poster immediately on every
            page load (this section is many screens below the fold),
            competing with the hero's own critical assets. Gating on `near`
            (an IntersectionObserver on the SECTION itself, not the image)
            also sidesteps the actual bug that made loading="eager"
            necessary before: a lazy <img> sitting inside a position:sticky
            container can have its own viewport-intersection miscalculated
            by the browser while still in its pre-stuck resting position,
            so it can fail to ever trigger. Once mounted it loads eagerly —
            no further lazy-loading ambiguity once we've already decided
            it's time. */}
        {near && (
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
        )}

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
            className="absolute inset-0 z-10 h-full w-full transition-opacity duration-500"
            style={{ border: 0, opacity: live ? 1 : 0 }}
          />
        )}

        {/* Bottom-edge fade into the next section's own #0D0E12 marquee bg —
            only the last 20% of the sticky area darkens, so the cubes blend
            out smoothly instead of cutting off hard right as the marquee
            begins. Same recipe as ConveyorVideoSection's top fade. */}
        <div
          className="pointer-events-none absolute inset-0 z-[15]"
          style={{ background: 'linear-gradient(to bottom, rgba(13,14,18,0) 80%, #0D0E12 100%)' }}
          aria-hidden="true"
        />

        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6"
          style={reduceMotion ? undefined : { y: textY }}
        >
          <Headline reduceMotion={reduceMotion} />
        </motion.div>
      </div>
    </section>
  )
}

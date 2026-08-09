'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useIsLowPowerDevice } from '@/hooks/useIsLowPowerDevice'
import { TypewriterWord } from '@/components/ui/typewriter-word'

const SRC = '/media/8rubik/8rubik.html'
// No portrait variant shot yet — same poster serves both the always-on
// base layer (desktop, under the iframe) and the mobile/coarse-pointer
// stand-in (isLowPower below never mounts the iframe at all).
const POSTER = '/media/8rubik/poster.jpeg'

const WORDS = ['Improve', 'Upgrade', 'Optimize', 'Refine']

// Same-origin only — reaches into the iframe's own contentWindow, purely
// to forward wheel so the page scrolls over the iframe instead of the
// artifact trapping it (same shape as CubeFollowSection's tuneCubeScene).
function tuneRubikScene(iframe: HTMLIFrameElement) {
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
// AgencyIntro.tsx/HowYeleAnimations' shared h2 token), not the hero's own
// larger scale. Left-aligned within this right-hand column (mirroring the
// hero's own left-aligned text within ITS column, just on the other
// side) — expandRight on TypewriterWord so nothing needs to reserve the
// longest word's width; there's no centered content around it to keep
// stable, the word just grows into the column's own generous right inset.
function Headline({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <h2
      className="font-display leading-tight text-[clamp(1.5rem,2.6vw,2.75rem)]"
      style={{ color: '#F2F0EB' }}
    >
      <span className="sr-only">We improve your website constantly.</span>
      <span aria-hidden="true">
        <span className="whitespace-nowrap">
          We <TypewriterWord words={WORDS} reduceMotion={reduceMotion} expandRight />
        </span>
        <br />
        your website
        <br />
        constantly
      </span>
    </h2>
  )
}

// Hero-style split section, MIRRORED — animation on the LEFT, text on the
// RIGHT (the hero itself is text-left). Sits right after
// ConveyorVideoSection ("We make your website fast"). Same lazy-load/
// unload/poster-fade architecture as CubeFollowSection.tsx: near/far
// IntersectionObserver pair (600px-out load, unload once well past),
// tab-hidden pause, poster.jpeg mounts once `near` (not on initial page
// load) and then never unmounts, so there's no black pop once it's there;
// the iframe is transparent (see public/media/8rubik/8rubik.html) and
// fades in on top once it's had a moment to paint, so the poster stays
// visible continuously behind the cubes rather than being blocked.
// Mobile/coarse-pointer shows the poster only, no live iframe — the two
// columns stack (animation top half, text bottom half) instead of sitting
// side by side.
export default function KeepImprovingSection() {
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
    <section ref={ref} data-nav-dark className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
      {/* Continuous poster BEHIND BOTH halves — sized to the whole section
          (not nested inside the left column), so the right-hand text sits
          directly on the same image with no separate background, and the
          left column's transparent iframe shows it continuously behind the
          cubes too, not just up to the column's own edge. Mounted only once
          `near` (~600px out) — not on initial page load. This section is
          several screens below the fold; its ~1.3MB poster loading
          unconditionally at page load competed with the hero's own
          critical assets for bandwidth. Once mounted it loads eagerly — no
          further lazy-loading ambiguity once we've already decided it's
          time. */}
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

      <div className="relative z-10 flex h-full w-full flex-col md:flex-row">
        {/* LEFT half (top half on mobile): the animation. The iframe itself
            is transparent (scene.background=null + alpha renderer, see
            public/media/8rubik/8rubik.html) so the shared poster above
            shows through continuously behind the cubes instead of a solid
            block. */}
        <div className="relative h-1/2 w-full overflow-hidden md:h-full md:w-1/2">
          {!isLowPower && (
            <iframe
              ref={iframeRef}
              title="Rubik's cube animation"
              scrolling="no"
              loading="lazy"
              onLoad={e => {
                if (!e.currentTarget.getAttribute('src')) return
                tuneRubikScene(e.currentTarget)
                window.setTimeout(() => setLive(true), 150)
              }}
              className="absolute inset-0 z-10 h-full w-full border-0 transition-opacity duration-500"
              style={{ opacity: live ? 1 : 0 }}
            />
          )}
        </div>

        {/* RIGHT half (bottom half on mobile): the text — no background of
            its own, sitting directly on the shared poster behind it. */}
        <div className="relative flex h-1/2 w-full items-center pl-8 pr-8 sm:pl-12 sm:pr-16 md:h-full md:w-1/2 md:pl-12 md:pr-20 lg:pl-16 lg:pr-24">
          <div className="pointer-events-none max-w-xl">
            <Headline reduceMotion={reduceMotion} />
          </div>
        </div>
      </div>

      {/* Bottom-edge fade into the next section's own #0D0E12 bg. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 md:h-56"
        style={{ background: 'linear-gradient(to top, #0D0E12 0%, rgba(13,14,18,0) 100%)' }}
        aria-hidden="true"
      />
    </section>
  )
}

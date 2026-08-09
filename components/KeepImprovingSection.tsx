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
// tab-hidden pause, poster.jpeg as an always-mounted eager-loaded base
// layer so there's no black pop, iframe fades in on top once it's had a
// moment to paint. Mobile/coarse-pointer shows the poster only, no live
// iframe — the two columns stack (animation top half, text bottom half)
// instead of sitting side by side.
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
    <section ref={ref} data-nav-dark className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
      <div className="flex h-full w-full flex-col md:flex-row">
        {/* LEFT half (top half on mobile): the animation */}
        <div className="relative h-1/2 w-full overflow-hidden md:h-full md:w-1/2">
          {/* z-0 + loading="eager" — same reasoning as CubeFollowSection's
              poster: an <img> inside this column can sit in unusual
              layout contexts, so eager-loading removes any ambiguity
              about whether the browser's own lazy-loading heuristic ever
              triggers it. It's mounted well before the section scrolls
              into view regardless. */}
          <Image
            src={POSTER}
            alt=""
            fill
            loading="eager"
            quality={85}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="z-0 object-cover"
            aria-hidden="true"
          />

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
              className="absolute inset-0 z-[1] h-full w-full border-0 transition-opacity duration-500"
              style={{ opacity: live ? 1 : 0 }}
            />
          )}
        </div>

        {/* RIGHT half (bottom half on mobile): the text */}
        <div className="relative flex h-1/2 w-full items-center pl-8 pr-8 sm:pl-12 sm:pr-16 md:h-full md:w-1/2 md:pl-12 md:pr-20 lg:pl-16 lg:pr-24">
          <div className="pointer-events-none max-w-xl">
            <Headline reduceMotion={reduceMotion} />
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Check, ChevronDown } from 'lucide-react'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useIsLowPowerDevice } from '@/hooks/useIsLowPowerDevice'
import { TypewriterWord } from '@/components/ui/typewriter-word'
import { CTAButton } from '@/components/ui/cta-button'

// WebGL, canvas-drawn textures — client/browser only, no useful SSR output.
const CubesScene = dynamic(() => import('@/components/CubesScene'), { ssr: false })

// Cubes are the single biggest contributor to TBT (a WebGL init + a
// constant rAF loop on every page load) — the poster/gradient/text paint
// immediately regardless, and the cubes fill in a moment later. Its own
// canvas fades in on top of that (see CubesScene.tsx) so the delayed
// mount doesn't read as a pop-in.
//
// This USED to gate the first mount behind requestIdleCallback (up to
// 1500ms in Chrome, an 800ms flat setTimeout fallback in Safari) — that
// idle-wait turned out to be the dominant chunk of the hero cube's own
// boot time (measured ~2.7s Chrome / ~3.3s Safari to first visible cube),
// not the WebGL/texture work itself. Swapped for a double-rAF instead:
// still yields past the hero's own first paint (so this never competes
// with it for the critical rendering path) without waiting for genuine
// browser idle time, which can arrive arbitrarily late on a busy page.
//
// This used to be "mount once, never unmount" — CubesScene's own internal
// IntersectionObserver paused its render LOOP off-screen, but the WebGL
// CONTEXT itself (GPU memory/resources) stayed allocated for the rest of
// the page's life once mounted. With three more WebGL-hosting sections on
// the page (conveyor, the how-yele-animations glass section), that's a
// real contributor to running out of GPU resources and freezing the tab — so
// past the initial boot gate, ongoing mount/unmount is driven by
// the hero's own visibility: cubes fully unmount (React unmount ->
// CubesScene's own cleanup effect cancels its rAF loop and disposes the
// renderer, actually freeing the context) once the hero is more than
// roughly a viewport out of view, and re-init on approach. Sections on
// this page are all full-height and far apart, so this alone keeps at
// most one WebGL-hosting section "near" the viewport at any time.
function useDeferredCubes(sectionRef: React.RefObject<HTMLElement | null>) {
  const [paintedFired, setPaintedFired] = useState(false)
  const [near, setNear] = useState(false)
  const [far, setFar] = useState(true)
  const isLowPower = useIsLowPowerDevice()

  useEffect(() => {
    if (isLowPower || !sectionRef.current || !('IntersectionObserver' in window)) return
    const el = sectionRef.current
    // Approaching: mounts once within ~300px of view (or already on
    // screen, which is the initial-load case). Far: unmounts only once
    // genuinely more than a viewport away — asymmetric so small scrolls
    // right at one boundary don't thrash mount/unmount.
    const loadIO = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) setNear(true)
      },
      { rootMargin: '300px 0px' }
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
  }, [sectionRef, isLowPower])

  // Only gates the very FIRST mount (keeps the initial WebGL init off the
  // very first paint); subsequent re-mounts on scrolling back up don't
  // need to wait at all. Also fires off the module fetches for this
  // component's own chunk AND the "three" chunk it needs as early as
  // possible, in parallel with that first-paint yield — webpack dedupes
  // identical dynamic import() calls to the same module, so this warms
  // both chunks in the network queue well before <CubesScene/> actually
  // renders (gated below by `near`, which is already true almost
  // instantly for the initial-load case), instead of paying for two
  // sequential chunk fetches (this wrapper's own, then three.js inside
  // its effect) at the moment it'd otherwise first try to mount.
  useEffect(() => {
    if (isLowPower) return
    void import('@/components/CubesScene')
    void import('three')
    let raf1 = 0
    let raf2 = 0
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setPaintedFired(true))
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [isLowPower])

  return paintedFired && near && !far && !isLowPower
}

const REASSURANCES = ['Fast delivery', 'No upfront cost', 'Cancel anytime']

// ffmpeg -i hero_poster.jpeg -vf "scale=2560:-2,gblur=sigma=1.5" -q:v 3 hero_poster.jpg —
// source was a 1.3MB 2752x1536 export; higher res + a light blur pass (masks
// JPEG blocking on this low-detail gradient background) compresses to ~32KB.
const POSTER = '/media/hero_new2/hero_poster.jpg'
const WHITE = '#F2F0EB'

const WORDS = ['Last', 'Stand out', 'Perform', 'Convert', 'Endure', 'Grow']

// /agency is a Google Ads landing page rendering the same shared HomePage
// (see app/agency/page.tsx) — variant swaps just the subhead/CTAs/badges
// copy for that route without touching the homepage's own copy or any
// layout/animation/styling.
export default function Hero({ variant = 'default' }: { variant?: 'default' | 'agency' } = {}) {
  const reduceMotion = !!useHydratedReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const showCubes = useDeferredCubes(sectionRef)

  return (
    <section ref={sectionRef} id="hero" className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
      <Image
        src={POSTER}
        alt=""
        fill
        priority
        quality={85}
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />

      {/* Cubes — full-width/height background layer spanning the entire
          hero, so there's no seam between a "text half" and a "cubes
          half". The cluster stays visually right-of-center via its own
          aspect-aware offset (CubesScene.tsx) — the same on-screen
          position it held back when it lived in a right-half box. Never
          mounted at all on mobile/coarse-pointer (useDeferredCubes) —
          WebGL cost isn't worth it there, and the text needs the full
          width anyway; the `hidden md:block` below is just a belt-and-
          suspenders CSS backstop, not the actual gate. Mounted lazily and
          fully unmounted again once the hero scrolls more than roughly a
          viewport out of view (see useDeferredCubes above) — the poster/
          gradient/text behind it is a perfectly fine placeholder either
          way, and the canvas fades itself in once ready (CubesScene.tsx)
          so mounting never reads as a pop. */}
      {showCubes && (
        <div className="hidden md:block absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <CubesScene />
        </div>
      )}

      {/* Single feathered left→right gradient behind the text only, full
          width so there's no hard edge/seam — replaces the old boxed
          left-half scrim. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 60%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 h-full flex items-center pl-8 sm:pl-16 md:pl-28 lg:pl-40 xl:pl-48 pr-6 md:pr-8">
        <div className="max-w-xl -translate-y-4 md:-translate-y-8">
          <h1 className="font-display leading-tight" style={{ fontSize: 'clamp(1.8rem, 4.3vw, 4.4rem)', color: WHITE }}>
            {/* Real, static text for SEO/a11y — the animated span below is
                purely decorative and hidden from assistive tech so its
                rapidly-changing partial-word states are never announced. */}
            <span className="sr-only">
              Delivering websites that last, stand out, perform, convert, endure, and grow.
            </span>
            <span aria-hidden="true">
              Delivering
              <br />
              Websites
              <br />
              {/* whitespace-nowrap so "that" and the word can't wrap apart;
                  expandRight on TypewriterWord so the word isn't given a
                  fixed reserved width — "that " stays put and the word
                  grows to the right as shorter/longer words cycle through,
                  instead of the whole line staying a fixed centered width. */}
              <span className="whitespace-nowrap">
                that <TypewriterWord words={WORDS} reduceMotion={reduceMotion} expandRight />
              </span>
            </span>
          </h1>

          <p className="font-body mt-6 text-lg md:text-xl leading-snug" style={{ color: 'rgba(242, 240, 235, 0.7)' }}>
            {variant === 'agency' ? (
              <>
                For businesses that need to look as good as they are.
                <br />
                Custom design, content and maintenance — one subscription, from $99/mo.
              </>
            ) : (
              <>
                Website design, maintenance &amp; content creation
                <br />
                One subscription. From $99/mo.
              </>
            )}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <CTAButton href="/start" variant="white">
              {variant === 'agency' ? 'Get started — nothing upfront' : 'Start for free'}
            </CTAButton>
            <a
              href={variant === 'agency' ? '#precios' : '#contacto'}
              className="inline-block font-body text-sm font-medium text-white px-6 py-3 rounded-full cursor-pointer border border-white/30 transition-colors hover:bg-white/10 active:scale-95"
            >
              {variant === 'agency' ? 'See pricing' : 'Contact us'}
            </a>
          </div>

          {/* Reassurance row — kept well clear of the buttons above (mt-10)
              so it doesn't read as part of the same cluster. One step down
              from the hero subtitle's own size (text-lg/md:text-xl ->
              text-base/md:text-lg) — still reads as a real trust signal,
              just not competing with the subtitle for attention. */}
          {variant === 'agency' ? (
            <div
              className="flex flex-col gap-2 mt-10 font-body text-base md:text-lg text-center sm:text-left"
              style={{ color: 'rgba(242, 240, 235, 0.55)' }}
            >
              <span className="inline-flex items-center justify-center sm:justify-start gap-2 font-medium">
                <Check size={16} className="opacity-70 flex-shrink-0" aria-hidden="true" />
                See your website before you pay
              </span>
              {/* Single leading check + plain flowing text (not two
                  separately-flexed phrases) so this wraps like a normal
                  sentence on narrow screens instead of orphaning the second
                  checkmark onto its own line. */}
              <span className="inline-flex items-start justify-center sm:justify-start gap-2">
                <Check size={16} className="opacity-70 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  No upfront cost <span aria-hidden="true" className="opacity-50">·</span> No contract, cancel anytime
                </span>
              </span>
            </div>
          ) : (
            <div
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-10 font-body text-base md:text-lg"
              style={{ color: 'rgba(242, 240, 235, 0.55)' }}
            >
              {REASSURANCES.map((phrase, i) => (
                <span key={phrase} className="inline-flex items-center gap-4">
                  {i > 0 && <span aria-hidden="true" className="hidden sm:inline opacity-50">·</span>}
                  <span className="inline-flex items-center gap-2">
                    <Check size={16} className="opacity-70 flex-shrink-0" aria-hidden="true" />
                    {phrase}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll-down indicator — centered on the full viewport width,
          independent of the text column above it. */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/70 hover:text-white transition-colors cursor-pointer focus-visible:outline-none motion-safe:animate-[heroScrollBounce_1.5s_ease-in-out_infinite]"
        aria-label="Scroll to next section"
      >
        <ChevronDown size={28} aria-hidden="true" />
      </button>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useIsLowPowerDevice } from '@/hooks/useIsLowPowerDevice'
import { TextGradient } from '@/components/ui/text-gradient'

const SRC = '/how-yele-animations/subsection2.html' // "Glass Grid Eject" — loads directly as the coin, no morph

// Same-origin only — reaches into the iframe's own contentWindow/
// contentDocument. Forwards wheel so the page scrolls over the iframe
// instead of trapping it (the artifact's own body is overflow:hidden),
// and hides the artifact's built-in "MOVE YOUR CURSOR" hint (#hint),
// which otherwise overlaps our headline overlay. Polled rather than a
// single check at load: the bundler wrapper this artifact uses finishes
// unpacking asynchronously AFTER the iframe's own load event fires (it
// swaps in the real document from a template on DOMContentLoaded), so
// #hint doesn't exist in the DOM yet at the instant onLoad runs.
function tuneSubsection(iframe: HTMLIFrameElement) {
  const w = iframe.contentWindow
  const d = iframe.contentDocument
  if (!w || !d) return

  w.addEventListener(
    'wheel',
    (e: WheelEvent) => {
      window.scrollBy(0, e.deltaY)
    },
    { passive: true }
  )

  let tries = 0
  const iv = setInterval(() => {
    tries++
    const hint = d.getElementById('hint')
    if (hint) {
      hint.style.setProperty('display', 'none')
      clearInterval(iv)
    } else if (tries > 40) {
      clearInterval(iv) // stop ~10s
    }
  }, 250)
}

// Standard non-hero section-header size — matches WhyYele.tsx/
// AgencyIntro.tsx's shared h2 token (font-display, leading-tight,
// text-[clamp(1.5rem,2.6vw,2.75rem)]), not the larger hero-scale sizing
// this headline used before.
const HEADLINE_STYLE: React.CSSProperties = { color: '#F2F0EB' }

// "best design" gets the same pink-shine (TextGradient) + soft opacity
// pulse combo used elsewhere (e.g. AgencyIntro's "From $99/mo.").
function Headline({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <h2
      className="font-display leading-tight text-center text-[clamp(1.5rem,2.6vw,2.75rem)]"
      style={HEADLINE_STYLE}
    >
      <span className="sr-only">We create the best design right for you.</span>
      <span aria-hidden="true">
        <span className="block whitespace-nowrap">
          We create the{' '}
          <motion.span
            animate={reduceMotion ? {} : { opacity: [1, 0.55, 1] }}
            transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <TextGradient as="span">best design</TextGradient>
          </motion.span>
        </span>
        right for you
      </span>
    </h2>
  )
}

// One normal-flow, full-height block, no poster — just the section's own
// #0D0E12 background until the iframe has loaded and rendered a frame, at
// which point the iframe AND the headline fade in together (~500ms), so
// the scene and text arrive as one beat rather than the text just sitting
// there over black. Lazy-loads: `src` is set once the section is ~600px
// from view (own IntersectionObserver on this section's own ref, no
// shared cross-component lock — every WebGL-hosting section on this page
// is full-height and far apart, so at most one is ever "near" at once),
// and cleared again once well past — same imperative src-toggle pattern
// as the hero cubes/conveyor.
function AnimationSection() {
  const ref = useRef<HTMLDivElement>(null)
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
    <section ref={ref} id="how-yele-glass" data-nav-dark className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
      {!isLowPower && (
        <iframe
          ref={iframeRef}
          title="How Yele works — glass coin"
          scrolling="no"
          loading="lazy"
          onLoad={e => {
            if (!e.currentTarget.getAttribute('src')) return
            tuneSubsection(e.currentTarget)
            // No readiness signal reachable from the parent for this
            // artifact — a short approximated delay for the first WebGL
            // frame to actually paint before revealing it.
            window.setTimeout(() => setLive(true), 150)
          }}
          className="absolute inset-0 h-full w-full transition-opacity duration-500"
          style={{ border: 0, opacity: live ? 1 : 0 }}
        />
      )}

      {/* Mobile/coarse-pointer never loads the live scene at all (isLowPower
          above), so the headline there isn't gated on `live` — it just
          shows over the section's own black background. */}
      <div
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 transition-opacity duration-500"
        style={{ opacity: live || isLowPower ? 1 : 0 }}
      >
        <Headline reduceMotion={reduceMotion} />
      </div>
    </section>
  )
}

export function HowYeleAnimation() {
  return <AnimationSection />
}

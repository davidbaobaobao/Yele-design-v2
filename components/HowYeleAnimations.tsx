'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useIsLowPowerDevice } from '@/hooks/useIsLowPowerDevice'
import { TypewriterWord } from '@/components/ui/typewriter-word'
import { TextGradient } from '@/components/ui/text-gradient'

const WORDS = ['Professional?', 'Unforgettable?', 'Intuitive?', 'Standout?', 'Credible?', 'Welcoming?', 'Reliable?']

const SRC_A = '/how-yele-animations/subsection1.html' // "Glass Grid Hover"
const SRC_B = '/how-yele-animations/subsection2.html' // "Glass Grid Eject"

// Same-origin only — reaches into the iframe's own contentWindow/
// contentDocument. Forwards wheel so the page scrolls over the iframe
// instead of trapping it (each artifact's own body is overflow:hidden),
// and hides the artifact's built-in "MOVE YOUR CURSOR" hint (#hint),
// which otherwise overlaps our headline overlay. Polled rather than a
// single check at load: the bundler wrapper both artifacts use finishes
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

const HEADLINE_STYLE: React.CSSProperties = {
  fontSize: 'clamp(1.6rem, 3.75vw, 3.75rem)',
  color: '#F2F0EB',
}
const HEADLINE_LINE1_STYLE: React.CSSProperties = {
  fontSize: 'clamp(1.75rem, 5.5vw, 3.75rem)',
}

// Sub 1 — reuses the exact headline/word-rotation this beat already used
// as HowYeleMakesSection (replaced by this section).
function HeadlineA({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <h2 className="font-display leading-tight text-center" style={HEADLINE_STYLE}>
      <span className="sr-only">
        How Yele can make your website professional, unforgettable, intuitive, standout, credible, welcoming, reliable.
      </span>
      <span aria-hidden="true">
        <span className="block whitespace-nowrap" style={HEADLINE_LINE1_STYLE}>
          How Yele can make your website
        </span>
        <TypewriterWord words={WORDS} reduceMotion={reduceMotion} />
      </span>
    </h2>
  )
}

// Sub 2 — "best design" gets the same pink-shine (TextGradient) + soft
// opacity pulse combo used elsewhere (e.g. AgencyIntro's "From $99/mo.").
function HeadlineB({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <h2 className="font-display leading-tight text-center" style={HEADLINE_STYLE}>
      <span className="sr-only">We create the best design right for you.</span>
      <span aria-hidden="true">
        <span className="block whitespace-nowrap" style={HEADLINE_LINE1_STYLE}>
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

// Posters — reuse each artifact's own lightweight loading-thumbnail SVG
// (from its #__bundler_thumbnail fallback) as a stand-in for a real "at
// rest" screenshot. Rendered as a permanent backdrop for every viewer
// (see AnimationSubsection below), not just mobile: it's what makes the
// section look already-lit the moment it scrolls into view, before the
// live scene (desktop/fine-pointer only) has booted and crossfaded in.
function PosterA() {
  return (
    <svg viewBox="0 0 1200 800" className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="1200" height="800" fill="#0D0E12" />
      <circle cx="600" cy="400" r="230" fill="#a5647a" opacity="0.85" />
      <g stroke="#3a3d46" strokeWidth="10" fill="none" opacity="0.9">
        <rect x="330" y="130" width="250" height="250" rx="40" />
        <rect x="620" y="130" width="250" height="250" rx="40" />
        <rect x="330" y="420" width="250" height="250" rx="40" />
        <rect x="620" y="420" width="250" height="250" rx="40" />
      </g>
    </svg>
  )
}
function PosterB() {
  return (
    <svg viewBox="0 0 1200 800" className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="1200" height="800" fill="#0D0E12" />
      <g stroke="#3a3d46" strokeWidth="10" fill="none" opacity="0.9">
        <rect x="330" y="130" width="250" height="250" rx="40" />
        <rect x="620" y="130" width="250" height="250" rx="40" />
        <rect x="330" y="420" width="250" height="250" rx="40" />
        <rect x="620" y="420" width="250" height="250" rx="40" />
      </g>
      <circle cx="600" cy="400" r="200" fill="none" stroke="#a5647a" strokeWidth="22" opacity="0.95" />
      <circle cx="545" cy="360" r="42" fill="#e8dfe4" />
      <circle cx="655" cy="360" r="42" fill="#e8dfe4" />
      <circle cx="545" cy="450" r="42" fill="#e8dfe4" />
      <circle cx="655" cy="450" r="42" fill="#e8dfe4" />
      <circle cx="600" cy="405" r="30" fill="#b06a80" />
    </svg>
  )
}

// One normal-flow, full-height block. The poster is a permanent backdrop —
// always rendered, from the very first paint — so the section already
// looks "lit" (panels + sphere at rest) before it's ever scrolled to. The
// iframe itself stays mounted permanently too; its `src` is toggled
// imperatively (empty when far, real URL when near) rather than
// conditionally rendering the element — this is what actually releases
// the WebGL context, and matches the same pattern as the hero cubes and
// conveyor (own IntersectionObserver on this section's own ref, no shared
// cross-component lock — every WebGL-hosting section on this page is
// full-height and far apart, so at most one is ever "near" at once). It
// boots hidden (opacity 0) and crossfades in ~500ms after load — neither
// artifact exposes a real "first frame rendered" signal reachable from
// the parent (unlike conveyor's <three-d-stage>), so this is an
// approximated settle delay, not a true readiness poll. Because the
// poster matches the resting frame, the swap reads as invisible. Never
// boots the live scene at all on mobile/coarse-pointer — poster only
// there.
function AnimationSubsection({
  src,
  title,
  headline,
  poster,
}: {
  src: string
  title: string
  headline: React.ReactNode
  poster: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const isLowPower = useIsLowPowerDevice()
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
    // 600px rather than the usual ~300px: with the conveyor section gone
    // and these two sections now far apart (separated by ContentShowcase),
    // each can safely boot earlier so WebGL has time to render its resting
    // frame before the section is actually scrolled to — no boot pop.
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
      if (iframe.getAttribute('src') !== src) iframe.src = src
    } else if (iframe.getAttribute('src')) {
      iframe.src = ''
      setLive(false)
    }
  }, [showScene, src])

  return (
    <div ref={ref} className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
      <div className="absolute inset-0">{poster}</div>

      {!isLowPower && (
        <iframe
          ref={iframeRef}
          title={title}
          scrolling="no"
          loading="lazy"
          onLoad={e => {
            if (!e.currentTarget.getAttribute('src')) return
            tuneSubsection(e.currentTarget)
            window.setTimeout(() => setLive(true), 500)
          }}
          className="absolute inset-0 h-full w-full transition-opacity duration-300"
          style={{ border: 0, opacity: live ? 1 : 0 }}
        />
      )}

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
        {headline}
      </div>
    </div>
  )
}

// Two independent sections, placed far apart in HomePage.tsx (sub-1 after
// AgencyReachSection, sub-2 after ContentShowcase's pyramid reveal) rather
// than stacked together — each gets its own IntersectionObserver above, so
// with the distance between them (plus the conveyor section removed from
// between the hero cubes and these), at most one of the two is ever near
// the viewport, which alone keeps at most one live WebGL context.
export function HowYeleAnimationSub1() {
  const reduceMotion = !!useHydratedReducedMotion()
  return (
    <section id="how-yele-sub1" data-nav-dark>
      <AnimationSubsection
        src={SRC_A}
        title="How Yele works — hover reveal"
        headline={<HeadlineA reduceMotion={reduceMotion} />}
        poster={<PosterA />}
      />
    </section>
  )
}

export function HowYeleAnimationSub2() {
  const reduceMotion = !!useHydratedReducedMotion()
  return (
    <section id="how-yele-sub2" data-nav-dark>
      <AnimationSubsection
        src={SRC_B}
        title="How Yele works — eject and connect"
        headline={<HeadlineB reduceMotion={reduceMotion} />}
        poster={<PosterB />}
      />
    </section>
  )
}

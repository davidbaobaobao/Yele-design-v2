'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { TypewriterWord } from '@/components/ui/typewriter-word'
import { TextGradient } from '@/components/ui/text-gradient'

const WORDS = ['Professional?', 'Unforgettable?', 'Intuitive?', 'Standout?', 'Credible?', 'Welcoming?', 'Reliable?']

const SRC_A = '/how-yele-animations/subsection1.html' // "Glass Grid Hover"
const SRC_B = '/how-yele-animations/subsection2.html' // "Glass Grid Eject"

// Both scenes draw their sphere at the cursor and share bg #0D0E12, so a
// same-origin crossfade between them reads as one continuous sphere while
// the panels switch from hover-reveal to eject/coin-morph underneath it.
// Threshold-based (not scroll-scrubbed) — a hard scroll-progress cutoff
// with a CSS opacity transition either side, matching "over ~500ms".
const CROSSFADE_AT = 0.5
// Mount band around the threshold: B mounts a little before the crossfade
// so it has a frame or two rendered before it needs to be visible; A stays
// mounted a little after so the fade-out isn't cut short. Outside this
// band only one of the two ever has a live WebGL context.
const MOUNT_B_FROM = 0.42
const MOUNT_A_UNTIL = 0.58

// Same-origin only — reaches into the iframe's own contentWindow to
// forward wheel events to the parent, so the pinned section scrolls
// normally instead of trapping the scroll wheel inside the iframe.
function forwardWheel(iframe: HTMLIFrameElement) {
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

const HEADLINE_STYLE: React.CSSProperties = {
  fontSize: 'clamp(1.6rem, 3.75vw, 3.75rem)',
  color: '#F2F0EB',
}
const HEADLINE_LINE1_STYLE: React.CSSProperties = {
  fontSize: 'clamp(1.75rem, 5.5vw, 3.75rem)',
}

// Sub 1 — reuses the exact headline/word-rotation this beat already used
// as HowYeleMakesSection (now replaced by this pinned section).
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

// Mobile posters — reuse each artifact's own lightweight loading-thumbnail
// SVG (from its #__bundler_thumbnail fallback) rather than a live WebGL
// scene. Two transmission-glass scenes would be too heavy for a phone
// alongside the hero cubes + conveyor cards.
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

const FADE_TRANSITION = 'opacity 500ms ease'

export default function HowYeleAnimations() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const reduceMotion = !!useHydratedReducedMotion()
  const isMobile = useIsMobile()

  // Lazy-load gate: don't set either iframe src until the section is
  // within ~300px of the viewport. Separate, wider-margin gate for
  // unloading BOTH once the section is genuinely far away (asymmetric
  // hysteresis, same reasoning as ConveyorCards — mounts early, only
  // unmounts once well past the edge, so it doesn't thrash on small
  // scrolls). This is now the 3rd/4th WebGL scene on the page, so both
  // ends of this are strict.
  const [near, setNear] = useState(false)
  const [farAway, setFarAway] = useState(true)
  const [tabHidden, setTabHidden] = useState(false)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el || !('IntersectionObserver' in window)) {
      setNear(true)
      setFarAway(false)
      return
    }
    const loadIO = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) setNear(true)
      },
      { rootMargin: '300px 0px' }
    )
    const unloadIO = new IntersectionObserver(
      entries => setFarAway(!entries[0]?.isIntersecting),
      { rootMargin: '100% 0px' }
    )
    loadIO.observe(el)
    unloadIO.observe(el)
    return () => {
      loadIO.disconnect()
      unloadIO.disconnect()
    }
  }, [])

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden)
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const active = near && !farAway && !tabHidden

  // Scroll progress through the pinned wrapper drives the crossfade. Only
  // three boolean thresholds actually matter for rendering, so this
  // re-renders on threshold crossings, not on every scroll pixel — the
  // whole point of this section is being strict about cost, and a naive
  // setState-per-tick would fight that.
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end end'] })
  const [crossed, setCrossed] = useState(false)
  const [pastMountA, setPastMountA] = useState(false)
  const [pastMountB, setPastMountB] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', v => {
    const nowCrossed = v >= CROSSFADE_AT
    setCrossed(prev => (prev === nowCrossed ? prev : nowCrossed))
    const nowPastMountA = v >= MOUNT_A_UNTIL
    setPastMountA(prev => (prev === nowPastMountA ? prev : nowPastMountA))
    const nowPastMountB = v > MOUNT_B_FROM
    setPastMountB(prev => (prev === nowPastMountB ? prev : nowPastMountB))
  })

  const mountA = active && !isMobile && !pastMountA
  const mountB = active && !isMobile && pastMountB

  return (
    <section ref={wrapperRef} data-nav-dark className="relative" style={{ height: '200vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
        {isMobile ? (
          <>
            <div className="absolute inset-0" style={{ opacity: crossed ? 0 : 1, transition: FADE_TRANSITION }}>
              <PosterA />
            </div>
            <div className="absolute inset-0" style={{ opacity: crossed ? 1 : 0, transition: FADE_TRANSITION }}>
              <PosterB />
            </div>
          </>
        ) : (
          <>
            {mountA && (
              <iframe
                src={SRC_A}
                title="How Yele works — hover reveal"
                scrolling="no"
                loading="lazy"
                onLoad={e => forwardWheel(e.currentTarget)}
                className="absolute inset-0 h-full w-full"
                style={{ border: 0, opacity: crossed ? 0 : 1, transition: FADE_TRANSITION }}
              />
            )}
            {mountB && (
              <iframe
                src={SRC_B}
                title="How Yele works — eject and connect"
                scrolling="no"
                loading="lazy"
                onLoad={e => forwardWheel(e.currentTarget)}
                className="absolute inset-0 h-full w-full"
                style={{ border: 0, opacity: crossed ? 1 : 0, transition: FADE_TRANSITION }}
              />
            )}
          </>
        )}

        {/* Headline overlays — not part of either artifact, so they live
            here, fading on the same threshold. pointer-events-none so
            they never sit in front of the iframes' own hover/click. */}
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6"
          style={{ opacity: crossed ? 0 : 1, transition: FADE_TRANSITION }}
        >
          <HeadlineA reduceMotion={reduceMotion} />
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6"
          style={{ opacity: crossed ? 1 : 0, transition: FADE_TRANSITION }}
        >
          <HeadlineB reduceMotion={reduceMotion} />
        </div>
      </div>
    </section>
  )
}

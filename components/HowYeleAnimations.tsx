'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
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

// One normal-flow, full-height block: lazy-loads its iframe on approach,
// unloads it once well out of view (or the tab is hidden), and never runs
// WebGL on mobile at all (poster instead). No pinning/sticky — this
// scrolls up like any other section and brings the next one in behind it.
function AnimationSubsection({
  src,
  title,
  headline,
  poster,
  loadMargin = '300px 0px',
}: {
  src: string
  title: string
  headline: React.ReactNode
  poster: React.ReactNode
  loadMargin?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [near, setNear] = useState(false)
  const [farAway, setFarAway] = useState(true)
  const [tabHidden, setTabHidden] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setNear(true)
      setFarAway(false)
      return
    }
    const loadIO = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) setNear(true)
      },
      { rootMargin: loadMargin }
    )
    // Wider, fixed margin for unloading regardless of the (possibly
    // larger) load margin above — asymmetric hysteresis so it doesn't
    // thrash on small scrolls: mounts early, only unmounts once
    // genuinely well past the edge.
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
  }, [loadMargin])

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden)
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const showScene = !isMobile && near && !farAway && !tabHidden

  return (
    <div ref={ref} className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
      {isMobile ? (
        poster
      ) : (
        showScene && (
          <iframe
            src={src}
            title={title}
            scrolling="no"
            loading="lazy"
            onLoad={e => tuneSubsection(e.currentTarget)}
            className="absolute inset-0 h-full w-full"
            style={{ border: 0 }}
          />
        )
      )}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
        {headline}
      </div>
    </div>
  )
}

export default function HowYeleAnimations() {
  const reduceMotion = !!useHydratedReducedMotion()

  return (
    <section id="how-yele-animations" data-nav-dark>
      <AnimationSubsection
        src={SRC_A}
        title="How Yele works — hover reveal"
        headline={<HeadlineA reduceMotion={reduceMotion} />}
        poster={<PosterA />}
        // Warms up well before it's on screen (vs. the usual 300px) so the
        // scene has already booted and settled — panels + sphere at rest —
        // by the time the user actually scrolls in, instead of visibly
        // activating right as it arrives.
        loadMargin="800px 0px"
      />
      <AnimationSubsection
        src={SRC_B}
        title="How Yele works — eject and connect"
        headline={<HeadlineB reduceMotion={reduceMotion} />}
        poster={<PosterB />}
      />
    </section>
  )
}

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const PALE_GOLD = '#F0E6C8'
const CARD_BG = '#0A0A0C'

// Function-form transform helper — framer-motion's range-array useTransform
// (mv, [in], [out]) doesn't reliably track live scroll updates in this app
// (found and worked around the same way in Hero.tsx). Every scroll-linked
// value below is built on this instead.
function linearMap(inMin: number, inMax: number, outMin: number, outMax: number) {
  return (v: number) => {
    if (v <= inMin) return outMin
    if (v >= inMax) return outMax
    return outMin + ((outMax - outMin) * (v - inMin)) / (inMax - inMin)
  }
}

function hexToRgba(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

type CardData = {
  n: string
  title: string
  text: string
  description: string
  capabilities: string[]
  closingLine?: string
  // Aurora blob hues — accent is the card's primary color, accent2 a
  // neighboring hue, so each card's glow reads as visually distinct.
  accent: string
  accent2: string
}

const CARDS: CardData[] = [
  {
    n: '01',
    title: 'We design',
    text: '#FFFFFF',
    description:
      "Bold, custom, no templates. A website designed from scratch for your business and nobody else's.",
    capabilities: ['ART DIRECTION', 'UX & LAYOUT', 'BRANDING', 'MOBILE-FIRST'],
    accent: '#7B8CDE', // cornflower
    accent2: '#3ED6C4', // teal
  },
  {
    n: '02',
    title: 'We build',
    text: '#FFFFFF',
    description: 'Fast, reliable, SEO-ready. Live in one week, built to perform from day one.',
    capabilities: ['NEXT-GEN STACK', 'LOCAL SEO', 'PERFORMANCE', 'HOSTING & DOMAIN'],
    accent: '#D46FC8', // orchid pink
    accent2: '#5B8CDE', // blue
  },
  {
    n: '03',
    title: 'We create',
    text: '#FFFFFF',
    description:
      'Photography, video, copy and illustration. Content that makes your site stand out — included.',
    capabilities: ['PHOTO & VIDEO', 'COPYWRITING', 'ILLUSTRATION', 'SOCIAL ASSETS'],
    accent: '#C7488F', // magenta-rose
    accent2: '#9B5DE5', // violet
  },
  {
    n: '04',
    title: 'We maintain',
    text: '#FFFFFF',
    description:
      "Hosting, security, updates and every change you need. Handled forever — that's the point.",
    capabilities: ['24/7 SUPPORT', 'UPDATES INCLUDED', 'SECURITY', 'ALWAYS IMPROVING'],
    closingLine: 'BUILT. STAYING.',
    accent: '#5B4B9E', // violet-indigo
    accent2: '#6E8FE0', // blue
  },
]

// True only for devices that can actually hover with a precise pointer —
// touch gets the static (still animating) aurora, no parallax to chase.
function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return fine
}

// Raw pointer position (-0.5..0.5 on each axis, card-relative), rAF-
// throttled and run through a spring so the aurora glides toward the
// pointer while moving and eases back to center on mouse leave.
function useAuroraParallax(disabled: boolean) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 100, damping: 20, mass: 0.7 })
  const y = useSpring(rawY, { stiffness: 100, damping: 20, mass: 0.7 })
  const rafRef = useRef<number | null>(null)
  const pendingRef = useRef<{ x: number; y: number } | null>(null)

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) return
      const rect = e.currentTarget.getBoundingClientRect()
      pendingRef.current = {
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      }
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null
          if (pendingRef.current) {
            rawX.set(pendingRef.current.x)
            rawY.set(pendingRef.current.y)
          }
        })
      }
    },
    [disabled, rawX, rawY]
  )

  const onMouseLeave = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { x, y, onMouseMove, onMouseLeave }
}

// Three blurred radial-gradient blobs near the card's bottom, each on its
// own CSS keyframe drift (transform + opacity only — see globals.css) so
// their overlaps constantly recombine instead of moving in lockstep. A
// top-to-bottom black gradient keeps the top ~55% clean for text; the
// aurora only reads in the bottom ~45%. Hover parallax (optional, cheap) is
// a single wrapper offset — the blobs' own CSS animation is untouched by it.
function AuroraLayer({
  accent,
  accent2,
  index,
  parallaxX,
  parallaxY,
}: {
  accent: string
  accent2: string
  index: number
  parallaxX: MotionValue<number>
  parallaxY: MotionValue<number>
}) {
  // useAuroraParallax already no-ops (values stay at 0) when disabled —
  // these hooks are always called, never conditionally, regardless.
  const px = useTransform(parallaxX, v => v * 16)
  const py = useTransform(parallaxY, v => v * 12)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div className="absolute inset-0" style={{ x: px, y: py }}>
        <div className="wwd-aurora-blob wwd-aurora-blob-a" style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, animationDelay: `${index * -3.4}s` }} />
        <div className="wwd-aurora-blob wwd-aurora-blob-b" style={{ background: `radial-gradient(circle, ${accent2} 0%, transparent 70%)`, animationDelay: `${index * -3.4 + 5}s` }} />
        <div className="wwd-aurora-blob wwd-aurora-blob-c" style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 65%)`, animationDelay: `${index * -3.4 + 2.3}s` }} />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, ${CARD_BG} 0%, ${CARD_BG} 55%, transparent 100%)` }}
      />
    </div>
  )
}

function WhatWeDoCard({
  card,
  index,
  dim,
  reduceMotion,
  rootRef,
}: {
  card: CardData
  index: number
  dim: MotionValue<number> | null
  reduceMotion: boolean
  rootRef?: React.Ref<HTMLDivElement>
}) {
  const stickyStyle = {
    top: `calc(var(--wwd-nav-h) + ${index} * var(--wwd-strip-h))`,
    // Fixed height, same for every card (not decreasing per index like
    // before) — rocketweblabs cards read as ~60-70vh, not near-full-
    // viewport. This also shortens each card's own contribution to the
    // section's total scroll length (the sticky containing-block dwell
    // math below doesn't need a separate wrapper div to achieve that — a
    // smaller fixed height already tightens it directly).
    height: 'min(48vh, 440px)',
  }

  const finePointer = useFinePointer()
  const parallax = useAuroraParallax(reduceMotion || !finePointer)

  const inner = (
    <div
      style={{
        backgroundColor: CARD_BG,
        willChange: 'transform',
        boxShadow: `0 0 60px ${hexToRgba(card.accent, 0.18)}`,
      }}
      className="relative flex flex-col h-full rounded-t-[2rem] overflow-hidden border border-white/[0.08]"
      onMouseMove={reduceMotion ? undefined : parallax.onMouseMove}
      onMouseLeave={reduceMotion ? undefined : parallax.onMouseLeave}
    >
      {/* Aurora renders in both branches — reduced motion freezes the CSS
          drift (see the prefers-reduced-motion rule in globals.css) rather
          than removing the glow outright. Hover parallax only wires in
          when motion is allowed. */}
      <div className="absolute inset-0 z-0">
        <AuroraLayer
          accent={card.accent}
          accent2={card.accent2}
          index={index}
          parallaxX={parallax.x}
          parallaxY={parallax.y}
        />
      </div>

      {/* Header strip — fixed height, stays visible when the card is
          collapsed under later cards. Pure black background (no aurora
          reaches this high) for clean text reading. */}
      <div className="relative shrink-0 flex items-center justify-between px-8" style={{ height: 'var(--wwd-strip-h)' }}>
        <h2 className="font-display font-black leading-none text-[36px] md:text-[68px]" style={{ color: card.text }}>
          {card.title}
        </h2>
        <span className="font-mono text-sm" style={{ color: card.text }}>
          {card.n}
        </span>
      </div>

      {/* Body — the part that gets covered as the next card arrives. Content
          sits right below the strip (self-start), not anchored to the
          bottom: now that cards are shorter than the viewport, the next
          card's natural position already reaches partway up the screen
          from the very first frame, so bottom-anchored content (self-end)
          was getting truncated almost immediately instead of staying clear
          until the card actually starts collapsing. */}
      <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 px-8 pb-6 pt-2 min-h-0">
        <div className="md:col-span-5 self-start">
          <p className="font-body text-base md:text-lg max-w-md" style={{ color: card.text }}>
            {card.description}
          </p>
        </div>
        <div className="md:col-start-6 md:col-span-2 self-start">
          <div className="font-mono text-sm uppercase space-y-1.5" style={{ color: card.text, opacity: 0.7 }}>
            {card.capabilities.map(c => (
              <div key={c}>{c}</div>
            ))}
          </div>
        </div>
      </div>

      {card.closingLine && (
        <p className="absolute bottom-6 right-8 font-mono text-sm md:text-base" style={{ color: PALE_GOLD }}>
          {card.closingLine}
        </p>
      )}

      {dim && (
        <motion.div
          style={{ opacity: dim }}
          className="absolute inset-0 z-20 bg-ink pointer-events-none"
          aria-hidden="true"
        />
      )}
    </div>
  )

  if (reduceMotion) {
    return (
      <div ref={rootRef} className="min-h-[58vh]">
        {inner}
      </div>
    )
  }

  // All four cards are direct siblings sharing the <section> as their
  // sticky containing block — NOT individually wrapped. A sticky element
  // stays pinned only while the *remaining space in its containing block*
  // is still >= its own height, so sharing one large containing block gives
  // cards 1-3 plenty of room to stay pinned as strips all the way through
  // the rest of the section (verified: wrapping each card in its own
  // min-h-screen box, which was tried first, caps each card's dwell to just
  // its own slot — cards 1-3 then un-stick and scroll away instead of
  // remaining stacked, breaking the effect). Card 4 is the one exception:
  // as the last child its natural bottom always coincides with the
  // section's end, giving it zero dwell — fixed with a trailing sentinel,
  // see the bottom of the component below.
  return (
    <div ref={rootRef} className="sticky" style={stickyStyle}>
      {inner}
    </div>
  )
}

// Dim driver for card `index`, based on how far the *next* card (nextRef)
// has approached — same proven function-form useTransform pattern as
// elsewhere in this app.
function useCoverDim(nextRef: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({ target: nextRef, offset: ['start end', 'start start'] })
  return useTransform(scrollYProgress, v => linearMap(0, 1, 0, 0.15)(v))
}

export default function WhatWeDo() {
  const reduceMotion = !!useHydratedReducedMotion()

  const card2Ref = useRef<HTMLDivElement>(null)
  const card3Ref = useRef<HTMLDivElement>(null)
  const card4Ref = useRef<HTMLDivElement>(null)

  const dim1 = useCoverDim(card2Ref)
  const dim2 = useCoverDim(card3Ref)
  const dim3 = useCoverDim(card4Ref)

  return (
    <section data-nav-dark className="wwd-strip-vars relative bg-[#0D0E12]">
      <WhatWeDoCard card={CARDS[0]} index={0} dim={reduceMotion ? null : dim1} reduceMotion={reduceMotion} />
      <WhatWeDoCard card={CARDS[1]} index={1} dim={reduceMotion ? null : dim2} reduceMotion={reduceMotion} rootRef={card2Ref} />
      <WhatWeDoCard card={CARDS[2]} index={2} dim={reduceMotion ? null : dim3} reduceMotion={reduceMotion} rootRef={card3Ref} />
      <WhatWeDoCard card={CARDS[3]} index={3} dim={null} reduceMotion={reduceMotion} rootRef={card4Ref} />
      {/* Card 4, as the last child, has its natural bottom coincide exactly
          with the section's own end — giving it zero dwell (verified: it
          releases and scrolls away the instant it arrives, with no buffer).
          This trailing sentinel, colored to match, gives it real hold time;
          any release that still happens within it is invisible since the
          color is identical. Not needed in the reduced-motion path, which
          doesn't use sticky at all. */}
      {!reduceMotion && <div style={{ height: 'min(48vh, 440px)', backgroundColor: CARD_BG }} aria-hidden="true" />}
    </section>
  )
}

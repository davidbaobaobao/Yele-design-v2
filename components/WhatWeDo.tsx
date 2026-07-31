'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const PALE_GOLD = '#F0E6C8'
const CARD_BG = '#0A0A0C'
const VIDEO_DIR = '/media/wesection'

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

// Resolves `vw` to a live pixel value in JS instead of leaving it as a raw
// CSS `vw` unit on the card's own inline width. Chrome has documented bugs
// around `position: sticky` elements not reliably recomputing viewport-unit
// widths while sibling elements receive continuous scroll-driven style
// writes (exactly what's happening here — every card's `dim` opacity is a
// framer-motion value updated on every scroll frame) — Safari doesn't show
// the same issue. A stable, JS-resolved pixel width sidesteps that class of
// bug entirely instead of depending on the browser to keep re-deriving `vw`
// correctly mid-scroll. Undefined until mounted so SSR/first paint still
// renders (falls back to the `vw` string below), then swaps to px once
// resolved and again on resize.
function useViewportWidthPx() {
  const [vw, setVw] = useState<number | undefined>(undefined)
  useEffect(() => {
    const update = () => setVw(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return vw
}

function hexToRgba(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// A darker shade of the same hue (not a different color) — used for the
// aurora's third blob so each card still reads as ONE dominant accent with
// a little depth, rather than a multi-color mix.
function darken(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.round(((n >> 16) & 255) * (1 - amount))
  const g = Math.round(((n >> 8) & 255) * (1 - amount))
  const b = Math.round((n & 255) * (1 - amount))
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`
}

type CardData = {
  n: string
  title: string
  text: string
  description: string
  capabilities: string[]
  videoBase: string
  closingLine?: string
  accent: string
}

const CARDS: CardData[] = [
  {
    n: '01',
    title: 'We design',
    text: '#FFFFFF',
    description:
      "Bold, custom, no templates. A website designed from scratch for your business and nobody else's.",
    capabilities: ['ART DIRECTION', 'UX & LAYOUT', 'BRANDING', 'MOBILE-FIRST'],
    videoBase: 'wevideo1',
    accent: '#7B8CDE', // cornflower
  },
  {
    n: '02',
    title: 'We build',
    text: '#FFFFFF',
    description: 'Fast, reliable, SEO-ready. Live in one week, built to perform from day one.',
    capabilities: ['NEXT-GEN STACK', 'LOCAL SEO', 'PERFORMANCE', 'HOSTING & DOMAIN'],
    videoBase: 'wevideo2',
    accent: '#D46FC8', // orchid pink
  },
  {
    n: '03',
    title: 'We create',
    text: '#FFFFFF',
    description:
      'Photography, video, copy and illustration. Content that makes your site stand out — included.',
    capabilities: ['PHOTO & VIDEO', 'COPYWRITING', 'ILLUSTRATION', 'SOCIAL ASSETS'],
    videoBase: 'wevideo3',
    accent: '#C7488F', // magenta-rose
  },
  {
    n: '04',
    title: 'We maintain',
    text: '#FFFFFF',
    description:
      "Hosting, security, updates and every change you need. Handled forever — that's the point.",
    capabilities: ['24/7 SUPPORT', 'UPDATES INCLUDED', 'SECURITY', 'ALWAYS IMPROVING'],
    videoBase: 'wevideo4',
    closingLine: 'BUILT. STAYING.',
    accent: '#5B4B9E', // violet-indigo
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
// own bold CSS keyframe drift (transform + opacity only — see globals.css)
// so their overlaps constantly recombine instead of moving in lockstep. All
// three share ONE dominant accent hue (the third uses a darker shade of the
// same color for depth, not a different color) so each card still reads as
// single-accent. A top-to-bottom black gradient keeps the top ~55% clean
// for text. Hover parallax (optional, cheap) is a single wrapper offset —
// the blobs' own CSS animation is untouched by it.
function AuroraLayer({
  accent,
  index,
  parallaxX,
  parallaxY,
}: {
  accent: string
  index: number
  parallaxX: MotionValue<number>
  parallaxY: MotionValue<number>
}) {
  const px = useTransform(parallaxX, v => v * 16)
  const py = useTransform(parallaxY, v => v * 12)
  const accentDark = darken(accent, 0.4)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div className="absolute inset-0" style={{ x: px, y: py }}>
        <div className="wwd-aurora-blob wwd-aurora-blob-a" style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, animationDelay: `${index * -2.2}s` }} />
        <div className="wwd-aurora-blob wwd-aurora-blob-b" style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, animationDelay: `${index * -2.2 + 3}s` }} />
        <div className="wwd-aurora-blob wwd-aurora-blob-c" style={{ background: `radial-gradient(circle, ${accentDark} 0%, transparent 65%)`, animationDelay: `${index * -2.2 + 1.5}s` }} />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, ${CARD_BG} 0%, ${CARD_BG} 55%, transparent 100%)` }}
      />
    </div>
  )
}

// Same treatment as every other video section on this site: borderless,
// large radius, left-edge fade so the video's own background tone
// dissolves into the card behind it, IntersectionObserver-driven play so
// only on-screen cards decode video.
function VideoPanel({
  videoRef,
  videoBase,
  title,
  reduceMotion,
}: {
  videoRef: React.Ref<HTMLVideoElement>
  videoBase: string
  title: string
  reduceMotion: boolean
}) {
  const poster = `${VIDEO_DIR}/${videoBase}_poster.jpg`
  const fadeMask = 'linear-gradient(to right, transparent 0%, black 12%)'

  return (
    <div
      className="relative w-full aspect-video rounded-2xl overflow-hidden"
      style={{ WebkitMaskImage: fadeMask, maskImage: fadeMask }}
    >
      {reduceMotion ? (
        <Image src={poster} alt={title} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
      ) : (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src={`${VIDEO_DIR}/${videoBase}_hq.webm`} type="video/webm" />
          <source src={`${VIDEO_DIR}/${videoBase}_hq.mp4`} type="video/mp4" />
        </video>
      )}
    </div>
  )
}

// Each card is wider than the last (centered via auto margins) so as later
// cards stack over earlier ones, the growing width overhangs the narrower
// card beneath on both edges — a layered 3D tier effect. Applied as an
// INLINE style computed straight from the index, not a Tailwind arbitrary-
// value class — Tailwind classes are resolved to CSS at build time from
// static strings it can find via source scanning, which makes them fragile
// for a value that's genuinely a function of `index` (any indirection
// between the literal class string and its use point risks the generated
// CSS not matching what's actually applied at runtime). An inline style is
// computed fresh on every render, directly from `index`, with nothing for
// a build step to get out of sync with.
function cardWidthStyle(index: number, viewportWidthPx?: number): React.CSSProperties {
  const pct = (74 + index * 4) / 100
  return {
    width: viewportWidthPx != null ? `${Math.min(Math.round(viewportWidthPx * pct), 1500)}px` : `${pct * 100}vw`,
    maxWidth: '1500px',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxSizing: 'border-box',
  }
}

function WhatWeDoCard({
  card,
  index,
  videoRef,
  dim,
  reduceMotion,
  rootRef,
}: {
  card: CardData
  index: number
  videoRef: React.Ref<HTMLVideoElement>
  dim: MotionValue<number> | null
  reduceMotion: boolean
  rootRef?: React.Ref<HTMLDivElement>
}) {
  const viewportWidthPx = useViewportWidthPx()
  const widthStyle = cardWidthStyle(index, viewportWidthPx)
  const stickyStyle = {
    ...widthStyle,
    top: `calc(var(--wwd-nav-h) + ${index} * var(--wwd-strip-h))`,
    // Fixed height, same for every card (not decreasing per index like
    // before). This also shortens each card's own contribution to the
    // section's total scroll length (the sticky containing-block dwell
    // math below doesn't need a separate wrapper div to achieve that — a
    // smaller fixed height already tightens it directly).
    height: 'min(70vh, 640px)',
  }

  const finePointer = useFinePointer()
  const parallax = useAuroraParallax(reduceMotion || !finePointer)

  const inner = (
    // Shadow wrapper — carries the outer accent glow and the floating
    // card's vertical inset (my-2: a sliver of the section's own black bg
    // shows above/below, so stacked strips read as separated floating
    // panels rather than edge-to-edge). Deliberately NOT overflow-hidden —
    // box-shadow needs to spread freely into that surrounding black margin
    // instead of being clipped at the card's own edge. Only the content
    // div below (rounded the same amount) clips.
    <div
      style={{ boxShadow: `0 0 60px ${hexToRgba(card.accent, 0.18)}`, willChange: 'transform' }}
      className="relative h-full my-2 rounded-3xl"
    >
      <div
        style={{ backgroundColor: CARD_BG }}
        className="relative flex flex-col h-full rounded-3xl overflow-hidden border border-white/[0.08]"
        onMouseMove={reduceMotion ? undefined : parallax.onMouseMove}
        onMouseLeave={reduceMotion ? undefined : parallax.onMouseLeave}
      >
      {/* Aurora renders in both branches — reduced motion freezes the CSS
          drift (see the prefers-reduced-motion rule in globals.css) rather
          than removing the glow outright. Hover parallax only wires in
          when motion is allowed. */}
      <div className="absolute inset-0 z-0">
        <AuroraLayer accent={card.accent} index={index} parallaxX={parallax.x} parallaxY={parallax.y} />
      </div>

      {/* Header strip — fixed height, stays visible when the card is
          collapsed under later cards. Pure black background (no aurora
          reaches this high) for clean text reading. Padding-top > padding-
          bottom (both inside items-center) so the title's centered position
          shifts down within the strip — more breathing room above it,
          without losing the title/index baseline alignment items-center
          already gave them. */}
      <div className="relative shrink-0 flex items-center justify-between px-8 pt-8 pb-2" style={{ height: 'var(--wwd-strip-h)' }}>
        <h2 className="font-display font-medium leading-none text-[44px] md:text-[84px]" style={{ color: card.text }}>
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
          until the card actually starts collapsing. Text stays on the
          left, video panel on the right (~40% width). */}
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
        {/* z-10 keeps the video panel visually above the aurora (z-0,
            positioned first) so the video's own content stays clean — the
            aurora still glows around/behind it underneath. */}
        <div className="relative z-10 md:col-start-8 md:col-span-5 self-start">
          <VideoPanel videoRef={videoRef} videoBase={card.videoBase} title={card.title} reduceMotion={reduceMotion} />
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
    </div>
  )

  if (reduceMotion) {
    return (
      <div ref={rootRef} className="min-h-[85vh]" style={widthStyle}>
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
  const viewportWidthPx = useViewportWidthPx()

  const card2Ref = useRef<HTMLDivElement>(null)
  const card3Ref = useRef<HTMLDivElement>(null)
  const card4Ref = useRef<HTMLDivElement>(null)

  const dim1 = useCoverDim(card2Ref)
  const dim2 = useCoverDim(card3Ref)
  const dim3 = useCoverDim(card4Ref)

  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)
  const video3Ref = useRef<HTMLVideoElement>(null)
  const video4Ref = useRef<HTMLVideoElement>(null)
  const videoRefs = [video1Ref, video2Ref, video3Ref, video4Ref]

  // One shared IntersectionObserver drives play/pause for all four videos —
  // play once a card is >=30% visible, pause otherwise. The stacking means
  // at most two cards are ever meaningfully on screen at once.
  useEffect(() => {
    if (reduceMotion) return
    const videos = videoRefs.map(r => r.current).filter((v): v is HTMLVideoElement => !!v)
    if (videos.length === 0) return

    videos.forEach(v => {
      v.setAttribute('muted', '')
      v.setAttribute('playsinline', '')
      v.setAttribute('webkit-playsinline', '')
      v.muted = true
    })

    const play = (v: HTMLVideoElement) => {
      if (!v.paused && !v.ended) return
      v.muted = true
      if (v.ended) v.currentTime = 0
      if (v.networkState === HTMLMediaElement.NETWORK_EMPTY) v.load()
      v.play().catch(() => {
        setTimeout(() => {
          if (v.paused || v.ended) {
            v.muted = true
            v.play().catch(() => {})
          }
        }, 300)
      })
    }

    const onEnded = (e: Event) => play(e.target as HTMLVideoElement)
    videos.forEach(v => v.addEventListener('ended', onEnded))

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const v = entry.target as HTMLVideoElement
          if (entry.isIntersecting) play(v)
          else v.pause()
        })
      },
      { threshold: 0.3 }
    )
    videos.forEach(v => observer.observe(v))

    return () => {
      observer.disconnect()
      videos.forEach(v => v.removeEventListener('ended', onEnded))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion])

  return (
    // pt-px: the first card's own my-2 top margin has nothing (no padding
    // or border) to stop it collapsing through this section onto Mission's
    // bottom edge otherwise — a classic CSS margin-collapse case that was
    // showing up as an 8px gap of the page's own (light) background between
    // the two dark sections. Any nonzero padding here breaks the collapse;
    // 1px is visually imperceptible. pb-40: room for card 4's outer glow
    // shadow (which spreads past its own box into this section's own bg)
    // plus breathing space before the next section.
    <section data-nav-dark className="wwd-strip-vars relative bg-[#0D0E12] pt-px pb-40">
      {/* No shared width wrapper here — each card now carries its own
          per-index width class (mx-auto) directly on its own sticky div, so
          widths can grow index-over-index while every card still centers on
          the same axis. Adding width/mx-auto to an *existing* element (the
          sticky div itself) rather than introducing a new wrapping box keeps
          the vertical stacking math untouched, exactly like the old shared
          wrapper's horizontal-only inset did. */}
      <WhatWeDoCard card={CARDS[0]} index={0} videoRef={video1Ref} dim={reduceMotion ? null : dim1} reduceMotion={reduceMotion} />
      <WhatWeDoCard card={CARDS[1]} index={1} videoRef={video2Ref} dim={reduceMotion ? null : dim2} reduceMotion={reduceMotion} rootRef={card2Ref} />
      <WhatWeDoCard card={CARDS[2]} index={2} videoRef={video3Ref} dim={reduceMotion ? null : dim3} reduceMotion={reduceMotion} rootRef={card3Ref} />
      <WhatWeDoCard card={CARDS[3]} index={3} videoRef={video4Ref} dim={null} reduceMotion={reduceMotion} rootRef={card4Ref} />
      {/* Card 4, as the last child, has its natural bottom coincide exactly
          with the section's own end — giving it zero dwell (verified: it
          releases and scrolls away the instant it arrives, with no buffer).
          This trailing sentinel, colored to match and matching card 4's
          width, gives it real hold time; any release that still happens
          within it is invisible since the color is identical. Not needed in
          the reduced-motion path, which doesn't use sticky at all. */}
      {!reduceMotion && (
        <div
          style={{ ...cardWidthStyle(3, viewportWidthPx), height: 'min(70vh, 640px)', backgroundColor: CARD_BG }}
          aria-hidden="true"
        />
      )}
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { TextGradient } from '@/components/ui/text-gradient'
import { useEarlyLoad } from '@/hooks/useEarlyLoad'
import { useCappedVideoPlayback } from '@/hooks/useCappedVideoPlayback'
import PosterVideo from '@/components/ui/poster-video'

const CARD_BG = '#16171C'
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

type CardData = {
  n: string
  title: string
  text: string
  description: string
  capabilities: string[]
  videoBase: string
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
    accent: '#5B4B9E', // violet-indigo
  },
]

// Per-card accent glow, GitHub-workflow-card style: at each of top-center
// and bottom-center, a small very-bright HOT CORE (tight ellipse, opacity
// maxed at 1) layered on top of a wider, still-strong CONE underneath it,
// so there's a hot bright center fading out into a broader bloom — not a
// single flat cone. A much fainter wide wash sits behind everything so the
// sides are never fully black. Layered hot-core-first, cone-second, wash-
// last since CSS paints earlier background-image layers over later ones.
function cardGradient(index: number): string {
  const accent = CARDS[index].accent
  const topHot = `radial-gradient(ellipse 22% 18% at 50% 0%, ${hexToRgba(accent, 1)} 0%, ${hexToRgba(accent, 0.85)} 40%, transparent 68%)`
  const topCone = `radial-gradient(ellipse 62% 46% at 50% 0%, ${hexToRgba(accent, 1)} 0%, ${hexToRgba(accent, 0.75)} 35%, transparent 72%)`
  const bottomHot = `radial-gradient(ellipse 22% 18% at 50% 100%, ${hexToRgba(accent, 1)} 0%, ${hexToRgba(accent, 0.85)} 40%, transparent 68%)`
  const bottomCone = `radial-gradient(ellipse 62% 46% at 50% 100%, ${hexToRgba(accent, 1)} 0%, ${hexToRgba(accent, 0.75)} 35%, transparent 72%)`
  const sideDiffuse = `radial-gradient(ellipse 140% 100% at 50% 50%, ${hexToRgba(accent, 0.1)} 0%, transparent 65%)`
  return `${topHot}, ${topCone}, ${bottomHot}, ${bottomCone}, ${sideDiffuse}`
}

// Blends `hex` toward white by `tint` (0 = pure hex, 1 = pure white), then
// applies `alpha` — used to give the gradient-border's bright top/bottom
// stops a hint of the card's accent color rather than plain white.
function mixToRgba(hex: string, alpha: number, tint: number): string {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const mr = Math.round(r + (255 - r) * tint)
  const mg = Math.round(g + (255 - g) * tint)
  const mb = Math.round(b + (255 - b) * tint)
  return `rgba(${mr}, ${mg}, ${mb}, ${alpha})`
}

// The card's rim: a thick gradient (not a flat color) — bright top &
// bottom, faint at the sides, so it reads as catching light from the glow
// above rather than a uniform frame. Applied via the padding technique (see
// borderWrapper below): this string is the wrapper's own background, and
// its padding is what reveals it as a "border" around the solid inner
// surface. Bright-stop alpha raised well past half-strength so the rim
// visibly lights up where the hot glow core sits behind it.
function borderGradient(index: number): string {
  const accent = CARDS[index].accent
  const bright = mixToRgba(accent, 0.88, 0.75)
  const dim = 'rgba(255,255,255,0.10)'
  return `linear-gradient(180deg, ${bright} 0%, ${dim} 35%, ${dim} 65%, ${bright} 100%)`
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
  videoRef: React.RefObject<HTMLVideoElement | null>
  videoBase: string
  title: string
  reduceMotion: boolean
}) {
  const poster = `${VIDEO_DIR}/${videoBase}_poster.jpg`
  const fadeMask = 'linear-gradient(to right, transparent 0%, black 12%)'
  useEarlyLoad(videoRef)
  // PosterVideo's own poster <img> has no near-view gate (it's meant to be
  // always-visible immediately) — src is set directly in SSR'd markup, so
  // a mobile browser's native HTML parser fetches it before any JS
  // (including WhatWeDo's own isMobile check) ever runs. Gating its mount
  // on this local `mounted` flag — which, like isMobile, starts false on
  // both server and first client render — means it isn't in that initial
  // markup at all for ANY device; React 18 batches this effect with
  // WhatWeDo's own isMobile-resolving effect from the same commit, so on
  // mobile the parent's `if (isMobile) return null` wins before this ever
  // gets a chance to paint with a real poster URL, while desktop only
  // sees a few-ms-later attach, not a visible pop.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div
      className="relative w-full aspect-video rounded-2xl overflow-hidden"
      style={{ WebkitMaskImage: fadeMask, maskImage: fadeMask }}
    >
      {!mounted ? null : reduceMotion ? (
        <Image src={poster} alt={title} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
      ) : (
        <PosterVideo
          videoRef={videoRef}
          poster={poster}
          posterAlt={title}
          className="absolute inset-0 w-full h-full object-cover"
        >
          {/* ffmpeg -i {videoBase}_hq.mp4 -vf "scale=480:-2" -c:v libx264
              -profile:v main -crf 30 -preset slow -pix_fmt yuv420p
              -movflags +faststart -an {videoBase}_mobile.mp4 — media-query
              <source>, so mobile (iOS included — no webm support there)
              never considers the webm/desktop-mp4 pair below; desktop is
              untouched since the query never matches there. */}
          <source media="(max-width: 767px)" src={`${VIDEO_DIR}/${videoBase}_mobile.mp4`} type="video/mp4" />
          <source src={`${VIDEO_DIR}/${videoBase}_hq.webm`} type="video/webm" />
          <source src={`${VIDEO_DIR}/${videoBase}_hq.mp4`} type="video/mp4" />
        </PosterVideo>
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
  videoRef: React.RefObject<HTMLVideoElement | null>
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

  const gradient = cardGradient(index)

  const inner = (
    // Shadow wrapper — carries the outer accent glow halo and the floating
    // card's vertical inset (my-2: a sliver of the section's own black bg
    // shows above/below, so stacked strips read as separated floating
    // panels rather than edge-to-edge). Deliberately NOT overflow-hidden —
    // box-shadow (and the blurred glow-bloom layer below) needs to spread
    // freely into that surrounding black margin instead of being clipped at
    // the card's own edge. Only the content div below (rounded the same
    // amount) clips. `group` scopes the glow bloom's hover intensification
    // below — the lift + shadow stay on this wrapper since box-shadow
    // doesn't survive the inner div's clip.
    <div
      style={{ boxShadow: `0 0 60px ${hexToRgba(card.accent, 0.18)}`, willChange: 'transform' }}
      className={`group relative h-full my-2 rounded-3xl ${reduceMotion ? '' : 'transition-transform duration-500 hover:-translate-y-1'}`}
    >
      {/* Glow halo — GitHub workflow-card style: a soft accent bloom that's
          ALWAYS partially visible outside the card's own edges (not just on
          hover), intensifying further on hover. Blurred heavily and living
          OUTSIDE the inner div's overflow-hidden clip so it bleeds into the
          floating margin around the card. Drifts (same keyframe as the CTA
          button's glow, staggered per-card so all four don't move in
          lockstep, sped up to a 5s loop) so it reads as a living aurora,
          not a static bloom; opacity/scale still transition on hover. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 rounded-3xl blur-[40px] pointer-events-none ${reduceMotion ? 'opacity-55' : 'opacity-55 group-hover:opacity-95 transition-[opacity] duration-500 motion-safe:animate-[cta-glow-drift_5s_ease-in-out_infinite]'}`}
        style={{
          background: gradient,
          willChange: reduceMotion ? undefined : 'opacity, transform',
          animationDelay: reduceMotion ? undefined : `${index * -1.3}s`,
        }}
      />

      {/* Gradient-border wrapper: the border is a real gradient (bright top
          & bottom, faint sides — not a flat color that can't vary), built
          with the padding technique rather than a CSS `border` — p-2 (8px)
          IS the border thickness (chunky, GitHub-style, up from the earlier
          4px), and this div's own `background` is the gradient itself. The
          solid CARD_BG surface below sits inside that padding, so an 8px
          ring of this gradient shows around it. */}
      <div className="relative h-full rounded-3xl p-2" style={{ background: borderGradient(index) }}>
        {/* Inside: a plain flat dark-grey surface (CARD_BG) — no aurora, no
            interior gradient wash, no video glow. Just the gradient rim
            above, the flat surface, and the header/body/video content on
            top of it. Inner radius is the outer rounded-3xl (1.5rem) minus
            the 8px rim so the two stay concentric. */}
        <div
          style={{ backgroundColor: CARD_BG, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)' }}
          className="relative flex flex-col h-full rounded-[calc(1.5rem-8px)] overflow-hidden"
        >
      {/* Header strip — fixed height, stays visible when the card is
          collapsed under later cards. Padding-top > padding-bottom (both
          inside items-center) so the title's centered position shifts down
          within the strip — more breathing room above it, without losing
          the title/index baseline alignment items-center already gave
          them. */}
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

      {dim && (
        <motion.div
          style={{ opacity: dim }}
          className="absolute inset-0 z-20 bg-ink pointer-events-none"
          aria-hidden="true"
        />
      )}
        </div>
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
  const isMobile = useIsMobile()
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

  // Play once a card is >=30% visible, pause otherwise — the stacking
  // means at most two cards are ever meaningfully on screen at once. Also
  // caps concurrent plays on Safari specifically (see the hook) — WebKit's
  // decoder ceiling is what caused the one-by-one staggered start there.
  useCappedVideoPlayback(videoRefs, { reduceMotion })

  // Mobile: disabled entirely — no cards, no videos/posters loaded. All
  // hooks above still run unconditionally (Rules of Hooks); with nothing
  // rendered, their refs stay null and their effects become no-ops.
  if (isMobile) return null

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
      {/* Moved here from the old AgencyReachSection spacer beat — same
          copy/style, now heading this section instead of standing alone. */}
      <div className="max-w-3xl mx-auto text-center px-6 pt-24 pb-16 md:pt-32 md:pb-20">
        <h2 className="font-display leading-tight text-[clamp(1.5rem,2.6vw,2.75rem)]" style={{ color: '#F2F0EB' }}>
          All the resources of an Agency
          <br />
          <motion.span
            animate={reduceMotion ? {} : { opacity: [1, 0.55, 1] }}
            transition={reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <TextGradient as="span">at your reach.</TextGradient>
          </motion.span>{' '}
          On demand
        </h2>
      </div>
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

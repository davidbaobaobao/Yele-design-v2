'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const AMBER_DARK = '#C97F3D'
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

type CardData = {
  n: string
  title: string
  bg: string
  text: string
  description: string
  capabilities: string[]
  videoBase: string
  closingLine?: string
}

const CARDS: CardData[] = [
  {
    n: '01',
    title: 'We design',
    bg: '#1A1815', // warm charcoal — tinted with the dimmed wevideo1 footage
    text: '#F3EFE9',
    description:
      "Bold, custom, no templates. A website designed from scratch for your business and nobody else's.",
    capabilities: ['ART DIRECTION', 'UX & LAYOUT', 'BRANDING', 'MOBILE-FIRST'],
    videoBase: 'wevideo1',
  },
  {
    n: '02',
    title: 'We build',
    bg: '#14171C', // blue charcoal — tinted with the dimmed wevideo2 footage
    text: '#EAEEF3',
    description: 'Fast, reliable, SEO-ready. Live in one week, built to perform from day one.',
    capabilities: ['NEXT-GEN STACK', 'LOCAL SEO', 'PERFORMANCE', 'HOSTING & DOMAIN'],
    videoBase: 'wevideo2',
  },
  {
    n: '03',
    title: 'We create',
    bg: '#1A1710', // ochre charcoal — tinted with the dimmed wevideo3 footage
    text: '#F3EDDF',
    description:
      'Photography, video, copy and illustration. Content that makes your site stand out — included.',
    capabilities: ['PHOTO & VIDEO', 'COPYWRITING', 'ILLUSTRATION', 'SOCIAL ASSETS'],
    videoBase: 'wevideo3',
  },
  {
    n: '04',
    title: 'We maintain',
    bg: '#161418', // violet charcoal — tinted with the dimmed wevideo4 footage
    text: '#EFECF2',
    description:
      "Hosting, security, updates and every change you need. Handled forever — that's the point.",
    capabilities: ['24/7 SUPPORT', 'UPDATES INCLUDED', 'SECURITY', 'ALWAYS IMPROVING'],
    videoBase: 'wevideo4',
    closingLine: 'BUILT. STAYING.',
  },
]

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

  // Borderless, larger radius, and a left-edge fade so the video's own
  // background tone dissolves into the card bg behind it instead of
  // showing a hard rectangle edge — frameless look.
  const fadeMask = 'linear-gradient(to right, transparent 0%, black 12%)'

  return (
    <div
      className="relative w-full aspect-video rounded-3xl overflow-hidden"
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
          preload="metadata"
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

  const inner = (
    <div
      style={{ backgroundColor: card.bg, willChange: 'transform' }}
      className="relative flex flex-col h-full rounded-t-[2rem] border-t border-hairlineDark overflow-hidden"
    >
      {/* Header strip — fixed height, stays visible when the card is
          collapsed under later cards. */}
      <div className="shrink-0 flex items-center justify-between px-8" style={{ height: 'var(--wwd-strip-h)' }}>
        <h2 className="font-display font-bold text-[28px] md:text-[44px]" style={{ color: card.text }}>
          {card.title}
        </h2>
        <span className="font-mono text-sm" style={{ color: card.text, opacity: 0.7 }}>
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-8 pb-6 pt-2 min-h-0">
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
        <div className="md:col-start-8 md:col-span-5 self-start">
          <VideoPanel videoRef={videoRef} videoBase={card.videoBase} title={card.title} reduceMotion={reduceMotion} />
        </div>
      </div>

      {card.closingLine && (
        <p className="absolute bottom-6 right-8 font-mono text-sm md:text-base" style={{ color: AMBER_DARK }}>
          {card.closingLine}
        </p>
      )}

      {dim && (
        <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-ink pointer-events-none" aria-hidden="true" />
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
    <section data-nav-dark className="wwd-strip-vars relative bg-[#0E0E10]">
      <WhatWeDoCard card={CARDS[0]} index={0} videoRef={video1Ref} dim={reduceMotion ? null : dim1} reduceMotion={reduceMotion} />
      <WhatWeDoCard card={CARDS[1]} index={1} videoRef={video2Ref} dim={reduceMotion ? null : dim2} reduceMotion={reduceMotion} rootRef={card2Ref} />
      <WhatWeDoCard card={CARDS[2]} index={2} videoRef={video3Ref} dim={reduceMotion ? null : dim3} reduceMotion={reduceMotion} rootRef={card3Ref} />
      <WhatWeDoCard card={CARDS[3]} index={3} videoRef={video4Ref} dim={null} reduceMotion={reduceMotion} rootRef={card4Ref} />
      {/* Card 4, as the last child, has its natural bottom coincide exactly
          with the section's own end — giving it zero dwell (verified: it
          releases and scrolls away the instant it arrives, with no buffer).
          This trailing sentinel, colored to match, gives it real hold time;
          any release that still happens within it is invisible since the
          color is identical. Not needed in the reduced-motion path, which
          doesn't use sticky at all. */}
      {!reduceMotion && (
        <div style={{ height: 'min(48vh, 440px)', backgroundColor: CARDS[3].bg }} aria-hidden="true" />
      )}
    </section>
  )
}

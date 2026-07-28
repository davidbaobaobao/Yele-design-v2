'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const PALE_GOLD = '#F0E6C8'
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
  // Multi-stop iridescent gradient, tuned per card to lean a different hue
  // family so the four sheens read as distinct from one another even
  // though they share the same mix-blend-mode/opacity treatment.
  sheen: string
}

const CARDS: CardData[] = [
  {
    n: '01',
    title: 'We design',
    bg: '#7B8CDE', // soft cornflower blue
    text: '#FFFFFF',
    description:
      "Bold, custom, no templates. A website designed from scratch for your business and nobody else's.",
    capabilities: ['ART DIRECTION', 'UX & LAYOUT', 'BRANDING', 'MOBILE-FIRST'],
    videoBase: 'wevideo1',
    sheen: 'linear-gradient(120deg, #7CFFE3 0%, #33C7B0 22%, #A8FFDB 45%, #4FD8FF 68%, #8CFFF0 100%)',
  },
  {
    n: '02',
    title: 'We build',
    bg: '#D46FC8', // bright orchid pink
    text: '#FFFFFF',
    description: 'Fast, reliable, SEO-ready. Live in one week, built to perform from day one.',
    capabilities: ['NEXT-GEN STACK', 'LOCAL SEO', 'PERFORMANCE', 'HOSTING & DOMAIN'],
    videoBase: 'wevideo2',
    sheen: 'linear-gradient(120deg, #FFE38C 0%, #C9E86B 25%, #FFF3B0 50%, #8FE0A0 75%, #FFD86B 100%)',
  },
  {
    n: '03',
    title: 'We create',
    bg: '#C7488F', // magenta-rose
    text: '#FFFFFF',
    description:
      'Photography, video, copy and illustration. Content that makes your site stand out — included.',
    capabilities: ['PHOTO & VIDEO', 'COPYWRITING', 'ILLUSTRATION', 'SOCIAL ASSETS'],
    videoBase: 'wevideo3',
    sheen: 'linear-gradient(120deg, #8AB4FF 0%, #B48CFF 25%, #6EE7FF 50%, #C39CFF 75%, #7CA8FF 100%)',
  },
  {
    n: '04',
    title: 'We maintain',
    bg: '#5B4B9E', // deep violet-indigo
    text: '#FFFFFF',
    description:
      "Hosting, security, updates and every change you need. Handled forever — that's the point.",
    capabilities: ['24/7 SUPPORT', 'UPDATES INCLUDED', 'SECURITY', 'ALWAYS IMPROVING'],
    videoBase: 'wevideo4',
    closingLine: 'BUILT. STAYING.',
    sheen: 'linear-gradient(120deg, #FFB3D9 0%, #FFD199 25%, #FF8CC6 50%, #FFE3A8 75%, #FF9ED4 100%)',
  },
]

// True only for devices that can actually hover with a precise pointer —
// touch gets the static sheen (no parallax to chase, nothing to throttle).
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

// Raw pointer position (-0.5..0.5 on each axis, card-relative) updated at
// most once per animation frame, then run through a spring so the sheen
// glides toward the pointer while moving and eases back to center on
// mouse leave — the "throttle with rAF" and "spring back on leave"
// requirements share this one mechanism.
function useSheenParallax(disabled: boolean) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 120, damping: 20, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.6 })
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

// Two gradient layers sharing one mask of hover-driven motion — the deep
// layer moves roughly 2x as far as the shallow one for a sense of depth.
// Both mix-blend:screen over the card so the flat brand color underneath
// still reads through the sheen rather than being replaced by it.
function SheenOverlay({ gradient, x, y }: { gradient: string; x: MotionValue<number>; y: MotionValue<number> }) {
  const shallowPosX = useTransform(x, v => `${50 + v * 24}%`)
  const shallowPosY = useTransform(y, v => `${50 + v * 24}%`)
  const shallowX = useTransform(x, v => v * 8)
  const shallowY = useTransform(y, v => v * 8)

  const deepPosX = useTransform(x, v => `${50 - v * 46}%`)
  const deepPosY = useTransform(y, v => `${50 - v * 46}%`)
  const deepX = useTransform(x, v => v * -18)
  const deepY = useTransform(y, v => v * -18)

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: gradient,
          backgroundSize: '220% 220%',
          backgroundPositionX: shallowPosX,
          backgroundPositionY: shallowPosY,
          x: shallowX,
          y: shallowY,
          mixBlendMode: 'screen',
          opacity: 0.2,
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: gradient,
          backgroundSize: '320% 320%',
          backgroundPositionX: deepPosX,
          backgroundPositionY: deepPosY,
          x: deepX,
          y: deepY,
          mixBlendMode: 'screen',
          opacity: 0.14,
        }}
      />
    </>
  )
}

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

  const finePointer = useFinePointer()
  const sheenParallax = useSheenParallax(reduceMotion || !finePointer)

  const inner = (
    <div
      style={{ backgroundColor: card.bg, willChange: 'transform' }}
      className="relative flex flex-col h-full rounded-t-[2rem] overflow-hidden"
      onMouseMove={reduceMotion ? undefined : sheenParallax.onMouseMove}
      onMouseLeave={reduceMotion ? undefined : sheenParallax.onMouseLeave}
    >
      {!reduceMotion && (
        <div className="absolute inset-0 z-0">
          <SheenOverlay gradient={card.sheen} x={sheenParallax.x} y={sheenParallax.y} />
        </div>
      )}

      {/* Header strip — fixed height, stays visible when the card is
          collapsed under later cards. */}
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
          <div className="font-mono text-sm uppercase space-y-1.5" style={{ color: card.text, opacity: 0.75 }}>
            {card.capabilities.map(c => (
              <div key={c}>{c}</div>
            ))}
          </div>
        </div>
        {/* z-10 keeps the video panel visually above the sheen (which is
            z-0, positioned first) so the video's own content stays clean —
            the sheen still spans the full card underneath it. */}
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

'use client'

import { useEffect, useRef, useState, type Ref, type RefObject } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const AMBER_DARK = '#C97F3D'
const PLACEHOLDER = '#DDDAD3'

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
  title: [string, string]
  bg: string
  description: string
  capabilities: [string, string, string, string]
  image: string
  imageAlt: string
  closingLine?: string
}

const CARDS: CardData[] = [
  {
    n: '01',
    title: ['WE', 'DESIGN'],
    bg: '#F6F3EC',
    description:
      "Bold, custom, no templates. A website designed from scratch for your business and nobody else's.",
    capabilities: ['ART DIRECTION', 'UX & LAYOUT', 'BRANDING', 'MOBILE-FIRST'],
    image: '/media/pillars/01_swarm.webp',
    imageAlt: 'Loose particle swarm',
  },
  {
    n: '02',
    title: ['WE', 'BUILD'],
    bg: '#E6EAE1',
    description: 'Fast, reliable, SEO-ready. Live in one week, built to perform from day one.',
    capabilities: ['NEXT-GEN STACK', 'LOCAL SEO', 'PERFORMANCE', 'HOSTING & DOMAIN'],
    image: '/media/pillars/02_assembly.webp',
    imageAlt: 'Particles aligning into blocks',
  },
  {
    n: '03',
    title: ['WE', 'CREATE'],
    bg: '#E2E8EE',
    description:
      'Photography, video, copy and illustration. Content that makes your site stand out — included.',
    capabilities: ['PHOTO & VIDEO', 'COPYWRITING', 'ILLUSTRATION', 'SOCIAL ASSETS'],
    image: '/media/pillars/03_structure.webp',
    imageAlt: 'Half-formed block structure',
  },
  {
    n: '04',
    title: ['WE', 'MAINTAIN'],
    bg: '#F0E7DA',
    description:
      "Hosting, security, updates and every change you need. Handled forever — that's the point.",
    capabilities: ['24/7 SUPPORT', 'UPDATES INCLUDED', 'SECURITY', 'ALWAYS IMPROVING'],
    image: '/media/pillars/04_monolith.webp',
    imageAlt: 'Finished glowing block monolith',
    closingLine: 'BUILT. STAYING.',
  },
]

function PillarImage({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return <div className="w-full h-full" style={{ backgroundColor: PLACEHOLDER }} aria-hidden="true" />
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-cover"
      onError={() => setErrored(true)}
    />
  )
}

function WhatWeDoCard({
  card,
  cardRef,
  nextRef,
  isMobile,
  reduceMotion,
}: {
  card: CardData
  cardRef: Ref<HTMLDivElement>
  nextRef: RefObject<HTMLElement | null>
  isMobile: boolean
  reduceMotion: boolean
}) {
  const { scrollYProgress } = useScroll({
    target: nextRef,
    offset: ['start end', 'start start'],
  })

  const targetScale = isMobile ? 0.97 : 0.94
  const scale = useTransform(scrollYProgress, v => linearMap(0, 1, 1, targetScale)(v))
  const translateY = useTransform(scrollYProgress, v => `${linearMap(0, 1, 0, -3)(v)}vh`)
  const dim = useTransform(scrollYProgress, v => linearMap(0, 1, 0, 0.12)(v))

  const content = (
    <div className="relative h-full min-h-screen px-6 md:px-12 py-14 md:py-16 flex flex-col justify-between">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">
          {card.n} — WHAT WE DO
        </p>
        <h2 className="font-display font-black uppercase text-ink leading-[0.9] tracking-tight text-[clamp(2.5rem,13vw,5rem)] md:text-[clamp(4rem,9vw,11rem)]">
          <span className="md:hidden">
            {card.title[0]}
            <br />
            {card.title[1]}
          </span>
          <span className="hidden md:inline whitespace-nowrap">
            {card.title[0]} {card.title[1]}
          </span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-end mt-10">
        <div>
          <p className="font-body text-ink max-w-md text-base md:text-lg leading-relaxed mb-6">
            {card.description}
          </p>
          <div className="font-mono text-xs uppercase tracking-widest text-muted space-y-1.5">
            {card.capabilities.map(c => (
              <div key={c}>{c}</div>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-3xl border border-hairline overflow-hidden">
          <PillarImage src={card.image} alt={card.imageAlt} />
        </div>
      </div>

      {card.closingLine && (
        <p
          className="font-mono text-sm md:text-base mt-10 text-right"
          style={{ color: AMBER_DARK }}
        >
          {card.closingLine}
        </p>
      )}
    </div>
  )

  if (reduceMotion) {
    return (
      <div
        ref={cardRef}
        className="min-h-screen rounded-t-[2.5rem] border-t border-hairline"
        style={{ backgroundColor: card.bg }}
      >
        {content}
      </div>
    )
  }

  // The sticky positioning lives on a plain, untransformed outer element —
  // applying the scale/translate transform directly to a position:sticky
  // element corrupts its containing-block math (verified: it un-sticks and
  // scrolls away early instead of staying pinned). The transform, rounded
  // clipping and dim overlay all live on an inner wrapper instead.
  return (
    <div ref={cardRef} className="sticky top-0 min-h-screen">
      <motion.div
        style={{
          scale,
          y: translateY,
          transformOrigin: 'center top',
          willChange: 'transform',
          backgroundColor: card.bg,
        }}
        className="relative min-h-screen rounded-t-[2.5rem] border-t border-hairline overflow-hidden"
      >
        {content}
        <motion.div
          style={{ opacity: dim }}
          className="absolute inset-0 bg-ink pointer-events-none"
          aria-hidden="true"
        />
      </motion.div>
    </div>
  )
}

export default function WhatWeDo() {
  const reduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  const card1Ref = useRef<HTMLDivElement>(null)
  const card2Ref = useRef<HTMLDivElement>(null)
  const card3Ref = useRef<HTMLDivElement>(null)
  const card4Ref = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const cardRefs = [card1Ref, card2Ref, card3Ref, card4Ref]
  // Card i's contraction is driven by the element right after it — cards
  // 1-3 target the next card, card 4 targets this trailing sentinel so its
  // contraction is driven by whatever section follows WhatWeDo on the page,
  // without WhatWeDo needing to know what that section is.
  const nextRefs: RefObject<HTMLElement | null>[] = [card2Ref, card3Ref, card4Ref, sentinelRef]

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <section className="relative bg-[#0A0A0A]">
      {CARDS.map((card, i) => (
        <WhatWeDoCard
          key={card.n}
          card={card}
          cardRef={cardRefs[i]}
          nextRef={nextRefs[i]}
          isMobile={isMobile}
          reduceMotion={!!reduceMotion}
        />
      ))}
      {/* Trailing buffer the same color as card 4: a sticky element whose
          height equals the viewport has a zero-duration stuck window (it
          releases the instant it arrives), which cards 1-3 mask because the
          next card's normal-flow entry covers the release — card 4 has
          nothing behind it to do that, so this gives it the same one-
          viewport dwell/contraction room instead of exposing the section's
          background for a frame. */}
      <div ref={sentinelRef} className="h-screen" style={{ backgroundColor: CARDS[3].bg }} aria-hidden="true" />
    </section>
  )
}

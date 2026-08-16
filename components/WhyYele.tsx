'use client'

import { useRef } from 'react'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useCappedVideoPlayback } from '@/hooks/useCappedVideoPlayback'
import { TextGradient } from '@/components/ui/text-gradient'
import FeatureCard from './FeatureCard'

const VIDEO_DIR = '/media/whyyele3'

type CardData = {
  title: string
  description: string
  videoBase: string
}

const DEFAULT_CARDS: CardData[] = [
  {
    title: 'Custom design',
    description: 'Built from scratch for your business. No templates, no lookalikes.',
    videoBase: 'whyyele1',
  },
  {
    title: 'Yours to control',
    description: 'Edit prices, photos and content anytime from your dashboard.',
    videoBase: 'whyyele3',
  },
  {
    title: 'One flat price',
    description: 'Hosting, domain, changes and support — all included in one monthly rate.',
    videoBase: 'whyyele6',
  },
  {
    title: 'Cancel anytime',
    description: 'No lock-in. You stay because it works.',
    videoBase: 'whyyele4',
  },
  {
    title: 'Live in days',
    description: 'Your site ready in a week, not months. Updated in seconds.',
    videoBase: 'whyyele2',
  },
  {
    title: 'Always maintained',
    description: 'Hosting, security and updates handled around the clock. Your site never goes down, and you never lift a finger.',
    videoBase: 'whyyele5',
  },
]

// /agency variant — title/description order unchanged; videoBase per slot
// reassigned to the [1,3,2,5,6,4] order requested (independent of
// DEFAULT_CARDS' own position→video mapping above).
const AGENCY_CARDS: CardData[] = [
  {
    title: 'Custom design, never a template',
    description: "Designed from scratch for your business. Nothing you'll see on anyone else's site.",
    videoBase: 'whyyele1',
  },
  {
    title: 'See it before you pay',
    description: 'We design your website first. Your first payment lands the day it goes live.',
    videoBase: 'whyyele3',
  },
  {
    title: 'Content that looks the part',
    description: 'Realistic photos, video and animation created for your site — the media of a high-budget website.',
    videoBase: 'whyyele2',
  },
  {
    title: 'Live in a week',
    description: "First design in about seven days. Then we refine it with you until it's right.",
    videoBase: 'whyyele5',
  },
  {
    title: 'Everything included',
    description: 'Hosting, domain, updates and support in one flat monthly price. No extras, no surprises.',
    videoBase: 'whyyele6',
  },
  {
    title: 'No contract, cancel anytime',
    description: "Month to month. You stay because it works, not because you're stuck.",
    videoBase: 'whyyele4',
  },
]

export default function WhyYele({ variant = 'default' }: { variant?: 'default' | 'agency' } = {}) {
  const CARDS = variant === 'agency' ? AGENCY_CARDS : DEFAULT_CARDS
  const reduceMotion = !!useHydratedReducedMotion()

  const videoRefs = [
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
  ]

  // Play once a card is >=30% visible, pause otherwise, so we never force
  // all six to decode/play at once. Independent of the entrance animation.
  // A 3-column grid means a whole row (or two) can cross that threshold
  // together — on Safari specifically, this hook also caps how many can
  // be simultaneously playing (WebKit's decoder ceiling is what caused the
  // one-by-one staggered start there); Chrome/Firefox never hit that cap.
  useCappedVideoPlayback(videoRefs, { reduceMotion })

  const heading = (
    <h2 className="font-display leading-tight max-w-4xl text-[clamp(1.5rem,2.6vw,2.75rem)] mb-12">
      <span style={{ color: '#F2F0EB' }}>
        Building a website used to be a headache — slow, big upfront bills, endless
        back-and-forth.{' '}
      </span>
      <TextGradient as="span">Not anymore.</TextGradient>
    </h2>
  )

  return (
    <section data-nav-dark className="relative bg-[#0D0E12] pt-12 md:pt-16 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {heading}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {CARDS.map((card, i) => (
            <FeatureCard
              key={card.videoBase}
              card={{
                title: card.title,
                description: card.description,
                poster: `${VIDEO_DIR}/${card.videoBase}_poster.jpg`,
                webmSrc: `${VIDEO_DIR}/${card.videoBase}.webm`,
                mp4Src: `${VIDEO_DIR}/${card.videoBase}.mp4`,
                mobileSrc: `${VIDEO_DIR}/${card.videoBase}_mobile.mp4`,
              }}
              index={i}
              videoRef={videoRefs[i]}
              reduceMotion={reduceMotion}
              panelBg="bg-[#16171C]"
              titleColor="text-bone"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

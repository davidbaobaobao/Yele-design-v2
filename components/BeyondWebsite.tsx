'use client'

import { useRef } from 'react'
import { motion, type Transition } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useCappedVideoPlayback } from '@/hooks/useCappedVideoPlayback'
import { TextGradient } from '@/components/ui/text-gradient'
import { useDealFade } from '@/components/DealFadeContext'
import FeatureCard from './FeatureCard'

const MEDIA_DIR = '/media/beyond'

// Shares DealFadeContext with LatestFeaturedWork directly below it (which
// owns the flip's actual trigger) and StatsBold two sections further down,
// so this section flips white->black at the EXACT same instant with the
// exact same transition — they read as one continuous surface turning
// dark, not independently-timed fades. The video panels themselves
// (bg-[#EEEDE9]) stay fixed regardless, same as every other flip-capable
// section on this site — they're media, not text/background.
const DARK_BG = '#0D0E12'
const LIGHT_BG = '#FFFFFF'
const DARK_TEXT = '#FFFFFF'
const LIGHT_TEXT = '#16161A'
const DARK_SECONDARY = 'rgba(242, 240, 235, 0.7)'
const LIGHT_SECONDARY = 'rgba(22, 22, 26, 0.6)'
const DARK_HAIRLINE = 'rgba(255, 255, 255, 0.12)'
const LIGHT_HAIRLINE = 'rgba(0, 0, 0, 0.1)'
const FLIP_TRANSITION: Transition = { duration: 0.5, ease: 'easeInOut' }

type CardData = {
  title: string
  description: string
  videoBase: string
}

const CARDS: CardData[] = [
  {
    title: 'SEO',
    description: 'Rank higher on Google and get found by more local customers.',
    videoBase: 'SEO',
  },
  {
    title: 'Google Ads',
    description: 'Managed campaigns that bring ready-to-buy visitors.',
    videoBase: 'ADS',
  },
  {
    title: 'Marketing campaigns',
    description: 'Ongoing content and promotions, done for you.',
    videoBase: 'Marketing',
  },
  {
    title: 'AI phone answering',
    description: 'An AI receptionist that answers calls 24/7.',
    videoBase: 'AIcall',
  },
  {
    title: 'Automations',
    description: 'Follow-ups, bookings and reminders on autopilot.',
    videoBase: 'automate',
  },
  {
    title: 'AI agents & chat',
    description: 'A smart assistant that answers visitors instantly.',
    videoBase: 'AIchat',
  },
]

export default function BeyondWebsite() {
  const reduceMotion = !!useHydratedReducedMotion()
  const { pastThreshold } = useDealFade()

  const videoRefs = [
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
  ]

  // Play once a card is >=30% visible, pause otherwise, so we never force
  // all six to decode/play at once. On Safari specifically, this hook also
  // caps how many can be simultaneously playing (WebKit's decoder ceiling
  // is what caused the one-by-one staggered start there); Chrome/Firefox
  // never hit that cap.
  useCappedVideoPlayback(videoRefs, { reduceMotion })

  if (reduceMotion) {
    return (
      <section className="relative bg-white py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <span className="block font-mono text-sm text-muted mb-4">BEYOND THE WEBSITE</span>
          <h2 className="font-display text-ink text-[clamp(1.75rem,2.5vw,2.5rem)] leading-tight">
            Everything that makes your website work <TextGradient as="span">harder</TextGradient>.
          </h2>
          <div className="border-t border-hairline mt-8" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-16">
            {CARDS.map((card, i) => (
              <FeatureCard
                key={card.videoBase}
                card={{
                  title: card.title,
                  description: card.description,
                  poster: `${MEDIA_DIR}/${card.videoBase}_poster.jpg`,
                  webmSrc: `${MEDIA_DIR}/${card.videoBase}_hq.webm`,
                  mp4Src: `${MEDIA_DIR}/${card.videoBase}_hq.mp4`,
                  mobileSrc: `${MEDIA_DIR}/${card.videoBase}_mobile.mp4`,
                }}
                index={i}
                videoRef={videoRefs[i]}
                reduceMotion={reduceMotion}
                panelBg="bg-[#EEEDE9]"
                titleColor="text-ink"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const secondaryColor = pastThreshold ? DARK_SECONDARY : LIGHT_SECONDARY
  const primaryColor = pastThreshold ? DARK_TEXT : LIGHT_TEXT
  const hairlineColor = pastThreshold ? DARK_HAIRLINE : LIGHT_HAIRLINE

  return (
    <section data-nav-fade className="relative py-28 px-6">
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ backgroundColor: pastThreshold ? DARK_BG : LIGHT_BG }}
        transition={FLIP_TRANSITION}
        aria-hidden="true"
      />
      <div className="max-w-6xl mx-auto">
        <motion.span
          className="block font-mono text-sm mb-4"
          animate={{ color: secondaryColor }}
          transition={FLIP_TRANSITION}
        >
          BEYOND THE WEBSITE
        </motion.span>
        <motion.h2
          className="font-display text-[clamp(1.75rem,2.5vw,2.5rem)] leading-tight"
          animate={{ color: primaryColor }}
          transition={FLIP_TRANSITION}
        >
          Everything that makes your website work <TextGradient as="span">harder</TextGradient>.
        </motion.h2>
        <motion.div className="border-t mt-8" animate={{ borderColor: hairlineColor }} transition={FLIP_TRANSITION} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-16">
          {CARDS.map((card, i) => (
            <FeatureCard
              key={card.videoBase}
              card={{
                title: card.title,
                description: card.description,
                poster: `${MEDIA_DIR}/${card.videoBase}_poster.jpg`,
                webmSrc: `${MEDIA_DIR}/${card.videoBase}_hq.webm`,
                mp4Src: `${MEDIA_DIR}/${card.videoBase}_hq.mp4`,
                mobileSrc: `${MEDIA_DIR}/${card.videoBase}_mobile.mp4`,
              }}
              index={i}
              videoRef={videoRefs[i]}
              reduceMotion={reduceMotion}
              panelBg="bg-[#EEEDE9]"
              titleColor={`transition-colors duration-500 ${pastThreshold ? 'text-white' : 'text-ink'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

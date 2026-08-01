'use client'

import { useEffect, useRef } from 'react'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { TextGradient } from '@/components/ui/text-gradient'
import FeatureCard from './FeatureCard'

const MEDIA_DIR = '/media/beyond'

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

  const videoRefs = [
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
  ]

  // One shared IntersectionObserver drives play/pause for all six panels —
  // play once a card is >=30% visible, pause otherwise, so we never force
  // all six to decode/play at once.
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

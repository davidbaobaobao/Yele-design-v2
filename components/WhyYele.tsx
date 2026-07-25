'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const VIDEO_DIR = '/media/whyyele'

type CardData = {
  title: string
  description: string
  videoBase: string
}

const CARDS: CardData[] = [
  {
    title: 'Custom design',
    description: 'Built from scratch for your business. No templates, no lookalikes.',
    videoBase: 'whyyele1',
  },
  {
    title: 'Yours to control',
    description: 'Edit prices, photos and content anytime from your dashboard.',
    videoBase: 'whyyele2',
  },
  {
    title: 'One flat price',
    description: 'Hosting, domain, changes and support — all included in one monthly rate.',
    videoBase: 'whyyele3',
  },
  {
    title: 'No lock-in',
    description: 'Cancel whenever you want. You stay because it works.',
    videoBase: 'whyyele4',
  },
  {
    title: 'Live in days',
    description: 'Your site ready in a week, not months. Updates in hours.',
    videoBase: 'whyyele5',
  },
  {
    title: 'Built to convert',
    description: 'Designed to turn visitors into calls, bookings and customers.',
    videoBase: 'whyyele6',
  },
]

function WhyYeleCard({
  card,
  index,
  videoRef,
  reduceMotion,
}: {
  card: CardData
  index: number
  videoRef: React.Ref<HTMLVideoElement>
  reduceMotion: boolean
}) {
  const poster = `${VIDEO_DIR}/${card.videoBase}_poster.jpg`

  const inner = (
    <div className="max-w-[380px] md:max-w-[420px] mx-auto">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#EEEDE9]">
        {reduceMotion ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt={card.title} className="absolute inset-0 w-full h-full object-cover" />
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
            <source src={`${VIDEO_DIR}/${card.videoBase}.webm`} type="video/webm" />
            <source src={`${VIDEO_DIR}/${card.videoBase}.mp4`} type="video/mp4" />
          </video>
        )}
      </div>

      <div className="mt-6 px-1">
        <h3 className="font-display text-ink text-[20px]">{card.title}</h3>
        <p className="font-body text-[15px] text-muted max-w-sm mt-2">{card.description}</p>
      </div>
    </div>
  )

  if (reduceMotion) return inner

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
    >
      {inner}
    </motion.div>
  )
}

export default function WhyYele() {
  const reduceMotion = !!useReducedMotion()

  const videoRefs = [
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
  ]

  // One shared IntersectionObserver drives play/pause for all six videos —
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
    <section className="bg-base py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-ink text-[clamp(1.5rem,2.5vw,2.25rem)] leading-tight">
          Everything included. Nothing hidden.
        </h2>
        <div className="border-t border-hairline mt-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16 mt-16">
          {CARDS.map((card, i) => (
            <WhyYeleCard key={card.videoBase} card={card} index={i} videoRef={videoRefs[i]} reduceMotion={reduceMotion} />
          ))}
        </div>
      </div>
    </section>
  )
}

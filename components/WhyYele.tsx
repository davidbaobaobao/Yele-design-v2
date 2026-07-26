'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const VIDEO_DIR = '/media/whyyele2'

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
    <div>
      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#16171C]">
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

      <div className="mt-5">
        <h3 className="font-display text-bone text-[19px]">{card.title}</h3>
        <p className="font-body text-[14px] text-muted max-w-md mt-1.5">{card.description}</p>
      </div>
    </div>
  )

  if (reduceMotion) return inner

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
    >
      {inner}
    </motion.div>
  )
}

export default function WhyYele() {
  const reduceMotion = !!useHydratedReducedMotion()

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
  // all six to decode/play at once. Independent of the entrance animation.
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

  const heading = (
    <h2 className="font-display leading-tight max-w-4xl text-[clamp(1.5rem,2.6vw,2.75rem)] mb-12">
      <span className="text-[#8A8A92]">
        Building a website used to be a headache — slow, big upfront bills, endless
        back-and-forth.{' '}
      </span>
      <span className="text-bone">Not anymore.</span>
    </h2>
  )

  return (
    <section data-nav-dark className="relative bg-[#0D0E12] pt-12 md:pt-16 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {heading}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
          {CARDS.map((card, i) => (
            <WhyYeleCard key={card.videoBase} card={card} index={i} videoRef={videoRefs[i]} reduceMotion={reduceMotion} />
          ))}
        </div>
      </div>
    </section>
  )
}

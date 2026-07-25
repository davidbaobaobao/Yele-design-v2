'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const VIDEO_DIR = '/media/whyyele'

type CardData = {
  n: string
  title: string
  description: string
  videoBase: string
}

const CARDS: CardData[] = [
  {
    n: '01',
    title: 'Custom design',
    description: 'Built from scratch for your business. No templates, no lookalikes.',
    videoBase: 'whyyele1',
  },
  {
    n: '02',
    title: 'Yours to control',
    description: 'Edit prices, photos and content anytime from your dashboard.',
    videoBase: 'whyyele2',
  },
  {
    n: '03',
    title: 'One flat price',
    description: 'Hosting, domain, changes and support — all included, one monthly rate.',
    videoBase: 'whyyele3',
  },
  {
    n: '04',
    title: 'No lock-in',
    description: "Cancel whenever you want. You stay because it works, not because you're stuck.",
    videoBase: 'whyyele4',
  },
  {
    n: '05',
    title: 'Live in days',
    description: 'Your site ready in a week, not months. Updates in hours.',
    videoBase: 'whyyele5',
  },
  {
    n: '06',
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
    <div className="relative h-[60vh] md:h-[70vh] md:min-h-[520px] rounded-3xl overflow-hidden bg-white border border-hairline flex flex-col justify-end">
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

      {/* Bottom gradient so the text stays legible over the video */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-white pointer-events-none" />

      <div className="relative z-10 p-8">
        <span className="block font-mono text-sm text-muted mb-2">{card.n}</span>
        <h3 className="font-display text-ink text-[28px] mb-2">{card.title}</h3>
        <p className="font-body text-ink/70 max-w-sm">{card.description}</p>
      </div>
    </div>
  )

  if (reduceMotion) return inner

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.08 + 0.05, ease: 'easeOut' }}
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
    <section className="bg-base py-24 px-6 md:px-10">
      <span className="block font-mono text-sm text-muted mb-4">WHY YELE</span>
      <h2 className="font-display text-ink text-[clamp(2rem,3.5vw,3.25rem)] leading-tight max-w-3xl">
        Everything included. Nothing hidden.
      </h2>
      <p className="font-body text-muted max-w-xl mt-4">
        Six reasons the subscription just works.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {CARDS.map((card, i) => (
          <WhyYeleCard key={card.videoBase} card={card} index={i} videoRef={videoRefs[i]} reduceMotion={reduceMotion} />
        ))}
      </div>
    </section>
  )
}

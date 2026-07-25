'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const VIDEO_DIR = '/media/whyyele'

// Sequenced reveal: bg color resolves first, then heading+cards fade in
// after a delay — driven by explicit variants rather than scroll progress,
// triggered once by useInView. "when: beforeChildren" + delayChildren is
// what enforces the bg-then-content ordering.
const sectionVariants: Variants = {
  hidden: { backgroundColor: '#0A0A0A' },
  visible: {
    backgroundColor: '#F7F6F3',
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
      when: 'beforeChildren',
      staggerChildren: 0.08,
      delayChildren: 0.5,
    },
  },
}

const childVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

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
  videoRef,
  reduceMotion,
}: {
  card: CardData
  videoRef: React.Ref<HTMLVideoElement>
  reduceMotion: boolean
}) {
  const poster = `${VIDEO_DIR}/${card.videoBase}_poster.jpg`

  const inner = (
    <div>
      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#EEEDE9]">
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
        <h3 className="font-display text-ink text-[19px]">{card.title}</h3>
        <p className="font-body text-[14px] text-muted max-w-md mt-1.5">{card.description}</p>
      </div>
    </div>
  )

  if (reduceMotion) return inner

  return <motion.div variants={childVariants}>{inner}</motion.div>
}

export default function WhyYele() {
  const reduceMotion = !!useHydratedReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-20% 0px' })
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (inView) setEntered(true)
  }, [inView])

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
    <>
      <h2 className="font-display text-ink text-[clamp(1.5rem,2.5vw,2.25rem)] leading-tight">
        Everything included. Nothing hidden.
      </h2>
      <div className="border-t border-hairline mt-8" />
    </>
  )

  // Reduced motion: no bg animation, static light bg, cards visible immediately.
  if (reduceMotion) {
    return (
      <section className="relative bg-base py-28 px-6">
        <div className="max-w-6xl mx-auto">
          {heading}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14 mt-14">
            {CARDS.map((card, i) => (
              <WhyYeleCard key={card.videoBase} card={card} videoRef={videoRefs[i]} reduceMotion={reduceMotion} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <motion.section
      ref={sectionRef}
      variants={sectionVariants}
      initial="hidden"
      animate={entered ? 'visible' : 'hidden'}
      className="relative py-28 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div variants={childVariants}>{heading}</motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14 mt-14">
          {CARDS.map((card, i) => (
            <WhyYeleCard key={card.videoBase} card={card} videoRef={videoRefs[i]} reduceMotion={reduceMotion} />
          ))}
        </div>
      </div>
    </motion.section>
  )
}

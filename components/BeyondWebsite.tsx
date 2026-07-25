'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useInView, type Variants } from 'framer-motion'

const MEDIA_DIR = '/media/beyond'

// Sequenced reveal — mirror of WhyYele's dark->light one, just inverted:
// bg color resolves first (light -> dark), then heading+cards fade in
// after a delay. Driven by explicit variants rather than scroll progress,
// triggered once by useInView. "when: beforeChildren" + delayChildren is
// what enforces the bg-then-content ordering.
const sectionVariants: Variants = {
  hidden: { backgroundColor: '#F7F6F3' },
  visible: {
    backgroundColor: '#0A0A0A',
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
  media: string
}

const CARDS: CardData[] = [
  {
    title: 'SEO',
    description: 'Rank higher on Google and get found by more local customers.',
    media: `${MEDIA_DIR}/beyond1.jpg`,
  },
  {
    title: 'Google Ads',
    description: 'Managed campaigns that bring ready-to-buy visitors.',
    media: `${MEDIA_DIR}/beyond2.jpg`,
  },
  {
    title: 'Marketing campaigns',
    description: 'Ongoing content and promotions, done for you.',
    media: `${MEDIA_DIR}/beyond3.jpg`,
  },
  {
    title: 'AI phone answering',
    description: 'An AI receptionist that answers calls 24/7.',
    media: `${MEDIA_DIR}/beyond4.jpg`,
  },
  {
    title: 'Automations',
    description: 'Follow-ups, bookings and reminders on autopilot.',
    media: `${MEDIA_DIR}/beyond5.jpg`,
  },
  {
    title: 'AI agents & chat',
    description: 'A smart assistant that answers visitors instantly.',
    media: `${MEDIA_DIR}/beyond6.jpg`,
  },
]

// Renders a video when `src` points at an .mp4, otherwise an image — so the
// dummy beyond*.jpg placeholders can become beyond*.mp4 later with no
// layout change, just a data swap in CARDS above.
function Media({
  src,
  alt,
  videoRef,
  reduceMotion,
}: {
  src: string
  alt: string
  videoRef: React.Ref<HTMLVideoElement>
  reduceMotion: boolean
}) {
  if (src.endsWith('.mp4') && !reduceMotion) {
    return (
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src={src} type="video/mp4" />
      </video>
    )
  }
  const imgSrc = src.endsWith('.mp4') ? src.replace(/\.mp4$/, '.jpg') : src
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={imgSrc} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
}

function BeyondCard({
  card,
  videoRef,
  reduceMotion,
}: {
  card: CardData
  videoRef: React.Ref<HTMLVideoElement>
  reduceMotion: boolean
}) {
  const inner = (
    <div>
      <div className="relative aspect-[4/3] md:aspect-[3/4] rounded-2xl overflow-hidden bg-[#141418] border border-hairlineDark">
        <Media src={card.media} alt={card.title} videoRef={videoRef} reduceMotion={reduceMotion} />
      </div>
      <div className="mt-5">
        <h3 className="font-display text-bone text-[18px]">{card.title}</h3>
        <p className="font-body text-[14px] text-[#8A8A92] max-w-xs mt-1.5">{card.description}</p>
      </div>
    </div>
  )

  if (reduceMotion) return inner

  return <motion.div variants={childVariants}>{inner}</motion.div>
}

export default function BeyondWebsite() {
  const reduceMotion = !!useReducedMotion()
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

  // One shared IntersectionObserver drives play/pause for all six panels —
  // play once a card is >=30% visible, pause otherwise. Independent of the
  // entrance animation. No-op today since the dummy media is all .jpg, but
  // wired for when real .mp4s land.
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
      <span className="block font-mono text-sm text-[#8A8A92] mb-4">BEYOND THE WEBSITE</span>
      <h2 className="font-display text-bone text-[clamp(1.75rem,2.5vw,2.5rem)] leading-tight">
        Everything that makes your website work harder.
      </h2>
      <p className="font-body text-[#8A8A92] max-w-xl mt-4">
        Growth services, included in Pro and Frontier.
      </p>
      <div className="border-t border-hairlineDark mt-8" />
    </>
  )

  // Reduced motion: no bg animation, static dark bg, cards visible immediately.
  if (reduceMotion) {
    return (
      <section data-nav-dark className="relative bg-[#0A0A0A] py-28 px-6">
        <div className="max-w-6xl mx-auto">
          {heading}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-16">
            {CARDS.map((card, i) => (
              <BeyondCard key={card.media} card={card} videoRef={videoRefs[i]} reduceMotion={reduceMotion} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <motion.section
      ref={sectionRef}
      data-nav-dark
      variants={sectionVariants}
      initial="hidden"
      animate={entered ? 'visible' : 'hidden'}
      className="relative py-28 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div variants={childVariants}>{heading}</motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-16">
          {CARDS.map((card, i) => (
            <BeyondCard key={card.media} card={card} videoRef={videoRefs[i]} reduceMotion={reduceMotion} />
          ))}
        </div>
      </div>
    </motion.section>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const MEDIA_DIR = '/media/howwework2'
const AMBER = '#C97F3D'

type StepData = {
  n: string
  title: string
  lead: string
  leadAmber?: boolean
  description: string
  videoBase: string
}

const STEPS: StepData[] = [
  {
    n: '01',
    title: 'Tell us about you',
    lead: 'One short form.',
    description: 'Ten minutes: what you do, who you serve, how you want to look.',
    videoBase: 'howvideo1',
  },
  {
    n: '02',
    title: 'We build it',
    lead: 'Design and content, done for you.',
    description: 'You review and approve. No meetings, no back-and-forth.',
    videoBase: 'howvideo2-2',
  },
  {
    n: '03',
    title: 'You go live',
    lead: 'Live in one week.',
    description: 'Your site publishes and starts working from day one.',
    videoBase: 'howvideo3',
  },
  {
    n: '04',
    title: 'We stay',
    lead: 'Forever.',
    leadAmber: true,
    description: 'Hosting, updates, changes and improvements — handled, month after month.',
    videoBase: 'howvideo4',
  },
]

// Reduced motion shows the poster only; otherwise a muted/looping video whose
// play/pause is driven by the shared IntersectionObserver in HowWeWork below
// (not a bare autoPlay attribute — iOS Safari needs the attribute set on the
// element directly plus a play() retry, same pattern as every other video
// section on this site).
function Media({
  videoBase,
  alt,
  videoRef,
  reduceMotion,
}: {
  videoBase: string
  alt: string
  videoRef: React.Ref<HTMLVideoElement>
  reduceMotion: boolean
}) {
  const poster = `${MEDIA_DIR}/${videoBase}_poster.jpg`

  if (reduceMotion) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
  }

  return (
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
      <source src={`${MEDIA_DIR}/${videoBase}_hq.webm`} type="video/webm" />
      <source src={`${MEDIA_DIR}/${videoBase}_hq.mp4`} type="video/mp4" />
    </video>
  )
}

function StepText({ step }: { step: StepData }) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <span className="block font-mono text-sm text-muted mb-4">{step.n}</span>
        <h3 className="font-display text-ink text-[clamp(1.5rem,2vw,2rem)]">{step.title}</h3>
      </div>

      <div className="border-t border-hairline pt-6 mt-12">
        <p className="font-body font-medium" style={{ color: step.leadAmber ? AMBER : undefined }}>
          {step.leadAmber ? step.lead : <span className="text-ink">{step.lead}</span>}
        </p>
        <p className="font-body text-muted max-w-sm mt-2">{step.description}</p>
      </div>
    </div>
  )
}

function StepVisual({
  step,
  videoRef,
  reduceMotion,
}: {
  step: StepData
  videoRef: React.Ref<HTMLVideoElement>
  reduceMotion: boolean
}) {
  return (
    <div className="relative w-full max-w-[300px] md:max-w-[360px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-[#EEEDE9]">
      <Media videoBase={step.videoBase} alt={step.title} videoRef={videoRef} reduceMotion={reduceMotion} />
    </div>
  )
}

function HowWeWorkStep({
  step,
  index,
  videoRef,
  reduceMotion,
}: {
  step: StepData
  index: number
  videoRef: React.Ref<HTMLVideoElement>
  reduceMotion: boolean
}) {
  const visualFirst = index % 2 === 1
  const textOrder = visualFirst ? 'md:order-2' : 'md:order-1'
  const visualOrder = visualFirst ? 'md:order-1' : 'md:order-2'

  if (reduceMotion) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-stretch md:min-h-[70vh] mb-24">
        <div className={textOrder}>
          <StepText step={step} />
        </div>
        <div className={visualOrder}>
          <StepVisual step={step} videoRef={videoRef} reduceMotion={reduceMotion} />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-stretch md:min-h-[70vh] mb-24">
      <motion.div
        className={textOrder}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <StepText step={step} />
      </motion.div>

      <motion.div
        className={visualOrder}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      >
        <StepVisual step={step} videoRef={videoRef} reduceMotion={reduceMotion} />
      </motion.div>
    </div>
  )
}

export default function HowWeWork() {
  const reduceMotion = !!useHydratedReducedMotion()

  const videoRefs = [
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
  ]

  // One shared IntersectionObserver drives play/pause for all four videos —
  // play once a step is >=30% visible, pause otherwise. Same iOS-safe
  // attribute-setting + retry pattern used across the site's other video
  // sections (WhatWeDo, WhyYele, BeyondWebsite).
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
        <span className="block font-mono text-sm text-muted mb-4">HOW IT WORKS</span>
        <h2 className="font-display text-ink text-[clamp(1.75rem,2.8vw,2.75rem)] leading-tight mb-20">
          From brief to live in one week. Then we stay.
        </h2>

        {STEPS.map((step, i) => (
          <HowWeWorkStep key={step.n} step={step} index={i} videoRef={videoRefs[i]} reduceMotion={reduceMotion} />
        ))}
      </div>
    </section>
  )
}

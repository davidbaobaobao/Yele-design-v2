'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, type Transition } from 'framer-motion'
import { TextGradient } from '@/components/ui/text-gradient'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useEarlyReveal } from '@/hooks/useEarlyReveal'

const MEDIA_DIR = '/media/howwework2'

// One-shot 500ms fade, not a continuous scroll-progress drive: the whole
// bg/text flip is just these two color pairs, crossfaded by framer-motion's
// own `animate` prop whenever `pastThreshold` flips — no manual color
// mixing math needed, framer-motion interpolates the color strings itself.
const DARK_BG = '#0D0E12'
const LIGHT_BG = '#FFFFFF'
const DARK_TEXT = '#F2F0EB'
const LIGHT_TEXT = '#16161A'
const DARK_SECONDARY = 'rgba(242, 240, 235, 0.7)'
const LIGHT_SECONDARY = 'rgba(22, 22, 26, 0.6)'
const DARK_HAIRLINE = 'rgba(255, 255, 255, 0.15)'
const LIGHT_HAIRLINE = 'rgba(0, 0, 0, 0.1)'
const FLIP_TRANSITION: Transition = { duration: 0.5, ease: 'easeInOut' }

type StepPoint = {
  lead: string
  description: string
}

type StepData = {
  n: string
  title: string
  points: StepPoint[]
  videoBase: string
}

const STEPS: StepData[] = [
  {
    n: '01',
    title: 'Tell us about you',
    points: [
      {
        lead: 'Fill one short form',
        description: 'What you do, who you serve, and the look you want. Ten minutes, no meetings.',
      },
      {
        lead: 'Send what you have',
        description: "Logo, photos, text — or nothing at all. If you don't have it, we create it for you.",
      },
    ],
    videoBase: 'howvideo1',
  },
  {
    n: '02',
    title: 'We design & build it',
    points: [
      {
        lead: 'Custom design, done for you',
        description: 'Built from scratch for your business. You review, we refine.',
      },
      {
        lead: 'Content included',
        description: 'Photos, copy and visuals created for you, so your site looks complete from day one.',
      },
      {
        lead: 'First proposal in one week',
        description: "Then we refine it together until it's perfect and ready to ship.",
      },
    ],
    videoBase: 'howvideo2-2',
  },
  {
    n: '03',
    title: 'You go live',
    points: [
      {
        lead: 'Live from day one',
        description: 'You approve, we publish. Your site is online and working from day one.',
      },
      {
        lead: 'Working from day one',
        description: 'Optimized for Google and mobile, so your site starts bringing in customers immediately.',
      },
      {
        lead: 'Built to win customers',
        description: 'Fast, mobile-first and search-ready, designed to turn visitors into calls and bookings.',
      },
    ],
    videoBase: 'howvideo3',
  },
  {
    n: '04',
    title: 'We keep improving it',
    points: [
      {
        lead: 'Always online',
        description:
          'Hosting, security and monitoring handled around the clock. Your site never goes down, you never touch a thing.',
      },
      {
        lead: 'Changes whenever you need',
        description: 'Request edits anytime; we make them, no extra invoice.',
      },
      {
        lead: 'Growing with you',
        description: 'Ongoing improvements and marketing so your site keeps getting better every month.',
      },
    ],
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
  // howvideo2-2 (step 02's clip) has a faint 1-2px grey fringe baked into
  // its own source frame edges (visible on close inspection of its poster
  // — an export/compression artifact, not a CSS border; none of the other
  // three clips have it). A small over-scale pushes that fringe outside the
  // panel's own overflow-hidden clip instead of needing to re-encode the
  // source file. Harmless on the other three at this size.
  const scaleStyle = { transform: 'scale(1.03)' }

  if (reduceMotion) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt={alt} className="absolute inset-0 w-full h-full object-cover" style={scaleStyle} />
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
      style={scaleStyle}
      aria-hidden="true"
    >
      {/* media-query <source>: mobile (iOS included — no webm support
          there) never considers the webm/desktop-mp4 pair below; desktop
          is untouched since the query never matches there. */}
      <source media="(max-width: 767px)" src={`${MEDIA_DIR}/${videoBase}_mobile.mp4`} type="video/mp4" />
      <source src={`${MEDIA_DIR}/${videoBase}_hq.webm`} type="video/webm" />
      <source src={`${MEDIA_DIR}/${videoBase}_hq.mp4`} type="video/mp4" />
    </video>
  )
}

// Colors below are either static (reduced-motion / video panel, unaffected
// by the flip) or the current flip target string, passed down so every step
// binds to the SAME `animate` target — each motion element tweens to it
// independently over FLIP_TRANSITION whenever the string changes.
function StepText({
  step,
  reduceMotion,
  primaryColor,
  secondaryColor,
  hairlineColor,
}: {
  step: StepData
  reduceMotion: boolean
  primaryColor: string
  secondaryColor: string
  hairlineColor: string
}) {
  if (reduceMotion) {
    return (
      <div className="flex flex-col justify-between h-full">
        <div>
          <span className="block font-mono text-sm mb-4" style={{ color: secondaryColor }}>
            {step.n}
          </span>
          <h3 className="font-display text-[clamp(1.5rem,2vw,2rem)]" style={{ color: primaryColor }}>
            {step.title}
          </h3>
        </div>
        <div className="mt-12">
          {step.points.map((point, i) => (
            <div key={point.lead} className={`border-t pt-6 ${i > 0 ? 'mt-6' : ''}`} style={{ borderColor: hairlineColor }}>
              <p className="font-body font-semibold" style={{ color: primaryColor }}>
                {point.lead}
              </p>
              <p className="font-body max-w-sm mt-2" style={{ color: secondaryColor }}>
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <motion.span className="block font-mono text-sm mb-4" animate={{ color: secondaryColor }} transition={FLIP_TRANSITION}>
          {step.n}
        </motion.span>
        <motion.h3
          className="font-display text-[clamp(1.5rem,2vw,2rem)]"
          animate={{ color: primaryColor }}
          transition={FLIP_TRANSITION}
        >
          {step.title}
        </motion.h3>
      </div>

      <div className="mt-12">
        {step.points.map((point, i) => (
          <motion.div
            key={point.lead}
            className={`border-t pt-6 ${i > 0 ? 'mt-6' : ''}`}
            animate={{ borderColor: hairlineColor }}
            transition={FLIP_TRANSITION}
          >
            <motion.p className="font-body font-semibold" animate={{ color: primaryColor }} transition={FLIP_TRANSITION}>
              {point.lead}
            </motion.p>
            <motion.p className="font-body max-w-sm mt-2" animate={{ color: secondaryColor }} transition={FLIP_TRANSITION}>
              {point.description}
            </motion.p>
          </motion.div>
        ))}
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
  // Video panels stay as-is regardless of the section's dark/light state —
  // they're media, not text/background, so no color flip here.
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
  primaryColor,
  secondaryColor,
  hairlineColor,
}: {
  step: StepData
  index: number
  videoRef: React.Ref<HTMLVideoElement>
  reduceMotion: boolean
  primaryColor: string
  secondaryColor: string
  hairlineColor: string
}) {
  const visualFirst = index % 2 === 1
  const textOrder = visualFirst ? 'md:order-2' : 'md:order-1'
  const visualOrder = visualFirst ? 'md:order-1' : 'md:order-2'

  const textRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const textReveal = useEarlyReveal(textRef)
  const visualReveal = useEarlyReveal(visualRef)

  if (reduceMotion) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-stretch md:min-h-[70vh] mb-24">
        <div className={textOrder}>
          <StepText
            step={step}
            reduceMotion={reduceMotion}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            hairlineColor={hairlineColor}
          />
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
        ref={textRef}
        className={textOrder}
        initial={textReveal === 'shown' ? false : { opacity: 0, y: 24 }}
        animate={textReveal === 'hidden' ? undefined : { opacity: 1, y: 0 }}
        transition={textReveal === 'shown' ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
      >
        <StepText
          step={step}
          reduceMotion={reduceMotion}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          hairlineColor={hairlineColor}
        />
      </motion.div>

      <motion.div
        ref={visualRef}
        className={visualOrder}
        initial={visualReveal === 'shown' ? false : { opacity: 0, y: 24 }}
        animate={visualReveal === 'hidden' ? undefined : { opacity: 1, y: 0 }}
        transition={visualReveal === 'shown' ? { duration: 0 } : { duration: 0.25, delay: 0.05, ease: 'easeOut' }}
      >
        <StepVisual step={step} videoRef={videoRef} reduceMotion={reduceMotion} />
      </motion.div>
    </div>
  )
}

export default function HowWeWork() {
  const reduceMotion = !!useHydratedReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLHeadingElement>(null)
  const headerPageTopRef = useRef(0)

  const videoRefs = [
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
  ]

  // pastThreshold is a plain boolean, not a continuous scroll-driven value —
  // the flip is triggered (crossing the header's own top-of-viewport point)
  // and then animates as a fixed-duration tween via each motion element's
  // own `animate`/`transition` props, independent of further scrolling.
  const [pastThreshold, setPastThreshold] = useState(false)

  // Anchored on the HEADER itself, not the section's top edge — the flip
  // fires as "HOW IT WORKS" / the h2 reach the top of the viewport, which is
  // the moment the user is actually looking at that content, not while it's
  // still mostly below the fold.
  //
  // A single mount-time measurement isn't enough: everything ABOVE this
  // section (hero video, WhatWeDo videos/images, the Content showcase's own
  // media) can still be loading and reflowing the page well after this
  // effect first runs, silently shifting the header hundreds of pixels
  // below where it was measured. A ResizeObserver on <body> catches any of
  // that and re-measures. Kept in a ref (not state) since it only feeds a
  // scroll-event comparison, not a render.
  useEffect(() => {
    const measure = () => {
      const header = headerRef.current
      if (!header) return
      const rect = header.getBoundingClientRect()
      headerPageTopRef.current = rect.top + window.scrollY
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
      ro.disconnect()
    }
  }, [])

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', v => {
    const past = v >= headerPageTopRef.current
    setPastThreshold(prev => (prev === past ? prev : past))
  })

  const bgColor = pastThreshold ? LIGHT_BG : DARK_BG
  const primaryColor = pastThreshold ? LIGHT_TEXT : DARK_TEXT
  const secondaryColor = pastThreshold ? LIGHT_SECONDARY : DARK_SECONDARY
  const hairlineColor = pastThreshold ? LIGHT_HAIRLINE : DARK_HAIRLINE

  // Nav integration — this section is excluded from the generic always-dark
  // [data-nav-dark] observer (marked data-nav-fade instead, see Nav.tsx)
  // since it isn't uniformly dark: only fires while still on the dark side
  // of the flip. Reports the change only when it actually happens so
  // scrolling back up flips the nav back at the same point it flipped
  // forward.
  useEffect(() => {
    if (reduceMotion) return
    window.dispatchEvent(new CustomEvent('nav:fademode', { detail: { dark: !pastThreshold } }))
  }, [pastThreshold, reduceMotion])

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
            v.play().catch(err => console.warn('[video autoplay] rejected after retry:', err?.name, err?.message, v.currentSrc))
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

  // ---- Reduced motion: skip the fade entirely — static white bg, black
  // text, still readable. No dark entry phase, so this section doesn't
  // participate in the nav's dark/fade signaling at all. ----
  if (reduceMotion) {
    return (
      <section id="how-it-works" className="bg-white py-28 px-6 scroll-mt-24">
        <div className="max-w-6xl mx-auto" style={{ transform: 'translateY(-40px)' }}>
          <span className="block font-mono text-sm mb-4" style={{ color: LIGHT_SECONDARY }}>
            HOW IT WORKS
          </span>
          <h2 className="font-display text-[clamp(1.75rem,2.8vw,2.75rem)] leading-tight mb-20" style={{ color: LIGHT_TEXT }}>
            From brief to live in <TextGradient as="span">one week</TextGradient>. Then we keep it growing.
          </h2>

          {STEPS.map((step, i) => (
            <HowWeWorkStep
              key={step.n}
              step={step}
              index={i}
              videoRef={videoRefs[i]}
              reduceMotion={reduceMotion}
              primaryColor={LIGHT_TEXT}
              secondaryColor={LIGHT_SECONDARY}
              hairlineColor={LIGHT_HAIRLINE}
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="how-it-works" data-nav-fade className="relative py-28 px-6 scroll-mt-24">
      {/* Single full-section background layer behind the content — cheaper
          than animating the section's own background-color directly, and
          keeps the color transform isolated from the content's own layout. */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ backgroundColor: bgColor }}
        transition={FLIP_TRANSITION}
        aria-hidden="true"
      />

      {/* translateY(-40px): nudges the whole section's content up ~1
          line-height, per request — the scroll-linked dark/light trigger
          below (headerRef.getBoundingClientRect()) already accounts for CSS
          transforms, so it stays correctly synced with this shifted
          position without any other change to that logic. */}
      <div className="max-w-6xl mx-auto" style={{ transform: 'translateY(-40px)' }}>
        <motion.span
          className="block font-mono text-sm mb-4"
          animate={{ color: secondaryColor }}
          transition={FLIP_TRANSITION}
        >
          HOW IT WORKS
        </motion.span>
        <motion.h2
          ref={headerRef}
          className="font-display text-[clamp(1.75rem,2.8vw,2.75rem)] leading-tight mb-20"
          animate={{ color: primaryColor }}
          transition={FLIP_TRANSITION}
        >
          From brief to live in <TextGradient as="span">one week</TextGradient>. Then we keep it growing.
        </motion.h2>

        {STEPS.map((step, i) => (
          <HowWeWorkStep
            key={step.n}
            step={step}
            index={i}
            videoRef={videoRefs[i]}
            reduceMotion={reduceMotion}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            hairlineColor={hairlineColor}
          />
        ))}
      </div>
    </section>
  )
}

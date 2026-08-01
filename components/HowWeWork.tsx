'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const MEDIA_DIR = '/media/howwework2'

function linearMap(inMin: number, inMax: number, outMin: number, outMax: number) {
  return (v: number) => {
    if (v <= inMin) return outMin
    if (v >= inMax) return outMax
    return outMin + ((outMax - outMin) * (v - inMin)) / (inMax - inMin)
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function parseRgba(v: string): [number, number, number, number] {
  const m = v.match(/rgba?\(([^)]+)\)/)
  const parts = (m?.[1] ?? '0,0,0,1').split(',').map(s => parseFloat(s.trim()))
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0, parts[3] ?? 1]
}

function mixHex(from: string, to: string, t: number) {
  const k = Math.max(0, Math.min(1, t))
  const [r1, g1, b1] = hexToRgb(from)
  const [r2, g2, b2] = hexToRgb(to)
  const r = Math.round(r1 + (r2 - r1) * k)
  const g = Math.round(g1 + (g2 - g1) * k)
  const b = Math.round(b1 + (b2 - b1) * k)
  return `rgb(${r}, ${g}, ${b})`
}

function mixRgba(from: string, to: string, t: number) {
  const k = Math.max(0, Math.min(1, t))
  const [r1, g1, b1, a1] = parseRgba(from)
  const [r2, g2, b2, a2] = parseRgba(to)
  const r = Math.round(r1 + (r2 - r1) * k)
  const g = Math.round(g1 + (g2 - g1) * k)
  const b = Math.round(b1 + (b2 - b1) * k)
  const a = a1 + (a2 - a1) * k
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// The flip fires over this many pixels of scroll. Doubled from 70 to 140 —
// the original was too fast/scroll-sensitive (a small scroll jumped straight
// from dark to white); this spans roughly twice the scroll distance so it
// reads as a smoother, more deliberate transition.
const FLIP_RANGE_PX = 140

// Mercury effect: the section enters dark (#0D0E12, seamless from the
// previous dark "Showcase" section above it) then fades to white as the
// user scrolls past the header, with text flipping white -> ink. Reversible
// (tied to scrollYProgress, not a once:true trigger) — scrolling back up
// fades it back to dark.
const DARK_BG = '#0D0E12'
const LIGHT_BG = '#FFFFFF'
const DARK_TEXT = '#F2F0EB'
const LIGHT_TEXT = '#16161A'
const DARK_SECONDARY = 'rgba(242, 240, 235, 0.7)'
const LIGHT_SECONDARY = 'rgba(22, 22, 26, 0.6)'
const DARK_HAIRLINE = 'rgba(255, 255, 255, 0.15)'
const LIGHT_HAIRLINE = 'rgba(0, 0, 0, 0.1)'

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
      <source src={`${MEDIA_DIR}/${videoBase}_hq.webm`} type="video/webm" />
      <source src={`${MEDIA_DIR}/${videoBase}_hq.mp4`} type="video/mp4" />
    </video>
  )
}

// Colors below are either static (reduced-motion / video panel, unaffected
// by the flip) or live MotionValues shared from the section's own scroll
// progress — passed down so every step binds to the SAME transforms rather
// than each running its own scroll listener.
function StepText({
  step,
  reduceMotion,
  primaryColor,
  secondaryColor,
  hairlineColor,
}: {
  step: StepData
  reduceMotion: boolean
  primaryColor: MotionValue<string> | string
  secondaryColor: MotionValue<string> | string
  hairlineColor: MotionValue<string> | string
}) {
  if (reduceMotion) {
    return (
      <div className="flex flex-col justify-between h-full">
        <div>
          <span className="block font-mono text-sm mb-4" style={{ color: secondaryColor as string }}>
            {step.n}
          </span>
          <h3 className="font-display text-[clamp(1.5rem,2vw,2rem)]" style={{ color: primaryColor as string }}>
            {step.title}
          </h3>
        </div>
        <div className="mt-12">
          {step.points.map((point, i) => (
            <div key={point.lead} className={`border-t pt-6 ${i > 0 ? 'mt-6' : ''}`} style={{ borderColor: hairlineColor as string }}>
              <p className="font-body font-semibold" style={{ color: primaryColor as string }}>
                {point.lead}
              </p>
              <p className="font-body max-w-sm mt-2" style={{ color: secondaryColor as string }}>
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
        <motion.span className="block font-mono text-sm mb-4" style={{ color: secondaryColor }}>
          {step.n}
        </motion.span>
        <motion.h3 className="font-display text-[clamp(1.5rem,2vw,2rem)]" style={{ color: primaryColor }}>
          {step.title}
        </motion.h3>
      </div>

      <div className="mt-12">
        {step.points.map((point, i) => (
          <motion.div key={point.lead} className={`border-t pt-6 ${i > 0 ? 'mt-6' : ''}`} style={{ borderColor: hairlineColor }}>
            <motion.p className="font-body font-semibold" style={{ color: primaryColor }}>
              {point.lead}
            </motion.p>
            <motion.p className="font-body max-w-sm mt-2" style={{ color: secondaryColor }}>
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
  primaryColor: MotionValue<string> | string
  secondaryColor: MotionValue<string> | string
  hairlineColor: MotionValue<string> | string
}) {
  const visualFirst = index % 2 === 1
  const textOrder = visualFirst ? 'md:order-2' : 'md:order-1'
  const visualOrder = visualFirst ? 'md:order-1' : 'md:order-2'

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
        className={textOrder}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
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
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLHeadingElement>(null)
  const lastDarkRef = useRef(true)

  const videoRefs = [
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
  ]

  // useScroll's target+offset keyword syntax (e.g. ['start start','start
  // center']) was found to leave scrollYProgress permanently stuck at 0 in
  // this app whenever the second breakpoint resolves to a scroll position
  // BEFORE the first one (verified directly: scrollYProgress.get() never
  // left 0 across a full scroll pass with an out-of-order pair, while the
  // plain default offset and correctly-ordered combinations updated
  // normally). Sidestepping it with the same fix already proven elsewhere
  // in this codebase (Hero.tsx, WhatWeDo.tsx): a plain page-wide scrollY
  // MotionValue plus a manually measured pixel range, run through the
  // function-form transform helper.
  const { scrollY } = useScroll()
  const [flipStart, setFlipStart] = useState(0)
  const [flipEnd, setFlipEnd] = useState(1)

  // Anchored on the HEADER itself, not the section's top edge — the flip
  // fires as "HOW IT WORKS" / the h2 reach the top of the viewport, which is
  // the moment the user is actually looking at that content, not while it's
  // still mostly below the fold. flipEnd = scrollY at which the header's own
  // top is flush with the viewport's top edge; flipStart is FLIP_RANGE_PX
  // earlier (smaller scrollY, reached first on the way down).
  //
  // A single mount-time measurement isn't enough: everything ABOVE this
  // section (hero video, WhatWeDo videos/images, the Content showcase's own
  // media) can still be loading and reflowing the page well after this
  // effect first runs, silently shifting the header hundreds of pixels
  // below where it was measured — invisible with the old wide flip window,
  // but glaring with this one now that it's narrow and precisely anchored.
  // A ResizeObserver on <body> catches any of that and re-measures.
  useEffect(() => {
    const measure = () => {
      const header = headerRef.current
      if (!header) return
      const rect = header.getBoundingClientRect()
      const headerPageTop = rect.top + window.scrollY
      setFlipEnd(headerPageTop)
      setFlipStart(headerPageTop - FLIP_RANGE_PX)
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

  const progress = useTransform(scrollY, v => easeInOutCubic(linearMap(flipStart, flipEnd, 0, 1)(v)))
  const bgColor = useTransform(progress, v => mixHex(DARK_BG, LIGHT_BG, v))
  const primaryColor = useTransform(progress, v => mixHex(DARK_TEXT, LIGHT_TEXT, v))
  const secondaryColor = useTransform(progress, v => mixRgba(DARK_SECONDARY, LIGHT_SECONDARY, v))
  const hairlineColor = useTransform(progress, v => mixRgba(DARK_HAIRLINE, LIGHT_HAIRLINE, v))

  // Nav integration — this section is excluded from the generic always-dark
  // [data-nav-dark] observer (marked data-nav-fade instead, see Nav.tsx)
  // since it isn't uniformly dark: only the bg's own flip window is. Flips
  // at the window's midpoint, in step with the bg/text snap, and reports the
  // change only when it actually happens so scrolling back up flips the nav
  // back at the same point it flipped forward.
  useEffect(() => {
    if (reduceMotion) return
    const dark = progress.get() <= 0.5
    lastDarkRef.current = dark
    window.dispatchEvent(new CustomEvent('howwework:navmode', { detail: { dark } }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion])

  useMotionValueEvent(progress, 'change', v => {
    const dark = v <= 0.5
    if (dark !== lastDarkRef.current) {
      lastDarkRef.current = dark
      window.dispatchEvent(new CustomEvent('howwework:navmode', { detail: { dark } }))
    }
  })

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

  // ---- Reduced motion: skip the fade entirely — static white bg, black
  // text, still readable. No dark entry phase, so this section doesn't
  // participate in the nav's dark/fade signaling at all. ----
  if (reduceMotion) {
    return (
      <section className="bg-white py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <span className="block font-mono text-sm mb-4" style={{ color: LIGHT_SECONDARY }}>
            HOW IT WORKS
          </span>
          <h2 className="font-display text-[clamp(1.75rem,2.8vw,2.75rem)] leading-tight mb-20" style={{ color: LIGHT_TEXT }}>
            From brief to live in one week. Then we keep it growing.
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
    <section ref={sectionRef} data-nav-fade className="relative py-28 px-6">
      {/* Single full-section background layer behind the content — cheaper
          than animating the section's own background-color directly, and
          keeps the color transform isolated from the content's own layout. */}
      <motion.div className="absolute inset-0 -z-10" style={{ backgroundColor: bgColor }} aria-hidden="true" />

      <div className="max-w-6xl mx-auto">
        <motion.span className="block font-mono text-sm mb-4" style={{ color: secondaryColor }}>
          HOW IT WORKS
        </motion.span>
        <motion.h2
          ref={headerRef}
          className="font-display text-[clamp(1.75rem,2.8vw,2.75rem)] leading-tight mb-20"
          style={{ color: primaryColor }}
        >
          From brief to live in one week. Then we keep it growing.
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

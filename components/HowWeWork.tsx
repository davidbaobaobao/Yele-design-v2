'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const MEDIA_DIR = '/media/howwework2'
const AMBER = '#C97F3D'

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
        <div className="border-t pt-6 mt-12" style={{ borderColor: hairlineColor as string }}>
          <p className="font-body font-medium" style={{ color: step.leadAmber ? AMBER : (primaryColor as string) }}>
            {step.lead}
          </p>
          <p className="font-body max-w-sm mt-2" style={{ color: secondaryColor as string }}>
            {step.description}
          </p>
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

      <motion.div className="border-t pt-6 mt-12" style={{ borderColor: hairlineColor }}>
        <motion.p
          className="font-body font-medium"
          style={{ color: step.leadAmber ? AMBER : primaryColor }}
        >
          {step.lead}
        </motion.p>
        <motion.p className="font-body max-w-sm mt-2" style={{ color: secondaryColor }}>
          {step.description}
        </motion.p>
      </motion.div>
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
  // BEFORE the first one — which "start center" does here, since the
  // section's top crosses the viewport's center on the way to crossing its
  // top edge, not after (verified directly: scrollYProgress.get() never left
  // 0 across a full scroll pass with that offset, while the plain default
  // offset and other combinations updated normally). Sidestepping it with
  // the same fix already proven elsewhere in this codebase (Hero.tsx,
  // WhatWeDo.tsx): a plain page-wide scrollY MotionValue plus a manually
  // measured pixel range, run through the function-form transform helper.
  const { scrollY } = useScroll()
  const [fadeStart, setFadeStart] = useState(0)
  const [fadeEnd, setFadeEnd] = useState(1)

  useEffect(() => {
    const measure = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const pageTop = rect.top + window.scrollY
      setFadeStart(pageTop)
      setFadeEnd(pageTop + window.innerHeight * 0.4)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const progress = useTransform(scrollY, v => linearMap(fadeStart, fadeEnd, 0, 1)(v))
  const bgColor = useTransform(progress, v => mixHex(DARK_BG, LIGHT_BG, v))
  const primaryColor = useTransform(progress, v => mixHex(DARK_TEXT, LIGHT_TEXT, v))
  const secondaryColor = useTransform(progress, v => mixRgba(DARK_SECONDARY, LIGHT_SECONDARY, v))
  const hairlineColor = useTransform(progress, v => mixRgba(DARK_HAIRLINE, LIGHT_HAIRLINE, v))

  // Nav integration — this section is excluded from the generic always-dark
  // [data-nav-dark] observer (marked data-nav-fade instead, see Nav.tsx)
  // since it isn't uniformly dark: only the first half of its scroll range
  // is. Report the "which mode should the nav be in" boolean only when it
  // actually changes, so scrolling back up flips the nav back at the same
  // point it flipped forward.
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
            From brief to live in one week. Then we stay.
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
          className="font-display text-[clamp(1.75rem,2.8vw,2.75rem)] leading-tight mb-20"
          style={{ color: primaryColor }}
        >
          From brief to live in one week. Then we stay.
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

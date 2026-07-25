'use client'

import { motion } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const MEDIA_DIR = '/media/howwework'
const AMBER = '#C97F3D'

type StepData = {
  n: string
  title: string
  lead: string
  leadAmber?: boolean
  description: string
  media: string
}

const STEPS: StepData[] = [
  {
    n: '01',
    title: 'Tell us about you',
    lead: 'One short form.',
    description: 'Ten minutes: what you do, who you serve, how you want to look.',
    media: `${MEDIA_DIR}/step1.jpg`,
  },
  {
    n: '02',
    title: 'We build it',
    lead: 'Design and content, done for you.',
    description: 'You review and approve. No meetings, no back-and-forth.',
    media: `${MEDIA_DIR}/step2.jpg`,
  },
  {
    n: '03',
    title: 'You go live',
    lead: 'Live in one week.',
    description: 'Your site publishes and starts working from day one.',
    media: `${MEDIA_DIR}/step3.jpg`,
  },
  {
    n: '04',
    title: 'We stay',
    lead: 'Forever.',
    leadAmber: true,
    description: 'Hosting, updates, changes and improvements — handled, month after month.',
    media: `${MEDIA_DIR}/step4.jpg`,
  },
]

// Renders a video when `src` points at an .mp4, otherwise an image — so the
// dummy step*.jpg placeholders can become step*.mp4 later with no layout
// change, just a data swap in STEPS above.
function Media({ src, alt }: { src: string; alt: string }) {
  if (src.endsWith('.mp4')) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src={src} type="video/mp4" />
      </video>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
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

function StepVisual({ step }: { step: StepData }) {
  return (
    <div className="relative w-full max-w-[300px] md:max-w-[360px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden bg-[#EEEDE9]">
      <Media src={step.media} alt={step.title} />
    </div>
  )
}

function HowWeWorkStep({ step, index }: { step: StepData; index: number }) {
  const reduceMotion = !!useHydratedReducedMotion()
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
          <StepVisual step={step} />
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
        <StepVisual step={step} />
      </motion.div>
    </div>
  )
}

export default function HowWeWork() {
  return (
    <section className="bg-base py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <span className="block font-mono text-sm text-muted mb-4">HOW IT WORKS</span>
        <h2 className="font-display text-ink text-[clamp(1.75rem,2.8vw,2.75rem)] leading-tight mb-20">
          From brief to live in one week. Then we stay.
        </h2>

        {STEPS.map((step, i) => (
          <HowWeWorkStep key={step.n} step={step} index={i} />
        ))}
      </div>
    </section>
  )
}

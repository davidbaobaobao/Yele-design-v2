'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, type Transition } from 'framer-motion'
import { Check } from 'lucide-react'
import PlanCTA from '@/components/letsbuild/PlanCTA'
import { FeatureTooltip } from '@/components/PricingCards'

type Feature = { label: string; info?: string }

type Tier = {
  name: string
  price: string
  priceNote: string
  planValue: string
  blurb: string
  headline: string | null
  features: Feature[]
  care: string
  cta: string
  popular: boolean
}

const TIERS: Tier[] = [
  {
    name: 'Launch',
    price: '$599',
    priceNote: 'One-time',
    planValue: 'Launch — $599',
    blurb: 'Everything most small businesses need to get online professionally.',
    headline: null,
    features: [
      { label: 'Custom website design' },
      { label: 'Mobile optimization' },
      { label: 'Custom domain' },
      { label: 'Contact and forms' },
      { label: 'SEO and Google indexing' },
      { label: 'Professional image and video content' },
    ],
    care: '$49',
    cta: 'Choose Launch',
    popular: false,
  },
  {
    name: 'Business',
    price: '$1,199',
    priceNote: 'One-time',
    planValue: 'Business — $1,199',
    blurb: 'For businesses that want more functionality on their website.',
    headline: 'Everything in Launch, plus:',
    features: [
      { label: 'Calendar booking', info: 'Customers book their own appointments online, with automatic confirmations.' },
      { label: 'Payment acceptance', info: 'Accept secure credit-card payments directly on your website.' },
      { label: 'Small e-commerce', info: 'Ideal for smaller catalogs — up to around 30 products.' },
      { label: 'Conversion optimization', info: 'Improved layout and clear calls-to-action to turn more visitors into customers.' },
      { label: 'Blog' },
      { label: 'Analytics' },
    ],
    care: '$49',
    cta: 'Choose Business',
    popular: true,
  },
  {
    name: 'Pro',
    price: 'From $2,799',
    priceNote: 'One-time',
    planValue: 'Pro — $2,799',
    blurb: 'For businesses that need advanced functionality.',
    headline: 'Everything in Business, plus:',
    features: [
      { label: 'High-performance e-commerce', info: 'A fast, high-volume online store built around layout and conversion optimization.' },
      { label: 'Custom functionality and dashboard', info: 'A custom SaaS-style dashboard to track the specific parameters that matter to your business.' },
      { label: 'Advanced integrations', info: 'Connect third-party tools and services to your website.' },
      { label: 'Multiple locations' },
      { label: 'Custom workflows', info: 'Automated, business-specific processes built around how you actually operate.' },
      { label: 'Complex payment flows', info: 'Subscriptions, deposits, and multi-step or conditional checkout.' },
    ],
    care: '$99',
    cta: 'Talk to Us',
    popular: false,
  },
]

// Same spotlight-tilt card treatment as the index pricing (components/
// PricingCards.tsx): cursor-driven 3D rotate + a soft white radial spotlight,
// the dark highlighted middle card (#1C1D24) between two light bg-base cards,
// green check marks, and the shared click-to-open FeatureTooltip. Data + CTAs
// (plan-select dispatch) stay letsbuild-specific.
function PricingCard({ tier, index }: { tier: Tier; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [4, -4])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-4, 4])
  const spotX = useTransform(smoothX, [-0.5, 0.5], [0, 100])
  const spotY = useTransform(smoothY, [-0.5, 0.5], [0, 100])
  const spotBg = useMotionTemplate`radial-gradient(circle at ${spotX}% ${spotY}%, rgba(255,255,255,0.10) 0%, transparent 55%)`

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  const hl = tier.popular

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' } as Transition}
      viewport={{ once: true, margin: '-80px' }}
      className={`relative flex flex-col rounded-3xl cursor-default ${
        hl
          ? 'px-8 py-12 bg-[#1C1D24] text-white shadow-[0_24px_64px_rgba(0,0,0,0.5)] ring-1 ring-[#D46FC8]/30'
          : 'p-8 bg-base text-ink shadow-[0_16px_56px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.07]'
      }`}
    >
      <motion.div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: spotBg }} aria-hidden="true" />

      {tier.popular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 font-body text-xs font-semibold text-ink">
          Most Popular
        </span>
      )}

      <div className="relative mb-6">
        <p className={`font-body text-sm font-medium mb-2 ${hl ? 'text-white/50' : 'text-muted'}`}>{tier.name}</p>
        <div className="mb-2 flex items-end gap-2">
          <span className="font-display text-5xl font-semibold tracking-tight">{tier.price}</span>
          <span className={`mb-2 font-body text-sm ${hl ? 'text-white/50' : 'text-muted'}`}>{tier.priceNote}</span>
        </div>
        <span
          className={`we-pill-orange inline-flex items-center self-start whitespace-nowrap rounded-full font-body font-semibold text-white ${
            hl ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs'
          }`}
        >
          Pay 50% to start
        </span>
      </div>

      <ul className="relative mb-8 flex flex-1 flex-col gap-3">
        {tier.headline && <li className={`font-body text-sm font-bold ${hl ? 'text-white/80' : 'text-ink'}`}>{tier.headline}</li>}
        {tier.features.map(f => (
          <li key={f.label} className="flex items-start gap-2.5">
            <Check size={15} className="mt-0.5 flex-shrink-0 text-[#34C759]" aria-hidden="true" />
            <span className={`font-body text-sm ${hl ? 'text-white/80' : 'text-ink'}`}>
              {f.label}
              {f.info && (
                <>
                  {' '}
                  <FeatureTooltip text={f.info} dark={hl} />
                </>
              )}
            </span>
          </li>
        ))}
      </ul>

      <div className={`relative mb-6 border-t pt-4 ${hl ? 'border-white/10' : 'border-hairline'}`}>
        <p className={`font-body text-sm ${hl ? 'text-white/80' : 'text-ink'}`}>+ {tier.care}/month Yele Care</p>
      </div>

      <PlanCTA
        plan={tier.planValue}
        label={tier.cta}
        className={`relative inline-flex w-full cursor-pointer items-center justify-center rounded-full px-6 py-3 font-body text-sm font-medium transition-colors ${
          hl
            ? 'bg-[#F2F0EB] text-[#16161A] hover:bg-[#F8F7F4]'
            : 'bg-[#1A1A1F] text-[#F2F0EB] hover:bg-[#26262C]'
        }`}
      />
    </motion.div>
  )
}

export default function PricingCards() {
  return (
    <div className="grid items-center gap-6 md:grid-cols-3">
      {TIERS.map((tier, i) => (
        <PricingCard key={tier.name} tier={tier} index={i} />
      ))}
    </div>
  )
}

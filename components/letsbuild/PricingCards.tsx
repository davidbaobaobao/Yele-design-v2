'use client'

import { useRef, useState } from 'react'
import { Check, HelpCircle } from 'lucide-react'
import PlanCTA from '@/components/letsbuild/PlanCTA'

type Feature = { label: string; info?: string }

type Tier = {
  name: string
  price: string
  priceNote: string
  planValue: string
  blurb: string
  headline: string | null
  features: Feature[]
  cta: string
  popular: boolean
}

const TIERS: Tier[] = [
  {
    name: 'Launch',
    price: '$599',
    priceNote: '$599 one-time',
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
    cta: 'Choose Launch',
    popular: false,
  },
  {
    name: 'Business',
    price: '$1,199',
    priceNote: '$1,199 one-time',
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
    cta: 'Choose Business',
    popular: true,
  },
  {
    name: 'Pro',
    price: 'From $2,299',
    priceNote: 'From $2,299',
    planValue: 'Pro — $2,299',
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
    cta: 'Talk to Us',
    popular: false,
  },
]

function InfoTip({ info }: { info: string }) {
  return (
    <span className="group/tip relative ml-1 inline-flex align-middle">
      <HelpCircle
        size={13}
        className="text-muted/60 transition-colors group-hover/tip:text-[#D46FC8] cursor-help"
        aria-hidden="true"
      />
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-52 -translate-x-1/2 translate-y-1 rounded-lg bg-ink p-2.5 text-left font-body text-xs leading-snug text-white opacity-0 shadow-xl transition-all duration-200 group-hover/tip:translate-y-0 group-hover/tip:opacity-100"
      >
        {info}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-ink" aria-hidden="true" />
      </span>
    </span>
  )
}

// Cursor-driven 3D tilt + lift + a soft sheen that follows the pointer, for a
// tactile, parallax feel on hover. Falls back to a plain card when the pointer
// leaves (transform resets). Pointer events pass through to the CTA/tooltips.
function TiltCard({ tier }: { tier: Tier }) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')
  const [sheen, setSheen] = useState<{ x: number; y: number; on: boolean }>({ x: 50, y: 50, on: false })

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rx = (0.5 - py) * 6
    const ry = (px - 0.5) * 6
    setTransform(`perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px) scale(1.015)`)
    setSheen({ x: px * 100, y: py * 100, on: true })
  }
  function onLeave() {
    setTransform('')
    setSheen(s => ({ ...s, on: false }))
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transform, transformStyle: 'preserve-3d', transition: 'transform .3s cubic-bezier(0.2,0.6,0.2,1), box-shadow .3s ease' }}
      className={`relative flex flex-col rounded-2xl bg-white p-6 md:p-7 will-change-transform ${
        tier.popular
          ? 'border-2 border-[#D46FC8] shadow-lg shadow-[#D46FC8]/10 hover:shadow-2xl hover:shadow-[#D46FC8]/20'
          : 'border border-hairline hover:shadow-2xl hover:shadow-black/10'
      }`}
    >
      {/* cursor-follow sheen */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          opacity: sheen.on ? 1 : 0,
          background: `radial-gradient(340px circle at ${sheen.x}% ${sheen.y}%, rgba(212,111,200,0.10), transparent 60%)`,
        }}
        aria-hidden="true"
      />

      {tier.popular && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[#D46FC8] px-3 py-1 font-body text-xs font-semibold text-white">
          Most Popular
        </span>
      )}

      <h3 className="font-display text-2xl font-bold text-ink">{tier.name}</h3>
      <div className="mb-3 mt-1">
        <span className="font-display text-3xl font-bold text-ink">{tier.price}</span>
      </div>
      <p className="mb-5 font-body text-sm text-muted">{tier.blurb}</p>

      <ul className="mb-6 flex-1 space-y-2">
        {tier.headline && <li className="font-body text-sm font-semibold text-ink">{tier.headline}</li>}
        {tier.features.map(f => (
          <li key={f.label} className="flex items-start gap-2.5">
            <Check size={16} className="mt-0.5 flex-shrink-0 text-[#D46FC8]" aria-hidden="true" />
            <span className="font-body text-sm text-ink/75">
              {f.label}
              {f.info && <InfoTip info={f.info} />}
            </span>
          </li>
        ))}
      </ul>

      <div className="mb-5 border-t border-hairline pt-4">
        <p className="font-body text-sm font-medium text-ink">{tier.priceNote}</p>
        <p className="font-body text-sm text-ink">+ $49/month Yele Care</p>
      </div>

      <PlanCTA
        plan={tier.planValue}
        label={tier.cta}
        className={`inline-flex w-full cursor-pointer items-center justify-center rounded-xl px-6 py-3 font-body text-base font-medium transition-colors ${
          tier.popular ? 'bg-[#D46FC8] text-white hover:bg-[#DE85D2]' : 'bg-ink text-white hover:bg-ink/90'
        }`}
      />
    </div>
  )
}

export default function PricingCards() {
  return (
    <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
      {TIERS.map(tier => (
        <TiltCard key={tier.name} tier={tier} />
      ))}
    </div>
  )
}

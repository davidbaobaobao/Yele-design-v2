'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, type Transition } from 'framer-motion'
import { Check } from 'lucide-react'
import PlanCTA from '@/components/letsbuild/PlanCTA'
import { FeatureTooltip } from '@/components/PricingCards'
import { getFunnelDict, currencySymbol, type Locale } from '@/lib/i18n/funnel'

// Micro-strings not worth a full dict entry.
// `vat` shows next to EUR prices (Spain/Chinese versions) — website tiers only,
// never Yele Care. Empty for USD.
const MICRO: Record<Locale, { most: string; from: string; vat: string }> = {
  en: { most: 'Most Popular', from: 'from', vat: '' },
  es: { most: 'Más popular', from: 'desde', vat: '+ IVA' },
  zh: { most: '最受欢迎', from: '', vat: '+ IVA' },
}

type Feature = { label: string; info?: string }

type Tier = {
  name: string
  amount: string
  from?: boolean
  planValue: string
  blurb: string
  headline: string | null
  features: Feature[]
  care: string
  cta: string
  popular: boolean
}

// Tier data now comes from the funnel i18n dictionary (lib/i18n/funnel.ts),
// keyed by locale — English is identical to the original hardcoded set.

// Same spotlight-tilt card treatment as the index pricing (components/
// PricingCards.tsx): cursor-driven 3D rotate + a soft white radial spotlight,
// the dark highlighted middle card (#1C1D24) between two light bg-base cards,
// green check marks, and the shared click-to-open FeatureTooltip. Data + CTAs
// (plan-select dispatch) stay letsbuild-specific.
function PricingCard({ tier, index, ctaHref, sym, micro }: { tier: Tier; index: number; ctaHref?: string; sym: string; micro: { most: string; from: string; vat: string } }) {
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
          ? 'px-8 py-12 bg-[#1C1D24] text-white shadow-[0_24px_64px_rgba(0,0,0,0.5)] border-2 border-[#D46FC8]'
          : 'p-8 bg-base text-ink shadow-[0_16px_56px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.07]'
      }`}
    >
      <motion.div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: spotBg }} aria-hidden="true" />

      {tier.popular && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#D46FC8] px-3 py-1 font-body text-xs font-semibold text-white">
          {micro.most}
        </span>
      )}

      <div className="relative mb-6">
        <p className={`font-body text-sm font-medium mb-2 ${hl ? 'text-white/50' : 'text-muted'}`}>{tier.name}</p>
        <div className="mb-2 flex items-end gap-1">
          {tier.from && micro.from && (
            <span className={`mb-2 font-body text-sm ${hl ? 'text-white/50' : 'text-muted'}`}>{micro.from}</span>
          )}
          <span className={`mb-1 font-body text-2xl font-semibold ${hl ? 'text-white/60' : 'text-muted'}`}>{sym}</span>
          <span className="font-display text-5xl font-semibold tracking-tight">{tier.amount}</span>
          {micro.vat && (
            <span className={`mb-2 font-body text-sm ${hl ? 'text-white/50' : 'text-muted'}`}>{micro.vat}</span>
          )}
        </div>
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

      {(() => {
        const ctaClass = `relative inline-flex w-full cursor-pointer items-center justify-center rounded-full px-6 py-3 font-body text-sm font-medium transition-colors ${
          hl ? 'bg-[#F2F0EB] text-[#16161A] hover:bg-[#F8F7F4]' : 'bg-[#1A1A1F] text-[#F2F0EB] hover:bg-[#26262C]'
        }`
        // When ctaHref is set (index / services), the card CTA is a plain link
        // to the flow. On /letsbuild (no ctaHref) it stays a PlanCTA that
        // pre-selects the tier in the hero form via the shared event.
        return ctaHref ? (
          <a href={ctaHref} className={ctaClass}>
            {tier.cta}
          </a>
        ) : (
          <PlanCTA plan={tier.planValue} label={tier.cta} className={ctaClass} />
        )
      })()}
    </motion.div>
  )
}

export default function PricingCards({ ctaHref, locale = 'en' }: { ctaHref?: string; locale?: Locale } = {}) {
  const tiers = getFunnelDict(locale).pricing.tiers as Tier[]
  const sym = currencySymbol(locale)
  const micro = MICRO[locale]
  return (
    <div className="grid items-center gap-6 md:grid-cols-3">
      {tiers.map((tier, i) => (
        <PricingCard key={tier.name} tier={tier} index={i} ctaHref={ctaHref} sym={sym} micro={micro} />
      ))}
    </div>
  )
}

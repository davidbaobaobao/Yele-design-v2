import { Check } from 'lucide-react'
import { FeatureTooltip, type Feature } from '@/components/PricingCards'

// Below-fold pricing section shared by /websites and /newwebsite (identical
// on both) — dynamically imported so this isn't part of the initial
// hero/form bundle. Feature copy + tooltips match components/PricingCards.tsx's
// Starter/Pro plans exactly (Basic = Starter, "Everything in Starter"
// reworded to "Basic" to match this page's own plan name).
const PLANS: { name: string; price: number; highlight?: boolean; features: Feature[] }[] = [
  {
    name: 'Basic',
    price: 99,
    features: [
      { text: 'Functional website, no page limit' },
      { text: 'Custom domain' },
      { text: 'Control panel — update your content' },
      { text: 'On-page SEO & indexing' },
      { text: 'Custom email' },
      {
        text: 'Media creation — basic',
        tooltip:
          "We create all the required videos and image content so your website looks stunning and unlike anyone else's.",
      },
      { text: '24/7 support' },
    ],
  },
  {
    name: 'Pro',
    price: 169,
    highlight: true,
    features: [
      { text: 'Everything in Basic, plus:' },
      { text: 'Branding', tooltip: 'Company brand modernization and revamp.' },
      { text: 'Payment system', tooltip: 'Accept payments for your products.' },
      { text: 'Calendar & reservations' },
      {
        text: 'Periodic redesign of website elements',
        tooltip: 'Every three months, different elements can be readjusted or redesigned.',
      },
      {
        text: 'Media creation — Advanced',
        tooltip: 'Up to 1 video + 20 images per month, on demand.',
      },
      { text: 'Advanced SEO optimization' },
      { text: 'AI Intelligent Chatbot' },
    ],
  },
]

export default function PricingSection() {
  return (
    <section className="px-6 py-14 md:py-20">
      <div className="max-w-md md:max-w-3xl mx-auto">
        <h2 className="font-display font-bold text-3xl text-white text-center mb-2">Pricing</h2>
        <p className="font-body text-base text-white/60 text-center mb-10">
          Pick a plan. We design your site. You pay only once it&apos;s live.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-2xl p-6 ${
                plan.highlight
                  ? 'bg-[#1C1D24] ring-1 ring-[#D46FC8]/40 shadow-[0_16px_48px_rgba(212,111,200,0.12)]'
                  : 'bg-white/5 ring-1 ring-white/10'
              }`}
            >
              <p className="font-body text-sm font-medium text-white/50 mb-2">{plan.name}</p>
              <div className="flex items-end gap-1 mb-3">
                <span className="font-body text-xl font-semibold text-white/60">$</span>
                <span className="font-display font-bold text-4xl text-white tracking-tight">{plan.price}</span>
                <span className="font-body text-sm text-white/50 mb-1">/mo</span>
              </div>
              <span className="self-start we-pill-orange font-body font-semibold text-xs text-white rounded-full px-3 py-1 mb-5">
                Pay when it&apos;s live
              </span>

              <ul className="flex-1 space-y-2.5 mb-6">
                {plan.features.map(feat => {
                  const isHeader = feat.text.includes('plus:')
                  return (
                    <li key={feat.text} className="flex items-start gap-2.5">
                      {!isHeader && <Check size={15} className="mt-0.5 flex-shrink-0 text-[#34C759]" aria-hidden="true" />}
                      <span className={`font-body text-sm text-white/80 ${isHeader ? 'font-bold' : ''}`}>
                        {feat.text}
                        {feat.tooltip && (
                          <>
                            {' '}
                            <FeatureTooltip text={feat.tooltip} dark />
                          </>
                        )}
                      </span>
                    </li>
                  )
                })}
              </ul>

              <a
                href="#lead-form"
                className="w-full inline-flex items-center justify-center font-body font-medium text-base bg-[#D46FC8] hover:bg-[#DE85D2] text-white px-6 py-3 rounded-xl transition-colors"
              >
                Let&apos;s start
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'
import { Check } from 'lucide-react'

export const metadata = {
  title: 'Thanks — Yele',
  robots: { index: false, follow: false },
}

const NEXT_STEPS = [
  'Secure your spot in our calendar.',
  'Choose your plan, make your initial payment.',
  'We’ll get started on your website right away.',
]

// Half of the one-time build price (50% to start). Kept as display strings so
// the confirmation reads cleanly; the full tiers/prices live on /letsbuild.
const TIERS = [
  {
    name: 'Launch',
    desc: 'Everything to get online professionally.',
    pay: 'Pay $350',
    href: '/signup?plan=launch',
    popular: false,
  },
  {
    name: 'Business',
    desc: 'More functionality for growing businesses.',
    pay: 'Pay $600',
    href: '/signup?plan=business',
    popular: true,
  },
  {
    name: 'Pro',
    desc: 'Advanced functionality and e-commerce.',
    pay: 'Pay from $1,400',
    href: '/signup?plan=pro',
    popular: false,
  },
]

// Thank-you landing after a successful lead-form submit. `name` arrives as a
// query param from the form redirect; React escapes it as plain JSX text.
export default function ReceivedPage({
  searchParams,
}: {
  searchParams: { name?: string; email?: string; company?: string }
}) {
  const rawName = searchParams.name?.trim() ?? ''
  const firstName = rawName.split(/\s+/)[0]
  const name = firstName.length > 0 && firstName.length <= 40 ? firstName : ''

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="max-w-4xl w-full">
        <Link href="/" className="inline-flex items-center mb-10 focus-visible:outline-none" aria-label="yele">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG, Next's image optimizer refuses to serve those */}
          <img src="/media/logomedia/mainlogo.svg" alt="" className="h-8 w-auto" />
        </Link>

        <h1 className="font-display font-bold text-5xl md:text-6xl text-ink tracking-tight leading-tight mb-3">
          {name ? <>You are in, {name}!</> : <>You are in!</>}
        </h1>
        <p className="font-body text-muted text-xl leading-relaxed mb-12">
          We will contact you briefly.
        </p>

        <div className="border-t border-hairline pt-10">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-ink tracking-tight mb-6">
            Don&apos;t want to wait?
          </h2>

          <ul className="space-y-3 mb-10">
            {NEXT_STEPS.map(step => (
              <li key={step} className="flex items-start gap-3">
                <Check size={20} className="text-[#D46FC8] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="font-body text-base md:text-lg text-ink/80">{step}</span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIERS.map(tier => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl bg-white p-6 ${
                  tier.popular ? 'border-2 border-[#D46FC8] shadow-lg shadow-[#D46FC8]/10' : 'border border-hairline'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#D46FC8] px-3 py-1 font-body text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display font-bold text-xl text-ink">{tier.name}</h3>
                <p className="font-body text-sm text-muted mt-1 mb-5 flex-1">{tier.desc}</p>
                <Link
                  href={tier.href}
                  className={`inline-flex w-full items-center justify-center rounded-xl px-6 py-3 font-body text-base font-medium transition-colors ${
                    tier.popular ? 'bg-[#D46FC8] text-white hover:bg-[#DE85D2]' : 'bg-ink text-white hover:bg-ink/90'
                  }`}
                >
                  {tier.pay}
                </Link>
              </div>
            ))}
          </div>

          <p className="font-body text-sm text-muted mt-6">
            Pay 50% now to secure your spot — the remaining 50% is due at launch. Then Yele Care from $49/month.
          </p>
        </div>

        <div className="mt-10">
          <Link href="/" className="font-body text-base text-muted hover:text-ink transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

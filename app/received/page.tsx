import Link from 'next/link'
import PayButton from '@/components/received/PayButton'

export const metadata = {
  title: 'Thanks — Yele',
  robots: { index: false, follow: false },
}

const NEXT_STEPS = [
  'Secure your spot in our calendar.',
  'Choose your plan, make your initial payment.',
  'Tell us about your business.',
  'We’ll get started on your website right away.',
]

// Half of the one-time build price (50% to start). Kept as display strings so
// the confirmation reads cleanly; the full tiers/prices live on /letsbuild.
const TIERS = [
  {
    name: 'Launch',
    desc: 'Everything to get online professionally.',
    pay: 'Pay $349',
    plan: 'launch',
    popular: false,
  },
  {
    name: 'Business',
    desc: 'More functionality for growing businesses.',
    pay: 'Pay $599',
    plan: 'business',
    popular: true,
  },
  {
    name: 'Pro',
    desc: 'Advanced functionality and e-commerce.',
    pay: 'Pay $1,399',
    plan: 'pro',
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
  const email = searchParams.email?.trim() ?? ''
  const company = searchParams.company?.trim() ?? ''
  const firstName = rawName.split(/\s+/)[0]
  const name = firstName.length > 0 && firstName.length <= 40 ? firstName : ''

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="max-w-4xl w-full">
        <Link href="/" className="inline-flex items-center mb-10 focus-visible:outline-none" aria-label="yele">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG, Next's image optimizer refuses to serve those */}
          <img src="/media/logomedia/mainlogo.svg" alt="" className="h-8 w-auto" />
        </Link>

        <h1 className="font-display font-bold text-3xl md:text-4xl text-ink tracking-tight leading-tight mb-2">
          {name ? <>You are in, {name}!</> : <>You are in!</>}
        </h1>
        <p className="font-body text-muted text-lg leading-relaxed mb-12">
          We will contact you briefly.
        </p>

        <div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-ink tracking-tight mb-6">
            Don&apos;t want to wait?
          </h2>

          <ol className="space-y-2 mb-10">
            {NEXT_STEPS.map((step, i) => (
              <li key={step} className="group flex items-start gap-3 rounded-xl p-2 -mx-2 transition-colors hover:bg-black/[0.03]">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#D46FC8]/15 text-[#D46FC8] font-display font-bold text-sm flex items-center justify-center transition-all duration-300 group-hover:bg-[#D46FC8] group-hover:text-white group-hover:scale-110">
                  {i + 1}
                </span>
                <span className="font-body text-base md:text-lg text-ink/80 pt-0.5 transition-colors group-hover:text-ink">{step}</span>
              </li>
            ))}
          </ol>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIERS.map(tier => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl bg-white p-6 transition-shadow ${
                  tier.popular
                    ? 'border-2 border-[#D46FC8] shadow-xl shadow-[#D46FC8]/15'
                    : 'border border-ink/15 shadow-lg shadow-black/[0.08] hover:shadow-xl hover:shadow-black/[0.12]'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#D46FC8] px-3 py-1 font-body text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display font-bold text-xl text-ink">{tier.name}</h3>
                <p className="font-body text-sm text-muted mt-1 mb-5 flex-1">{tier.desc}</p>
                <PayButton
                  plan={tier.plan}
                  name={rawName}
                  email={email}
                  company={company}
                  label={tier.pay}
                  popular={tier.popular}
                />
              </div>
            ))}
          </div>

          <p className="font-body text-sm text-muted mt-6">
            Pay 50% now to secure your spot — the remaining 50% is due at launch. Then Yele Care for $49/month.
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

import Link from 'next/link'
import PayButton from '@/components/received/PayButton'

export const metadata = {
  title: 'Welcome — Yele',
  robots: { index: false, follow: false },
}

type Tier = {
  plan: 'launch' | 'business' | 'pro'
  name: string
  price: string
  care: string
  pay: string
  desc: string
  dark: boolean
}

const TIERS: Tier[] = [
  {
    plan: 'launch',
    name: 'Launch',
    price: '$699',
    care: '$49',
    pay: '$349',
    desc: 'Everything a small business needs to get online professionally — a custom design, mobile-optimized, with your own domain, contact forms and SEO indexing.',
    dark: false,
  },
  {
    plan: 'business',
    name: 'Business',
    price: '$1,199',
    care: '$49',
    pay: '$599',
    desc: 'More power for growing businesses — calendar booking, secure payments, small e-commerce, conversion optimization, a blog and detailed analytics.',
    dark: false,
  },
  {
    plan: 'pro',
    name: 'Pro',
    price: 'From $2,799',
    care: '$99',
    pay: '$1,399',
    desc: 'Advanced functionality and high-performance e-commerce — custom dashboards, third-party integrations, multiple locations and complex workflows.',
    dark: true,
  },
]

const STEPS = [
  {
    n: 1,
    title: 'Pay and secure your spot',
    body: "Start now by paying 50%. This locks in your project and reserves your place in our schedule — we'll start working on it right away.",
    cards: true,
  },
  {
    n: 2,
    title: 'Tell us about your business',
    body: 'A short survey so we understand your exact needs for the website before we design anything.',
    cards: false,
  },
  {
    n: 3,
    title: 'First proposal under 72h',
    body: "We'll build a functional demo of your website as a starting point, then review all the changes needed together.",
    cards: false,
  },
  {
    n: 4,
    title: 'Go live',
    body: 'Approve, pay the remaining 50%, and we launch your website — Yele Care keeps everything running smoothly afterwards.',
    cards: false,
  },
]

function TierCard({ tier, name, email, company }: { tier: Tier; name: string; email: string; company: string }) {
  return (
    <div
      className={`flex flex-col rounded-2xl p-6 shadow-lg ${
        tier.dark ? 'bg-[#0D0E12] text-white shadow-black/30' : 'bg-white text-ink border border-ink/15 shadow-black/[0.08]'
      }`}
    >
      <h4 className={`font-display text-xl font-bold ${tier.dark ? 'text-white' : 'text-ink'}`}>{tier.name}</h4>
      <div className="mt-1 flex items-end gap-1.5">
        <span className={`font-display text-3xl font-bold ${tier.dark ? 'text-white' : 'text-ink'}`}>{tier.price}</span>
        <span className={`mb-1 font-body text-sm ${tier.dark ? 'text-white/55' : 'text-muted'}`}>one-time</span>
      </div>
      <p className={`mt-1 font-body text-sm ${tier.dark ? 'text-white/70' : 'text-muted'}`}>+ {tier.care}/mo Yele Care</p>
      <p className={`mt-4 mb-6 flex-1 font-body text-sm leading-relaxed ${tier.dark ? 'text-white/75' : 'text-ink/75'}`}>
        {tier.desc}
      </p>
      <PayButton plan={tier.plan} name={name} email={email} company={company} label={`Pay ${tier.pay}`} popular={tier.dark} />
    </div>
  )
}

export default function ReceivedPage({
  searchParams,
}: {
  searchParams: { name?: string; email?: string; company?: string; plan?: string }
}) {
  const rawName = searchParams.name?.trim() ?? ''
  const email = searchParams.email?.trim() ?? ''
  const company = searchParams.company?.trim() ?? ''
  const firstName = rawName.split(/\s+/)[0]
  const name = firstName.length > 0 && firstName.length <= 40 ? firstName : ''

  const plan = (searchParams.plan ?? '').trim()
  const selected = TIERS.filter(t => t.plan === plan)
  const shownTiers = selected.length > 0 ? selected : TIERS
  const single = shownTiers.length === 1

  return (
    <div className="min-h-screen bg-white flex justify-center px-6 py-16">
      <div className="max-w-4xl w-full">
        <Link href="/" className="inline-flex items-center mb-10 focus-visible:outline-none" aria-label="yele">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG, Next's image optimizer refuses to serve those */}
          <img src="/media/logomedia/mainlogo.svg" alt="" className="h-8 w-auto" />
        </Link>

        <h1 className="font-display font-bold text-4xl md:text-5xl text-ink tracking-tight leading-tight mb-3">
          {name ? <>Welcome {name}, let&apos;s start with your website.</> : <>Welcome, let&apos;s start with your website.</>}
        </h1>
        <p className="font-body text-muted text-lg mb-10">Next steps:</p>

        <ol className="space-y-8">
          {STEPS.map(step => (
            <li key={step.n} className="flex gap-4">
              <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#D46FC8]/15 text-[#D46FC8] font-display font-bold flex items-center justify-center">
                {step.n}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-xl text-ink mb-1">{step.title}</h3>
                <p className="font-body text-base text-ink/75 leading-relaxed max-w-2xl">{step.body}</p>

                {step.cards && (
                  <div className={`mt-5 grid gap-4 ${single ? 'max-w-sm' : 'grid-cols-1 md:grid-cols-3'}`}>
                    {shownTiers.map(tier => (
                      <TierCard key={tier.plan} tier={tier} name={rawName} email={email} company={company} />
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>

        <p className="font-body text-sm text-muted mt-10">
          You pay 50% now to secure your spot — the remaining 50% is due at launch. Then Yele Care from $49/month.
        </p>

        <div className="mt-8">
          <Link href="/" className="font-body text-base text-muted hover:text-ink transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

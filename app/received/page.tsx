import Link from 'next/link'
import TierCard, { type Tier } from '@/components/received/TierCard'
import ReceivedCalEmbed from '@/components/received/ReceivedCalEmbed'

export const metadata = {
  title: 'Welcome — Yele',
  robots: { index: false, follow: false },
}

const TIERS: Tier[] = [
  {
    plan: 'launch',
    name: 'Launch',
    price: '$699',
    care: '$49',
    pay: '$349',
    desc: 'A functional, modern website — mobile-optimized, with your own domain, contact forms and SEO.',
    dark: false,
  },
  {
    plan: 'business',
    name: 'Business',
    price: '$1,199',
    care: '$49',
    pay: '$599',
    desc: 'A functional, modern website with advanced payments and scheduling capabilities.',
    dark: false,
  },
  {
    plan: 'pro',
    name: 'Pro',
    price: '$2,799',
    from: true,
    care: '$99',
    pay: '$1,399',
    desc: 'A functional, modern website with advanced functionality and high-performance applications.',
    dark: true,
  },
]

const STEPS = [
  {
    n: 1,
    title: 'Tell us about your business',
    body: 'A short survey so we understand your exact needs for the website before we design anything.',
  },
  {
    n: 2,
    title: 'First proposal under 72h',
    body: "We'll build a functional demo of your website as a starting point, then review all the changes needed together.",
  },
  {
    n: 3,
    title: 'Go live',
    body: 'Approve, pay the remaining 50%, and we launch your website — Yele Care keeps everything running smoothly afterwards.',
  },
]

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
          {name ? <>Welcome {name}!</> : <>Welcome!</>}
        </h1>
        <p className="font-body text-ink/75 text-lg md:text-xl mb-8">
          Let&apos;s book a 10-min call to get started with your website.
        </p>

        {/* ---- Booking calendar ---- */}
        <div className="h-[480px] md:h-[500px] w-full overflow-hidden rounded-2xl border border-hairline mb-10">
          <ReceivedCalEmbed name={rawName} email={email} />
        </div>

        {/* ---- Don't want to wait? Pay 50% now ---- */}
        <div className="border-t border-hairline pt-12">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-ink tracking-tight mb-2">
            Don&apos;t want to wait?
          </h2>
          <p className="font-body text-base text-ink/75 leading-relaxed max-w-2xl mb-6">
            Start right now. Pay 50% and secure your spot. This locks in your project and reserves your place in our
            schedule — we&apos;ll start working on it right away.
          </p>
          <div className={`grid items-start gap-4 [perspective:1200px] ${single ? 'max-w-sm' : 'grid-cols-1 md:grid-cols-3'}`}>
            {shownTiers.map(tier => (
              <TierCard key={tier.plan} tier={tier} name={rawName} email={email} company={company} />
            ))}
          </div>
        </div>

        {/* ---- Next steps ---- */}
        <div className="mt-16">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-ink tracking-tight mb-6">Next steps</h2>
          <ol className="space-y-4">
            {STEPS.map(step => (
              <li key={step.n} className="group flex gap-4 rounded-2xl p-3 -mx-3 transition-all duration-300 hover:bg-black/[0.03] hover:translate-x-1">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#D46FC8]/15 text-[#D46FC8] font-display font-bold flex items-center justify-center transition-all duration-300 group-hover:bg-[#D46FC8] group-hover:text-white group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#D46FC8]/30">
                  {step.n}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-xl text-ink mb-1 transition-colors duration-300 group-hover:text-[#D46FC8]">{step.title}</h3>
                  <p className="font-body text-base text-ink/75 leading-relaxed max-w-2xl">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
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

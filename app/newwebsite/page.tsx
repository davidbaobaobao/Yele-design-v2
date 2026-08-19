import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Check } from 'lucide-react'
import LeadForm from '@/components/LeadForm'
import FAQ from '@/components/FAQ'
import LogoMarquee from '@/components/LogoMarquee'
import { EnLangProvider } from '@/components/LangProvider'

// Below-fold, heavier sections — code-split so they don't weigh down the
// initial hero/form paint, same pattern components/HomePage.tsx uses for
// its own below-fold sections.
const Showcase = dynamic(() => import('@/components/Showcase'))

// Meta-ads-only landing page — a deliberate near-duplicate of /websites
// (same hero/form/marquee/how-it-works/pricing/carousel/CTA/FAQ, same
// copy/layout/styling) so Meta traffic gets its own dedicated page whose
// form submit does NOT fire Google Ads' onboarding_form_submit conversion
// — only <LeadForm platform="meta"> below differs from /websites' own
// <LeadForm platform="google"> (the default). noindex,nofollow since this
// is intentionally duplicate content of /websites, not a page meant to
// rank on its own — see metadata.robots below.
export const metadata: Metadata = {
  title: "Let's start with your new website",
  description:
    'See the final product before paying. No setup fee, cancel anytime. Our agency takes care of everything — get your website built in about a week.',
  alternates: {
    canonical: 'https://yele.design/newwebsite',
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yele.design/newwebsite',
    siteName: 'Yele',
    title: "Let's start with your new website | Yele",
    description: 'See the final product before paying. No setup fee, cancel anytime.',
  },
}

const KEY_POINTS = [
  'See the final product before paying',
  'No setup fee, cancel anytime',
  'Our agency takes care of everything',
]

const STEPS: { n: number; title: string; desc: string; pill: string }[] = [
  {
    n: 1,
    title: 'Tell us your direction',
    desc: "A 2-minute design survey (or a quick call if you'd rather talk).",
    pill: '~2 min',
  },
  {
    n: 2,
    title: 'We design',
    desc: "We design your first draft for your business. Then, from your feedback, we improve it until you're satisfied.",
    pill: '~1 week',
  },
  {
    n: 3,
    title: 'You approve',
    desc: "It goes live — and that's the day of your first payment. Nothing before.",
    pill: 'Days, not months',
  },
  {
    n: 4,
    title: 'We keep improving it',
    desc: 'Constant support and updates on design and functionality.',
    pill: '∞ Ongoing',
  },
]

// Full feature lists — matches components/PricingCards.tsx's Starter/Pro
// plans exactly (Basic = Starter, "Everything in Starter" reworded to
// "Basic" to match this page's own plan name). Tooltips from the main
// site's cards aren't reproduced here — just the bullet text itself, per
// "don't shorten them."
const PLANS: { name: string; price: number; highlight?: boolean; features: string[] }[] = [
  {
    name: 'Basic',
    price: 99,
    features: [
      'Functional website, no page limit',
      'Custom domain',
      'Control panel — update your content',
      'On-page SEO & indexing',
      'Custom email',
      'Media creation — basic',
      '24/7 support',
    ],
  },
  {
    name: 'Pro',
    price: 169,
    highlight: true,
    features: [
      'Everything in Basic, plus:',
      'Branding',
      'Payment system',
      'Calendar & reservations',
      'Periodic redesign of website elements',
      'Media creation — Advanced',
      'Advanced SEO optimization',
      'AI Intelligent Chatbot',
    ],
  },
]

// Reused components (Showcase, FAQ) read the active language from
// LanguageContext via useLang() — without this, they'd render whatever the
// global default resolves to instead of the English copy this page needs
// (WhyYele doesn't use lang context, but wrapping everything is simplest
// and harmless for it).
export default function NewWebsitePage() {
  return (
    <EnLangProvider>
      <main style={{ backgroundColor: '#0D0E12' }}>
      {/* ---- 1+2: Hero + lead form ---- */}
      <section className="px-6 pt-10 pb-14 md:pt-16 md:pb-20">
        <div className="max-w-md mx-auto">
          <Link href="/" className="inline-flex items-center mb-8 focus-visible:outline-none" aria-label="yele">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG, Next's image optimizer refuses to serve those */}
            <img src="/media/logomedia/mainlogo.svg" alt="" className="h-8 w-auto" />
          </Link>

          <h1 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-[1.08] mb-5">
            Let&apos;s start with your new website
          </h1>

          <ul className="space-y-2.5 mb-8">
            {KEY_POINTS.map(point => (
              <li key={point} className="flex items-start gap-2.5">
                <Check size={18} className="text-[#D46FC8] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="font-body text-base font-semibold text-white/90">{point}</span>
              </li>
            ))}
          </ul>

          {/* platform="meta" — the one intentional difference from
              /websites: fires the Meta Pixel "Lead" event instead of
              Google Ads' onboarding_form_submit. See components/LeadForm.tsx. */}
          <LeadForm variant="dark" ctaLabel="Let's start" id="lead-form" platform="meta" />

          <div className="text-center mt-4">
            <Link
              href="/schedule"
              className="font-body text-sm text-white/60 hover:text-white transition-colors underline underline-offset-4"
            >
              Prefer to talk? Book a free 10-min intro call
            </Link>
          </div>
        </div>
      </section>

      {/* ---- 2b: Logo marquee — reuses the homepage's, already dark-bg self-contained. ---- */}
      <LogoMarquee />

      {/* ---- 3: How it works — white bg, black text, larger type ---- */}
      <section className="px-6 py-14 md:py-20 bg-white">
        <div className="max-w-md md:max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-ink text-center mb-10">How it works</h2>
          <div className="space-y-8">
            {STEPS.map(step => (
              <div key={step.n} className="flex gap-4">
                <span
                  className="flex-shrink-0 w-11 h-11 rounded-full bg-[#D46FC8] text-white font-display font-bold text-lg flex items-center justify-center"
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <div className="flex-1 pt-1.5">
                  <p className="font-display font-bold text-ink text-xl mb-1.5">{step.title}</p>
                  <p className="font-body font-normal text-ink/80 text-lg leading-relaxed mb-3">{step.desc}</p>
                  <span className="inline-block font-mono text-xs font-medium uppercase tracking-wide text-[#D46FC8] bg-[#D46FC8]/10 border border-[#D46FC8]/30 rounded-full px-3 py-1">
                    {step.pill}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- 4: Pricing ---- */}
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
                  {plan.features.map(f => {
                    const isHeader = f.includes('plus:')
                    return (
                      <li key={f} className="flex items-start gap-2.5">
                        {!isHeader && <Check size={15} className="mt-0.5 flex-shrink-0 text-[#34C759]" aria-hidden="true" />}
                        <span className={`font-body text-sm text-white/80 ${isHeader ? 'font-bold' : ''}`}>{f}</span>
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

      {/* ---- 5a: Carousel — reuses the homepage's Showcase carousel, black bg ---- */}
      <section style={{ backgroundColor: '#0D0E12' }} className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-6 mb-8 md:mb-12">
          <h2 className="font-display font-semibold text-3xl md:text-4xl text-white tracking-tight">
            Built for your industry
          </h2>
        </div>
        <Showcase noHeader fullScreen dark />
      </section>

      {/* ---- 5b: "Let's start" CTA band ---- */}
      <section className="bg-white px-6 py-16 md:py-20 text-center">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-ink mb-6">Ready to get started?</h2>
        <a
          href="#lead-form"
          className="inline-flex items-center justify-center font-body font-semibold text-lg bg-[#D46FC8] hover:bg-[#DE85D2] text-white px-10 py-4 rounded-full transition-colors"
        >
          Let&apos;s start
        </a>
      </section>

      {/* ---- 5c: FAQ — reuses the homepage FAQ, white bg / dark text ---- */}
      <div style={{ backgroundColor: '#FFFFFF' }}>
        <FAQ noBg />
      </div>
      </main>
    </EnLangProvider>
  )
}

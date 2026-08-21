import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Check } from 'lucide-react'
import LeadForm from '@/components/LeadForm'
import ReputationBadge from '@/components/ReputationBadge'
import { EnLangProvider } from '@/components/LangProvider'

// Below-fold, heavier sections — code-split so none of this weighs down
// the initial hero/form bundle, which is what this page's LCP (and its
// conversion path) actually depends on. Everything below the fold can
// arrive in its own chunk once the browser gets to it.
const LogoMarquee = dynamic(() => import('@/components/LogoMarquee'))
const HowItWorks = dynamic(() => import('@/components/websites/HowItWorks'))
const PricingSection = dynamic(() => import('@/components/websites/PricingSection'))
const Showcase = dynamic(() => import('@/components/Showcase'))
const CTABand = dynamic(() => import('@/components/websites/CTABand'))
const FAQ = dynamic(() => import('@/components/FAQ'))

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
            <img src="/media/logomedia/mainlogo.svg" alt="" width={102} height={32} className="h-8 w-auto" />
          </Link>

          <h1 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-[1.08] mb-5">
            Let&apos;s start with your new website
          </h1>

          <ul className="space-y-2.5 mb-6">
            {KEY_POINTS.map(point => (
              <li key={point} className="flex items-start gap-2.5">
                <Check size={18} className="text-[#D46FC8] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="font-body text-base font-semibold text-white/90">{point}</span>
              </li>
            ))}
          </ul>

          <ReputationBadge className="mb-8" />

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
      <HowItWorks />

      {/* ---- 4: Pricing ---- */}
      <PricingSection />

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
      <CTABand />

      {/* ---- 5c: FAQ — reuses the homepage FAQ, white bg / dark text ---- */}
      <div style={{ backgroundColor: '#FFFFFF' }}>
        <FAQ noBg />
      </div>
      </main>
    </EnLangProvider>
  )
}

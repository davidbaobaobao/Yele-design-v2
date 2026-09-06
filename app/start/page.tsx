import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import LeadForm from '@/components/LeadForm'
import ReputationBadge from '@/components/ReputationBadge'
import PricingCards from '@/components/letsbuild/PricingCards'
import LetsBuildFAQ from '@/components/letsbuild/LetsBuildFAQ'
import { EnLangProvider } from '@/components/LangProvider'

export const metadata: Metadata = {
  title: 'Get a custom website from $699 | Yele',
  description:
    'Custom design and imagery, delivery under 4 weeks. Websites from $699 + Yele Care from $49/month. Pay 50% to start, 50% at launch.',
  alternates: { canonical: 'https://yele.design/start' },
}

const KEY_POINTS = [
  'From $699',
  'No tasteless templates',
  'No DIY — we build everything for you',
  'Delivery under 4 weeks',
]

const PLAN_OPTIONS = ['Launch — $699', 'Business — $1,199', 'Pro — $2,799']

const DARK = '#0D0E12'

// Organic funnel landing — same hero form + pricing flow as /letsbuild, but
// NOT an ads landing: the Meta Pixel Lead event is disabled here
// (trackMeta={false}); the Google Ads onboarding conversion still fires.
export default function StartPage() {
  return (
    <EnLangProvider>
      <main style={{ backgroundColor: DARK }}>
        {/* ---- HERO + quick lead form ---- */}
        <section className="min-h-[100svh] flex flex-col justify-center px-6 md:px-12 pt-20 pb-10 md:pt-24 md:pb-16">
          <div className="mx-auto w-full max-w-md md:max-w-5xl">
            <div className="md:grid md:grid-cols-2 md:gap-14 md:items-center">
              {/* LEFT — logo, headline, key points, trust badge */}
              <div>
                <Link href="/" className="inline-flex items-center mb-3 md:mb-6 focus-visible:outline-none" aria-label="yele">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/media/logomedia/mainlogo.svg" alt="" width={102} height={32} className="h-6 md:h-8 w-auto" />
                </Link>

                <h1 className="font-display font-bold text-[26px] md:text-4xl lg:text-5xl text-white tracking-tight leading-[1.05] mb-2.5 md:mb-5">
                  Let&apos;s build your website
                </h1>

                <ul className="space-y-1 md:space-y-2.5 mb-3.5 md:mb-7">
                  {KEY_POINTS.map(point => (
                    <li key={point} className="flex items-start gap-2.5">
                      <Check size={16} className="text-[#D46FC8] flex-shrink-0 mt-0.5 md:mt-1" aria-hidden="true" />
                      <span className="font-body text-sm md:text-base font-semibold text-white/90">{point}</span>
                    </li>
                  ))}
                </ul>

                <ReputationBadge className="mb-3.5 md:mb-0" />
              </div>

              {/* RIGHT — quick lead form (Meta tracking off) */}
              <div className="md:ml-auto md:w-full md:max-w-md">
                <LeadForm variant="dark" ctaLabel="Let's start" id="lead-form" planOptions={PLAN_OPTIONS} trackMeta={false} />

                <div className="text-center mt-2.5">
                  <Link href="/schedule" className="font-body text-sm text-white/60 hover:text-white transition-colors underline underline-offset-4">
                    Prefer to talk? Book a free 10-min intro call
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- PRICING (white, index-style cards) ---- */}
        <section id="pricing" className="bg-white px-6 pt-20 md:pt-28 pb-16 md:pb-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-ink tracking-tight text-center mb-10 md:mb-14">
              Pricing
            </h2>
            <PricingCards />

            <p className="max-w-2xl mx-auto text-center font-body text-base text-muted mt-10 leading-relaxed">
              Pay 50% at the beginning and the remaining 50% at launch.
              <br />
              Then Yele Care makes sure everything works and updated — for $49/month.
            </p>
          </div>
        </section>

        {/* ---- FAQ ---- */}
        <LetsBuildFAQ />
      </main>
    </EnLangProvider>
  )
}

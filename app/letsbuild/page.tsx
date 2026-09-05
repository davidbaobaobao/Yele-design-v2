import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Check, Search, Image as ImageIcon, Megaphone, Bot, PhoneCall, Zap, FilePlus2, RefreshCw, Wrench } from 'lucide-react'
import LeadForm from '@/components/LeadForm'
import ReputationBadge from '@/components/ReputationBadge'
import PlanCTA from '@/components/letsbuild/PlanCTA'
import CareVideo from '@/components/letsbuild/CareVideo'
import { EnLangProvider } from '@/components/LangProvider'

// Below-fold, heavier sections — code-split so the initial hero/form bundle
// (the LCP + conversion path) stays light, same pattern as /websites.
const LogoMarquee = dynamic(() => import('@/components/LogoMarquee'))
const LatestFeaturedWork = dynamic(() => import('@/components/LatestFeaturedWork'))
const LetsBuildFAQ = dynamic(() => import('@/components/letsbuild/LetsBuildFAQ'))
const BuildLeadForm = dynamic(() => import('@/components/letsbuild/BuildLeadForm'))

export const metadata: Metadata = {
  title: 'Get a custom website from $599 | Yele',
  description:
    'Custom design and imagery, delivery under 4 weeks, our agency takes care of everything. Websites from $599 + Yele Care from $49/month. Pay 50% to start, 50% at launch.',
  alternates: { canonical: 'https://yele.design/letsbuild' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yele.design/letsbuild',
    siteName: 'Yele',
    title: 'Get a custom website from $599 | Yele',
    description: 'Custom design. Delivery under 4 weeks. From $599 + $49/mo Yele Care. 50% to start.',
  },
}

const KEY_POINTS = [
  'From $599',
  'No templates. Custom design and imagery',
  'Delivery under 4 weeks',
  'Our agency takes care of everything',
]

// Plan-interest pills shown in the hero form; the pricing CTAs dispatch these
// exact values to pre-select the matching pill.
const PLAN_OPTIONS = ['Launch — $599', 'Business — $1,199', 'Pro — $2,299']

const TIERS = [
  {
    name: 'Launch',
    price: '$599',
    priceNote: '$599 one-time',
    planValue: 'Launch — $599',
    blurb: 'Everything most small businesses need to get online professionally.',
    headline: null as string | null,
    features: [
      'Custom website design',
      'Mobile optimization',
      'Custom domain',
      'Contact and forms',
      'SEO and Google indexing',
      'Professional image and video content',
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
      'Calendar booking',
      'Payment acceptance',
      'Small e-commerce',
      'Conversion optimization',
      'Blog',
      'Analytics',
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
    headline: 'Large e-commerce, plus:',
    features: [
      'Custom functionality and dashboard',
      'Advanced integrations',
      'Multiple locations',
      'Custom workflows',
      'Complex payment flows',
      'Business-specific solutions',
    ],
    cta: 'Talk to Us',
    popular: false,
  },
]

const CARE_INCLUDES = [
  'Website hosting',
  'Domain renewal when required',
  'SSL and security',
  'Backups',
  'Uptime monitoring',
  'Technical maintenance',
  'Bug fixes',
  'Support',
]

const STEPS = [
  { n: '1', title: 'Tell us about your business', body: 'Complete our short form and tell us what your business does, what you need, and what you want your website to achieve.' },
  { n: '2', title: 'Pay 50% to get started', body: 'We begin designing and building your website. You only pay the remaining 50% once your website is ready and approved for launch.' },
  { n: '3', title: 'Review your website', body: "We'll show you the website and make the agreed revisions before launch." },
  { n: '4', title: 'Go live', body: 'Once approved, we launch your new website and Yele Care keeps everything running afterwards.' },
]

const ACTIONS = [
  'Call your business',
  'Request a quote',
  'Book an appointment',
  'Send an enquiry',
  'Visit your location',
  'Buy a product',
  'Contact you on WhatsApp',
]

const SEO_ITEMS = [
  'SEO-friendly structure',
  'Page titles and descriptions',
  'Heading structure',
  'Image optimization',
  'Sitemap',
  'Google indexing setup',
  'Mobile optimization',
  'Performance optimization',
  'Google Analytics setup',
]

const GROW = [
  { icon: Search, title: 'SEO', body: 'Improve your visibility on Google and attract more organic customers.' },
  { icon: ImageIcon, title: 'Content & Media', body: 'Images, promotional graphics, website content, and videos for your business.' },
  { icon: Megaphone, title: 'Google & Meta Ads', body: 'Campaign setup, conversion tracking, optimization, and ongoing advertising management.' },
  { icon: Bot, title: 'AI Chat', body: 'Add an AI assistant to your website that answers questions, captures leads, and helps customers.' },
  { icon: PhoneCall, title: 'AI Phone Receptionist', body: 'Answer calls 24/7, qualify leads, book appointments, and handle common customer questions.' },
  { icon: Zap, title: 'Business Automations', body: 'Automate lead follow-ups, reminders, review requests, CRM workflows, and repetitive tasks.' },
]

const WHY = [
  { title: 'Affordable', body: 'Professional websites starting from $599.' },
  { title: 'Transparent', body: 'Clear pricing with no confusing agency quotes.' },
  { title: 'Custom', body: 'Designed around your business rather than simply changing a logo on a generic template.' },
  { title: 'Supported', body: 'We stay with you after launch through Yele Care.' },
  { title: 'Built for growth', body: 'Add SEO, advertising, content, AI, and automation as your business grows.' },
]

const DARK = '#0D0E12'

export default function LetsBuildPage() {
  return (
    <EnLangProvider>
      <main style={{ backgroundColor: DARK }}>
        {/* ---- HERO + quick lead form — sized to fit one viewport (desktop + mobile) ---- */}
        <section className="min-h-[100svh] flex flex-col justify-center px-6 py-4">
          <div className="max-w-md mx-auto w-full">
            <Link href="/" className="inline-flex items-center mb-3 focus-visible:outline-none" aria-label="yele">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/logomedia/mainlogo.svg" alt="" width={102} height={32} className="h-6 w-auto" />
            </Link>

            <h1 className="font-display font-bold text-[26px] md:text-4xl text-white tracking-tight leading-[1.05] mb-2.5">
              Let&apos;s build your website
            </h1>

            <ul className="space-y-1 mb-3">
              {KEY_POINTS.map(point => (
                <li key={point} className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#D46FC8] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-body text-sm md:text-base font-semibold text-white/90">{point}</span>
                </li>
              ))}
            </ul>

            <ReputationBadge className="mb-3.5" />

            <LeadForm variant="dark" ctaLabel="Let's start" id="lead-form" planOptions={PLAN_OPTIONS} />

            <div className="text-center mt-2.5">
              <Link href="/schedule" className="font-body text-sm text-white/60 hover:text-white transition-colors underline underline-offset-4">
                Prefer to talk? Book a free 10-min intro call
              </Link>
            </div>
          </div>
        </section>

        {/* ---- TRUST MARQUEE ---- */}
        <LogoMarquee />

        {/* ---- LATEST FEATURED WORK (index gallery, always dark, one screen) ---- */}
        <LatestFeaturedWork forceDark />

        {/* ---- PRICING (white) + YELE CARE follows directly, no gap ---- */}
        <section className="bg-white px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-ink tracking-tight text-center mb-10 md:mb-14">
              Pricing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              {TIERS.map(tier => (
                <div
                  key={tier.name}
                  className={`relative rounded-2xl p-6 md:p-7 flex flex-col bg-white ${
                    tier.popular ? 'border-2 border-[#D46FC8] shadow-lg shadow-[#D46FC8]/10' : 'border border-hairline'
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D46FC8] text-white font-body text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-display font-bold text-2xl text-ink">{tier.name}</h3>
                  <div className="mt-1 mb-3">
                    <span className="font-display font-bold text-3xl text-ink">{tier.price}</span>
                  </div>
                  <p className="font-body text-sm text-muted mb-5">{tier.blurb}</p>

                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.headline && (
                      <li className="font-body text-sm font-semibold text-ink">{tier.headline}</li>
                    )}
                    {tier.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check size={16} className="text-[#D46FC8] flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="font-body text-sm text-ink/75">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-hairline pt-4 mb-5">
                    <p className="font-body text-sm text-ink font-medium">{tier.priceNote}</p>
                    <p className="font-body text-sm text-ink">+ $49/month Yele Care</p>
                  </div>

                  <PlanCTA
                    plan={tier.planValue}
                    label={tier.cta}
                    className={`w-full inline-flex items-center justify-center font-body font-medium text-base px-6 py-3 rounded-xl transition-colors cursor-pointer ${
                      tier.popular
                        ? 'bg-[#D46FC8] hover:bg-[#DE85D2] text-white'
                        : 'bg-ink hover:bg-ink/90 text-white'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Yele Care — follows the tiers directly, no divider */}
            <div className="mt-10 md:mt-12">
              <div className="text-center mb-8 md:mb-10">
                <h3 className="font-display font-bold text-2xl md:text-3xl text-ink tracking-tight">
                  Looked after with Yele Care — <span className="text-[#D46FC8]">$49/month</span>
                </h3>
                <p className="font-body text-base text-muted mt-2">
                  Permanent attention that keeps everything working — for $49/month.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-hairline p-6">
                  <CareVideo webm="/media/beyond/SEO_hq.webm" mp4="/media/beyond/SEO_hq.mp4" poster="/media/beyond/SEO_poster.jpg" />
                  <div className="flex items-center gap-2 mb-1.5">
                    <FilePlus2 size={18} className="text-[#D46FC8] flex-shrink-0" aria-hidden="true" />
                    <h4 className="font-display font-bold text-lg text-ink">Content updates</h4>
                  </div>
                  <p className="font-body text-sm text-muted leading-relaxed">
                    We help you add new content — new projects, new photos, new menu items, whatever your business needs.
                  </p>
                </div>
                <div className="rounded-2xl border border-hairline p-6">
                  <CareVideo webm="/media/beyond/ADS_hq.webm" mp4="/media/beyond/ADS_hq.mp4" poster="/media/beyond/ADS_poster.jpg" />
                  <div className="flex items-center gap-2 mb-1.5">
                    <RefreshCw size={18} className="text-[#D46FC8] flex-shrink-0" aria-hidden="true" />
                    <h4 className="font-display font-bold text-lg text-ink">Yearly website redesign</h4>
                  </div>
                  <p className="font-body text-sm text-muted leading-relaxed">
                    A full design refresh every year, so your website is <span className="text-ink font-semibold">never</span> outdated.
                  </p>
                </div>
                <div className="rounded-2xl border border-hairline p-6">
                  <CareVideo webm="/media/whyyele3/whyyele5.webm" mp4="/media/whyyele3/whyyele5.mp4" poster="/media/whyyele3/whyyele5_poster.jpg" />
                  <div className="flex items-center gap-2 mb-1.5">
                    <Wrench size={18} className="text-[#D46FC8] flex-shrink-0" aria-hidden="true" />
                    <h4 className="font-display font-bold text-lg text-ink">Maintenance &amp; management</h4>
                  </div>
                  <p className="font-body text-sm text-muted leading-relaxed mb-3">
                    All the technical work handled so your site stays online, secure and running correctly.
                  </p>
                  <ul className="flex flex-wrap gap-x-3 gap-y-1">
                    {CARE_INCLUDES.map(item => (
                      <li key={item} className="font-body text-xs text-muted flex items-center gap-1">
                        <Check size={12} className="text-[#D46FC8]" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- HOW IT WORKS (dark) ---- */}
        <section className="px-6 py-16 md:py-24 border-t border-white/10" style={{ backgroundColor: DARK }}>
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/50 mb-3">How it works</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-10">
              From idea to live website in four simple steps.
            </h2>
            <div className="space-y-8">
              {STEPS.map(step => (
                <div key={step.n} className="flex gap-5">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D46FC8]/15 text-[#D46FC8] font-display font-bold flex items-center justify-center">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-xl text-white mb-1">{step.title}</h3>
                    <p className="font-body text-base text-white/70 leading-relaxed max-w-2xl">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <a href="#build-form" className="inline-flex items-center justify-center font-body font-medium text-base bg-[#D46FC8] hover:bg-[#DE85D2] text-white px-7 py-3.5 rounded-xl transition-colors">
                Start My Website
              </a>
            </div>
          </div>
        </section>

        {/* ---- BUILT TO GENERATE BUSINESS ---- */}
        <section className="px-6 py-16 md:py-24 border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/50 mb-3">Built to generate business</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-3">
              Your website should do more than look good.
            </h2>
            <p className="font-body text-base text-white/70 mb-8">
              Every Yele website is built around helping visitors take action.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {ACTIONS.map(a => (
                <div key={a} className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#D46FC8] flex-shrink-0 mt-1" aria-hidden="true" />
                  <span className="font-body text-base text-white/80">{a}</span>
                </div>
              ))}
            </div>
            <p className="font-body text-base text-white/60 mt-8">Your website should make the next step obvious.</p>
          </div>
        </section>

        {/* ---- INCLUDED SEO ---- */}
        <section className="px-6 py-16 md:py-24 border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/50 mb-3">Included SEO</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-3">
              SEO-ready from day one.
            </h2>
            <p className="font-body text-base text-white/70 mb-8">
              Every website includes the technical SEO foundations needed to give search engines a clear understanding of your website.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {SEO_ITEMS.map(a => (
                <div key={a} className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#D46FC8] flex-shrink-0 mt-1" aria-hidden="true" />
                  <span className="font-body text-base text-white/80">{a}</span>
                </div>
              ))}
            </div>
            <p className="font-body text-sm text-white/45 mt-8">
              Ongoing SEO campaigns, content creation, local SEO, and ranking work are available separately.
            </p>
          </div>
        </section>

        {/* ---- MORE THAN WEBSITES ---- */}
        <section className="px-6 py-16 md:py-24 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/50 mb-3">More than websites</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-3">
              Grow with Yele when you&apos;re ready.
            </h2>
            <p className="font-body text-base text-white/70 mb-10">
              Your website is only the beginning. As your business grows, Yele can also help with:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {GROW.map(s => {
                const Icon = s.icon
                return (
                  <div key={s.title} className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
                    <Icon size={24} className="text-[#D46FC8] mb-4" aria-hidden="true" />
                    <h3 className="font-display font-bold text-lg text-white mb-2">{s.title}</h3>
                    <p className="font-body text-sm text-white/70 leading-relaxed">{s.body}</p>
                  </div>
                )
              })}
            </div>
            <p className="font-body text-base text-white/60 mt-8">Add these services whenever your business needs them.</p>
          </div>
        </section>

        {/* ---- WHY BUSINESSES CHOOSE YELE ---- */}
        <section className="px-6 py-16 md:py-24 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/50 mb-3">Why businesses choose Yele</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-10">
              Professional without the traditional agency price.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHY.map(w => (
                <div key={w.title}>
                  <h3 className="font-display font-bold text-xl text-white mb-1">{w.title}</h3>
                  <p className="font-body text-base text-white/70 leading-relaxed">{w.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- PAYMENT ---- */}
        <section className="px-6 py-16 md:py-24 border-t border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/50 mb-3">Payment</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-6">
              You don&apos;t pay everything upfront.
            </h2>
            <div className="font-body text-base md:text-lg text-white/80 space-y-2">
              <p>Pay 50% to begin your project.</p>
              <p>Review your completed website.</p>
              <p>Pay the remaining 50% when you approve it for launch.</p>
              <p>Then Yele Care begins at $49/month.</p>
              <p className="text-[#D46FC8] font-semibold pt-2">Simple.</p>
            </div>
          </div>
        </section>

        {/* ---- FAQ ---- */}
        <LetsBuildFAQ />

        {/* ---- LEAD FORM (detailed) ---- */}
        <section id="build-form" className="px-6 py-16 md:py-24" style={{ backgroundColor: DARK }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-2">
              Ready for a better website?
            </h2>
            <p className="font-body text-base text-white/70 mb-8">
              Tell us a little about your business and we&apos;ll recommend the right website package.
            </p>
            <BuildLeadForm />
          </div>
        </section>

        {/* ---- FINAL CTA ---- */}
        <section className="px-6 py-20 md:py-28 border-t border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight mb-5">
              Your business deserves a website that looks professional.
            </h2>
            <p className="font-body text-base md:text-lg text-white/70 leading-relaxed mb-2">
              Get a custom website without paying traditional agency prices.
            </p>
            <p className="font-body text-base text-white/60 mb-8">
              Websites from $599. Yele Care from $49/month. 50% to start. 50% when you&apos;re ready to launch.
            </p>
            <a href="#build-form" className="inline-flex items-center justify-center font-body font-medium text-base bg-[#D46FC8] hover:bg-[#DE85D2] text-white px-8 py-4 rounded-xl transition-colors">
              Start My Website
            </a>
            <p className="font-body text-sm text-white/45 mt-8">
              Professional websites. Affordable pricing. Ongoing support.
            </p>
          </div>
        </section>
      </main>
    </EnLangProvider>
  )
}

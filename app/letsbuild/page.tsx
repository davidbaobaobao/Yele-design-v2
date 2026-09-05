import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Check, Search, Image as ImageIcon, Megaphone, Bot, PhoneCall, Zap } from 'lucide-react'
import LeadForm from '@/components/LeadForm'
import ReputationBadge from '@/components/ReputationBadge'
import { EnLangProvider } from '@/components/LangProvider'

// Below-fold, heavier sections — code-split so the initial hero/form bundle
// (the LCP + conversion path) stays light, same pattern as /websites.
const LogoMarquee = dynamic(() => import('@/components/LogoMarquee'))
const Showcase = dynamic(() => import('@/components/Showcase'))
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
  'No templates. Custom design and imagery',
  'Delivery under 4 weeks',
  'Our agency takes care of everything',
]

const TIERS = [
  {
    name: 'Launch',
    price: '$599',
    priceNote: '$599 one-time',
    blurb: 'Everything most small businesses need to get online professionally.',
    features: [
      'Custom website design',
      'All standard pages needed for your business',
      'Mobile and tablet optimization',
      'Contact and lead forms',
      'Call and WhatsApp buttons',
      'Basic booking/calendar integration',
      'Google Maps and social links',
      'SEO foundation',
      'Meta titles and descriptions',
      'Google indexing setup',
      'Analytics setup',
      'Basic image and visual creation',
      'Domain connection',
      'Launch support',
    ],
    cta: 'Choose Launch',
    popular: false,
  },
  {
    name: 'Business',
    price: '$1,299',
    priceNote: '$1,299 one-time',
    blurb: 'For businesses that want their website to do more than simply look good.',
    features: [
      'Everything in Launch, plus:',
      'More customized design',
      'Conversion-focused page structure',
      'Advanced forms',
      'Advanced booking',
      'Payments and deposits',
      'Blog or CMS',
      'CRM integrations',
      'Marketing pixels and conversion tracking',
      'More advanced content and visual support',
      'Additional business integrations',
      'More complex customer journeys',
    ],
    cta: 'Choose Business',
    popular: true,
  },
  {
    name: 'Pro',
    price: 'From $2,299',
    priceNote: 'From $2,299',
    blurb: 'For businesses that need advanced functionality.',
    features: [
      'Everything in Business, plus:',
      'E-commerce',
      'Advanced booking systems',
      'Custom functionality',
      'Advanced integrations',
      'Multiple locations',
      'Membership features',
      'Multilingual websites',
      'Custom workflows',
      'Advanced CMS functionality',
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
  'Small text and image updates',
  'Annual website health and design review',
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
        {/* ---- HERO + quick lead form ---- */}
        <section className="px-6 pt-10 pb-14 md:pt-16 md:pb-20">
          <div className="max-w-md mx-auto">
            <Link href="/" className="inline-flex items-center mb-8 focus-visible:outline-none" aria-label="yele">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/logomedia/mainlogo.svg" alt="" width={102} height={32} className="h-8 w-auto" />
            </Link>

            <h1 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-[1.08] mb-5">
              Let&apos;s build your website
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

            <LeadForm variant="dark" ctaLabel="Let's start" id="lead-form" />

            <div className="text-center mt-4">
              <Link href="/schedule" className="font-body text-sm text-white/60 hover:text-white transition-colors underline underline-offset-4">
                Prefer to talk? Book a free 10-min intro call
              </Link>
            </div>
          </div>
        </section>

        {/* ---- TRUST MARQUEE ---- */}
        <LogoMarquee />

        {/* ---- PRICING ---- */}
        <section className="px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 md:mb-14">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/50 mb-3">Pricing</p>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight">
                One-time build. $49/month support.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              {TIERS.map(tier => (
                <div
                  key={tier.name}
                  className={`relative rounded-2xl p-6 md:p-7 flex flex-col ${
                    tier.popular
                      ? 'bg-white/[0.06] border border-[#D46FC8]/50'
                      : 'bg-white/[0.03] border border-white/10'
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D46FC8] text-white font-body text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-display font-bold text-2xl text-white">{tier.name}</h3>
                  <div className="mt-1 mb-3">
                    <span className="font-display font-bold text-3xl text-white">{tier.price}</span>
                  </div>
                  <p className="font-body text-sm text-white/60 mb-5">{tier.blurb}</p>

                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.features.map((f, i) => (
                      <li key={f} className="flex items-start gap-2.5">
                        {i === 0 && f.startsWith('Everything') ? (
                          <span className="font-body text-sm font-semibold text-white/90">{f}</span>
                        ) : (
                          <>
                            <Check size={16} className="text-[#D46FC8] flex-shrink-0 mt-0.5" aria-hidden="true" />
                            <span className="font-body text-sm text-white/75">{f}</span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-white/10 pt-4 mb-5">
                    <p className="font-body text-sm text-white">{tier.priceNote}</p>
                    <p className="font-body text-sm text-[#D46FC8]">+ $49/month Yele Care</p>
                  </div>

                  <a
                    href="#build-form"
                    className={`w-full inline-flex items-center justify-center font-body font-medium text-base px-6 py-3 rounded-xl transition-colors ${
                      tier.popular
                        ? 'bg-[#D46FC8] hover:bg-[#DE85D2] text-white'
                        : 'bg-white hover:bg-white/90 text-ink'
                    }`}
                  >
                    {tier.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- YELE CARE ---- */}
        <section className="px-6 py-16 md:py-24 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/50 mb-3">Yele Care</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-4">
              We don&apos;t disappear after your website launches.
            </h2>
            <p className="font-body text-base md:text-lg text-white/70 leading-relaxed mb-2">
              Every Yele website is supported by Yele Care for <span className="text-white font-semibold">$49/month</span>. We keep your website online, secure, updated, and working properly so you don&apos;t have to worry about it. Yearly design update so your website is never outdated.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-8">
              {CARE_INCLUDES.map(item => (
                <div key={item} className="flex items-start gap-2.5">
                  <Check size={16} className="text-[#D46FC8] flex-shrink-0 mt-1" aria-hidden="true" />
                  <span className="font-body text-base text-white/80">{item}</span>
                </div>
              ))}
            </div>

            <p className="font-body text-sm text-white/45 mt-8">
              Major redesigns, new functionality, and larger website changes are quoted separately.
            </p>
          </div>
        </section>

        {/* ---- HOW IT WORKS ---- */}
        <section className="bg-white px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted mb-3">How it works</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-ink tracking-tight mb-10">
              From idea to live website in four simple steps.
            </h2>
            <div className="space-y-8">
              {STEPS.map(step => (
                <div key={step.n} className="flex gap-5">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D46FC8]/10 text-[#D46FC8] font-display font-bold flex items-center justify-center">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-xl text-ink mb-1">{step.title}</h3>
                    <p className="font-body text-base text-muted leading-relaxed max-w-2xl">{step.body}</p>
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

        {/* ---- LATEST PROJECTS ---- */}
        <section style={{ backgroundColor: DARK }} className="py-14 md:py-20">
          <div className="max-w-6xl mx-auto px-6 mb-8 md:mb-12">
            <h2 className="font-display font-semibold text-3xl md:text-4xl text-white tracking-tight">Latest projects</h2>
          </div>
          <Showcase noHeader fullScreen dark />
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

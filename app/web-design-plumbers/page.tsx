import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ComoFunciona from '@/components/ComoFunciona'
import Precios from '@/components/Precios'
import FAQClient from '@/components/FAQClient'
import type { FAQItem } from '@/components/FAQClient'

export const metadata: Metadata = {
  title: 'Website design for plumbers — get more local jobs',
  description:
    'Professional website for plumbers, live in 1 week. Show up in Google when customers need you. No setup fee, from $99/mo, no commitment.',
  alternates: {
    canonical: 'https://yele.design/web-design-plumbers',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Website design for plumbers — get more local jobs | Yele',
    description:
      'Professional website for plumbers, live in 1 week. No setup fee, from $99/mo, no commitment.',
    url: 'https://yele.design/web-design-plumbers',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Website design for plumbers — Yele' }],
  },
}

const FAQS: FAQItem[] = [
  {
    question: 'I\'m already on Google Maps — do I need a website?',
    answer:
      'Google Maps shows you exist, but a website is what builds trust. It shows your services, your coverage area, your reviews, and your phone number clearly — so customers call you instead of the next result.',
  },
  {
    question: 'I already get leads from Angi and Thumbtack. Why do I need my own site?',
    answer:
      'Those platforms charge per lead and put you in a price war with other plumbers. With your own site, those same customers find you directly — no middleman, no commission.',
  },
  {
    question: 'Will I show up when someone searches "plumber near me"?',
    answer:
      'We build your site with local SEO in mind. We can\'t promise the top spot, but a well-built site is the foundation for ranking where you aren\'t showing up today.',
  },
  {
    question: 'How long does it take and what does it cost?',
    answer: 'Live in 1 week, from $99/mo, no setup fee, no commitment.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://yele.design' },
        { '@type': 'ListItem', position: 2, name: 'Website design for plumbers', item: 'https://yele.design/web-design-plumbers' },
      ],
    },
  ],
}

export default function PlumbersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <main id="main-content" className="bg-white">

        {/* Hero */}
        <section className="pt-32 pb-20 md:pt-44 md:pb-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h1
              className="font-display font-bold text-ink tracking-tighter leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(40px, 5.5vw, 72px)' }}
            >
              Website design for plumbers
            </h1>
            <p className="font-body text-muted text-xl leading-relaxed max-w-2xl mb-10">
              Your professional website, live in 1 week. Show up in Google when someone in your area needs a plumber — and win jobs without paying commission per lead. From $99/mo, no setup fee, no commitment.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 font-body font-medium text-base bg-ink text-white px-7 py-3.5 rounded-2xl hover:bg-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC]"
            >
              Get my website <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* Pillar 1 — Emergency intent */}
        <section className="py-20 md:py-28 bg-base">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-body text-xs tracking-[0.15em] uppercase text-muted mb-4 block">
              Why it matters
            </span>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-ink tracking-tight mb-6 leading-tight">
              Customers search when they have a problem — right now
            </h2>
            <p className="font-body text-muted text-lg leading-relaxed max-w-2xl">
              A burst pipe or a broken water heater doesn&rsquo;t wait. Customers open Google, search &ldquo;plumber near me&rdquo; or their neighborhood name, and call the first result that looks credible. If you don&rsquo;t have a website showing your services, your area, your phone, and your reviews — that job goes to someone else. Not because they&rsquo;re better, but because they&rsquo;re visible.
            </p>
          </div>
        </section>

        {/* Pillar 2 — Lead platforms */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-body text-xs tracking-[0.15em] uppercase text-muted mb-4 block">
              The lead platform trap
            </span>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-ink tracking-tight mb-6 leading-tight">
              Stop paying per lead<br />to Angi and Thumbtack
            </h2>
            <p className="font-body text-muted text-lg leading-relaxed max-w-2xl">
              Angi, Thumbtack, and HomeAdvisor charge you for every contact and pit you against five other plumbers competing on price. With your own site, customers find you directly and call you — no middleman, no commission. The site pays for itself with a couple of jobs a month that used to go to the platform.
            </p>
          </div>
        </section>

        {/* How it works */}
        <ComoFunciona />

        {/* Why Yele */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-body text-xs tracking-[0.15em] uppercase text-muted mb-4 block">
              Why Yele
            </span>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-ink tracking-tight mb-10 leading-tight">
              Basically risk-free to try.
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {([
                { title: 'No setup fee', desc: 'You pay nothing upfront. Your first bill is when your site is live.' },
                { title: 'No commitment', desc: 'Cancel anytime, no penalties.' },
                { title: 'All inclusive', desc: 'Domain, hosting, maintenance, and support. No surprise invoices.' },
                { title: 'Live in 1 week', desc: 'Not two months. In under a week your site is up and running.' },
              ] as const).map(item => (
                <div key={item.title} className="bg-base rounded-2xl p-6">
                  <p className="font-display font-semibold text-ink text-lg mb-2">{item.title}</p>
                  <p className="font-body text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Precios />
        <FAQClient faqs={FAQS} />

        {/* Final CTA */}
        <section className="py-24 md:py-32 bg-ink">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-white tracking-tight mb-5 leading-tight">
              Start winning the jobs<br />you&rsquo;re missing right now.
            </h2>
            <p className="font-body text-muted text-lg mb-10">
              No setup fee. Live in 1 week.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 font-body font-medium text-base bg-white text-ink px-8 py-4 rounded-2xl hover:bg-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC]"
            >
              Get my website <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}

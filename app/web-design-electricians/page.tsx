import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ComoFunciona from '@/components/ComoFunciona'
import Precios from '@/components/Precios'
import FAQClient from '@/components/FAQClient'
import type { FAQItem } from '@/components/FAQClient'

export const metadata: Metadata = {
  title: 'Website design for electricians — more clients from Google',
  description:
    'Professional website for electricians, live in 1 week. Show up in Google when customers search in your area. No setup fee, from $99/mo, no commitment.',
  alternates: {
    canonical: 'https://yele.design/web-design-electricians',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Website design for electricians — more clients from Google | Yele',
    description:
      'Professional website for electricians, live in 1 week. No setup fee, from $99/mo, no commitment.',
    url: 'https://yele.design/web-design-electricians',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Website design for electricians — Yele' }],
  },
}

const FAQS: FAQItem[] = [
  {
    question: 'I\'m on Google Maps already — do I still need a website?',
    answer:
      'Maps shows you exist, but a website builds trust. It shows your services, coverage area, reviews, and license info — the things that make a customer call you instead of the next result.',
  },
  {
    question: 'I get jobs through Angi and HomeAdvisor. Why go direct?',
    answer:
      'Those platforms charge per lead and put you against multiple electricians in the same listing. With your own site, you own the relationship from the first search — no commission, no race to the bottom on price.',
  },
  {
    question: 'Will I rank for "electrician near me"?',
    answer:
      'We build your site with local SEO in mind. No guaranteed rankings, but a properly built site gives you a real chance to show up where you don\'t today.',
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
        { '@type': 'ListItem', position: 2, name: 'Website design for electricians', item: 'https://yele.design/web-design-electricians' },
      ],
    },
  ],
}

export default function ElectriciansPage() {
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
              Website design for electricians
            </h1>
            <p className="font-body text-muted text-xl leading-relaxed max-w-2xl mb-10">
              When someone&rsquo;s power goes out or their panel needs an upgrade, they search Google and call the first electrician who looks credible. Be that electrician — with a professional website live in 1 week. From $99/mo, no setup fee, no commitment.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 font-body font-medium text-base bg-ink text-white px-7 py-3.5 rounded-2xl hover:bg-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC]"
            >
              Get my website <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* Pillar 1 — Trust is non-negotiable */}
        <section className="py-20 md:py-28 bg-base">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-body text-xs tracking-[0.15em] uppercase text-muted mb-4 block">
              Why it matters
            </span>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-ink tracking-tight mb-6 leading-tight">
              Customers don&rsquo;t just want cheap — they want safe
            </h2>
            <p className="font-body text-muted text-lg leading-relaxed max-w-2xl">
              Electrical work is high stakes. Nobody wants to hire an unknown off a list and hope for the best. A website with your license, your services, your coverage area, and real reviews is what turns a searcher into a caller. Without one, you&rsquo;re invisible to the customer who&rsquo;s already decided to hire someone today.
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
              Stop paying per lead<br />on Angi and HomeAdvisor
            </h2>
            <p className="font-body text-muted text-lg leading-relaxed max-w-2xl">
              On those platforms you pay for every contact and compete on price against other electricians in the same listing. With your own site, customers find you directly and call you — no fee, no middleman, and you control the first impression.
            </p>
          </div>
        </section>

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
              Show up when customers<br />need you most.
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

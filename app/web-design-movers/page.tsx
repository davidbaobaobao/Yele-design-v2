import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ComoFunciona from '@/components/ComoFunciona'
import Precios from '@/components/Precios'
import FAQClient from '@/components/FAQClient'
import type { FAQItem } from '@/components/FAQClient'

export const metadata: Metadata = {
  title: 'Website design for moving companies — more direct bookings',
  description:
    'Professional website for movers, live in 1 week. Quote form, service area, and trust signals to get booked direct without paying per lead. From $99/mo.',
  alternates: {
    canonical: 'https://yele.design/web-design-movers',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Website design for moving companies — more direct bookings | Yele',
    description:
      'Get more direct bookings without intermediaries. Live in 1 week, from $99/mo, no setup fee, no commitment.',
    url: 'https://yele.design/web-design-movers',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Website design for moving companies — Yele' }],
  },
}

const FAQS: FAQItem[] = [
  {
    question: 'Can the website show the areas I serve?',
    answer:
      'Yes — we include a service area section so customers know at a glance whether you cover their move.',
  },
  {
    question: 'Can customers request a quote directly from my site?',
    answer:
      'Yes — the site includes a quote request form that comes straight to you, no intermediaries, no commission.',
  },
  {
    question: 'I already use moving lead sites. Why go direct?',
    answer:
      'On those platforms you compete on price and pay per contact. With your own site, customers choose you and reach out directly.',
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
        { '@type': 'ListItem', position: 2, name: 'Website design for moving companies', item: 'https://yele.design/web-design-movers' },
      ],
    },
  ],
}

const TRUST_SIGNALS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Insurance & licensing visible',
    desc: 'Showing your moving insurance and DOT number turns doubters into callers.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    title: 'Real customer reviews',
    desc: 'Google reviews and testimonials make customers trust you with their belongings.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: 'Clear service area',
    desc: 'Customers see immediately whether you cover their move — without having to call and ask.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    title: 'Quote in 24 hours',
    desc: 'A direct form on your site — no middlemen, no commission on that first contact.',
  },
]

export default function MoversPage() {
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
              className="font-outfit font-bold text-[#1D1D1F] tracking-tighter leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(40px, 5.5vw, 72px)' }}
            >
              Website design for moving companies
            </h1>
            <p className="font-manrope text-[#6B7280] text-xl leading-relaxed max-w-2xl mb-10">
              When someone has a move date, they request quotes from several movers the same day and decide fast. If you&rsquo;re not easy to find on Google and don&rsquo;t make it easy to request a quote, you don&rsquo;t even make the shortlist. Professional website live in 1 week. From $99/mo, no setup fee, no commitment.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 font-manrope font-medium text-base bg-[#1D1D1F] text-white px-7 py-3.5 rounded-2xl hover:bg-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC]"
            >
              Get my website <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* Pillar 1 — Speed of decision */}
        <section className="py-20 md:py-28 bg-[#F5F5F7]">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#6B7280] mb-4 block">
              Why it matters
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-6 leading-tight">
              A move is decided<br className="hidden md:block" /> in a single afternoon
            </h2>
            <p className="font-manrope text-[#6B7280] text-lg leading-relaxed max-w-2xl">
              When someone has a move date locked in, they search &ldquo;movers near me&rdquo; or their city name and request quotes from the first companies that look credible. They decide on two things: clear pricing and the confidence that their stuff will be safe. A website with your service area, what&rsquo;s included, and a simple quote button gets you into that shortlist. Without one, you&rsquo;re not even considered.
            </p>
          </div>
        </section>

        {/* Quote form + service area mockup */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#6B7280] mb-4 block">
              Key features
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-4 leading-tight">
              Easy quote request<br className="hidden md:block" /> + service area
            </h2>
            <p className="font-manrope text-[#6B7280] text-base mb-12 max-w-xl">
              Two elements that turn visitors into contacts: a direct form and a clear map of where you operate.
            </p>

            <div className="grid md:grid-cols-2 gap-8">

              {/* Quote form */}
              <div className="bg-[#F5F5F7] rounded-2xl p-8">
                <p className="font-outfit font-semibold text-[#1D1D1F] text-lg mb-6">
                  Request a quote
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Origin city', placeholder: 'e.g. Chicago, IL' },
                    { label: 'Destination city', placeholder: 'e.g. Austin, TX' },
                    { label: 'Approximate move date', placeholder: 'e.g. August 15' },
                    { label: 'Approximate square footage', placeholder: 'e.g. 1,200 sq ft' },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="font-manrope text-[10px] font-semibold uppercase tracking-widest text-[#6B7280] block mb-1">
                        {field.label}
                      </label>
                      <div className="w-full bg-white border border-black/[0.08] rounded-xl px-4 py-3 font-manrope text-sm text-[#6B7280]">
                        {field.placeholder}
                      </div>
                    </div>
                  ))}
                  <div className="mt-2 bg-[#1D1D1F] text-white font-manrope font-medium text-sm rounded-xl px-5 py-3.5 text-center">
                    Request a quote →
                  </div>
                </div>
                <p className="font-manrope text-[10px] text-[#6B7280] mt-4 text-center">
                  Goes straight to your email — no intermediaries.
                </p>
              </div>

              {/* Service area */}
              <div className="bg-[#F5F5F7] rounded-2xl p-8">
                <p className="font-outfit font-semibold text-[#1D1D1F] text-lg mb-2">
                  Service area
                </p>
                <p className="font-manrope text-sm text-[#6B7280] mb-6">
                  Customers see immediately if you cover their move — without having to call.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Chicago, IL', 'Naperville, IL', 'Evanston, IL', 'Oak Park, IL',
                    'Joliet, IL', 'Aurora, IL', 'Gary, IN', 'Hammond, IN',
                    'Kenosha, WI', 'Waukegan, IL',
                  ].map(city => (
                    <span
                      key={city}
                      className="font-manrope text-xs font-medium bg-white border border-black/[0.08] text-[#1D1D1F] px-3 py-1.5 rounded-full"
                    >
                      {city}
                    </span>
                  ))}
                  <span className="font-manrope text-xs text-[#6B7280] px-3 py-1.5">
                    + your custom areas
                  </span>
                </div>
                <p className="font-manrope text-[10px] text-[#6B7280] mt-6">
                  These cities are customized to match the areas where you actually operate.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Pillar 2 — Lead aggregators */}
        <section className="py-20 md:py-28 bg-[#F5F5F7]">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#6B7280] mb-4 block">
              The lead aggregator trap
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-6 leading-tight">
              Stop depending<br className="hidden md:block" /> on moving lead sites
            </h2>
            <p className="font-manrope text-[#6B7280] text-lg leading-relaxed max-w-2xl">
              Moving lead aggregators put you in a price war and charge per contact. With your own site, customers request a quote from you directly — no fee, no middleman, and you own the relationship from the first message.
            </p>
          </div>
        </section>

        {/* Trust signals */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#6B7280] mb-4 block">
              Build trust before the call
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-10 leading-tight">
              Show customers you&rsquo;re<br className="hidden md:block" /> the safe choice
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {TRUST_SIGNALS.map(signal => (
                <div key={signal.title} className="bg-[#F5F5F7] rounded-2xl p-6">
                  <div className="text-[#1D1D1F] mb-3">{signal.icon}</div>
                  <p className="font-outfit font-semibold text-[#1D1D1F] text-base mb-2">{signal.title}</p>
                  <p className="font-manrope text-[#6B7280] text-sm leading-relaxed">{signal.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ComoFunciona />

        {/* Why Yele */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#6B7280] mb-4 block">
              Why Yele
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-10 leading-tight">
              Basically risk-free to try.
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {([
                { title: 'No setup fee', desc: 'You pay nothing upfront. Your first bill is when your site is live.' },
                { title: 'No commitment', desc: 'Cancel anytime, no penalties.' },
                { title: 'All inclusive', desc: 'Domain, hosting, maintenance, and support. No surprise invoices.' },
                { title: 'Live in 1 week', desc: 'Not two months. In under a week your site is up and running.' },
              ] as const).map(item => (
                <div key={item.title} className="bg-[#F5F5F7] rounded-2xl p-6">
                  <p className="font-outfit font-semibold text-[#1D1D1F] text-lg mb-2">{item.title}</p>
                  <p className="font-manrope text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Precios />
        <FAQClient faqs={FAQS} />

        {/* Final CTA */}
        <section className="py-24 md:py-32 bg-[#1D1D1F]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-white tracking-tight mb-5 leading-tight">
              Get on the shortlist<br />for every local move.
            </h2>
            <p className="font-manrope text-[#6B7280] text-lg mb-10">
              No setup fee. Live in 1 week.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 font-manrope font-medium text-base bg-white text-[#1D1D1F] px-8 py-4 rounded-2xl hover:bg-[#F5F5F7] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC]"
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

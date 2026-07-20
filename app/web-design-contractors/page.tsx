import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ComoFunciona from '@/components/ComoFunciona'
import Precios from '@/components/Precios'
import FAQClient from '@/components/FAQClient'
import type { FAQItem } from '@/components/FAQClient'

export const metadata: Metadata = {
  title: 'Website design for contractors — win more bids',
  description:
    'Professional website for contractors and remodelers, live in 1 week. Show your project gallery, win bids, and get direct leads without paying commission. From $99/mo.',
  alternates: {
    canonical: 'https://yele.design/web-design-contractors',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Website design for contractors — win more bids | Yele',
    description:
      'Show your project gallery and win bids without paying commission. Live in 1 week, from $99/mo, no commitment.',
    url: 'https://yele.design/web-design-contractors',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Website design for contractors — Yele' }],
  },
}

const FAQS: FAQItem[] = [
  {
    question: 'Can I show photos of my past projects?',
    answer:
      'Yes — your site includes a project gallery with before and after photos. That&rsquo;s exactly what convinces a customer who\'s comparing multiple contractors.',
  },
  {
    question: 'I have a profile on Houzz and Angi. Why do I need my own site?',
    answer:
      'On those platforms you pay per lead and compete on price. With your own site, customers choose you based on your work and contact you directly — no intermediary, no commission.',
  },
  {
    question: 'Can I update the gallery myself?',
    answer:
      'Yes — from your dashboard you can upload new project photos whenever you want, without touching any code.',
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
        { '@type': 'ListItem', position: 2, name: 'Website design for contractors', item: 'https://yele.design/web-design-contractors' },
      ],
    },
  ],
}

const GALLERY_PROJECTS = [
  {
    label: 'Open kitchen remodel',
    location: 'Austin, TX',
    before: 'https://images.unsplash.com/photo-1755336522640-d821da5826f1?w=800&q=80',
    after:  'https://images.unsplash.com/photo-1682888813913-e13f18692019?w=800&q=80',
  },
  {
    label: 'Full bathroom renovation',
    location: 'Phoenix, AZ',
    before: 'https://images.unsplash.com/photo-1779608993392-a76f7c9ebbda?w=800&q=80',
    after:  'https://images.unsplash.com/photo-1638799869566-b17fa794c4de?w=800&q=80',
  },
  {
    label: 'Full home renovation',
    location: 'Miami, FL',
    before: 'https://images.unsplash.com/photo-1769079453311-df7d01fce172?w=800&q=80',
    after:  'https://images.unsplash.com/photo-1666282167632-c613fbeb163c?w=800&q=80',
  },
]

export default function ContractorsPage() {
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
              Website design for contractors
            </h1>
            <p className="font-manrope text-[#6B7280] text-xl leading-relaxed max-w-2xl mb-10">
              When someone is about to spend thousands on a renovation, they research. If they can&rsquo;t see your work, they hire someone else. Show your projects with a professional website live in 1 week. From $99/mo, no setup fee, no commitment.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 font-manrope font-medium text-base bg-[#1D1D1F] text-white px-7 py-3.5 rounded-2xl hover:bg-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC]"
            >
              Get my website <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* Pillar 1 — Proof + trust */}
        <section className="py-20 md:py-28 bg-[#F5F5F7]">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#6B7280] mb-4 block">
              Why it matters
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-6 leading-tight">
              A renovation isn&rsquo;t decided<br className="hidden md:block" /> in one phone call
            </h2>
            <p className="font-manrope text-[#6B7280] text-lg leading-relaxed max-w-2xl">
              Before hiring a contractor, customers compare for weeks: they look at past projects, read reviews, and judge whether they can trust you with their home and their money. If all you have is an Angi profile, they can&rsquo;t judge you properly. A website with a project gallery — before and after — is what turns a curious visitor into a bid request.
            </p>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#6B7280] mb-4 block">
              Your work speaks for you
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-4 leading-tight">
              Project gallery
            </h2>
            <p className="font-manrope text-[#6B7280] text-base mb-10 max-w-xl">
              Before and after every project. Customers see exactly what to expect from you.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {GALLERY_PROJECTS.map(project => (
                <div key={project.label} className="rounded-2xl overflow-hidden border border-black/[0.06]">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={project.before}
                      alt={`${project.label} — before`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className="absolute top-3 left-3 font-manrope text-[10px] font-semibold tracking-widest uppercase bg-white/90 text-[#6B7280] px-2.5 py-1 rounded-full">
                      Before
                    </span>
                  </div>
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={project.after}
                      alt={`${project.label} — after`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className="absolute top-3 left-3 font-manrope text-[10px] font-semibold tracking-widest uppercase bg-[#1D1D1F]/80 text-white px-2.5 py-1 rounded-full">
                      After
                    </span>
                  </div>
                  <div className="px-4 py-3 bg-white">
                    <p className="font-outfit font-medium text-sm text-[#1D1D1F]">{project.label}</p>
                    <p className="font-manrope text-xs text-[#6B7280] mt-0.5">{project.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pillar 2 — Lead platforms */}
        <section className="py-20 md:py-28 bg-[#F5F5F7]">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#6B7280] mb-4 block">
              The lead platform trap
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-6 leading-tight">
              Stop competing<br className="hidden md:block" /> only on price
            </h2>
            <p className="font-manrope text-[#6B7280] text-lg leading-relaxed max-w-2xl">
              On Angi, Houzz, or HomeAdvisor you pay per contact and enter a price war with four other contractors on the same lead. With your own site and your own gallery, customers choose you for your work — not just your price — and contact you directly, with no commission.
            </p>
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
              Let your work<br />speak for itself.
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

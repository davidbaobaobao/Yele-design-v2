import type { Metadata } from 'next'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { EnLangProvider } from '@/components/LangProvider'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { CTAButton } from '@/components/ui/cta-button'
import PricingCards from '@/components/letsbuild/PricingCards'

const CARE_TIERS = [
  { name: 'Yele Care Lite', price: '$29', image: '/media/services/care_lite.webp', features: ['Hosting', 'Security', 'Backups'], popular: false },
  { name: 'Yele Care', price: '$49', image: '/media/services/care.webp', features: ['A full redesign every year', 'We update your content', 'Monitoring'], popular: true },
  { name: 'Yele Care+', price: '$99', image: '/media/services/care_plus.webp', features: ['Advanced security', 'Backups', 'Monitoring', 'Priority services'], popular: false },
]

export const metadata: Metadata = {
  // No "| Yele" here — the root layout's title.template ('%s | Yele')
  // appends it automatically for every nested route segment (verified:
  // it does NOT apply to app/page.tsx itself, only child segments like
  // this one — matches the convention every other page.tsx in app/ uses).
  title: 'Services & Add-ons',
  description:
    'Essential website packages plus modular add-ons — booking, AI chat, phone receptionist, payments, online store, SEO, media creation and more. Add exactly what you need.',
  alternates: {
    canonical: 'https://yele.design/services',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yele.design/services',
    siteName: 'Yele',
    title: 'Services & Add-ons | Yele',
    description:
      'Essential website packages plus modular add-ons you can add exactly when you need them.',
  },
}

type ServiceItem = {
  name: string
  price: number
  image: string
  includedIn: string | null
  description: string
}

type ServiceCategory = {
  title: string
  items: ServiceItem[]
}

// Suggested order (highest-intent first) within each category.
const CATEGORIES: ServiceCategory[] = [
  {
    title: 'Automation & AI',
    items: [
      {
        name: 'Smart Booking',
        price: 29,
        image: 'smartbooking.jpeg',
        includedIn: 'Pro & Frontier',
        description:
          "Let clients book appointments directly from your site. Syncs in real time with your Google Calendar or Outlook so you're never double-booked, with automatic confirmations and reminders.",
      },
      {
        name: 'AI Chat Assistant',
        price: 29,
        image: 'aichatassistant.jpeg',
        includedIn: 'Pro & Frontier',
        description:
          'A smart assistant that answers visitor questions instantly, 24/7. Give it a personality and a goal — capture leads, book calls, or guide buyers to a decision. Includes 100,000 tokens/month (~500 conversations); $5 per additional 100,000.',
      },
      {
        name: 'AI Phone Receptionist',
        price: 59,
        image: 'aiphonereceptionist.jpeg',
        includedIn: 'Frontier',
        description:
          'A next-generation AI that answers your inbound calls 24/7 and handles multiple simultaneous calls at once — never a busy signal, never a missed customer. Give it a personality and a strategy: answer questions, book appointments, even upsell. Calls billed per minute (~$0.20–$0.50/min depending on complexity), adjustable on demand.',
      },
    ],
  },
  {
    title: 'Sales & Payments',
    items: [
      {
        name: 'Online Payments',
        price: 49,
        image: 'onlinepayments.jpeg',
        includedIn: 'Pro & Frontier',
        description:
          'Accept payments right on your site — one-time or recurring subscriptions. Powered by Stripe with support for all major cards, and secure PCI-compliant checkout.',
      },
      {
        name: 'Online Store',
        price: 69,
        image: 'onlinestore.jpeg',
        includedIn: 'Pro & Frontier',
        description:
          'A full digital storefront to sell physical or digital products and services. Product catalog, cart, and secure checkout — everything you need to start selling online.',
      },
    ],
  },
  {
    title: 'Growth & Marketing',
    items: [
      {
        name: 'Advanced SEO',
        price: 49,
        image: 'advancedseo.jpeg',
        includedIn: 'Pro & Frontier',
        description:
          'Hands-on, ongoing SEO. We fine-tune your ranking factors every week to help you climb Google and get found by more of the right local customers.',
      },
      {
        name: 'Google Ads Management',
        price: 69,
        image: 'googleadsmanagement.jpeg',
        includedIn: 'Frontier',
        description:
          'We create, manage and continuously optimize your Google Ads — ad creation, keyword management, and conversion optimization to get more from every click. Ad spend billed separately.',
      },
      {
        name: 'Marketing Campaign',
        price: 199,
        image: 'marketingcampaign.jpeg',
        includedIn: 'Frontier',
        description:
          'One complete campaign each month — a long-form video plus supporting images and copy, formatted for every social platform. From idea to launch, built around a single goal.',
      },
    ],
  },
  {
    title: 'Content & Media',
    items: [
      {
        name: 'Media Creation',
        price: 99,
        image: 'mediacreation.jpeg',
        includedIn: 'Pro & Frontier',
        description:
          'Professional content on demand every month: 1 video (up to 10s, up to 3 revisions) and 20 images (unlimited revisions). From concept to final cut — dialed in on look, style and cinematic feel.',
      },
      {
        name: 'Media Creation Plus',
        price: 199,
        image: 'mediacreationplus.jpeg',
        includedIn: 'Frontier',
        description:
          'For brands that need volume: 4 videos (up to 10s each, up to 3 revisions) and 80 images (unlimited revisions) every month, with full creative direction from concept to polished result.',
      },
      {
        name: 'Content & Articles',
        price: 39,
        image: 'contentarticles.jpeg',
        includedIn: 'Frontier',
        description:
          'One high-quality, SEO-optimized article for your business each month. Includes topic research, custom images and media, and keyword optimization to grow your search visibility.',
      },
    ],
  },
]

function ServiceCard({ item }: { item: ServiceItem }) {
  return (
    <div className="relative flex flex-col rounded-2xl border border-hairlineDark bg-[#16171C] overflow-hidden">
      <div className="relative w-full aspect-[16/9]">
        <Image
          src={`/media/services/${item.image}`}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
        />
      </div>

      <div className="flex flex-col flex-1 p-6">
        {item.includedIn && (
          <span className="font-body text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/30 text-white bg-white/10 whitespace-nowrap self-start mb-5">
            Included in {item.includedIn}
          </span>
        )}

        <h3 className="font-display text-lg text-bone mb-2">{item.name}</h3>
        <p className="font-body text-sm leading-relaxed text-white/60 flex-1 mb-6">{item.description}</p>

        <CTAButton href="/start" variant="white" className="text-xs px-5 py-2.5 self-start">
          Get started
        </CTAButton>
      </div>
    </div>
  )
}

export default function ServicesPage() {
  return (
    <EnLangProvider>
      <Nav />
      <main id="main-content" data-nav-dark style={{ backgroundColor: '#0D0E12' }}>
        {/* ---- Section 1: Essential Packages (exact homepage pricing cards) ---- */}
        <section className="relative pt-32 pb-24 px-6" style={{ backgroundColor: '#0D0E12' }}>
          <div
            className="pointer-events-none absolute inset-0 z-0"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(ellipse 480px 420px at 15% 30%, rgba(212,111,200,0.2), transparent 70%), ' +
                'radial-gradient(ellipse 560px 480px at 50% 20%, rgba(212,111,200,0.26), transparent 70%), ' +
                'radial-gradient(ellipse 480px 420px at 85% 30%, rgba(212,111,200,0.2), transparent 70%)',
              filter: 'blur(70px)',
            }}
          />
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h1
                className="font-display font-semibold text-bone tracking-tight mb-4"
                style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
              >
                Essential packages
              </h1>
              <p className="font-body text-lg text-white/60 max-w-xl mx-auto">
                Pick a plan. One-time build, then Yele Care keeps everything running.
              </p>
            </div>

            <PricingCards ctaHref="/start" />

            <p className="text-center font-body text-sm font-bold text-bone mt-6">
              Pay 50% to start and 50% at launch.
            </p>

            <div className="text-center mt-4">
              <a
                href="/#contacto"
                className="font-body text-sm font-semibold text-bone underline underline-offset-4 hover:text-bone/80 transition-colors"
              >
                Help me decide
              </a>
            </div>

            {/* Yele Care — 3 maintenance tiers */}
            <div className="mt-20">
              <div className="text-center mb-10">
                <h2 className="font-display font-semibold text-bone tracking-tight mb-3" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
                  Yele Care
                </h2>
                <p className="font-body text-lg text-white/60 max-w-xl mx-auto">
                  Maintenance that keeps your website fast, secure and always up to date — from $29/month.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                {CARE_TIERS.map(tier => (
                  <div
                    key={tier.name}
                    className={`relative flex flex-col rounded-2xl p-6 transition-shadow ${
                      tier.popular
                        ? 'bg-[#1C1D24] border-2 border-[#D46FC8] shadow-xl shadow-[#D46FC8]/15'
                        : 'bg-white/[0.03] border border-white/10 hover:border-white/25'
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#D46FC8] px-3 py-1 font-body text-xs font-semibold text-white">
                        Most Popular
                      </span>
                    )}
                    <div className="relative mb-4 w-full aspect-[16/9] overflow-hidden rounded-xl" style={{ backgroundColor: '#0D0E12' }}>
                      <Image src={tier.image} alt={tier.name} fill sizes="360px" className="object-cover" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-bone">{tier.name}</h3>
                    <div className="mt-1 mb-4 flex items-end gap-1">
                      <span className="font-display text-3xl font-bold text-bone">{tier.price}</span>
                      <span className="mb-1 font-body text-sm text-white/50">/month</span>
                    </div>
                    <ul className="space-y-2">
                      {tier.features.map(f => (
                        <li key={f} className="flex items-start gap-2.5">
                          <Check size={16} className="mt-0.5 flex-shrink-0 text-[#D46FC8]" aria-hidden="true" />
                          <span className="font-body text-sm text-white/80">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---- Section 2: Modular services (à-la-carte add-ons) ---- */}
        <section className="relative py-24 px-6 border-t border-hairlineDark" style={{ backgroundColor: '#0D0E12' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2
                className="font-display font-semibold text-bone tracking-tight mb-4"
                style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
              >
                Modular services
              </h2>
              <p className="font-body text-lg text-white/60 max-w-xl mx-auto">
                Add exactly what you need. Cancel anytime.
              </p>
            </div>

            <div className="flex flex-col gap-16">
              {CATEGORIES.map(category => (
                <div key={category.title}>
                  <h3 className="font-display text-xl text-bone tracking-tight mb-6">{category.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.items.map(item => (
                      <ServiceCard key={item.name} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </EnLangProvider>
  )
}

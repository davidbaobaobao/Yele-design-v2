import type { Metadata } from 'next'
import {
  CalendarCheck,
  Bot,
  PhoneCall,
  CreditCard,
  Store,
  TrendingUp,
  Clapperboard,
  Sparkles,
  FileText,
  Megaphone,
  Target,
  type LucideIcon,
} from 'lucide-react'
import { EnLangProvider } from '@/components/LangProvider'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { CTAButton } from '@/components/ui/cta-button'
import { PricingCardsGrid } from '@/components/PricingCards'

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
  Icon: LucideIcon
  includedIn: string | null
  description: string
}

// Suggested order (highest-intent first).
const SERVICES: ServiceItem[] = [
  {
    name: 'Smart Booking',
    price: 29,
    Icon: CalendarCheck,
    includedIn: 'Pro & Frontier',
    description:
      "Let clients book appointments directly from your site. Syncs in real time with your Google Calendar or Outlook so you're never double-booked, with automatic confirmations and reminders.",
  },
  {
    name: 'AI Chat Assistant',
    price: 29,
    Icon: Bot,
    includedIn: 'Pro & Frontier',
    description:
      'A smart assistant that answers visitor questions instantly, 24/7. Give it a personality and a goal — capture leads, book calls, or guide buyers to a decision. Includes 100,000 tokens/month (~500 conversations); $5 per additional 100,000.',
  },
  {
    name: 'Online Payments',
    price: 49,
    Icon: CreditCard,
    includedIn: 'Pro & Frontier',
    description:
      'Accept payments right on your site — one-time or recurring subscriptions. Powered by Stripe with support for all major cards, and secure PCI-compliant checkout.',
  },
  {
    name: 'AI Phone Receptionist',
    price: 59,
    Icon: PhoneCall,
    includedIn: 'Frontier',
    description:
      'A next-generation AI that answers your inbound calls 24/7 and handles multiple simultaneous calls at once — never a busy signal, never a missed customer. Give it a personality and a strategy: answer questions, book appointments, even upsell. Calls billed per minute (~$0.20–$0.50/min depending on complexity), adjustable on demand.',
  },
  {
    name: 'Online Store',
    price: 69,
    Icon: Store,
    includedIn: 'Pro & Frontier',
    description:
      'A full digital storefront to sell physical or digital products and services. Product catalog, cart, and secure checkout — everything you need to start selling online.',
  },
  {
    name: 'Advanced SEO',
    price: 49,
    Icon: TrendingUp,
    includedIn: 'Pro & Frontier',
    description:
      'Hands-on, ongoing SEO. We fine-tune your ranking factors every week to help you climb Google and get found by more of the right local customers.',
  },
  {
    name: 'Google Ads Management',
    price: 69,
    Icon: Target,
    includedIn: 'Frontier',
    description:
      'We create, manage and continuously optimize your Google Ads — ad creation, keyword management, and conversion optimization to get more from every click. Ad spend billed separately.',
  },
  {
    name: 'Media Creation',
    price: 99,
    Icon: Clapperboard,
    includedIn: 'Pro & Frontier',
    description:
      'Professional content on demand every month: 1 video (up to 10s, up to 3 revisions) and 20 images (unlimited revisions). From concept to final cut — dialed in on look, style and cinematic feel.',
  },
  {
    name: 'Media Creation Plus',
    price: 199,
    Icon: Sparkles,
    includedIn: 'Frontier',
    description:
      'For brands that need volume: 4 videos (up to 10s each, up to 3 revisions) and 80 images (unlimited revisions) every month, with full creative direction from concept to polished result.',
  },
  {
    name: 'Content & Articles',
    price: 39,
    Icon: FileText,
    includedIn: 'Frontier',
    description:
      'One high-quality, SEO-optimized article for your business each month. Includes topic research, custom images and media, and keyword optimization to grow your search visibility.',
  },
  {
    name: 'Marketing Campaign',
    price: 199,
    Icon: Megaphone,
    includedIn: 'Frontier',
    description:
      'One complete campaign each month — a long-form video plus supporting images and copy, formatted for every social platform. From idea to launch, built around a single goal.',
  },
]

function ServiceCard({ item }: { item: ServiceItem }) {
  const { Icon } = item
  return (
    <div className="relative flex flex-col rounded-2xl border border-hairlineDark bg-[#16171C] p-6">
      <div className="flex items-start justify-between mb-5">
        <div
          className="flex items-center justify-center w-11 h-11 rounded-xl"
          style={{ backgroundColor: 'rgba(212,111,200,0.12)' }}
          aria-hidden="true"
        >
          <Icon size={20} className="text-[#D46FC8]" />
        </div>
        {item.includedIn && (
          <span className="font-body text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#D46FC8]/30 text-[#F0A6E4] bg-[#D46FC8]/10 whitespace-nowrap">
            Included in {item.includedIn}
          </span>
        )}
      </div>

      <h3 className="font-display text-lg text-bone mb-1.5">{item.name}</h3>
      <p className="font-body text-2xl font-semibold text-[#D46FC8] mb-3">
        ${item.price}
        <span className="text-sm font-medium text-white/50">/mo</span>
      </p>
      <p className="font-body text-sm leading-relaxed text-white/60 flex-1 mb-6">{item.description}</p>

      <CTAButton href="/registro" variant="pink" className="text-xs px-5 py-2.5 self-start">
        Get started
      </CTAButton>
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
                Everything you need, in one plan.
              </p>
            </div>

            <PricingCardsGrid />

            <p className="text-center font-body text-sm font-bold text-bone mt-6">No lock-in. Cancel anytime.</p>

            <div className="text-center mt-4">
              <a
                href="/#contacto"
                className="font-body text-sm font-semibold text-bone underline underline-offset-4 hover:text-bone/80 transition-colors"
              >
                Help me decide
              </a>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map(item => (
                <ServiceCard key={item.name} item={item} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </EnLangProvider>
  )
}

import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Check, Search, Image as ImageIcon, Megaphone, Bot, PhoneCall, Zap, FilePlus2, RefreshCw, Wrench } from 'lucide-react'
import LeadForm from '@/components/LeadForm'
import ReputationBadge from '@/components/ReputationBadge'
import PricingCards from '@/components/letsbuild/PricingCards'
import CareVideo from '@/components/letsbuild/CareVideo'
import StartNowMarquee from '@/components/letsbuild/StartNowMarquee'
import { EnLangProvider } from '@/components/LangProvider'

// Below-fold, heavier sections — code-split so the initial hero/form bundle
// (the LCP + conversion path) stays light, same pattern as /websites.
const LogoMarquee = dynamic(() => import('@/components/LogoMarquee'))
const LatestFeaturedWork = dynamic(() => import('@/components/LatestFeaturedWork'))
const LetsBuildFAQ = dynamic(() => import('@/components/letsbuild/LetsBuildFAQ'))
const BuildLeadForm = dynamic(() => import('@/components/letsbuild/BuildLeadForm'))

export const metadata: Metadata = {
  title: 'Get a custom website from $699 | Yele',
  description:
    'Custom design and imagery, delivery under 4 weeks, our agency takes care of everything. Websites from $699 + Yele Care from $49/month. Pay 50% to start, 50% at launch.',
  alternates: { canonical: 'https://yele.design/letsbuild' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yele.design/letsbuild',
    siteName: 'Yele',
    title: 'Get a custom website from $699 | Yele',
    description: 'Custom design. Delivery under 4 weeks. From $699 + $49/mo Yele Care. 50% to start.',
  },
}

const KEY_POINTS = [
  'From $699',
  'No tasteless templates',
  'No DIY — we build everything for you',
  'Delivery under 4 weeks',
]

// Plan-interest pills shown in the hero form; the pricing CTAs dispatch these
// exact values to pre-select the matching pill.
const PLAN_OPTIONS = ['Launch — $699', 'Business — $1,199', 'Pro — $2,799']

const CARE_INCLUDES = ['Hosting', 'SSL & security', 'Backups', 'Uptime monitoring']

const STEPS = [
  { n: '1', title: 'Start now', body: 'Secure your spot by paying 50% — this locks in your project and reserves your place in our schedule.' },
  { n: '2', title: 'Tell us about your business', body: 'A quick call or email so we understand your exact needs for the website before we design anything.' },
  { n: '3', title: 'Review', body: 'We show you the finished website and make the agreed revisions before launch.' },
  { n: '4', title: 'Go live', body: 'Approve, pay the remaining 50%, and we launch your website — Yele Care keeps everything running afterwards.' },
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
  { title: 'Design refresh', body: 'A full redesign every year, so your website never looks dated.', webm: '/media/whyyele3/whyyele1.webm', mp4: '/media/whyyele3/whyyele1.mp4', poster: '/media/whyyele3/whyyele1_poster.jpg' },
  { title: 'Affordable & transparent', body: 'Professional websites from $699, with clear pricing and no confusing agency quotes.', webm: '/media/whyyele3/whyyele6.webm', mp4: '/media/whyyele3/whyyele6.mp4', poster: '/media/whyyele3/whyyele6_poster.jpg' },
  { title: 'Custom', body: 'Designed around your business, not a generic template with your logo dropped on.', webm: '/media/whyyele3/whyyele3.webm', mp4: '/media/whyyele3/whyyele3.mp4', poster: '/media/whyyele3/whyyele3_poster.jpg' },
  { title: 'Fast delivery', body: 'Delivery goal set for under 4 weeks.', webm: '/media/whyyele3/whyyele2.webm', mp4: '/media/whyyele3/whyyele2.mp4', poster: '/media/whyyele3/whyyele2_poster.jpg' },
  { title: 'Support 24/7', body: 'We stay with you after launch — support whenever you need it.', webm: '/media/beyond/AIcall_hq.webm', mp4: '/media/beyond/AIcall_hq.mp4', poster: '/media/beyond/AIcall_poster.jpg' },
  { title: 'Built for growth', body: 'Add SEO, advertising, content, AI, and automation as your business grows.', webm: '/media/beyond/Marketing_hq.webm', mp4: '/media/beyond/Marketing_hq.mp4', poster: '/media/beyond/Marketing_poster.jpg' },
]

const DARK = '#0D0E12'

export default function LetsBuildPage() {
  return (
    <EnLangProvider>
      <main style={{ backgroundColor: DARK }}>
        {/* ---- HERO + quick lead form — sized to fit one viewport (desktop + mobile) ---- */}
        {/* Mobile: single centered column. Desktop: two columns — text/logo/
            trust on the left, form on the right. Fills the viewport (marquee
            sits just below the fold), with top/bottom spacing from the padding
            + vertical centering. */}
        <section className="min-h-[calc(100svh-132px)] flex flex-col justify-center px-6 md:px-12 pt-16 pb-8 md:pt-16 md:pb-10">
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

              {/* RIGHT — quick lead form */}
              <div className="md:ml-auto md:w-full md:max-w-md">
                <LeadForm variant="dark" ctaLabel="Let's start" id="lead-form" planOptions={PLAN_OPTIONS} />

                <div className="text-center mt-2.5">
                  <Link href="/schedule" className="font-body text-sm text-white/60 hover:text-white transition-colors underline underline-offset-4">
                    Prefer to talk? Book a free 10-min intro call
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- TRUST MARQUEE ---- */}
        <LogoMarquee />

        {/* ---- LATEST FEATURED WORK (index gallery, always dark, one screen) ---- */}
        <LatestFeaturedWork forceDark />

        {/* ---- PRICING (white, index-style cards) ---- */}
        <section id="pricing" className="bg-white px-6 pt-20 md:pt-28 pb-10 md:pb-12">
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

        {/* ---- YELE CARE (white, 3 cards with videos) ---- */}
        <section className="bg-white px-6 pt-6 md:pt-8 pb-16 md:pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-ink tracking-tight">
                Looked after with <span className="text-[#D46FC8]">Yele Care</span>
              </h2>
              <p className="font-body text-base text-muted mt-2">
                Permanent attention that keeps everything working — for $49/month.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-hairline p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 hover:border-ink/20">
                <CareVideo webm="/media/beyond/SEO_hq.webm" mp4="/media/beyond/SEO_hq.mp4" poster="/media/beyond/SEO_poster.jpg" />
                <div className="flex items-center gap-2 mb-1.5">
                  <FilePlus2 size={18} className="text-[#D46FC8] flex-shrink-0" aria-hidden="true" />
                  <h4 className="font-display font-bold text-lg text-ink">Content updates</h4>
                </div>
                <p className="font-body text-sm text-muted leading-relaxed">
                  We help you add new content — new projects, new photos, new menu items, whatever your business needs.
                </p>
              </div>
              <div className="rounded-2xl border border-hairline p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 hover:border-ink/20">
                <CareVideo webm="/media/beyond/ADS_hq.webm" mp4="/media/beyond/ADS_hq.mp4" poster="/media/beyond/ADS_poster.jpg" />
                <div className="flex items-center gap-2 mb-1.5">
                  <RefreshCw size={18} className="text-[#D46FC8] flex-shrink-0" aria-hidden="true" />
                  <h4 className="font-display font-bold text-lg text-ink">Yearly website redesign</h4>
                </div>
                <p className="font-body text-sm text-muted leading-relaxed">
                  A full design refresh every year, so your website is <span className="text-ink font-semibold">never</span> outdated.
                </p>
              </div>
              <div className="rounded-2xl border border-hairline p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 hover:border-ink/20">
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
        </section>

        {/* ---- HOW IT WORKS (white) ---- */}
        <section className="bg-white px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted mb-3">How it works</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-ink tracking-tight mb-10">
              From idea to live website in four simple steps.
            </h2>
            <div className="space-y-4">
              {STEPS.map(step => (
                <div
                  key={step.n}
                  className="group flex gap-5 rounded-2xl p-4 -mx-4 transition-all duration-300 hover:bg-black/[0.03] hover:translate-x-1"
                >
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D46FC8]/15 text-[#D46FC8] font-display font-bold flex items-center justify-center transition-all duration-300 group-hover:bg-[#D46FC8] group-hover:text-white group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#D46FC8]/30">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-xl text-ink mb-1 transition-colors duration-300 group-hover:text-[#D46FC8]">{step.title}</h3>
                    <p className="font-body text-base text-muted leading-relaxed max-w-2xl">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <a href="#lead-form" className="inline-flex items-center justify-center font-body font-medium text-base bg-[#D46FC8] hover:bg-[#DE85D2] text-white px-7 py-3.5 rounded-xl transition-colors">
                Start now
              </a>
            </div>
          </div>
        </section>

        {/* ---- WHY BUSINESSES CHOOSE YELE ---- */}
        <section className="px-6 py-16 md:py-24 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-2">
              Why businesses choose Yele
            </h2>
            <p className="font-body text-base text-white/70 mb-10">
              Professional without the traditional agency price.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHY.map(w => (
                <div key={w.title} className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-black/40">
                  <CareVideo webm={w.webm} mp4={w.mp4} poster={w.poster} />
                  <h3 className="font-display font-bold text-lg text-white mb-1">{w.title}</h3>
                  <p className="font-body text-sm text-white/70 leading-relaxed">{w.body}</p>
                </div>
              ))}
            </div>

            {/* Never outdated — one video on the left, text on the right half */}
            <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
              <video
                className="w-full aspect-video rounded-2xl object-cover border border-white/10"
                autoPlay muted loop playsInline preload="none" poster="/media/conveyor_poster.jpg"
              >
                <source src="/media/conveyor.mp4" type="video/mp4" />
              </video>

              <div>
                <h3 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-4">
                  Your website will <span className="text-[#D46FC8]">never</span> be outdated.
                </h3>
                <p className="font-body text-base md:text-lg text-white/70 leading-relaxed">
                  Every year, Yele Care includes a full redesign — we refresh the look, update the content, and keep your
                  website modern as design trends move on. No rebuilds, no extra quotes. Your site stays current for as
                  long as you&apos;re with us.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---- START NOW marquee (scrolls up to the hero form) ---- */}
        <StartNowMarquee />

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
            <BuildLeadForm variant="dark" />
          </div>
        </section>

        {/* ---- FINAL CTA (dark, video left / text right, centered CTA below) ---- */}
        <section className="px-6 py-20 md:py-28 border-t border-white/10" style={{ backgroundColor: DARK }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
              <video
                className="w-full aspect-video rounded-2xl object-cover border border-white/10 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40"
                autoPlay muted loop playsInline preload="none" poster="/media/boldstats/boldstats_poster.jpg"
              >
                <source src="/media/boldstats/boldstats_hq.webm" type="video/webm" />
                <source src="/media/boldstats/boldstats_hq.mp4" type="video/mp4" />
              </video>

              <div>
                <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight mb-5">
                  Your business deserves a website that looks professional.
                </h2>
                <p className="font-body text-base md:text-lg text-white/70 leading-relaxed mb-2">
                  Get a custom website without paying traditional agency prices.
                </p>
                <p className="font-body text-base text-white/60">
                  Websites from $699. Yele Care from $49/month. 50% to start. 50% when you&apos;re ready to launch.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <a href="#build-form" className="inline-flex items-center justify-center font-body font-medium text-base bg-[#D46FC8] hover:bg-[#DE85D2] text-white px-8 py-4 rounded-xl transition-colors">
                Start now
              </a>
            </div>
          </div>
        </section>

        {/* ---- MORE THAN WEBSITES (last — to be moved to its own page later) ---- */}
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
      </main>
    </EnLangProvider>
  )
}

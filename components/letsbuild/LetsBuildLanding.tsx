import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Check, FilePlus2, RefreshCw, Wrench } from 'lucide-react'
import LeadForm from '@/components/LeadForm'
import LetsBuildHero from '@/components/letsbuild/LetsBuildHero'
import ReputationBadge from '@/components/ReputationBadge'
import PricingCards from '@/components/letsbuild/PricingCards'
import CareVideo from '@/components/letsbuild/CareVideo'
import StartNowMarquee from '@/components/letsbuild/StartNowMarquee'
import LocaleSwitcher from '@/components/letsbuild/LocaleSwitcher'
import { EnLangProvider } from '@/components/LangProvider'
import { getFunnelDict, type Locale } from '@/lib/i18n/funnel'

// Below-fold, heavier sections — code-split so the initial hero/form bundle
// (the LCP + conversion path) stays light.
const LogoMarquee = dynamic(() => import('@/components/LogoMarquee'))
const LatestFeaturedWork = dynamic(() => import('@/components/LatestFeaturedWork'))
const LetsBuildFAQ = dynamic(() => import('@/components/letsbuild/LetsBuildFAQ'))
const BuildLeadForm = dynamic(() => import('@/components/letsbuild/BuildLeadForm'))
// Async server component (fetches testimonials) — same section as the
// homepage, always dark so it drops straight into the dark landing.
const Testimonios = dynamic(() => import('@/components/Testimonios'))

// Media for the "Why businesses choose Yele" cards — text comes from the
// locale dictionary (getFunnelDict().why.items), zipped by index with these.
const WHY_MEDIA = [
  { webm: '/media/whyyele3/whyyele1.webm', mp4: '/media/whyyele3/whyyele1.mp4', poster: '/media/whyyele3/whyyele1_poster.jpg' },
  { webm: '/media/whyyele3/whyyele6.webm', mp4: '/media/whyyele3/whyyele6.mp4', poster: '/media/whyyele3/whyyele6_poster.jpg' },
  { webm: '/media/whyyele3/whyyele3.webm', mp4: '/media/whyyele3/whyyele3.mp4', poster: '/media/whyyele3/whyyele3_poster.jpg' },
  { webm: '/media/whyyele3/whyyele2.webm', mp4: '/media/whyyele3/whyyele2.mp4', poster: '/media/whyyele3/whyyele2_poster.jpg' },
  { webm: '/media/beyond/AIcall_hq.webm', mp4: '/media/beyond/AIcall_hq.mp4', poster: '/media/beyond/AIcall_poster.jpg' },
  { webm: '/media/beyond/Marketing_hq.webm', mp4: '/media/beyond/Marketing_hq.mp4', poster: '/media/beyond/Marketing_poster.jpg' },
]

const DARK = '#0D0E12'

// Shared landing body for /letsbuild and /letsbuildga (+ /es, /zh variants).
// `leadSource` is stamped onto both forms so the lead email says where the
// lead came from. `locale` drives all funnel copy + the $/€ currency; it
// defaults to 'en' so the existing English pages render exactly as before.
export default function LetsBuildLanding({ leadSource, locale = 'en' }: { leadSource?: string; locale?: Locale }) {
  const d = getFunnelDict(locale)
  const planOptions = d.pricing.tiers.map(t => t.planValue)

  return (
    <EnLangProvider>
      <main style={{ backgroundColor: DARK }}>
        <LocaleSwitcher current={locale} />

        {/* ---- HERO — text + testimonial pills left, 3D cubes right/bg. ---- */}
        <LetsBuildHero locale={locale} />

        <LogoMarquee />

        <LatestFeaturedWork forceDark title={d.featuredTitle} />

        {/* ---- PRICING ---- */}
        <section id="pricing" className="bg-white px-6 pt-20 md:pt-28 pb-10 md:pb-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-ink tracking-tight text-center mb-10 md:mb-14">
              {d.pricing.title}
            </h2>
            <PricingCards locale={locale} />

            <p className="max-w-2xl mx-auto text-center font-body text-base text-muted mt-10 leading-relaxed">
              {d.pricing.payNote}
            </p>
          </div>
        </section>

        {/* ---- YELE CARE ---- */}
        <section className="bg-white px-6 pt-6 md:pt-8 pb-8 md:pb-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-ink tracking-tight">
                {d.care.title1}<br className="sm:hidden" /><span className="text-[#D46FC8]">{d.care.title2}</span>
              </h2>
              <p className="font-body text-base text-muted mt-2">
                {d.care.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-hairline p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 hover:border-ink/20">
                <CareVideo webm="/media/beyond/SEO_hq.webm" mp4="/media/beyond/SEO_hq.mp4" poster="/media/beyond/SEO_poster.jpg" />
                <div className="flex items-center gap-2 mb-1.5">
                  <FilePlus2 size={18} className="text-[#D46FC8] flex-shrink-0" aria-hidden="true" />
                  <h4 className="font-display font-bold text-lg text-ink">{d.care.contentTitle}</h4>
                </div>
                <p className="font-body text-sm text-muted leading-relaxed">
                  {d.care.contentBody}
                </p>
              </div>
              <div className="rounded-2xl border border-hairline p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 hover:border-ink/20">
                <CareVideo webm="/media/beyond/ADS_hq.webm" mp4="/media/beyond/ADS_hq.mp4" poster="/media/beyond/ADS_poster.jpg" />
                <div className="flex items-center gap-2 mb-1.5">
                  <RefreshCw size={18} className="text-[#D46FC8] flex-shrink-0" aria-hidden="true" />
                  <h4 className="font-display font-bold text-lg text-ink">{d.care.redesignTitle}</h4>
                </div>
                <p className="font-body text-sm text-muted leading-relaxed">
                  {d.care.redesignBodyPre}<span className="text-ink font-semibold">{d.care.redesignNever}</span>{d.care.redesignBodyPost}
                </p>
              </div>
              <div className="rounded-2xl border border-hairline p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 hover:border-ink/20">
                <CareVideo webm="/media/whyyele3/whyyele5.webm" mp4="/media/whyyele3/whyyele5.mp4" poster="/media/whyyele3/whyyele5_poster.jpg" />
                <div className="flex items-center gap-2 mb-1.5">
                  <Wrench size={18} className="text-[#D46FC8] flex-shrink-0" aria-hidden="true" />
                  <h4 className="font-display font-bold text-lg text-ink">{d.care.maintTitle}</h4>
                </div>
                <p className="font-body text-sm text-muted leading-relaxed mb-3">
                  {d.care.maintBody}
                </p>
                <ul className="flex flex-wrap gap-x-3 gap-y-1">
                  {d.care.includes.map(item => (
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

        {/* ---- HOW IT WORKS ---- */}
        <section className="bg-white px-6 pt-8 md:pt-10 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted mb-3">{d.how.kicker}</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-ink tracking-tight mb-10">
              {d.how.title}
            </h2>
            <div className="space-y-4">
              {d.how.steps.map((step, i) => (
                <div
                  key={step.title}
                  className="group flex gap-5 rounded-2xl p-4 -mx-4 transition-all duration-300 hover:bg-black/[0.03] hover:translate-x-1"
                >
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D46FC8]/15 text-[#D46FC8] font-display font-bold flex items-center justify-center transition-all duration-300 group-hover:bg-[#D46FC8] group-hover:text-white group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#D46FC8]/30">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-xl text-ink mb-1 transition-colors duration-300 group-hover:text-[#D46FC8]">{step.title}</h3>
                    <p className="font-body text-base text-muted leading-relaxed max-w-2xl">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- QUICK LEAD FORM — left values + testimonial pills, right form. ---- */}
        <section className="px-6 py-16 md:py-24 border-t border-white/10 scroll-mt-8" style={{ backgroundColor: DARK }}>
          <div className="mx-auto w-full max-w-md md:max-w-5xl">
            <div className="md:grid md:grid-cols-2 md:gap-14 md:items-center">
              <div className="mb-10 md:mb-0">
                <h2
                  className="font-display font-bold text-white tracking-tight leading-[1.03] mb-5 md:mb-7"
                  style={{ fontSize: 'clamp(2.6rem, 5.6vw, 5.25rem)' }}
                >
                  {d.form.heading}
                </h2>

                <p className="font-body text-base md:text-lg font-semibold uppercase tracking-[0.12em] text-white/50 mb-4">
                  {d.form.coreValues}
                </p>
                <ul className="space-y-3.5 mb-8 md:mb-9">
                  {d.form.values.map(v => (
                    <li key={v.title} className="flex items-start gap-3">
                      <Check size={22} className="text-[#D46FC8] flex-shrink-0 mt-1" aria-hidden="true" />
                      <span className="font-body text-base md:text-xl text-white/80 leading-relaxed">
                        <span className="font-semibold text-white">{v.title}.</span> {v.body}
                      </span>
                    </li>
                  ))}
                </ul>

                <ReputationBadge className="scale-110 origin-left" locale={locale} />
              </div>

              <div className="md:ml-auto md:w-full md:max-w-md">
                <LeadForm variant="dark" ctaLabel={d.form.cta} id="lead-form" planOptions={planOptions} leadSource={leadSource} sendWelcome locale={locale} />

                <div className="text-center mt-2.5">
                  <Link href="/schedule" className="font-body text-sm text-white/60 hover:text-white transition-colors underline underline-offset-4">
                    {d.form.bookCall}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- WHY BUSINESSES CHOOSE YELE ---- */}
        <section className="px-6 py-16 md:py-24 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-2">
              {d.why.title}
            </h2>
            <p className="font-body text-base text-white/70 mb-10">
              {d.why.subtitle}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {d.why.items.map((w, i) => (
                <div key={w.title} className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-black/40">
                  <CareVideo webm={WHY_MEDIA[i].webm} mp4={WHY_MEDIA[i].mp4} poster={WHY_MEDIA[i].poster} />
                  <h3 className="font-display font-bold text-lg text-white mb-1">{w.title}</h3>
                  <p className="font-body text-sm text-white/70 leading-relaxed">{w.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
              <video
                className="w-full aspect-video rounded-2xl object-cover border border-white/10"
                autoPlay muted loop playsInline preload="none" poster="/media/conveyor_poster.jpg"
              >
                <source src="/media/conveyor.mp4" type="video/mp4" />
              </video>

              <div>
                <h3 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-4">
                  {d.why.neverTitlePre}<span className="text-[#D46FC8]">{d.why.neverWord}</span>{d.why.neverTitlePost}
                </h3>
                <p className="font-body text-base md:text-lg text-white/70 leading-relaxed">
                  {d.why.neverBody}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---- TESTIMONIALS (same section as the homepage) ---- */}
        <Testimonios />

        <StartNowMarquee />

        <LetsBuildFAQ locale={locale} />

        {/* ---- LEAD FORM (detailed) ---- */}
        <section id="build-form" className="px-6 py-16 md:py-24" style={{ backgroundColor: DARK }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-2">
              {d.buildForm.title}
            </h2>
            <p className="font-body text-base text-white/70 mb-8">
              {d.buildForm.subtitle}
            </p>
            <BuildLeadForm variant="dark" leadSource={leadSource} sendWelcome />
          </div>
        </section>

        {/* ---- FINAL CTA ---- */}
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
                  {d.finalCta.title}
                </h2>
                <p className="font-body text-base md:text-lg text-white/70 leading-relaxed mb-2">
                  {d.finalCta.line1}
                </p>
                <p className="font-body text-base text-white/60">
                  {d.finalCta.line2}
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <a href="#build-form" className="inline-flex items-center justify-center font-body font-medium text-base bg-[#D46FC8] hover:bg-[#DE85D2] text-white px-8 py-4 rounded-xl transition-colors">
                {d.finalCta.startNow}
              </a>
            </div>
          </div>
        </section>

        {/* ---- Footer (static, no animation) ---- */}
        <footer className="px-6 py-10 border-t border-white/10" style={{ backgroundColor: DARK }}>
          <div className="max-w-6xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-body text-sm text-white/50">
              © {new Date().getFullYear()} Yele. {d.footer.rights}
            </p>
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/terms" className="font-body text-sm text-white/60 hover:text-white transition-colors">
                {d.footer.terms}
              </Link>
              <Link href="/privacy-policy" className="font-body text-sm text-white/60 hover:text-white transition-colors">
                {d.footer.privacy}
              </Link>
              <Link href="/legal-notice" className="font-body text-sm text-white/60 hover:text-white transition-colors">
                {d.footer.legal}
              </Link>
            </nav>
          </div>
        </footer>
      </main>
    </EnLangProvider>
  )
}

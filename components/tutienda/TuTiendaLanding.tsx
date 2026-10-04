import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Check, FilePlus2, RefreshCw, Wrench, X } from 'lucide-react'
import LeadForm from '@/components/LeadForm'
import TuTiendaHero from '@/components/tutienda/TuTiendaHero'
import PricingComparisonCard from '@/components/tutienda/PricingComparisonCard'
import Parallax from '@/components/tutienda/Parallax'
import TiltCard from '@/components/tutienda/TiltCard'
import ReputationBadge from '@/components/ReputationBadge'
import PlanCTA from '@/components/letsbuild/PlanCTA'
import CareVideo from '@/components/letsbuild/CareVideo'
import StartNowMarquee from '@/components/letsbuild/StartNowMarquee'
import LocaleSwitcher from '@/components/letsbuild/LocaleSwitcher'
import { LbHeroPing, LbSeen } from '@/components/letsbuild/LbTrack'
import WhatsAppLink from '@/components/WhatsAppLink'
import { EnLangProvider } from '@/components/LangProvider'
import { getFunnelDict, type Locale } from '@/lib/i18n/funnel'
import { getTuTienda } from '@/lib/i18n/tutienda'

// Below-fold, heavier sections — code-split so the hero/table bundle stays light.
const LogoMarquee = dynamic(() => import('@/components/LogoMarquee'))
const LatestFeaturedWork = dynamic(() => import('@/components/LatestFeaturedWork'))
const LetsBuildFAQ = dynamic(() => import('@/components/letsbuild/LetsBuildFAQ'))
const BuildLeadForm = dynamic(() => import('@/components/letsbuild/BuildLeadForm'))
const Testimonios = dynamic(() => import('@/components/Testimonios'))

// Media for the "Why businesses choose Yele" cards (shared with /letsbuild).
const WHY_MEDIA = [
  { webm: '/media/whyyele3/whyyele1.webm', mp4: '/media/whyyele3/whyyele1.mp4', poster: '/media/whyyele3/whyyele1_poster.jpg' },
  { webm: '/media/whyyele3/whyyele6.webm', mp4: '/media/whyyele3/whyyele6.mp4', poster: '/media/whyyele3/whyyele6_poster.jpg' },
  { webm: '/media/whyyele3/whyyele3.webm', mp4: '/media/whyyele3/whyyele3.mp4', poster: '/media/whyyele3/whyyele3_poster.jpg' },
  { webm: '/media/whyyele3/whyyele2.webm', mp4: '/media/whyyele3/whyyele2.mp4', poster: '/media/whyyele3/whyyele2_poster.jpg' },
  { webm: '/media/beyond/AIcall_hq.webm', mp4: '/media/beyond/AIcall_hq.mp4', poster: '/media/beyond/AIcall_poster.jpg' },
  { webm: '/media/beyond/Marketing_hq.webm', mp4: '/media/beyond/Marketing_hq.mp4', poster: '/media/beyond/Marketing_poster.jpg' },
]

const DARK = '#0D0E12'

// /tutienda — ecommerce Meta-ads landing (ES / EN / ZH). Store-specific hero,
// Shopify comparisons, pricing and values come from lib/i18n/tutienda.ts; the
// reused letsbuild sections (care videos, why, testimonials, forms, footer)
// come from getFunnelDict(locale).
export default function TuTiendaLanding({ locale = 'es' }: { locale?: Locale }) {
  const d = getFunnelDict(locale)
  const t = getTuTienda(locale)
  const leadSource = t.leadSource
  const legalPrefix = locale === 'es' ? '/es' : ''
  const planOptions = t.pricing.tiers.map(x => x.planValue)
  // Ecommerce override for the "Affordable & transparent" why-card (index 1).
  const whyItems = d.why.items.map((w, i) => (i === 1 ? { ...w, body: t.whyAffordableBody } : w))

  return (
    <EnLangProvider>
      <main className="overflow-x-hidden" style={{ backgroundColor: DARK }}>
        {/* /es/tutienda hides the language switcher — Spanish Meta-ads traffic. */}
        {locale !== 'es' && <LocaleSwitcher current={locale} />}
        <LbHeroPing page="tutienda" />

        {/* ---- HERO — text + pills + CTAs left, cost-comparison card right. ---- */}
        <TuTiendaHero
          t={t.hero}
          locale={locale}
          rightPanel={
            <Parallax distance={18}>
              <PricingComparisonCard title={t.compare.title} rows={t.compare.rows} />
            </Parallax>
          }
        />

        <LogoMarquee />

        {/* ---- COMPARATIVA Yele vs Shopify (feature table) — white table on black. ---- */}
        <section id="comparativa" className="px-6 py-16 md:py-24 scroll-mt-4" style={{ backgroundColor: DARK }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-2 text-center">
              <span className="text-[#D46FC8]">Yele</span>{t.feature.vsRest}
            </h2>
            <p className="font-body text-base text-white/70 mb-10 text-center">{t.feature.subtitle}</p>
            <div className="relative">
              {/* Shading + pink bloom so the table reads as levitating, not flat. */}
              <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[#D46FC8]/15 blur-[80px] scale-95 translate-y-6" aria-hidden="true" />
              <div className="pointer-events-none absolute -inset-x-8 -bottom-2 h-28 translate-y-1/2 rounded-[50%] bg-black/70 blur-2xl" aria-hidden="true" />
              <div className="pointer-events-none absolute left-1/2 -bottom-4 h-24 w-3/4 -translate-x-1/2 rounded-[50%] bg-[#D46FC8]/20 blur-3xl" aria-hidden="true" />

              {/* Desktop/tablet: 3-column table. */}
              <Parallax distance={22} className="relative hidden md:block overflow-hidden rounded-2xl bg-white shadow-[0_40px_90px_-20px_rgba(0,0,0,0.75)] ring-1 ring-black/[0.06]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left font-body text-xs font-semibold uppercase tracking-wide text-muted px-4 md:px-6 py-4 bg-base/70">{t.feature.colFeature}</th>
                      <th className="text-left font-body text-sm font-bold text-[#D46FC8] px-4 md:px-6 py-4 bg-[#D46FC8]/[0.07]">Yele</th>
                      <th className="text-left font-body text-sm font-semibold text-muted px-4 md:px-6 py-4 bg-base/70">Shopify</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.feature.rows.map(r => (
                      <tr key={r.feature} className="group border-t border-hairline transition-colors duration-200 hover:bg-[#D46FC8]/[0.05]">
                        <td className="px-4 md:px-6 py-4 font-body text-sm text-ink font-semibold align-top">{r.feature}</td>
                        <td className="px-4 md:px-6 py-4 align-top bg-[#D46FC8]/[0.04] transition-colors duration-200 group-hover:bg-[#D46FC8]/[0.1]">
                          <span className="flex items-start gap-2.5">
                            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#D46FC8]" aria-hidden="true">
                              <Check size={12} className="text-white" strokeWidth={3} />
                            </span>
                            <span className="font-body text-sm text-ink font-medium">{r.yele}</span>
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 font-body text-sm text-muted align-top">
                          {r.shopifyNone ? (
                            <span className="flex items-start gap-2.5">
                              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#D46FC8]" aria-hidden="true">
                                <X size={12} className="text-white" strokeWidth={3} />
                              </span>
                              {r.shopify}
                            </span>
                          ) : (
                            r.shopify
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Parallax>

              {/* Mobile: one card per feature, Yele (left, pink) and Shopify
                  (right) on the same level — no per-row labels. */}
              <div className="relative md:hidden flex flex-col gap-3.5">
                {t.feature.rows.map(r => (
                  <div key={r.feature} className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)]">
                    <div className="px-4 py-3 border-b border-hairline">
                      <span className="font-body text-sm font-bold text-ink">{r.feature}</span>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-hairline">
                      <div className="px-3.5 py-3 bg-[#D46FC8]/[0.05] flex items-start gap-2">
                        <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#D46FC8]" aria-hidden="true">
                          <Check size={10} className="text-white" strokeWidth={3} />
                        </span>
                        <span className="font-body text-[13px] text-ink font-medium leading-snug">
                          {r.yele.split(' · ').map(part => (
                            <span key={part} className="block">{part}</span>
                          ))}
                        </span>
                      </div>
                      <div className="px-3.5 py-3 flex items-start gap-2">
                        {r.shopifyNone && (
                          <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#D46FC8]" aria-hidden="true">
                            <X size={10} className="text-white" strokeWidth={3} />
                          </span>
                        )}
                        <span className="font-body text-[13px] text-muted leading-snug">
                          {r.shopify.split(' · ').map(part => (
                            <span key={part} className="block">{part}</span>
                          ))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---- PRECIOS — group 1: build (one-time), group 2: Yele Care (monthly). ---- */}
        <LbSeen event="lb_precios" page="tutienda" />
        <section id="pricing" className="bg-white px-6 pt-20 md:pt-28 pb-16 md:pb-24 scroll-mt-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-ink tracking-tight text-center mb-10 md:mb-14">
              {t.pricing.title}
            </h2>

            {/* Group 1 — one-time build */}
            <div className="flex items-center gap-3 mb-6">
              <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#D46FC8] text-white font-display font-bold flex items-center justify-center">1</span>
              <h3 className="font-display font-bold text-lg md:text-xl text-ink uppercase tracking-wide">{t.pricing.group1}</h3>
              <span className="rounded-full bg-[#D46FC8]/12 border border-[#D46FC8]/30 px-3 py-1 font-body text-xs font-semibold text-[#B5479F]">{t.pricing.pagoUnico}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {t.pricing.tiers.map((tier, i) => {
                const hl = tier.popular
                return (
                  <TiltCard
                    key={tier.name}
                    index={i}
                    className={`relative flex flex-col rounded-3xl p-7 md:p-8 ${
                      hl
                        ? 'bg-[#1C1D24] text-white border-2 border-[#D46FC8] shadow-[0_24px_64px_rgba(0,0,0,0.3)]'
                        : 'bg-white ring-1 ring-black/[0.07] shadow-[0_16px_56px_rgba(0,0,0,0.12)]'
                    }`}
                  >
                    {hl && (
                      <span className="absolute -top-3.5 left-8 rounded-full bg-[#D46FC8] px-3 py-1 font-body text-xs font-semibold text-white">
                        {t.pricing.masPopular}
                      </span>
                    )}
                    <p className={`relative font-body text-sm font-medium mb-2 ${hl ? 'text-white/55' : 'text-muted'}`}>{tier.name}</p>
                    <div className="relative mb-5 flex items-end gap-1.5">
                      <span className={`mb-1 font-body text-2xl font-semibold ${hl ? 'text-white/60' : 'text-muted'}`}>€</span>
                      <span className={`font-display text-5xl font-semibold tracking-tight ${hl ? 'text-white' : 'text-ink'}`}>{tier.amount}</span>
                      <span className={`mb-2 font-body text-sm ${hl ? 'text-white/55' : 'text-muted'}`}>{t.pricing.iva}</span>
                    </div>
                    {tier.headline && <p className={`relative font-body text-sm font-bold mb-3 ${hl ? 'text-white/85' : 'text-ink'}`}>{tier.headline}</p>}
                    <ul className="relative flex flex-1 flex-col gap-3 mb-6">
                      {tier.features.map(f => (
                        <li key={f} className="flex items-start gap-2.5">
                          <Check size={16} className="mt-0.5 flex-shrink-0 text-[#D46FC8]" aria-hidden="true" />
                          <span className={`font-body text-sm ${hl ? 'text-white/85' : 'text-ink'}`}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <PlanCTA
                      plan={tier.planValue}
                      label={tier.cta}
                      className={`relative inline-flex w-full cursor-pointer items-center justify-center rounded-full px-6 py-3 font-body text-sm font-medium transition-colors ${
                        hl ? 'bg-[#F2F0EB] text-[#16161A] hover:bg-white' : 'bg-[#1A1A1F] text-[#F2F0EB] hover:bg-[#26262C]'
                      }`}
                    />
                  </TiltCard>
                )
              })}
            </div>

            {/* Payment note sits directly under the one-time build cards. */}
            <p className="max-w-2xl mx-auto text-center font-body text-base text-muted mt-8 mb-14 md:mb-16 leading-relaxed">
              {d.pricing.payNote}
            </p>

            {/* Group 2 — monthly Yele Care */}
            <div className="flex items-center gap-3 mb-2">
              <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#D46FC8] text-white font-display font-bold flex items-center justify-center">2</span>
              <h3 className="font-display font-bold text-lg md:text-xl text-ink uppercase tracking-wide">{t.pricing.group2}</h3>
              <span className="rounded-full bg-[#D46FC8]/12 border border-[#D46FC8]/30 px-3 py-1 font-body text-xs font-semibold text-[#B5479F]">{t.pricing.cuotaMensual}</span>
            </div>
            <p className="font-body text-sm text-muted mb-6 ml-12">{t.pricing.careSubtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {t.pricing.careTiers.map((care, i) => {
                const hl = care.popular
                return (
                  <TiltCard
                    key={care.name}
                    index={i}
                    className={`relative flex flex-col rounded-3xl p-7 ${
                      hl
                        ? 'bg-[#1C1D24] text-white border-2 border-[#D46FC8] shadow-[0_20px_56px_rgba(0,0,0,0.28)]'
                        : 'bg-white ring-1 ring-black/[0.07] shadow-[0_16px_56px_rgba(0,0,0,0.12)]'
                    }`}
                  >
                    <p className={`relative font-body text-sm font-semibold mb-2 ${hl ? 'text-white' : 'text-ink'}`}>{care.name}</p>
                    <div className="relative mb-5 flex items-end gap-0.5">
                      <span className={`font-display text-4xl font-semibold tracking-tight ${hl ? 'text-white' : 'text-ink'}`}>{care.price}</span>
                      <span className={`mb-1.5 font-body text-sm ${hl ? 'text-white/55' : 'text-muted'}`}>{t.pricing.perMonth}</span>
                    </div>
                    {care.headline && <p className={`relative font-body text-sm font-bold mb-3 ${hl ? 'text-white/85' : 'text-ink'}`}>{care.headline}</p>}
                    <ul className="relative flex flex-1 flex-col gap-2.5">
                      {care.features.map(feat => (
                        <li key={feat} className="flex items-start gap-2">
                          <Check size={15} className="mt-0.5 flex-shrink-0 text-[#D46FC8]" aria-hidden="true" />
                          <span className={`font-body text-sm leading-snug ${hl ? 'text-white/85' : 'text-ink'}`}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </TiltCard>
                )
              })}
            </div>
          </div>
        </section>

        {/* ---- VALUES + LEAD FORM ---- */}
        <LbSeen event="lb_form" page="tutienda" />
        <section className="px-6 py-16 md:py-24 border-t border-white/10 scroll-mt-8" style={{ backgroundColor: DARK }}>
          <div className="mx-auto w-full max-w-md md:max-w-5xl">
            <div className="md:grid md:grid-cols-2 md:gap-14 md:items-center">
              <div className="mb-10 md:mb-0">
                <h2
                  className="font-display font-bold text-white tracking-tight leading-[1.1] mb-5 md:mb-7"
                  style={{ fontSize: 'clamp(1.65rem, 3vw, 2.35rem)' }}
                >
                  {t.values.titleLine1}
                  <br />
                  {t.values.titleLine2}
                </h2>

                <p className="font-body text-base md:text-lg font-semibold uppercase tracking-[0.12em] text-white/50 mb-4">
                  {t.values.kicker}
                </p>
                <ul className="space-y-3.5 mb-8 md:mb-9">
                  {t.values.items.map((v, i) => (
                    <li key={v.title} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D46FC8] text-white font-display font-bold text-sm flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span className="font-body text-lg md:text-xl text-white/80 leading-relaxed">
                        <span className="font-semibold text-white">{v.title}.</span> {v.body}
                      </span>
                    </li>
                  ))}
                </ul>

                <ReputationBadge className="scale-110 origin-left" locale={locale} align="left" />
              </div>

              <div className="md:ml-auto md:w-full md:max-w-md">
                <LeadForm
                  variant="dark"
                  ctaLabel={d.form.cta}
                  id="tienda-form"
                  planOptions={planOptions}
                  leadSource={leadSource}
                  sendWelcome
                  locale={locale}
                  submitBeacon={{ event: 'lb_submit', page: 'tutienda' }}
                />
                <div className="text-center mt-2.5">
                  <WhatsAppLink label={d.form.whatsapp ?? 'WhatsApp'} tone="dark" prefill={t.whatsappPrefill} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- ÚLTIMOS PROYECTOS (below the first form) ---- */}
        <div id="proyectos" className="scroll-mt-4">
          <LatestFeaturedWork forceDark title={d.featuredTitle} />
        </div>

        {/* ---- MANTENIMIENTO CON YELE (care feature cards) ---- */}
        <section className="bg-white px-6 pt-6 md:pt-8 pb-8 md:pb-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-ink tracking-tight">
                {d.care.title1}<br className="sm:hidden" /><span className="text-[#D46FC8]">{d.care.title2}</span>
              </h2>
              <p className="font-body text-base text-muted mt-2">{d.care.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-hairline p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 hover:border-ink/20">
                <CareVideo webm="/media/beyond/SEO_hq.webm" mp4="/media/beyond/SEO_hq.mp4" poster="/media/beyond/SEO_poster.jpg" />
                <div className="flex items-center gap-2 mb-1.5">
                  <FilePlus2 size={18} className="text-[#D46FC8] flex-shrink-0" aria-hidden="true" />
                  <h4 className="font-display font-bold text-lg text-ink">{d.care.contentTitle}</h4>
                </div>
                <p className="font-body text-sm text-muted leading-relaxed">{d.care.contentBody}</p>
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
                <p className="font-body text-sm text-muted leading-relaxed mb-3">{d.care.maintBody}</p>
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

        {/* ---- CÓMO FUNCIONA ---- */}
        <section className="bg-white px-6 pt-8 md:pt-10 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted mb-3">{t.how.kicker}</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-ink tracking-tight mb-10">{t.how.title}</h2>
            <div className="space-y-4">
              {t.how.steps.map((step, i) => (
                <div key={step.title} className="group flex gap-5 rounded-2xl p-4 -mx-4 transition-all duration-300 hover:bg-black/[0.03] hover:translate-x-1">
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

        {/* ---- POR QUÉ LOS NEGOCIOS ELIGEN YELE ---- */}
        <LbSeen event="lb_porque" page="tutienda" />
        <section className="px-6 py-16 md:py-24 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-2">{d.why.title}</h2>
            <p className="font-body text-base text-white/70 mb-10">{d.why.subtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyItems.map((w, i) => (
                <div key={w.title} className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-black/40">
                  <CareVideo webm={WHY_MEDIA[i].webm} mp4={WHY_MEDIA[i].mp4} poster={WHY_MEDIA[i].poster} />
                  <h3 className="font-display font-bold text-lg text-white mb-1">{w.title}</h3>
                  <p className="font-body text-sm text-white/70 leading-relaxed">{w.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
              <video className="w-full aspect-video rounded-2xl object-cover border border-white/10" autoPlay muted loop playsInline preload="none" poster="/media/conveyor_poster.jpg">
                <source src="/media/conveyor.mp4" type="video/mp4" />
              </video>
              <div>
                <h3 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-4">
                  {d.why.neverTitlePre}<span className="text-[#D46FC8]">{d.why.neverWord}</span>{d.why.neverTitlePost}
                </h3>
                <p className="font-body text-base md:text-lg text-white/70 leading-relaxed">{d.why.neverBody}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---- TESTIMONIALS ---- */}
        <Testimonios locale={locale} />

        <StartNowMarquee />

        <LbSeen event="lb_faq" page="tutienda" />
        <LetsBuildFAQ locale={locale} items={t.faq} />

        {/* ---- LEAD FORM (detailed, 2nd form) ---- */}
        <section id="build-form" className="px-6 py-16 md:py-24" style={{ backgroundColor: DARK }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-2">{d.buildForm.title}</h2>
            <p className="font-body text-base text-white/70 mb-8">{d.buildForm.subtitle}</p>
            <BuildLeadForm variant="dark" leadSource={leadSource} sendWelcome packages={t.buildPackages} />
          </div>
        </section>

        {/* ---- FINAL CTA ---- */}
        <section className="px-6 py-20 md:py-28 border-t border-white/10" style={{ backgroundColor: DARK }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
              <video className="w-full aspect-video rounded-2xl object-cover border border-white/10 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40" autoPlay muted loop playsInline preload="none" poster="/media/boldstats/boldstats_poster.jpg">
                <source src="/media/boldstats/boldstats_hq.webm" type="video/webm" />
                <source src="/media/boldstats/boldstats_hq.mp4" type="video/mp4" />
              </video>
              <div>
                <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight mb-5">
                  {t.finalCta.title}
                </h2>
                <p className="font-body text-base md:text-lg text-white/70 leading-relaxed mb-2">{t.finalCta.line1}</p>
                <p className="font-body text-base text-white/60">{t.finalCta.line2}</p>
              </div>
            </div>
            <div className="mt-12 text-center">
              <a href="#build-form" className="inline-flex items-center justify-center font-body font-medium text-base bg-[#D46FC8] hover:bg-[#DE85D2] text-white px-8 py-4 rounded-xl transition-colors">
                {d.finalCta.startNow}
              </a>
            </div>
          </div>
        </section>

        {/* ---- Footer ---- */}
        <footer className="px-6 py-10 border-t border-white/10" style={{ backgroundColor: DARK }}>
          <div className="max-w-6xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-body text-sm text-white/50">© {new Date().getFullYear()} Yele. {d.footer.rights}</p>
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href={legalPrefix + '/terms'} className="font-body text-sm text-white/60 hover:text-white transition-colors">{d.footer.terms}</Link>
              <Link href={legalPrefix + '/privacy-policy'} className="font-body text-sm text-white/60 hover:text-white transition-colors">{d.footer.privacy}</Link>
              <Link href={legalPrefix + '/legal-notice'} className="font-body text-sm text-white/60 hover:text-white transition-colors">{d.footer.legal}</Link>
            </nav>
          </div>
        </footer>
      </main>
    </EnLangProvider>
  )
}

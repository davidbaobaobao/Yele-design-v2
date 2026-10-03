import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Check, FilePlus2, RefreshCw, Wrench } from 'lucide-react'
import LeadForm from '@/components/LeadForm'
import TuTiendaHero from '@/components/tutienda/TuTiendaHero'
import ReputationBadge from '@/components/ReputationBadge'
import PricingCards from '@/components/letsbuild/PricingCards'
import CareVideo from '@/components/letsbuild/CareVideo'
import StartNowMarquee from '@/components/letsbuild/StartNowMarquee'
import { LbHeroPing, LbSeen } from '@/components/letsbuild/LbTrack'
import WhatsAppLink from '@/components/WhatsAppLink'
import { EnLangProvider } from '@/components/LangProvider'
import { getFunnelDict } from '@/lib/i18n/funnel'

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

// ---- Ecommerce pricing tiers (Business / Pro), fixed prices (no "desde"). ----
const TIENDA_TIERS = [
  {
    name: 'Business',
    amount: '1.199',
    planValue: 'Business — 1.199€',
    blurb: '',
    headline: null,
    features: [
      { label: 'Diseño personalizado, no plantilla' },
      { label: 'Optimizado para vender' },
      { label: 'Fotos y vídeos customizados para 20 productos' },
      { label: 'Chat IA inteligente' },
      { label: 'Pago seguro' },
    ],
    care: '49€',
    cta: 'Elegir Business',
    popular: true,
  },
  {
    name: 'Pro',
    amount: '2.799',
    planValue: 'Pro — 2.799€',
    blurb: '',
    headline: 'Todo lo de Business, y además:',
    features: [
      { label: 'Fotos y vídeos customizados para 50 productos' },
      { label: 'Catálogo de 100+ productos' },
      { label: 'Base de datos de alto rendimiento' },
      { label: 'Integraciones avanzadas' },
      { label: 'Extensiones' },
    ],
    care: '99€',
    cta: 'Elegir Pro',
    popular: false,
  },
]

// ---- Hero price comparison: what you'd pay monthly, by sales volume. ----
const HERO_PRICE_ROWS = [
  { sales: '5.000 €', yele: '99 €', save: '40,7 % menos', shopify: '167 €' },
  { sales: '20.000 €', yele: '309 €', save: '46,0 % menos', shopify: '572 €' },
  { sales: '50.000 €', yele: '729 €', save: '43,6 % menos', shopify: '1.292 €' },
]

function HeroPriceTable() {
  return (
    <div className="rounded-2xl bg-white/[0.06] border border-white/12 backdrop-blur p-5 md:p-6 shadow-2xl shadow-black/40">
      <p className="font-body text-sm font-semibold uppercase tracking-[0.12em] text-white/50 mb-1">Lo que pagarías al mes</p>
      <h2 className="font-display font-bold text-xl md:text-2xl text-white tracking-tight mb-4">Yele vs Shopify</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/15">
            <th className="text-left font-body text-xs font-semibold uppercase tracking-wide text-white/50 pb-2">Ventas/mes</th>
            <th className="text-right font-body text-xs font-semibold uppercase tracking-wide text-[#D46FC8] pb-2">Yele</th>
            <th className="text-right font-body text-xs font-semibold uppercase tracking-wide text-white/50 pb-2">Shopify</th>
          </tr>
        </thead>
        <tbody>
          {HERO_PRICE_ROWS.map(r => (
            <tr key={r.sales} className="border-b border-white/8 last:border-0">
              <td className="py-3 font-body text-sm md:text-base text-white/85 font-semibold">{r.sales}</td>
              <td className="py-3 text-right">
                <span className="block font-display text-base md:text-lg font-bold text-white">{r.yele}</span>
                <span className="block font-body text-xs text-[#34C759] font-semibold">{r.save}</span>
              </td>
              <td className="py-3 text-right font-body text-sm md:text-base text-white/45 line-through">{r.shopify}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="font-body text-[11px] text-white/40 mt-3 leading-relaxed">
        Estimación sobre comisiones y cuota mensual. Shopify: plan equivalente por volumen.
      </p>
    </div>
  )
}

// ---- Feature-by-feature comparison (Yele vs Shopify). ----
const FEATURE_ROWS = [
  { feature: 'Cuota mensual', yele: '29 €', shopify: 'Basic: 32 € · Grow: 92 € · Advanced: 384 €' },
  { feature: 'Comisión base', yele: '1 % + 0,20 €', shopify: 'Basic: 2,1 % + 0,30 €' },
  { feature: 'Comisión para mayor volumen', yele: 'A negociar', shopify: 'Grow: 1,8 % + 0,30 € · Advanced: 1,6 % + 0,30 €' },
  { feature: 'Cuentas de empleados', yele: 'Ilimitadas', shopify: 'Según el plan' },
  { feature: 'Personalización', yele: 'Completa', shopify: 'Según el plan y las extensiones' },
]

// ---- Yele Care maintenance plans for ecommerce. ----
const CARE_TIERS = [
  {
    name: 'Lite',
    price: '29€',
    popular: false,
    features: ['Alojamiento', 'SSL y seguridad', 'Copias de seguridad'],
  },
  {
    name: 'Yele Care',
    price: '49€',
    popular: true,
    features: ['Fotos y vídeos customizados de 5 productos al mes', 'Soporte para modificar/añadir productos', 'Rediseño anual'],
  },
  {
    name: 'Yele Care+',
    price: '99€',
    popular: false,
    features: ['Fotos y vídeos customizados de 15 productos al mes', 'Rediseño por temporada', 'Soporte prioritario'],
  },
]

// ---- Ecommerce-specific core values for the form section. ----
const TIENDA_VALUES = [
  { title: 'Diseño', body: 'Nada genérico, sin IA barata, sin plantillas aburridas.' },
  { title: 'Estructura', body: 'Optimizado con un solo propósito: vender.' },
  { title: 'Rendimiento', body: 'Optimizada para conseguirte más clientes y más ventas.' },
]

const PLAN_OPTIONS = ['Business — 1.199€', 'Pro — 2.799€']

// /es/tutienda — ecommerce Meta-ads landing. Reuses the proven /letsbuild
// section flow (care, how, why, testimonials, FAQ, forms, footer) but with
// store-specific hero, Shopify comparisons, pricing and values. Spanish-only.
export default function TuTiendaLanding() {
  const d = getFunnelDict('es')
  const leadSource = "Tu Tienda (ES)"

  return (
    <EnLangProvider>
      <main className="overflow-x-hidden" style={{ backgroundColor: DARK }}>
        <LbHeroPing page="tutienda" />

        {/* ---- HERO — text + pills + CTAs left, price table right. ---- */}
        <TuTiendaHero rightPanel={<HeroPriceTable />} />

        <LogoMarquee />

        <div id="proyectos" className="scroll-mt-4">
          <LatestFeaturedWork forceDark title={d.featuredTitle} />
        </div>

        {/* ---- COMPARATIVA Yele vs Shopify (feature table) ---- */}
        <section id="comparativa" className="px-6 py-16 md:py-24 border-t border-white/10 scroll-mt-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-2">
              Yele vs Shopify
            </h2>
            <p className="font-body text-base text-white/70 mb-8">
              Una tienda hecha a medida, con comisiones mucho más bajas.
            </p>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white/[0.04]">
                    <th className="text-left font-body text-xs font-semibold uppercase tracking-wide text-white/50 px-4 py-3">Característica</th>
                    <th className="text-left font-body text-xs font-semibold uppercase tracking-wide text-[#D46FC8] px-4 py-3">Yele</th>
                    <th className="text-left font-body text-xs font-semibold uppercase tracking-wide text-white/50 px-4 py-3">Shopify</th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_ROWS.map(r => (
                    <tr key={r.feature} className="border-t border-white/8">
                      <td className="px-4 py-4 font-body text-sm text-white/85 font-semibold align-top">{r.feature}</td>
                      <td className="px-4 py-4 font-body text-sm text-white align-top">{r.yele}</td>
                      <td className="px-4 py-4 font-body text-sm text-white/55 align-top">{r.shopify}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ---- PRICING (Business / Pro) ---- */}
        <LbSeen event="lb_precios" page="tutienda" />
        <section id="pricing" className="bg-white px-6 pt-20 md:pt-28 pb-10 md:pb-12 scroll-mt-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-ink tracking-tight text-center mb-10 md:mb-14">
              Precios
            </h2>
            <PricingCards locale="es" tiers={TIENDA_TIERS} />
            <p className="max-w-2xl mx-auto text-center font-body text-base text-muted mt-10 leading-relaxed">
              {d.pricing.payNote}
            </p>
          </div>
        </section>

        {/* ---- YELE CARE PLAN TIERS (Lite / Care / Care+) ---- */}
        <section className="px-6 py-16 md:py-24 border-t border-white/10" style={{ backgroundColor: DARK }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-14">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight">
                Mantenimiento con <span className="text-[#D46FC8]">Yele Care</span>
              </h2>
              <p className="font-body text-base text-white/70 mt-2">
                Tu tienda cuidada cada mes — contenido, soporte y rediseños incluidos.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {CARE_TIERS.map(t => (
                <div
                  key={t.name}
                  className={`relative flex flex-col rounded-3xl p-8 ${
                    t.popular
                      ? 'bg-[#1C1D24] border-2 border-[#D46FC8] shadow-[0_24px_64px_rgba(0,0,0,0.5)]'
                      : 'bg-white/[0.03] border border-white/10'
                  }`}
                >
                  {t.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#D46FC8] px-3 py-1 font-body text-xs font-semibold text-white">
                      Más popular
                    </span>
                  )}
                  <p className="font-body text-sm font-medium text-white/50 mb-2">{t.name}</p>
                  <div className="mb-6 flex items-end gap-1">
                    <span className="mb-1 font-body text-2xl font-semibold text-white/60">€</span>
                    <span className="font-display text-5xl font-semibold tracking-tight text-white">{t.price.replace('€', '')}</span>
                    <span className="mb-2 font-body text-sm text-white/50">/mes</span>
                  </div>
                  <ul className="flex flex-1 flex-col gap-3">
                    {t.features.map(feat => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <Check size={15} className="mt-0.5 flex-shrink-0 text-[#34C759]" aria-hidden="true" />
                        <span className="font-body text-sm text-white/80">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
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
                  className="font-display font-bold text-white tracking-tight leading-[1.03] mb-5 md:mb-7"
                  style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
                >
                  Empecemos con tu tienda
                </h2>

                <p className="font-body text-base md:text-lg font-semibold uppercase tracking-[0.12em] text-white/50 mb-4">
                  Nuestros valores
                </p>
                <ul className="space-y-3.5 mb-8 md:mb-9">
                  {TIENDA_VALUES.map((v, i) => (
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

                <ReputationBadge className="scale-110 origin-left" locale="es" align="left" />
              </div>

              <div className="md:ml-auto md:w-full md:max-w-md">
                <LeadForm
                  variant="dark"
                  ctaLabel={d.form.cta}
                  id="tienda-form"
                  planOptions={PLAN_OPTIONS}
                  leadSource={leadSource}
                  sendWelcome
                  locale="es"
                  submitBeacon={{ event: 'lb_submit', page: 'tutienda' }}
                />
                <div className="text-center mt-2.5">
                  <WhatsAppLink label={d.form.whatsapp ?? 'O danos un toque por WhatsApp'} tone="dark" prefill="¡Hola! Me interesa una tienda online con Yele." />
                </div>
              </div>
            </div>
          </div>
        </section>

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
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted mb-3">{d.how.kicker}</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-ink tracking-tight mb-10">{d.how.title}</h2>
            <div className="space-y-4">
              {d.how.steps.map((step, i) => (
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
              {d.why.items.map((w, i) => (
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
        <Testimonios locale="es" />

        <StartNowMarquee />

        <LbSeen event="lb_faq" page="tutienda" />
        <LetsBuildFAQ locale="es" />

        {/* ---- LEAD FORM (detailed, 2nd form) ---- */}
        <section id="build-form" className="px-6 py-16 md:py-24" style={{ backgroundColor: DARK }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight mb-2">{d.buildForm.title}</h2>
            <p className="font-body text-base text-white/70 mb-8">{d.buildForm.subtitle}</p>
            <BuildLeadForm variant="dark" leadSource={leadSource} sendWelcome />
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
                  Tu tienda merece un escaparate a su altura.
                </h2>
                <p className="font-body text-base md:text-lg text-white/70 leading-relaxed mb-2">
                  Una tienda online a medida, optimizada para vender — con comisiones mucho más bajas que Shopify.
                </p>
                <p className="font-body text-base text-white/60">
                  Tiendas desde 1.199€. Yele Care desde 29€/mes. 50% para empezar, 50% al lanzar.
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

        {/* ---- Footer ---- */}
        <footer className="px-6 py-10 border-t border-white/10" style={{ backgroundColor: DARK }}>
          <div className="max-w-6xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-body text-sm text-white/50">© {new Date().getFullYear()} Yele. {d.footer.rights}</p>
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/es/terms" className="font-body text-sm text-white/60 hover:text-white transition-colors">{d.footer.terms}</Link>
              <Link href="/es/privacy-policy" className="font-body text-sm text-white/60 hover:text-white transition-colors">{d.footer.privacy}</Link>
              <Link href="/es/legal-notice" className="font-body text-sm text-white/60 hover:text-white transition-colors">{d.footer.legal}</Link>
            </nav>
          </div>
        </footer>
      </main>
    </EnLangProvider>
  )
}

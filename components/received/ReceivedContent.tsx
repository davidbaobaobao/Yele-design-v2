import Link from 'next/link'
import TierCard, { type Tier } from '@/components/received/TierCard'
import ReceivedCalEmbed from '@/components/received/ReceivedCalEmbed'
import WhatsAppLink from '@/components/WhatsAppLink'
import LocaleSwitcher from '@/components/letsbuild/LocaleSwitcher'
import { getFunnelDict, currencySymbol, type Locale } from '@/lib/i18n/funnel'

// Numeric price/pay amounts are identical across locales; only the currency
// symbol changes ($ for en, € for es/zh). desc comes from the dictionary.
const PAY_VERB: Record<Locale, string> = { en: 'Pay', es: 'Pagar', zh: '支付' }

const TIER_DESC: Record<Locale, string[]> = {
  en: [
    'A functional, modern website — mobile-optimized, with your own domain, contact forms and SEO.',
    'A functional, modern website with advanced payments and scheduling capabilities.',
    'A functional, modern website with advanced functionality and high-performance applications.',
  ],
  es: [
    'Una web funcional y moderna — optimizada para móvil, con dominio propio, formularios de contacto y SEO.',
    'Una web funcional y moderna con pagos y reservas avanzadas.',
    'Una web funcional y moderna con funcionalidad avanzada y aplicaciones de alto rendimiento.',
  ],
  zh: [
    '一个功能完善的现代网站 — 移动端优化，拥有专属域名、联系表单和 SEO。',
    '一个功能完善的现代网站，具备进阶支付和预约功能。',
    '一个功能完善的现代网站，具备进阶功能和高性能应用。',
  ],
}

function buildTiers(locale: Locale): Tier[] {
  const s = currencySymbol(locale)
  const desc = TIER_DESC[locale]
  return [
    { plan: 'launch', name: 'Launch', price: `${s}699`, care: `${s}49`, pay: `${s}349`, desc: desc[0], dark: false },
    { plan: 'business', name: 'Business', price: `${s}1,199`, care: `${s}49`, pay: `${s}599`, desc: desc[1], dark: false },
    { plan: 'pro', name: 'Pro', price: `${s}2,799`, from: true, care: `${s}99`, pay: `${s}1,399`, desc: desc[2], dark: true },
  ]
}

export default function ReceivedContent({
  locale = 'en',
  searchParams,
}: {
  locale?: Locale
  searchParams: { name?: string; email?: string; company?: string; plan?: string }
}) {
  const d = getFunnelDict(locale).received
  const rawName = searchParams.name?.trim() ?? ''
  const email = searchParams.email?.trim() ?? ''
  const company = searchParams.company?.trim() ?? ''
  const firstName = rawName.split(/\s+/)[0]
  const name = firstName.length > 0 && firstName.length <= 40 ? firstName : ''

  const plan = (searchParams.plan ?? '').trim()
  const allTiers = buildTiers(locale)
  const selected = allTiers.filter(t => t.plan === plan)
  const shownTiers = selected.length > 0 ? selected : allTiers
  const single = shownTiers.length === 1
  const foot = getFunnelDict(locale).footer

  return (
    <div className="min-h-screen bg-white flex justify-center px-6 py-16">
      <LocaleSwitcher current={locale} />
      <div className="max-w-4xl w-full">
        <Link href="/" className="inline-flex items-center mb-10 focus-visible:outline-none" aria-label="yele">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG, Next's image optimizer refuses to serve those */}
          <img src="/media/logomedia/mainlogo.svg" alt="" className="h-8 w-auto" />
        </Link>

        <h1 className="font-display font-bold text-4xl md:text-5xl text-ink tracking-tight leading-tight mb-3">
          {name ? d.welcomeName(name) : d.welcome}
        </h1>
        <p className="font-body text-ink/75 text-lg md:text-xl mb-8">
          {d.callLead}
        </p>

        {/* ---- Booking calendar ---- */}
        <div className="-mx-6 mb-4 md:mx-0 md:h-[430px] md:w-full md:overflow-hidden md:rounded-2xl md:border md:border-hairline">
          <ReceivedCalEmbed name={rawName} email={email} />
        </div>

        {/* Spanish version: offer WhatsApp as an alternative to the calendar. */}
        {getFunnelDict(locale).form.whatsapp && (
          <div className="mb-10 text-center">
            <WhatsAppLink label={getFunnelDict(locale).form.whatsapp as string} tone="light" prefill="¡Hola! Acabo de reservar/ver la web con Yele." />
          </div>
        )}

        {/* ---- Don't want to wait? Pay 50% now ---- */}
        <div className="border-t border-hairline pt-12">
          <h2 className="font-display font-bold text-3xl md:text-5xl text-ink tracking-tight mb-3">
            {d.dontWait}
          </h2>
          <p className="font-body text-base md:text-lg text-ink/75 leading-relaxed max-w-2xl mb-6">
            {d.dontWaitBody}
          </p>
          <div className={`grid items-start gap-4 [perspective:1200px] ${single ? 'max-w-sm' : 'grid-cols-1 md:grid-cols-3'}`}>
            {shownTiers.map(tier => (
              <TierCard key={tier.plan} tier={tier} name={rawName} email={email} company={company} payLabel={d.pay50} payVerb={PAY_VERB[locale]} locale={locale} />
            ))}
          </div>
        </div>

        {/* ---- Next steps ---- */}
        <div className="mt-16">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-ink tracking-tight mb-6">{d.nextSteps}</h2>
          <ol className="space-y-4">
            {d.steps.map((step, i) => (
              <li key={step.title} className="group flex gap-4 rounded-2xl p-3 -mx-3 transition-all duration-300 hover:bg-black/[0.03] hover:translate-x-1">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#D46FC8]/15 text-[#D46FC8] font-display font-bold flex items-center justify-center transition-all duration-300 group-hover:bg-[#D46FC8] group-hover:text-white group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#D46FC8]/30">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-xl text-ink mb-1 transition-colors duration-300 group-hover:text-[#D46FC8]">{step.title}</h3>
                  <p className="font-body text-base text-ink/75 leading-relaxed max-w-2xl">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10">
          <Link href="/" className="font-body text-base text-muted hover:text-ink transition-colors">
            {d.backHome}
          </Link>
        </div>

        {/* ---- Footer (static, no animation) ---- */}
        <footer className="mt-16 border-t border-hairline pt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-sm text-muted">
            © {new Date().getFullYear()} Yele. {foot.rights}
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/terms" className="font-body text-sm text-muted hover:text-ink transition-colors">
              {foot.terms}
            </Link>
            <Link href="/privacy-policy" className="font-body text-sm text-muted hover:text-ink transition-colors">
              {foot.privacy}
            </Link>
            <Link href="/legal-notice" className="font-body text-sm text-muted hover:text-ink transition-colors">
              {foot.legal}
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  )
}

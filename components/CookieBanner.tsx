'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, ChevronDown } from 'lucide-react'

declare global {
  interface Window { clarity?: (...args: unknown[]) => void }
}

type Prefs = { analytics: boolean; marketing: boolean }

const CONSENT_KEY = 'cookie-consent'

// Geo-split consent model:
//  • EU / localized pages (/es, /zh): PRIOR OPT-IN. A blocking top panel with a
//    backdrop — the visitor must click Accept or Reject before anything
//    non-essential (Meta Pixel, funnel analytics) runs. Toggles default OFF.
//    This is the AEPD/ePrivacy-compliant path.
//  • Detected non-EU (English): opt-out — trackers already fired on load
//    (see lib/metaPixel.ts hasMarketingConsent, which grants by default only
//    when yele_eu=0). The panel still shows and still asks for a choice, but
//    without the blocking backdrop since nothing is being gated.
export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [isEu, setIsEu] = useState(true)
  // Toggles default OFF (opt-in) — only an explicit Accept / Save turns them on.
  const [prefs, setPrefs] = useState<Prefs>({ analytics: false, marketing: false })
  const decidedRef = useRef(false)
  const pathname = usePathname()
  const locale = pathname.startsWith('/es') ? 'es' : pathname.startsWith('/zh') ? 'zh' : 'en'
  const tt = (es: string, en: string, zh?: string) => (locale === 'es' ? es : locale === 'zh' ? (zh ?? en) : en)
  // Blocking (backdrop + scroll lock) for EU and any localized page — the
  // stricter audience that requires prior opt-in.
  const blocking = isEu || locale !== 'en'

  useEffect(() => {
    let stored: string | null = null
    try { stored = localStorage.getItem(CONSENT_KEY) } catch { stored = null }
    if (stored) return
    let nonEu = false
    try { nonEu = document.cookie.split('; ').some(c => c === 'yele_eu=0') } catch { nonEu = false }
    setIsEu(!nonEu)
    setVisible(true)
  }, [])

  // Lock page scroll while the blocking panel is up, so the visitor can't
  // interact with the page before choosing.
  useEffect(() => {
    if (!visible || !blocking) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [visible, blocking])

  function commit(p: Prefs) {
    if (decidedRef.current) return
    decidedRef.current = true
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ essential: true, ...p })) } catch { /* storage may be blocked */ }
    window.clarity?.('consentv2', {
      ad_Storage: p.marketing ? 'granted' : 'denied',
      analytics_Storage: p.analytics ? 'granted' : 'denied',
    })
    // Lets consent-gated scripts (MetaPixelScript, site-wide) react immediately
    // — on EU this is what actually mounts the pixel once they accept.
    window.dispatchEvent(new Event('cookie-consent-updated'))
    setVisible(false)
  }

  if (!visible) return null

  const title = tt('Tu privacidad', 'Your privacy', '你的隐私')
  const desc = tt(
    'Usamos cookies para analizar el tráfico, medir nuestras campañas y mejorar el sitio. Elige una opción para continuar.',
    'We use cookies to analyse traffic, measure our campaigns and improve the site. Choose an option to continue.',
    '我们使用 Cookie 来分析流量、衡量广告效果并改进网站。请选择一项以继续。',
  )

  return (
    <AnimatePresence>
      {blocking && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-[99] bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden="true"
        />
      )}

      <motion.div
        key="panel"
        role="dialog"
        aria-modal={blocking}
        aria-label={title}
        className="fixed inset-x-0 top-0 z-[100] p-3 sm:p-4"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -24, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_rgba(0,0,0,0.3)] ring-1 ring-black/10">
          {/* Pink accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-[#D46FC8] via-[#DE85D2] to-[#D46FC8]" aria-hidden="true" />

          <div className="p-5 sm:p-6">
            {!expanded ? (
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#D46FC8]/12 text-[#D46FC8]">
                    <Cookie size={20} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-ink text-base mb-0.5">{title}</p>
                    <p className="font-body text-sm text-muted leading-relaxed">{desc}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center md:flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => commit({ analytics: true, marketing: true })}
                    className="order-1 sm:order-2 inline-flex items-center justify-center rounded-xl bg-[#D46FC8] px-7 py-3.5 font-body text-base font-semibold text-white shadow-lg shadow-[#D46FC8]/30 transition-colors hover:bg-[#DE85D2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D46FC8]"
                  >
                    {tt('Aceptar', 'Accept', '接受')}
                  </button>
                  <button
                    type="button"
                    onClick={() => commit({ analytics: false, marketing: false })}
                    className="order-2 sm:order-1 inline-flex items-center justify-center rounded-xl border border-ink/20 px-6 py-3.5 font-body text-base font-medium text-ink transition-colors hover:bg-black/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    {tt('Rechazar', 'Reject', '拒绝')}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="font-display font-bold text-ink text-base">{tt('Preferencias de cookies', 'Cookie preferences', 'Cookie 偏好设置')}</p>
                  <button onClick={() => setExpanded(false)} aria-label={tt('Cerrar', 'Close', '关闭')} className="text-muted hover:text-ink transition-colors">
                    <ChevronDown size={18} />
                  </button>
                </div>

                <div className="mb-5 rounded-xl border border-hairline overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-hairline bg-black/[0.015]">
                    <div className="pr-4">
                      <p className="font-body text-sm font-medium text-ink">{tt('Esenciales', 'Essential', '必要')}</p>
                      <p className="font-body text-xs text-muted">{tt('Necesarias para que el sitio funcione.', 'Required for the site to function.', '网站运行所必需。')}</p>
                    </div>
                    <span className="font-body text-xs text-[#34C759] font-medium shrink-0">{tt('Siempre activas', 'Always on', '始终开启')}</span>
                  </div>

                  <Toggle
                    label={tt('Analítica', 'Analytics', '分析')}
                    desc={tt('Nos ayudan a mejorar el sitio web.', 'Help us improve the website.', '帮助我们改进网站。')}
                    on={prefs.analytics}
                    onToggle={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                    border
                  />
                  <Toggle
                    label={tt('Marketing', 'Marketing', '营销')}
                    desc={tt('Medición de campañas y publicidad personalizada.', 'Campaign measurement and personalised advertising.', '广告衡量与个性化广告。')}
                    on={prefs.marketing}
                    onToggle={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                  />
                </div>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <a
                    href={locale === 'es' ? '/es/privacy-policy' : locale === 'zh' ? '/zh/privacy-policy' : '/privacy-policy'}
                    className="font-body text-xs text-muted hover:text-ink transition-colors underline underline-offset-2 text-center sm:text-left"
                  >
                    {tt('Política de privacidad', 'Privacy policy', '隐私政策')}
                  </a>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => commit({ analytics: false, marketing: false })}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl border border-ink/20 px-5 py-3 font-body text-sm font-medium text-ink transition-colors hover:bg-black/[0.04]"
                    >
                      {tt('Rechazar', 'Reject', '拒绝')}
                    </button>
                    <button
                      type="button"
                      onClick={() => commit(prefs)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl bg-[#D46FC8] px-6 py-3 font-body text-sm font-semibold text-white shadow-lg shadow-[#D46FC8]/30 transition-colors hover:bg-[#DE85D2]"
                    >
                      {tt('Guardar selección', 'Save selection', '保存选择')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!expanded && (
              <div className="mt-3 flex items-center justify-center gap-4 md:justify-start">
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="font-body text-xs text-muted hover:text-ink transition-colors underline underline-offset-2"
                >
                  {tt('Personalizar', 'Customise', '自定义')}
                </button>
                <a
                  href={locale === 'es' ? '/es/privacy-policy' : locale === 'zh' ? '/zh/privacy-policy' : '/privacy-policy'}
                  className="font-body text-xs text-muted hover:text-ink transition-colors underline underline-offset-2"
                >
                  {tt('Política de privacidad', 'Privacy policy', '隐私政策')}
                </a>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function Toggle({ label, desc, on, onToggle, border }: { label: string; desc: string; on: boolean; onToggle: () => void; border?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 ${border ? 'border-b border-hairline' : ''}`}>
      <div className="pr-4">
        <p className="font-body text-sm font-medium text-ink">{label}</p>
        <p className="font-body text-xs text-muted">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onToggle}
        className={`relative ml-4 h-6 w-11 rounded-full shrink-0 transition-colors duration-200 ${on ? 'bg-[#D46FC8]' : 'bg-black/15'}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}

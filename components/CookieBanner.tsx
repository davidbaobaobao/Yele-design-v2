'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

declare global {
  interface Window { clarity?: (...args: unknown[]) => void }
}

type Prefs = { analytics: boolean; marketing: boolean }

const CONSENT_KEY = 'cookie-consent'

// Mango-style blocking consent modal: a centered card over a dimmed backdrop
// that locks the page until the visitor picks an option (Accept all / Necessary
// only / Manage). Toggles default OFF.
//
// Tracker gating is geo-split (see lib/metaPixel.ts hasMarketingConsent +
// funnelBeacon): EU/unknown are prior opt-in (nothing non-essential runs until
// Accept); detected non-EU (yele_eu=0) is opt-out. The modal still blocks
// navigation for everyone — it's the consent gate AND a deliberate interstitial.
export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>({ analytics: false, marketing: false })
  const decidedRef = useRef(false)
  const pathname = usePathname()
  const locale = pathname.startsWith('/es') ? 'es' : pathname.startsWith('/zh') ? 'zh' : 'en'
  const tt = (es: string, en: string, zh?: string) => (locale === 'es' ? es : locale === 'zh' ? (zh ?? en) : en)
  const policyHref = locale === 'es' ? '/es/cookie-policy' : '/cookie-policy'

  useEffect(() => {
    let stored: string | null = null
    try { stored = localStorage.getItem(CONSENT_KEY) } catch { stored = null }
    if (!stored) setVisible(true)
  }, [])

  // Lock page scroll while the modal is up.
  useEffect(() => {
    if (!visible) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [visible])

  function commit(p: Prefs) {
    if (decidedRef.current) return
    decidedRef.current = true
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ essential: true, ...p })) } catch { /* storage may be blocked */ }
    window.clarity?.('consentv2', {
      ad_Storage: p.marketing ? 'granted' : 'denied',
      analytics_Storage: p.analytics ? 'granted' : 'denied',
    })
    window.dispatchEvent(new Event('cookie-consent-updated'))
    setVisible(false)
  }

  const title = tt('LAS COOKIES MEJORAN TU EXPERIENCIA', 'COOKIES IMPROVE YOUR EXPERIENCE', 'COOKIE 让你的体验更好')
  const body = tt(
    'Utilizamos cookies propias y de terceros para fines analíticos y para medir nuestras campañas publicitarias. Puedes aceptar todas las cookies o gestionar tus preferencias en el panel de configuración.',
    'We use our own and third-party cookies for analytics and to measure our advertising campaigns. You can accept all cookies or manage your preferences in the settings panel.',
    '我们使用自有和第三方 Cookie 进行分析并衡量广告效果。你可以接受全部 Cookie，或在设置面板中管理你的偏好。',
  )
  const learnMore = tt('Consulta más información en ', 'Learn more in our ', '了解更多请查看')
  const policyLabel = tt('Política de cookies', 'Cookie Policy', 'Cookie 政策')

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[110] bg-black/55 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          />

          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className="w-full max-w-3xl bg-white shadow-[0_30px_90px_rgba(0,0,0,0.35)] rounded-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="p-6 sm:p-8">
                <h2 className="font-display font-bold text-ink text-sm sm:text-base uppercase tracking-wide leading-snug mb-2.5">
                  {title}
                </h2>

                {!expanded ? (
                  <>
                    <p className="font-body text-[13px] text-muted leading-relaxed mb-6 max-w-2xl">
                      {body}{' '}
                      {learnMore}
                      <a href={policyHref} className="font-semibold text-ink underline underline-offset-2 hover:text-[#D46FC8] transition-colors">
                        {policyLabel}
                      </a>
                      .
                    </p>

                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
                      <button
                        type="button"
                        onClick={() => setExpanded(true)}
                        className="font-body text-xs font-semibold uppercase tracking-wide text-ink underline underline-offset-4 hover:text-[#D46FC8] transition-colors py-2 sm:py-0 sm:mr-2"
                      >
                        {tt('Configurar cookies', 'Manage cookies', '管理 Cookie')}
                      </button>
                      <button
                        type="button"
                        onClick={() => commit({ analytics: false, marketing: false })}
                        className="w-full sm:w-auto inline-flex items-center justify-center border border-ink/25 px-8 py-4 font-body text-xs font-semibold uppercase tracking-wide text-ink rounded-lg transition-colors hover:bg-black/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                      >
                        {tt('Solo cookies necesarias', 'Necessary only', '仅必要 Cookie')}
                      </button>
                      <button
                        type="button"
                        onClick={() => commit({ analytics: true, marketing: true })}
                        className="w-full sm:w-auto inline-flex items-center justify-center bg-ink px-10 py-4 font-body text-xs font-semibold uppercase tracking-wide text-white rounded-lg transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                      >
                        {tt('Aceptar todas', 'Accept all', '全部接受')}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-6 rounded-xl border border-hairline overflow-hidden">
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

                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
                      <button
                        type="button"
                        onClick={() => commit({ analytics: false, marketing: false })}
                        className="font-body text-xs font-semibold uppercase tracking-wide text-ink underline underline-offset-4 hover:text-[#D46FC8] transition-colors py-2 sm:py-0 sm:mr-auto"
                      >
                        {tt('Rechazar todo', 'Reject all', '全部拒绝')}
                      </button>
                      <button
                        type="button"
                        onClick={() => commit(prefs)}
                        className="w-full sm:w-auto inline-flex items-center justify-center bg-ink px-10 py-4 font-body text-xs font-semibold uppercase tracking-wide text-white rounded-lg transition-colors hover:bg-black"
                      >
                        {tt('Guardar selección', 'Save selection', '保存选择')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
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

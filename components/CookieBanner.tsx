'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { buildConsentPayload, pageFromPath, localeFromPath, type ConsentEvent } from '@/lib/consent/consentStats'

declare global {
  interface Window { clarity?: (...args: unknown[]) => void }
}

type Prefs = { analytics: boolean; marketing: boolean }

const CONSENT_KEY = 'cookie-consent'

// Non-blocking cookie banner: a slim semi-transparent bar along the bottom on
// desktop, a small rounded box at the bottom on mobile. The visitor can keep
// browsing normally — it does NOT block the page.
//
// Tracker gating is geo-split (lib/metaPixel.ts hasMarketingConsent +
// funnelBeacon): in the EU / unknown region nothing non-essential runs until
// the visitor clicks Accept; detected non-EU (yele_eu=0) is opt-out. So EU
// visitors can browse with tracking OFF until they choose to accept.

// Fire one privacy-first banner-outcome counter. Minimal payload {event,page,
// locale} via sendBeacon — no cookies, no id, no PII. Fire-and-forget.
const statFired = new Set<ConsentEvent>()
function sendConsentStat(event: ConsentEvent, pathname: string) {
  try {
    if (statFired.has(event)) return
    const payload = buildConsentPayload(event, pageFromPath(pathname), localeFromPath(pathname))
    if (!payload) return
    statFired.add(event)
    const body = JSON.stringify(payload)
    const blob = new Blob([body], { type: 'application/json' })
    if (!navigator.sendBeacon?.('/api/consent-stats', blob)) {
      fetch('/api/consent-stats', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
    }
  } catch { /* best-effort only */ }
}

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
    if (!stored) {
      setVisible(true)
      sendConsentStat('shown', pathname)
    }
  }, [pathname])

  // "No choice" = the visitor leaves the page while the banner is unresolved.
  // pagehide + sendBeacon; fires at most once and only if no decision was made.
  useEffect(() => {
    if (!visible) return
    const onHide = () => { if (!decidedRef.current) sendConsentStat('no_choice', pathname) }
    window.addEventListener('pagehide', onHide)
    return () => window.removeEventListener('pagehide', onHide)
  }, [visible, pathname])

  function commit(p: Prefs) {
    if (decidedRef.current) return
    decidedRef.current = true
    // 'accept' if any non-essential was enabled, else 'reject'. Measurement
    // only — it does not change the consent stored below, and Reject is treated
    // exactly like Accept here.
    sendConsentStat(p.analytics || p.marketing ? 'accept' : 'reject', pathname)
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ essential: true, ...p })) } catch { /* storage may be blocked */ }
    window.clarity?.('consentv2', {
      ad_Storage: p.marketing ? 'granted' : 'denied',
      analytics_Storage: p.analytics ? 'granted' : 'denied',
    })
    window.dispatchEvent(new Event('cookie-consent-updated'))
    setVisible(false)
  }

  if (!visible) return null

  const body = tt(
    'Usamos cookies para analizar el tráfico y medir nuestras campañas. Puedes aceptarlas o gestionarlas.',
    'We use cookies to analyse traffic and measure our campaigns. You can accept or manage them.',
    '我们使用 Cookie 来分析流量并衡量广告效果。你可以接受或管理它们。',
  )

  return (
    <AnimatePresence>
      <motion.div
        key="cookie-banner"
        role="region"
        aria-label={tt('Aviso de cookies', 'Cookie notice', 'Cookie 通知')}
        className="fixed inset-x-0 bottom-0 z-[100] pointer-events-none"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        {/* Mobile: small rounded box inset from edges. Desktop: full-width bar. */}
        <div className="pointer-events-auto m-2.5 sm:m-0 rounded-2xl sm:rounded-none bg-white/85 backdrop-blur-xl shadow-[0_-2px_24px_rgba(0,0,0,0.12)] ring-1 ring-black/10 sm:ring-0 sm:border-t sm:border-hairline pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-6xl mx-auto px-4 py-3.5 sm:py-2.5">
            {!expanded ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <p className="font-body text-[13px] sm:text-xs text-muted leading-relaxed sm:flex-1 sm:min-w-0">
                  <span className="font-semibold text-ink">{tt('Cookies. ', 'Cookies. ', 'Cookie。')}</span>
                  {body}{' '}
                  <a href={policyHref} className="underline underline-offset-2 hover:text-ink transition-colors whitespace-nowrap">
                    {tt('Política de cookies', 'Cookie policy', 'Cookie 政策')}
                  </a>
                </p>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:shrink-0">
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    className="order-3 sm:order-1 font-body text-xs font-semibold uppercase tracking-wide text-ink underline underline-offset-4 hover:text-[#D46FC8] transition-colors py-1 sm:py-0 sm:mr-1"
                  >
                    {tt('Configurar', 'Manage', '管理')}
                  </button>
                  <button
                    type="button"
                    onClick={() => commit({ analytics: false, marketing: false })}
                    className="order-2 w-full sm:w-auto inline-flex items-center justify-center border border-ink/25 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-wide text-ink rounded-lg transition-colors hover:bg-black/[0.04]"
                  >
                    {tt('Solo necesarias', 'Necessary only', '仅必要')}
                  </button>
                  <button
                    type="button"
                    onClick={() => commit({ analytics: true, marketing: true })}
                    className="order-1 sm:order-3 w-full sm:w-auto inline-flex items-center justify-center bg-ink px-7 py-2.5 font-body text-xs font-semibold uppercase tracking-wide text-white rounded-lg transition-colors hover:bg-black"
                  >
                    {tt('Aceptar', 'Accept', '接受')}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-body text-sm font-semibold text-ink">{tt('Preferencias de cookies', 'Cookie preferences', 'Cookie 偏好设置')}</p>
                </div>
                <div className="mb-3 rounded-xl border border-hairline overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-hairline bg-black/[0.015]">
                    <div className="pr-4">
                      <p className="font-body text-xs font-medium text-ink">{tt('Esenciales', 'Essential', '必要')}</p>
                    </div>
                    <span className="font-body text-[11px] text-[#34C759] font-medium shrink-0">{tt('Siempre activas', 'Always on', '始终开启')}</span>
                  </div>
                  <Toggle
                    label={tt('Analítica', 'Analytics', '分析')}
                    on={prefs.analytics}
                    onToggle={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                    border
                  />
                  <Toggle
                    label={tt('Marketing', 'Marketing', '营销')}
                    on={prefs.marketing}
                    onToggle={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                  />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                  <button
                    type="button"
                    onClick={() => commit({ analytics: false, marketing: false })}
                    className="font-body text-xs font-semibold uppercase tracking-wide text-muted hover:text-ink transition-colors underline underline-offset-4 py-1.5 sm:py-0 sm:mr-auto"
                  >
                    {tt('Rechazar todo', 'Reject all', '全部拒绝')}
                  </button>
                  <button
                    type="button"
                    onClick={() => commit(prefs)}
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-ink px-7 py-2.5 font-body text-xs font-semibold uppercase tracking-wide text-white rounded-lg transition-colors hover:bg-black"
                  >
                    {tt('Guardar', 'Save', '保存')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function Toggle({ label, on, onToggle, border }: { label: string; on: boolean; onToggle: () => void; border?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 py-2.5 ${border ? 'border-b border-hairline' : ''}`}>
      <p className="font-body text-xs font-medium text-ink">{label}</p>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onToggle}
        className={`relative ml-4 h-5 w-9 rounded-full shrink-0 transition-colors duration-200 ${on ? 'bg-[#D46FC8]' : 'bg-black/15'}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}

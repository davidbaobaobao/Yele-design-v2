'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronUp } from 'lucide-react'

declare global {
  interface Window { clarity?: (...args: unknown[]) => void }
}

type Prefs = { analytics: boolean; marketing: boolean }

const CONSENT_KEY = 'cookie-consent'
// Deliberately generous/short — this is "did they keep browsing," not a
// precision UX timer. Exact values aren't load-bearing.
const SCROLL_THRESHOLD_PX = 200
const AUTO_ACCEPT_TIMEOUT_MS = 5000

// Opt-OUT model: consent is GRANTED the instant a visitor arrives (Meta
// Pixel/Clarity/gtag all fire immediately — see lib/metaPixel.ts's
// hasMarketingConsent(), which defaults to true when nothing is stored
// yet). This banner's job is purely to inform + offer an explicit Reject,
// not to gate anything itself — "kept browsing without objecting" (a
// scroll, a click elsewhere, a route change, or a few seconds passing)
// simply persists that implied default to localStorage so the banner
// doesn't re-prompt on the next visit; an explicit Reject is the ONLY
// action that actually turns anything off.
export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [isEu, setIsEu] = useState(true)
  const [prefs, setPrefs] = useState<Prefs>({ analytics: true, marketing: true })
  const bannerRef = useRef<HTMLDivElement>(null)
  // Guards against the explicit-click path and an auto-accept trigger both
  // resolving for the same visit (e.g. the "click elsewhere" listener
  // firing on the same click that hit the Reject button, just a tick
  // later) — whichever calls commit() first wins, everything after is a
  // no-op, regardless of exact event-ordering timing.
  const decidedRef = useRef(false)
  const pathname = usePathname()
  const firstPathnameRef = useRef(pathname)
  // The banner lives above the page's LanguageProvider, so it derives its own
  // language from the path (/es, /zh) to match the page it's shown on.
  const locale = pathname.startsWith('/es') ? 'es' : pathname.startsWith('/zh') ? 'zh' : 'en'
  const tt = (es: string, en: string, zh?: string) => (locale === 'es' ? es : locale === 'zh' ? (zh ?? en) : en)

  useEffect(() => {
    // localStorage can THROW in some in-app browsers (Instagram/Facebook
    // WebView, iOS private mode). If we don't guard it, the whole effect
    // throws before setVisible() runs and the banner silently never appears —
    // exactly the "no banner from a Meta ad on iPhone" case. Treat any failure
    // as "no stored choice yet" so we still show it.
    let stored: string | null = null
    try { stored = localStorage.getItem(CONSENT_KEY) } catch { stored = null }
    if (stored) return
    // The middleware sets `yele_eu` from geo — '0' means detected non-EU (e.g.
    // US). We show the banner to EVERYONE, but the behaviour differs:
    //  • Non-EU (US): a light, semitransparent notice that dismisses itself the
    //    moment the visitor keeps going (scroll / type / click / route / timeout).
    //  • EU/unknown: the banner STAYS until an explicit Accept or Reject.
    let nonEu = false
    try { nonEu = document.cookie.split('; ').some(c => c === 'yele_eu=0') } catch { nonEu = false }
    setIsEu(!nonEu)
    setVisible(true)
  }, [])

  function commit(p: Prefs) {
    if (decidedRef.current) return
    decidedRef.current = true
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ essential: true, ...p })) } catch { /* storage may be blocked in in-app browsers */ }
    // Re-affirms consent with the user's actual choice — layout.tsx already
    // granted implied consent on load, this updates it once they've made an
    // explicit selection (matters most for a Reject, where Clarity needs to
    // stop treating the visitor as tracked; analytics_Storage=denied
    // correctly keeps Clarity cookieless from that point on).
    window.clarity?.('consentv2', {
      ad_Storage: p.marketing ? 'granted' : 'denied',
      analytics_Storage: p.analytics ? 'granted' : 'denied',
    })
    // Broadcast for any other consent-gated script to react to (currently:
    // components/MetaPixelScript.tsx, site-wide) without this component
    // needing to know Meta-specific details itself. Meta itself has no
    // live consent-mode API — a Reject here stops FUTURE fbq calls (see
    // lib/metaPixel.ts's hasMarketingConsent() checks at each call site),
    // but can't retroactively undo whatever already fired before this
    // point. That's expected for the implied-consent model, not a bug.
    window.dispatchEvent(new Event('cookie-consent-updated'))
    setVisible(false)
  }

  // Explicit choice via the banner's own buttons.
  const save = (p: Prefs) => commit(p)

  // Passive "kept browsing" persistence: the first of a scroll past
  // SCROLL_THRESHOLD_PX, a click anywhere outside the banner itself, a
  // route change, or the timeout — whichever happens first — just writes
  // down the already-granted default so this banner doesn't reappear next
  // visit. Nothing here needs to grant anything that wasn't already true.
  useEffect(() => {
    // EU/unknown: no passive dismissal — the banner stays until an explicit
    // Accept or Reject. Only non-EU (US) gets the implied "kept browsing" model.
    if (!visible || isEu) return
    const persistDefault = () => commit({ analytics: true, marketing: true })

    const onScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD_PX) persistDefault()
    }
    const onClick = (e: MouseEvent) => {
      if (bannerRef.current?.contains(e.target as Node)) return
      persistDefault()
    }
    // Typing anywhere (e.g. the Web Police search box) also counts as "kept going".
    const onKey = () => persistDefault()
    const timer = setTimeout(persistDefault, AUTO_ACCEPT_TIMEOUT_MS)

    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    // Capture phase, not bubble: an in-banner click (e.g. "Manage") can
    // synchronously swap the collapsed view for the expanded panel before a
    // bubble-phase document listener would run, detaching the clicked
    // button from the DOM first — at that point `bannerRef.current.contains
    // (e.target)` wrongly returns false since the target is no longer in
    // the tree, misreading an in-banner click as "outside." Capture runs
    // top-down before React's own handler, so e.target is still attached.
    document.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onClick, true)
      clearTimeout(timer)
    }
  }, [visible, isEu])

  // Route-change trigger — separate effect since it only needs to react to
  // pathname actually changing, not fire on mount like the others above.
  useEffect(() => {
    if (!visible || isEu) return
    if (pathname !== firstPathnameRef.current) {
      commit({ analytics: true, marketing: true })
    }
  }, [pathname, visible, isEu])

  if (!visible) return null

  return (
    <div
      ref={bannerRef}
      className="fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-t border-hairline shadow-[0_-2px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
    >
      {expanded ? (
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-body text-sm font-semibold text-ink">{tt('Preferencias de cookies', 'Cookie preferences', 'Cookie 偏好设置')}</p>
            <button
              onClick={() => setExpanded(false)}
              aria-label="Collapse"
              className="text-muted hover:text-ink transition-colors"
            >
              <ChevronDown size={15} />
            </button>
          </div>

          <div className="space-y-0 mb-4 rounded-xl border border-hairline overflow-hidden">
            {/* Essential */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-hairline bg-black/[0.01]">
              <div>
                <p className="font-body text-xs font-medium text-ink">{tt('Esenciales', 'Essential', '必要')}</p>
                <p className="font-body text-[11px] text-muted">{tt('Necesarias para que el sitio funcione.', 'Required for the site to function.', '网站运行所必需。')}</p>
              </div>
              <span className="font-body text-[11px] text-[#34C759] font-medium shrink-0 ml-4">{tt('Siempre activas', 'Always on', '始终开启')}</span>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-hairline">
              <div>
                <p className="font-body text-xs font-medium text-ink">{tt('Analítica', 'Analytics', '分析')}</p>
                <p className="font-body text-[11px] text-muted">{tt('Nos ayudan a mejorar el sitio web.', 'Help us improve the website.', '帮助我们改进网站。')}</p>
              </div>
              <button
                role="switch"
                aria-checked={prefs.analytics}
                onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                className={`relative ml-4 w-9 h-5 rounded-full shrink-0 transition-colors duration-200 ${prefs.analytics ? 'bg-ink' : 'bg-black/15'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${prefs.analytics ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between px-3 py-2.5">
              <div>
                <p className="font-body text-xs font-medium text-ink">{tt('Marketing', 'Marketing', '营销')}</p>
                <p className="font-body text-[11px] text-muted">{tt('Publicidad personalizada.', 'Personalised advertising.', '个性化广告。')}</p>
              </div>
              <button
                role="switch"
                aria-checked={prefs.marketing}
                onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                className={`relative ml-4 w-9 h-5 rounded-full shrink-0 transition-colors duration-200 ${prefs.marketing ? 'bg-ink' : 'bg-black/15'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${prefs.marketing ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <a href={locale === 'es' ? '/es/privacy-policy' : '/privacy-policy'} className="font-body text-[11px] text-muted hover:text-ink transition-colors underline underline-offset-2">
              {tt('Política de privacidad', 'Privacy policy', '隐私政策')}
            </a>
            <button
              onClick={() => save(prefs)}
              className="font-body text-xs font-medium bg-ink text-white px-3 py-1.5 rounded-lg hover:bg-black transition-colors"
            >
              {tt('Guardar selección', 'Save selection', '保存选择')}
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <p className="font-body text-xs text-muted flex-1 min-w-0 truncate">
            {isEu
              ? tt('Usamos cookies para analizar el tráfico y mejorar el sitio. Tú decides.', 'We use cookies to analyse traffic and improve the site. Your choice, your call.', '我们使用 Cookie 来分析流量并改进网站。由你决定。')
              : tt('Al seguir navegando, aceptas nuestro uso de cookies.', 'By continuing to browse, you agree to our use of cookies.', '继续浏览即表示你同意我们使用 Cookie。')}
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={locale === 'es' ? '/es/privacy-policy' : '/privacy-policy'}
              className="font-body text-xs text-muted hover:text-ink transition-colors underline underline-offset-2 px-2 py-1.5"
            >
              {tt('Política de privacidad', 'Privacy Policy', '隐私政策')}
            </a>
            <button
              onClick={() => setExpanded(true)}
              className="font-body text-xs text-muted hover:text-ink transition-colors flex items-center gap-0.5 px-2 py-1.5"
            >
              {tt('Gestionar', 'Manage', '管理')} <ChevronUp size={11} />
            </button>
            <button
              onClick={() => save({ analytics: false, marketing: false })}
              className="font-body text-xs text-muted hover:text-ink transition-colors px-2 py-1.5"
            >
              {tt('Rechazar', 'Reject', '拒绝')}
            </button>
            <button
              onClick={() => save({ analytics: true, marketing: true })}
              className="font-body text-xs font-medium bg-ink text-white px-3 py-1.5 rounded-lg hover:bg-black transition-colors"
            >
              {tt('Aceptar', 'Accept', '接受')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

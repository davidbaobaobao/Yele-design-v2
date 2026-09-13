'use client'

import { usePathname, useRouter } from 'next/navigation'
import { LOCALES, type Locale } from '@/lib/i18n/funnel'

const LABELS: Record<Locale, string> = { en: 'EN', es: 'ES', zh: '中文' }

// Small EN / ES / 中文 switcher for the funnel pages. Strips any /es or /zh
// prefix from the current path, then rebuilds it for the chosen locale, and
// stores the choice in a cookie so the middleware doesn't re-redirect away
// from a manual selection.
export default function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  function pathFor(locale: Locale): string {
    // Base path without any locale prefix (e.g. '/letsbuild').
    const base = pathname.replace(/^\/(es|zh)(?=\/|$)/, '') || '/'
    if (locale === 'en') return base
    return `/${locale}${base === '/' ? '' : base}`
  }

  function go(locale: Locale) {
    if (locale === current) return
    document.cookie = `yele_locale=${locale}; path=/; max-age=31536000; samesite=lax`
    router.push(pathFor(locale))
  }

  return (
    <div className="fixed right-3 top-3 z-50 flex items-center gap-0.5 rounded-full border border-white/15 bg-black/40 p-0.5 backdrop-blur-sm">
      {LOCALES.map(l => (
        <button
          key={l}
          type="button"
          onClick={() => go(l)}
          aria-current={l === current}
          className={`rounded-full px-2.5 py-1 font-body text-xs font-medium transition-colors ${
            l === current ? 'bg-white text-[#16161A]' : 'text-white/70 hover:text-white'
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  )
}

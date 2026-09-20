'use client'

import { usePathname, useRouter } from 'next/navigation'

const LOCALES = ['en', 'es', 'zh'] as const
type Loc = (typeof LOCALES)[number]
const LABELS: Record<Loc, string> = { en: 'EN', es: 'ES', zh: '中文' }

// Inline EN / ES / 中文 segmented pill for the top navbar. Same navigation
// logic as the funnel's LocaleSwitcher (strip any /es|/zh prefix, rebuild for
// the chosen locale, persist the choice in a cookie so the middleware doesn't
// redirect away from a manual pick) but styled to sit in the nav bar and
// adapt to its dark/light state.
export default function NavLangPill({ dark }: { dark?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const current: Loc = pathname.startsWith('/es') ? 'es' : pathname.startsWith('/zh') ? 'zh' : 'en'

  function pathFor(l: Loc): string {
    const base = pathname.replace(/^\/(es|zh)(?=\/|$)/, '') || '/'
    return l === 'en' ? base : `/${l}${base === '/' ? '' : base}`
  }
  function go(l: Loc) {
    if (l === current) return
    document.cookie = `yele_locale=${l}; path=/; max-age=31536000; samesite=lax`
    router.push(pathFor(l))
  }

  return (
    <div className={`flex items-center gap-0.5 rounded-full border p-0.5 ${dark ? 'border-white/20 bg-white/10' : 'border-black/10 bg-black/[0.04]'}`}>
      {LOCALES.map(l => (
        <button
          key={l}
          type="button"
          onClick={() => go(l)}
          aria-current={l === current}
          aria-label={LABELS[l]}
          className={`rounded-full px-2 py-1 font-body text-[11px] font-medium leading-none transition-colors cursor-pointer ${
            l === current
              ? dark ? 'bg-white text-[#16161A]' : 'bg-[#16161A] text-white'
              : dark ? 'text-white/70 hover:text-white' : 'text-muted hover:text-ink'
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  )
}

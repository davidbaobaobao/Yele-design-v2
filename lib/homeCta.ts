// Where the homepage "start now" CTA goes, per language. Spanish and Chinese
// send visitors straight to their localized build funnel; English keeps /start.
export function startHref(lang: 'es' | 'en' | 'zh'): string {
  if (lang === 'es') return '/es/letsbuild'
  if (lang === 'zh') return '/zh/letsbuild'
  return '/start'
}

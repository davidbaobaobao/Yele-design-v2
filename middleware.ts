import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { RETIRED_SLUGS } from '@/lib/retired-slugs'
import { isLocale, type Locale } from '@/lib/i18n/funnel'

// EU/EEA + UK — visitors from these get the cookie/privacy banner. Everyone
// else (detected) is treated as non-EU and the banner is suppressed.
const EU_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', // EU 27
  'IS', 'LI', 'NO', // EEA
  'GB', // UK GDPR
])

// Funnel base paths (no locale prefix) that geo/browser detection applies to.
const FUNNEL_PATHS = new Set(['/letsbuild', '/received'])

// Only Spain triggers language detection (per spec: US -> English,
// Spain -> browser language, everything else/unknown -> English).
function detectLocale(country: string | null, acceptLanguage: string | null): Locale {
  if (country !== 'ES') return 'en'
  const al = (acceptLanguage ?? '').toLowerCase()
  if (al.includes('zh')) return 'zh'
  if (al.includes('es')) return 'es'
  return 'en'
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Retired blog posts — return 410 Gone so Google drops them faster than 404
  if (pathname.startsWith('/blog/')) {
    const slug = pathname.slice(6)
    if (RETIRED_SLUGS.has(slug)) {
      return new NextResponse('Gone', { status: 410 })
    }
  }

  const country = request.headers.get('x-vercel-ip-country')
  const isEu = country ? EU_COUNTRIES.has(country) : true // unknown -> assume EU (safe for the banner)

  // Locale routing for the funnel entry paths. A manual choice (yele_locale
  // cookie, set by the LocaleSwitcher) wins; otherwise detect from geo.
  if (FUNNEL_PATHS.has(pathname)) {
    const cookieLocale = request.cookies.get('yele_locale')?.value
    const chosen: Locale = isLocale(cookieLocale)
      ? cookieLocale
      : detectLocale(country, request.headers.get('accept-language'))
    if (chosen !== 'en') {
      const url = request.nextUrl.clone()
      url.pathname = `/${chosen}${pathname}`
      const res = NextResponse.redirect(url)
      res.cookies.set('yele_eu', isEu ? '1' : '0', { path: '/', maxAge: 60 * 60 * 24 * 30 })
      return res
    }
  }

  const response = NextResponse.next()
  // Expose EU status to the client cookie banner.
  response.cookies.set('yele_eu', isEu ? '1' : '0', { path: '/', maxAge: 60 * 60 * 24 * 30 })

  // Auth gate for /empezar only (unchanged) — keep the Supabase session call
  // scoped so it doesn't run on every matched path.
  if (pathname.startsWith('/empezar')) {
    const supabase = createMiddlewareClient({ req: request, res: response })
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.redirect(new URL('/signup', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/', '/letsbuild', '/received', '/empezar/:path*', '/blog/:slug+'],
}

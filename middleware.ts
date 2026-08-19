import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { RETIRED_SLUGS } from '@/lib/retired-slugs'

// EU-27 + EEA (IS/LI/NO) + UK (GB) + CH — the set of countries where GDPR
// or an equivalent regime applies. Used by components/CookieBanner.tsx to
// decide whether "continued browsing" may imply Marketing consent (never,
// for these) or Essential+Analytics only (still implied everywhere) — see
// that component for the full policy.
const GDPR_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE',
  'IS', 'LI', 'NO',
  'GB', 'CH',
])

const GEO_COOKIE = 'yele_geo'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Retired blog posts — return 410 Gone so Google drops them faster than 404
  if (pathname.startsWith('/blog/')) {
    const slug = pathname.slice(6)
    if (RETIRED_SLUGS.has(slug)) {
      return new NextResponse('Gone', { status: 410 })
    }
  }

  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })
  await supabase.auth.getSession()

  if (pathname.startsWith('/empezar')) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.redirect(new URL('/signup', request.url))
    }
  }

  // Vercel sets this header at the edge for real deployments; absent in
  // local dev and for any provider that doesn't populate it. Unknown geo
  // defaults to "eu" (the more conservative/cautious branch) rather than
  // "other" — safer to under-imply consent for a visitor we can't place
  // than to auto-grant Marketing to someone who might be in the EU.
  const country = request.headers.get('x-vercel-ip-country')
  const isEu = !country || GDPR_COUNTRIES.has(country)
  // Not httpOnly — components/CookieBanner.tsx (client) needs to read it.
  // Not a secret, so no security concern in exposing it to JS.
  response.cookies.set(GEO_COOKIE, isEu ? 'eu' : 'other', {
    maxAge: 60 * 60 * 24, // 1 day — cheap to refresh each visit, and a
    // visitor's actual location can genuinely change (travel, VPN).
    path: '/',
    sameSite: 'lax',
  })

  return response
}

export const config = {
  // Broadened from just /empezar + /blog so the geo cookie above gets set
  // on every real page visit (needed by the cookie banner site-wide) —
  // still skips API routes, static assets and Next's own internals, which
  // don't render the banner and don't need the cookie.
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|mp4|webm)$).*)'],
}

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { RETIRED_SLUGS } from '@/lib/retired-slugs'

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
      return NextResponse.redirect(new URL('/registro', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/empezar/:path*', '/blog/:slug+'],
}

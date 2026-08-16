import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  let newSignup = false

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore,
    })

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user?.id) {
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { data: client } = await supabaseAdmin
          .from('clients')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle()

        if (client) {
          const redirectResponse = NextResponse.redirect(
            new URL('/ya-eres-cliente', requestUrl.origin)
          )
          cookieStore.getAll().forEach(cookie => {
            redirectResponse.cookies.set(cookie.name, cookie.value)
          })
          return redirectResponse
        }

        // Google Ads sign_up conversion (fired client-side on /empezar, see
        // that page) must count only a genuinely new account, never a
        // returning login. Both the Google OAuth and email-magic-link
        // flows land here with a fresh session either way, so this is the
        // one place that can tell them apart for both — Supabase sets
        // created_at and last_sign_in_at within the same instant only on
        // an account's very first sign-in. A signal from /signup alone
        // can't do this reliably: signInWithOtp() only *sends* the email
        // link there, the account itself isn't resolved until the user
        // clicks it and lands here.
        const createdAt = new Date(session.user.created_at).getTime()
        const lastSignInAt = session.user.last_sign_in_at
          ? new Date(session.user.last_sign_in_at).getTime()
          : createdAt
        newSignup = Math.abs(lastSignInAt - createdAt) < 10_000
      }
    }
  }

  const empezarUrl = new URL('/empezar', requestUrl.origin)
  if (newSignup) empezarUrl.searchParams.set('new_signup', '1')
  return NextResponse.redirect(empezarUrl)
}

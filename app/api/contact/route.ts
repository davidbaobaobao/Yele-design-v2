import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const RECIPIENTS = [
  process.env.STUDIO_EMAIL ?? 'info@yele.design',
  process.env.OWNER_EMAIL  ?? 'davidbaobaobao@gmail.com',
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, email, mensaje } = body

    if (!nombre || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // ── Supabase ────────────────────────────────────────────────────────────
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (url && key && url !== 'https://placeholder.supabase.co') {
      const supabase = createClient(url, key)
      const { error } = await supabase
        .from('contact_requests')
        .insert({ nombre, email, mensaje })

      if (error) {
        console.error('[contact] supabase error', error.message)
      }
    }

    // ── Email via Resend ────────────────────────────────────────────────────
    const resendKey = process.env.RESEND_API_KEY

    if (resendKey) {
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: 'Yele Contacto <noreply@yele.design>',
        to: RECIPIENTS,
        replyTo: email,
        subject: `Nuevo mensaje de ${nombre}`,
        text: [
          `Nombre: ${nombre}`,
          `Email: ${email}`,
          '',
          mensaje ?? '(sin mensaje)',
        ].join('\n'),
      })
    } else {
      console.log('[contact] RESEND_API_KEY not set — email skipped', { nombre, email, mensaje })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

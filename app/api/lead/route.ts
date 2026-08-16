import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const RECIPIENTS = [
  process.env.STUDIO_EMAIL ?? 'info@yele.design',
  process.env.OWNER_EMAIL  ?? 'davidbaobaobao@gmail.com',
]

// Public discovery-form lead capture (/start) — distinct from /api/contact
// (the #contacto section form) and /api/intake (the paid-flow account →
// client provisioning). Uses the service-role Supabase client (same as
// /api/intake) rather than the anon client /api/contact uses, so the insert
// doesn't depend on an RLS policy existing on discovery_leads.
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, company } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error: dbError } = await supabaseAdmin
      .from('discovery_leads')
      .insert({
        name,
        email,
        phone: phone || null,
        company_description: company || null,
        source: 'start_form',
      })

    if (dbError) {
      console.error('[lead] supabase error', dbError.message)
    }

    const resendKey = process.env.RESEND_API_KEY

    if (resendKey) {
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: 'Yele Leads <noreply@yele.design>',
        to: RECIPIENTS,
        replyTo: email,
        subject: `New lead — ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Phone: ${phone || '(not provided)'}`,
          '',
          'Company description:',
          company || '(not provided)',
        ].join('\n'),
      })
    } else {
      console.log('[lead] RESEND_API_KEY not set — email skipped', { name, email, phone, company })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[lead] error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

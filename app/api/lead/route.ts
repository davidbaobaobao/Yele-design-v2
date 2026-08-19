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
    // eventId only arrives from /newwebsite's LeadForm instance (platform=
    // "meta") — see components/LeadForm.tsx. Unused by /start and /websites.
    const { name, email, phone, company, eventId } = body

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

    // Meta Conversions API — server-side "Lead" event for /newwebsite,
    // deduped against the browser-pixel fire (lib/metaPixel.ts) via the
    // shared eventId. TODO: not active yet — META_PIXEL_ID/
    // META_CAPI_ACCESS_TOKEN aren't set in the environment (no Meta Pixel
    // has been installed on the site yet, see lib/metaPixel.ts's own TODO).
    // Once both are set, wire the actual POST to
    // https://graph.facebook.com/v20.0/{META_PIXEL_ID}/events here — hashed
    // email in user_data.em (sha256 hex), event_name: 'Lead', this same
    // event_id, event_time, action_source: 'website'. Left as a log-only
    // no-op until then so nothing here can silently send malformed events.
    if (eventId) {
      if (process.env.META_PIXEL_ID && process.env.META_CAPI_ACCESS_TOKEN) {
        console.log('[lead] TODO: Meta CAPI credentials present but the actual Graph API call is not implemented yet', { eventId })
      } else {
        console.log('[lead] Meta CAPI not configured (META_PIXEL_ID/META_CAPI_ACCESS_TOKEN unset) — skipping server-side Lead event', { eventId })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[lead] error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

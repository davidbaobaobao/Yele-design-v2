import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { createHash } from 'crypto'
import { scheduleAiCallback, planFromPackageInterest } from '@/lib/ai-callback/schedule'
import { welcomeCheckoutEmail } from '@/lib/emails/welcome'

const RECIPIENTS = [
  process.env.STUDIO_EMAIL ?? 'info@yele.design',
  process.env.OWNER_EMAIL  ?? 'davidbaobaobao@gmail.com',
]

const META_GRAPH_VERSION = 'v21.0'

// Must stay identical to the consent sentence rendered under the /letsbuild
// submit button (components/letsbuild/BuildLeadForm.tsx) — stored per lead as
// TCPA evidence.
const LETSBUILD_CONSENT_TEXT =
  'No obligation. By clicking "Get My Website", you agree that Yele may contact you at the phone number you provide — including by automated technology, AI-generated or prerecorded calls, and text messages (SMS) — about your enquiry. Consent is not a condition of any purchase, and message and data rates may apply.'
const FALLBACK_SOURCE_URL = 'https://yele.design/'

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

// Public discovery-form lead capture (/start, /websites, /newwebsite) —
// distinct from /api/contact (the #contacto section form) and /api/intake
// (the paid-flow account → client provisioning). Uses the service-role
// Supabase client (same as /api/intake) rather than the anon client
// /api/contact uses, so the insert doesn't depend on an RLS policy existing
// on discovery_leads.
export async function POST(request: Request) {
  try {
    const body = await request.json()
    // eventId/fbc/fbp arrive from every LeadForm submit now (the Meta Pixel
    // is site-wide — see components/MetaPixelScript.tsx), not just
    // /newwebsite's Meta-exclusive traffic. The client also sends its own
    // `source` (platform) field, but the CAPI call below no longer needs
    // it — every submit gets a server-side Lead event regardless of
    // platform — so it isn't destructured here.
    const { name, email, phone, company, eventId, fbc, fbp } = body
    // Optional richer fields sent by the /letsbuild bottom form only. All
    // backward-compatible: the shared LeadForm (/start, /websites,
    // /newwebsite) never sends these, so they simply render as "(not
    // provided)" / are omitted from the email for those pages.
    const { businessName, currentWebsite, needs, packageInterest, leadSource, welcome } = body as {
      businessName?: string
      currentWebsite?: string
      needs?: string[]
      packageInterest?: string[]
      leadSource?: string
      welcome?: boolean
    }

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: inserted, error: dbError } = await supabaseAdmin
      .from('discovery_leads')
      .insert({
        name,
        email,
        phone: phone || null,
        company_description: company || null,
        source: 'start_form',
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('[lead] supabase error', dbError.message)
    }

    // AI callback (Retell "Ava") — only for the /letsbuild landings, which are
    // the only pages that stamp `leadSource` ("Let's Build (direct)", "Google
    // Ads") and whose forms show the TCPA consent sentence. Schedules a QStash
    // job that dials ~5 min after submit, inside the lead's legal calling
    // window, unless they pay first. No-op unless AI_CALLBACK_ENABLED=true.
    // Never throws.
    const isLetsBuild = typeof leadSource === 'string' && leadSource.trim().length > 0
    if (isLetsBuild && phone) {
      const scheduled = await scheduleAiCallback({
        name,
        email,
        phone,
        business: businessName || null,
        plan: planFromPackageInterest(packageInterest),
        leadSource: leadSource ?? null,
        discoveryLeadId: inserted?.id ?? null,
        consentIp: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
        consentText: LETSBUILD_CONSENT_TEXT,
      })
      if (!scheduled.scheduled) console.log('[lead] ai-callback not scheduled:', scheduled.reason)
    }

    const resendKey = process.env.RESEND_API_KEY

    if (resendKey) {
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: 'Yele Leads <noreply@yele.design>',
        to: RECIPIENTS,
        replyTo: email,
        subject: `New lead${leadSource ? ` [${leadSource}]` : ''} — ${name}${businessName ? ` (${businessName})` : ''}`,
        text: [
          leadSource ? `Source: ${leadSource}` : null,
          leadSource ? '' : null,
          `Name: ${name}`,
          businessName ? `Business name: ${businessName}` : null,
          `Email: ${email}`,
          `Phone: ${phone || '(not provided)'}`,
          currentWebsite ? `Current website: ${currentWebsite}` : null,
          '',
          'What the business does:',
          company || '(not provided)',
          Array.isArray(needs) && needs.length ? `\nWhat they need: ${needs.join(', ')}` : null,
          Array.isArray(packageInterest) && packageInterest.length
            ? `Package interest: ${packageInterest.join(', ')}`
            : null,
        ]
          .filter(line => line !== null)
          .join('\n'),
      })

      // Client confirmation ("Welcome … pay and secure your spot") — only for
      // the /letsbuild landings (leadSource set), mirroring the /received page.
      // Shows just the selected plan if one was chosen, otherwise all three.
      if ((welcome || isLetsBuild) && email) {
        try {
          const { subject, html, text } = welcomeCheckoutEmail({
            name,
            email,
            company,
            plan: planFromPackageInterest(packageInterest) ?? undefined,
          })
          await resend.emails.send({ from: 'Yele <noreply@yele.design>', to: [email], subject, html, text })
        } catch (err) {
          console.error('[lead] welcome email failed', err)
        }
      }
    } else {
      console.log('[lead] RESEND_API_KEY not set — email skipped', { name, email, phone, company })
    }

    // Meta Conversions API — server-side "Lead" event for every submit now
    // (the Pixel is site-wide, so every lead is a potential Meta
    // conversion regardless of source page/platform), deduped against the
    // browser-pixel fire (lib/metaPixel.ts's trackMetaLead) via the shared
    // eventId. Awaited (not truly fire-and-forget) since Vercel's
    // serverless functions don't reliably keep running background work
    // after the response is sent — wrapped in its own try/catch so a
    // Meta-side failure never turns the lead submission itself into an
    // error response.
    if (eventId) {
      const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
      const capiToken = process.env.META_CAPI_TOKEN

      if (pixelId && capiToken) {
        try {
          const userData: Record<string, unknown> = {}
          if (email) userData.em = [sha256(String(email).trim().toLowerCase())]
          const phoneDigits = phone ? String(phone).replace(/\D/g, '') : ''
          if (phoneDigits) userData.ph = [sha256(phoneDigits)]
          const firstName = name ? String(name).trim().split(/\s+/)[0] : ''
          if (firstName) userData.fn = [sha256(firstName.toLowerCase())]

          const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
          const clientUa = request.headers.get('user-agent')
          if (clientIp) userData.client_ip_address = clientIp
          if (clientUa) userData.client_user_agent = clientUa
          if (fbc) userData.fbc = fbc
          if (fbp) userData.fbp = fbp

          // The page the lead actually came from (/start, /websites,
          // /newwebsite, …) — Referer is the real submitting page since
          // this is a same-origin fetch() POST, not a hardcoded constant
          // now that every page can send a lead.
          const sourceUrl = request.headers.get('referer') || FALLBACK_SOURCE_URL

          const capiRes = await fetch(
            `https://graph.facebook.com/${META_GRAPH_VERSION}/${pixelId}/events?access_token=${capiToken}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                data: [{
                  event_name: 'Lead',
                  event_time: Math.floor(Date.now() / 1000),
                  event_id: eventId,
                  action_source: 'website',
                  event_source_url: sourceUrl,
                  user_data: userData,
                }],
              }),
            }
          )
          if (!capiRes.ok) {
            console.error('[lead] Meta CAPI request failed', capiRes.status, await capiRes.text())
          }
        } catch (err) {
          console.error('[lead] Meta CAPI error', err)
        }
      } else {
        console.log('[lead] Meta CAPI not configured (NEXT_PUBLIC_META_PIXEL_ID/META_CAPI_TOKEN unset) — skipping server-side Lead event', { eventId })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[lead] error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

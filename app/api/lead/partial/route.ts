import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Abandoned-lead capture. The LeadForm sends this (via navigator.sendBeacon)
// when a visitor filled some fields and clicked submit at least once but never
// completed a valid submit, then left the page or went idle. It emails the
// team a short "incomplete lead" summary so a useful partial can be followed
// up. No database write — this is a best-effort notification only.
//
// PRIVACY NOTE: this captures whatever was typed before the consent line was
// accepted. It only fires after an explicit submit attempt (clear intent),
// and only when there is a contactable field (email or phone). Treat it as
// internal follow-up data, not marketing consent.

const RECIPIENTS = [
  process.env.STUDIO_EMAIL ?? 'info@yele.design',
  process.env.OWNER_EMAIL ?? 'davidbaobaobao@gmail.com',
]

const esc = (s: string) => String(s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string))

export async function POST(request: Request) {
  try {
    // sendBeacon posts a Blob; some browsers omit a JSON content-type, so read
    // the raw text and parse defensively.
    const raw = await request.text()
    let body: Record<string, unknown> = {}
    try {
      body = raw ? JSON.parse(raw) : {}
    } catch {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim()
    const phone = String(body.phone ?? '').trim()
    const company = String(body.company ?? '').trim()
    const timeline = String(body.timeline ?? '').trim()
    const plan = String(body.plan ?? '').trim()
    const attempts = Number(body.attempts ?? 0) || 0
    const leadSource = String(body.leadSource ?? '').trim()
    const pageUrl = String(body.url ?? '').trim()

    // Only worth an email if there's a way to reach them.
    if (!email && !phone) return NextResponse.json({ ok: true, skipped: 'no contact' })

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) return NextResponse.json({ ok: true, skipped: 'no resend key' })

    const rows: [string, string][] = [
      ['Name', name],
      ['Email', email],
      ['Phone', phone],
      ['Company', company],
      ['Timeline', timeline],
      ['Plan interest', plan],
      ['Submit attempts', String(attempts)],
      ['Lead source', leadSource],
      ['Page', pageUrl],
    ]
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;background:#F7F6F3;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;background:#fff;">
  <div style="background:#16161A;padding:20px 28px;">
    <span style="font-size:18px;font-weight:700;color:#fff;">yele</span><span style="color:#D46FC8;font-size:18px;font-weight:700;">.design</span>
    <span style="color:#8A8A92;font-size:12px;margin-left:10px;">Incomplete lead (abandoned form)</span>
  </div>
  <div style="padding:20px 28px;">
    <p style="margin:0 0 14px;font-size:14px;color:#16161A;">A visitor started the form and clicked submit <strong>${attempts}</strong> time(s) but didn't complete it. What they filled:</p>
    <table style="width:100%;border-collapse:collapse;border:1px solid #E8E4DF;">
      ${rows
        .filter(([, v]) => v)
        .map(
          ([k, v]) =>
            `<tr><td style="padding:8px 14px;font-size:12px;font-weight:600;color:#8A8A92;text-transform:uppercase;letter-spacing:.05em;width:150px;vertical-align:top;">${esc(k)}</td><td style="padding:8px 14px;font-size:14px;color:#16161A;">${esc(v)}</td></tr>`
        )
        .join('')}
    </table>
    <p style="margin:14px 0 0;font-size:12px;color:#8A8A92;">Best-effort capture — the visitor did not accept the consent line. Follow up manually.</p>
  </div>
</div></body></html>`

    const resend = new Resend(resendKey)
    await resend.emails.send({
      from: 'Yele Leads <noreply@yele.design>',
      to: RECIPIENTS,
      replyTo: email || undefined,
      subject: `Incomplete lead${leadSource ? ` [${leadSource}]` : ''} — ${name || email || phone}`,
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[lead/partial] error', err)
    return NextResponse.json({ ok: false }, { status: 200 }) // never surface to the client
  }
}

// One email per visitor session listing every site they ran through the Web
// Police. Called by the client on idle and again on page hide (sendBeacon), so
// it can fire more than once — rows are claimed (reported_at stamped) before
// the email goes out, so a second call finds nothing left and sends nothing.

import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { claimUnreportedScans, countScans, hashIp, clientIp } from '@/lib/webpolice/store'

export const runtime = 'nodejs'

const RECIPIENTS = [process.env.OWNER_EMAIL ?? 'davidbaobaobao@gmail.com']

function sameOrigin(request: Request): boolean {
  if (process.env.NODE_ENV !== 'production') return true
  const host = request.headers.get('host')
  const src = request.headers.get('origin') ?? request.headers.get('referer')
  if (!host || !src) return false
  try { return new URL(src).host === host } catch { return false }
}

const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 })

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const sessionId = typeof body?.sessionId === 'string' && /^[A-Za-z0-9_-]{8,64}$/.test(body.sessionId)
    ? (body.sessionId as string)
    : null
  if (!sessionId) return NextResponse.json({ ok: false }, { status: 400 })

  // Nothing to report unless this IP actually ran scans recently.
  const ipHash = hashIp(clientIp(request))
  if ((await countScans({ ipHash, windowMs: 86_400_000 })) === 0) {
    return NextResponse.json({ ok: true, sent: false })
  }

  const rows = await claimUnreportedScans(sessionId)
  if (rows.length === 0) return NextResponse.json({ ok: true, sent: false })

  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.log('[webpolice/report] RESEND_API_KEY not set — digest skipped', rows.map(r => r.url))
    return NextResponse.json({ ok: true, sent: false })
  }

  const first = rows[0]
  const when = (iso?: string) =>
    new Date(iso ?? Date.now()).toLocaleString('en-GB', { timeZone: 'Europe/Madrid', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

  const tr = rows.map(r => `
    <tr>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif">
        <a href="${esc(r.url)}" style="color:#B8489F">${esc(r.host)}</a>
      </td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif;text-align:center">${r.quality ?? '—'}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif">${esc(r.verdict ?? '—')}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font:12px -apple-system,sans-serif;color:#777">${when(r.created_at)}${r.cached ? ' · cached' : ''}</td>
    </tr>`).join('')

  const html = `
  <div style="max-width:640px;margin:0 auto;font:14px/1.5 -apple-system,BlinkMacSystemFont,sans-serif;color:#16161A">
    <p style="font:600 12px/1 -apple-system,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#B8489F;margin:0 0 6px">Web Police</p>
    <h2 style="margin:0 0 4px;font-size:20px">${rows.length} site${rows.length > 1 ? 's' : ''} checked in one session</h2>
    <p style="margin:0 0 18px;color:#6F6373;font-size:13px">
      ${esc(first.locale)} · ${esc(first.country ?? 'unknown country')} · session <code>${esc(sessionId.slice(0, 8))}</code>
    </p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #eee">
      <tr>
        <th align="left" style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Site</th>
        <th style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Score</th>
        <th align="left" style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Verdict</th>
        <th align="left" style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">When</th>
      </tr>
      ${tr}
    </table>
    <p style="margin:18px 0 0;color:#6F6373;font-size:12px">
      Low scores are the warm ones — they just watched a robot tell them their site is ugly.
    </p>
  </div>`

  const text = rows.map(r => `${r.host} — ${r.quality ?? '—'}/100 — ${r.verdict ?? '—'} — ${when(r.created_at)}`).join('\n')

  try {
    const resend = new Resend(key)
    await resend.emails.send({
      from: 'Web Police <noreply@yele.design>',
      to: RECIPIENTS,
      subject: `🚨 Web Police — ${rows.length} site${rows.length > 1 ? 's' : ''} checked (${first.host})`,
      text,
      html,
    })
  } catch (err) {
    console.error('[webpolice/report] send failed', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  return NextResponse.json({ ok: true, sent: true, count: rows.length })
}

// Once-a-day owner digest of everything searched on the Web Police in the last
// 24h — one aggregated email instead of one per visitor session. Triggered by a
// Vercel Cron (see vercel.json). Secured with CRON_SECRET when set.

import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { scansSince } from '@/lib/webpolice/store'

export const runtime = 'nodejs'

const RECIPIENTS = [process.env.OWNER_EMAIL ?? 'davidbaobaobao@gmail.com']

const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))

export async function GET(request: Request) {
  // Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` when CRON_SECRET is
  // set on the project. Enforce it so nobody else can trigger the digest.
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const rows = await scansSince(24 * 3600_000)
  if (rows.length === 0) return NextResponse.json({ ok: true, sent: false, reason: 'no scans' })

  // Aggregate by site (host) — one row per site with its search count.
  const byHost = new Map<string, { host: string; url: string; count: number; quality: number | null; verdict: string | null; last: string }>()
  for (const r of rows) {
    const key = r.host
    const cur = byHost.get(key)
    if (cur) {
      cur.count++
      if (!cur.last || (r.created_at ?? '') > cur.last) { cur.last = r.created_at ?? cur.last; cur.quality = r.quality; cur.verdict = r.verdict }
    } else {
      byHost.set(key, { host: r.host, url: r.url, count: 1, quality: r.quality, verdict: r.verdict, last: r.created_at ?? '' })
    }
  }
  const sites = Array.from(byHost.values()).sort((a, b) => b.count - a.count || (b.last > a.last ? 1 : -1))
  const totalScans = rows.length
  const scored = rows.filter(r => typeof r.quality === 'number') as { quality: number }[]
  const avg = scored.length ? Math.round(scored.reduce((s, r) => s + r.quality, 0) / scored.length) : null

  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.log('[webpolice/daily-report] RESEND_API_KEY not set — skipped', sites.map(s => s.host))
    return NextResponse.json({ ok: true, sent: false, sites: sites.length })
  }

  const when = (iso?: string) =>
    new Date(iso ?? Date.now()).toLocaleString('en-GB', { timeZone: 'Europe/Madrid', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

  const tr = sites.map(s => `
    <tr>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif">
        <a href="${esc(s.url)}" style="color:#B8489F">${esc(s.host)}</a>
      </td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif;text-align:center">${s.count}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif;text-align:center">${s.quality ?? '—'}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif">${esc(s.verdict ?? '—')}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font:12px -apple-system,sans-serif;color:#777">${when(s.last)}</td>
    </tr>`).join('')

  const html = `
  <div style="max-width:680px;margin:0 auto;font:14px/1.5 -apple-system,BlinkMacSystemFont,sans-serif;color:#16161A">
    <p style="font:600 12px/1 -apple-system,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#B8489F;margin:0 0 6px">Web Police · Daily</p>
    <h2 style="margin:0 0 4px;font-size:20px">${sites.length} site${sites.length > 1 ? 's' : ''} searched in the last 24h</h2>
    <p style="margin:0 0 18px;color:#6F6373;font-size:13px">
      ${totalScans} total search${totalScans > 1 ? 'es' : ''}${avg !== null ? ` · avg score ${avg}/100` : ''}
    </p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #eee">
      <tr>
        <th align="left" style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Site</th>
        <th style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Searches</th>
        <th style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Score</th>
        <th align="left" style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Verdict</th>
        <th align="left" style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Last</th>
      </tr>
      ${tr}
    </table>
    <p style="margin:18px 0 0;color:#6F6373;font-size:12px">Low scores are the warm leads — they just watched a robot call their site ugly.</p>
  </div>`

  try {
    const resend = new Resend(key)
    await resend.emails.send({
      from: 'Yele <noreply@yele.design>',
      to: RECIPIENTS,
      subject: `🚨 Web Police — ${sites.length} site${sites.length > 1 ? 's' : ''} searched today`,
      html,
    })
  } catch (err) {
    console.error('[webpolice/daily-report] send failed', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  return NextResponse.json({ ok: true, sent: true, sites: sites.length, totalScans })
}

// Once-a-day owner digest of everything searched on the Web Police in the last
// 24h — one aggregated email instead of one per visitor session. Triggered by a
// Vercel Cron (see vercel.json). Secured with CRON_SECRET when set.

import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { scansSince, eventFunnelSince, eventUrlBreakdown } from '@/lib/webpolice/store'

export const runtime = 'nodejs'

const RECIPIENTS = Array.from(new Set([
  process.env.OWNER_EMAIL ?? 'davidbaobaobao@gmail.com',
  'davidbaobaobao@gmail.com',
  'info@yele.design',
]))

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

  // Split the day's attempts: completed OK, errored (couldn't display), and
  // abandoned (visitor left before it finished).
  const ok = rows.filter(r => !r.error)
  const errored = rows.filter(r => r.error && r.error !== 'abandoned')
  const abandoned = rows.filter(r => r.error === 'abandoned')

  type Agg = { host: string; url: string; count: number; quality: number | null; verdict: string | null; error: string | null; last: string; id: string | null }
  const aggregate = (list: typeof rows): Agg[] => {
    const m = new Map<string, Agg>()
    for (const r of list) {
      const cur = m.get(r.host)
      if (cur) {
        cur.count++
        if (!cur.last || (r.created_at ?? '') > cur.last) { cur.last = r.created_at ?? cur.last; cur.quality = r.quality; cur.verdict = r.verdict; cur.error = r.error ?? null; cur.id = r.id ?? null }
      } else {
        m.set(r.host, { host: r.host, url: r.url, count: 1, quality: r.quality, verdict: r.verdict, error: r.error ?? null, last: r.created_at ?? '', id: r.id ?? null })
      }
    }
    return Array.from(m.values()).sort((a, b) => b.count - a.count || (b.last > a.last ? 1 : -1))
  }
  const BASE = 'https://yele.design'
  const resultLink = (id: string | null) => (id ? `<a href="${BASE}/api/webpolice/result?id=${id}" style="color:#B8489F">view</a>` : '—')

  const sites = aggregate(ok)
  const errSites = aggregate(errored)
  const abSites = aggregate(abandoned)
  // Serious vs fun split (from the tone column).
  const seriousOk = ok.filter(r => r.tone === 'serious')
  const funOk = ok.filter(r => (r.tone ?? 'fun') !== 'serious')
  const seriousSites = aggregate(seriousOk)
  const totalScans = ok.length
  const scored = ok.filter(r => typeof r.quality === 'number') as { quality: number }[]
  const avg = scored.length ? Math.round(scored.reduce((s, r) => s + r.quality, 0) / scored.length) : null

  const ERR_LABEL: Record<string, string> = { protected: 'Bot-protected / no screenshot', blocked: 'Security check / not a real page', ai_failed: 'AI analysis failed', error: 'Error' }

  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.log('[webpolice/daily-report] RESEND_API_KEY not set — skipped', sites.map(s => s.host))
    return NextResponse.json({ ok: true, sent: false, sites: sites.length })
  }

  // ── Visitor funnel (from the lightweight webpolice_events beacons) ──────────
  const sinceEvents = new Date(Date.now() - 24 * 3600_000).toISOString()
  const funnel = await eventFunnelSince(sinceEvents)
  const [scrollMidSites, plugSites] = await Promise.all([
    eventUrlBreakdown('scroll_mid', sinceEvents),
    eventUrlBreakdown('plug_view', sinceEvents),
  ])
  // /letsbuild scroll funnel (separate page='letsbuild').
  const lbFunnel = await eventFunnelSince(sinceEvents, 'letsbuild')
  const lbs = (k: string) => lbFunnel[k]?.sessions ?? 0
  const lbLoaded = lbs('lb_hero')
  const lbSteps: [string, number][] = [
    ['Loaded /letsbuild', lbLoaded],
    ['Scrolled to pricing', lbs('lb_precios')],
    ['Scrolled to the first form', lbs('lb_form')],
    ['Scrolled to “why Yele”', lbs('lb_porque')],
    ['Scrolled into the FAQ', lbs('lb_faq')],
  ]
  const lbHasData = lbSteps.some(([, n]) => n > 0)
  const lbPct = (n: number) => (lbLoaded ? Math.round((n / lbLoaded) * 100) : 0)
  const lbBlock = lbHasData ? `
    <h3 style="margin:26px 0 2px;font-size:15px">🏗️ /letsbuild funnel (last 24h)</h3>
    <p style="margin:0 0 8px;color:#6F6373;font-size:12px">Distinct visitors reaching each section. % is of everyone who loaded the page.</p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #eee">
      <tr>
        <th align="left" style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Step</th>
        <th style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Visitors</th>
        <th style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">% of loaded</th>
      </tr>
      ${lbSteps.map(([label, n], i) => `
      <tr>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif">${esc(label)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif;text-align:center">${n}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif;text-align:center;color:${i === 0 ? '#16161A' : '#6F6373'}">${i === 0 ? '100%' : lbPct(n) + '%'}</td>
      </tr>`).join('')}
    </table>` : ''
  const fs = (k: string) => funnel[k]?.sessions ?? 0
  const visitors = fs('page_view')
  const pctOf = (n: number) => (visitors ? Math.round((n / visitors) * 100) : 0)
  const funnelSteps: [string, number][] = [
    ['Opened the page', visitors],
    ['Ran a search', fs('search')],
    ['Saw a result', fs('result_view')],
    ['Pressed play (read aloud)', fs('speaker_click')],
    ['Scrolled to mid (design-year)', fs('scroll_mid')],
    ['Reached the plug form', fs('plug_view')],
    ['Pressed a share button', fs('share_click')],
    ['Clicked “Check out our site”', fs('letsbuild_click')],
  ]
  const funnelHasData = funnelSteps.some(([, n]) => n > 0)
  const funnelBlock = funnelHasData ? `
    <h3 style="margin:26px 0 2px;font-size:15px">📊 Visitor funnel (last 24h)</h3>
    <p style="margin:0 0 8px;color:#6F6373;font-size:12px">Distinct visitors reaching each step. % is of everyone who opened the page.</p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #eee">
      <tr>
        <th align="left" style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Step</th>
        <th style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Visitors</th>
        <th style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">% of opened</th>
      </tr>
      ${funnelSteps.map(([label, n], i) => `
      <tr>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif">${esc(label)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif;text-align:center">${n}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif;text-align:center;color:${i === 0 ? '#16161A' : '#6F6373'}">${i === 0 ? '100%' : pctOf(n) + '%'}</td>
      </tr>`).join('')}
    </table>
    ${(() => {
      const searchTotal = funnel['search']?.total ?? 0
      const searchers = fs('search')
      if (searchers === 0) return ''
      const avg = (searchTotal / searchers).toFixed(1)
      const repeats = searchTotal - searchers
      return `<p style="margin:8px 0 0;color:#6F6373;font-size:12px">${searchTotal} total searches from ${searchers} visitor${searchers === 1 ? '' : 's'} · avg ${avg} each${repeats > 0 ? ` · ${repeats} repeat search${repeats === 1 ? '' : 'es'} (people checking more than one site)` : ''}</p>`
    })()}` : ''

  // Per-URL breakdown for the two milestone steps: which sites people scrolled
  // through to the middle, and which they reached the plug form on.
  const hostOf = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return u } }
  const siteRows = (rows: { url: string; sessions: number }[]) =>
    rows.slice(0, 25).map(r => `
      <tr>
        <td style="padding:7px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif"><a href="${esc(r.url)}" style="color:#B8489F">${esc(hostOf(r.url))}</a></td>
        <td style="padding:7px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif;text-align:center">${r.sessions}</td>
      </tr>`).join('')
  const siteBlock = (title: string, note: string, rows: { url: string; sessions: number }[]) => rows.length ? `
    <h3 style="margin:26px 0 2px;font-size:15px">${title}</h3>
    <p style="margin:0 0 8px;color:#6F6373;font-size:12px">${note}</p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #eee">
      <tr>
        <th align="left" style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Site</th>
        <th style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Visitors</th>
      </tr>
      ${siteRows(rows)}
    </table>` : ''
  const scrollMidBlock = siteBlock('🧭 Sites people read to the middle', 'Reached the “What year your website feels” section — visitors who actually engaged with the verdict.', scrollMidSites)
  const plugBlock = siteBlock('📮 Sites that reached the plug form', 'Visitors who scrolled all the way to the “get a better website” form — the warmest signal.', plugSites)

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
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif">${resultLink(s.id)}</td>
    </tr>`).join('')

  // Simple list rows for the "errored" and "abandoned" sections.
  const listRow = (s: Agg, third: string) => `
    <tr>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif"><a href="${esc(s.url)}" style="color:#B8489F">${esc(s.host)}</a></td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif;text-align:center">${s.count}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif">${third}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font:12px -apple-system,sans-serif;color:#777">${when(s.last)}</td>
    </tr>`
  const section = (title: string, note: string, headers: string[], rowsHtml: string) => rowsHtml ? `
    <h3 style="margin:26px 0 2px;font-size:15px">${title}</h3>
    <p style="margin:0 0 8px;color:#6F6373;font-size:12px">${note}</p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #eee">
      <tr>${headers.map(h => `<th align="left" style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">${h}</th>`).join('')}</tr>
      ${rowsHtml}
    </table>` : ''

  const errBlock = section(
    `⚠️ ${errSites.length} site${errSites.length === 1 ? '' : 's'} that errored or didn’t display`,
    'Couldn’t be captured or analyzed — bot walls, security checks, or a failed analysis.',
    ['Site', 'Tries', 'Reason', 'Last'],
    errSites.map(s => listRow(s, esc(ERR_LABEL[s.error ?? 'error'] ?? s.error ?? 'Error'))).join(''),
  )
  const abBlock = section(
    `🚪 ${abSites.length} site${abSites.length === 1 ? '' : 's'} people left before it finished`,
    'The visitor started a search but navigated away before the result loaded.',
    ['Site', 'Tries', '', 'Left'],
    abSites.map(s => listRow(s, '')).join(''),
  )
  // Serious-mode scans get their own section — these visitors wanted a real,
  // professional assessment (higher-intent), so worth a closer look.
  const seriousBlock = section(
    `🧐 ${seriousSites.length} site${seriousSites.length === 1 ? '' : 's'} analysed in SERIOUS mode`,
    'Professional-mode scans — higher-intent visitors who wanted a real assessment.',
    ['Site', 'Searches', 'Score', 'Verdict', 'Result'],
    seriousSites.map(s => `
      <tr>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif"><a href="${esc(s.url)}" style="color:#B8489F">${esc(s.host)}</a></td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif;text-align:center">${s.count}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif;text-align:center">${s.quality ?? '—'}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif">${esc(s.verdict ?? '—')}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;font:13px -apple-system,sans-serif">${resultLink(s.id)}</td>
      </tr>`).join(''),
  )

  const html = `
  <div style="max-width:680px;margin:0 auto;font:14px/1.5 -apple-system,BlinkMacSystemFont,sans-serif;color:#16161A">
    <p style="font:600 12px/1 -apple-system,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#B8489F;margin:0 0 6px">Web Police · Daily</p>
    <h2 style="margin:0 0 4px;font-size:20px">${sites.length} site${sites.length === 1 ? '' : 's'} analyzed in the last 24h</h2>
    <p style="margin:0 0 18px;color:#6F6373;font-size:13px">
      ${totalScans} completed search${totalScans === 1 ? '' : 'es'}${avg !== null ? ` · avg score ${avg}/100` : ''}${errSites.length ? ` · ${errored.length} errored` : ''}${abSites.length ? ` · ${abandoned.length} abandoned` : ''}
    </p>
    <p style="margin:0 0 18px;color:#16161A;font-size:13px;font-weight:600">🧐 ${seriousOk.length} serious &nbsp;·&nbsp; 🐒 ${funOk.length} fun</p>
    ${funnelBlock}
    ${scrollMidBlock}
    ${plugBlock}
    ${sites.length ? `<table style="width:100%;border-collapse:collapse;border-top:1px solid #eee">
      <tr>
        <th align="left" style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Site</th>
        <th style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Searches</th>
        <th style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Score</th>
        <th align="left" style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Verdict</th>
        <th align="left" style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Last</th>
        <th align="left" style="padding:6px 10px;font:600 11px -apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6F6373">Result</th>
      </tr>
      ${tr}
    </table>` : ''}
    ${seriousBlock}
    ${lbBlock}
    ${errBlock}
    ${abBlock}
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

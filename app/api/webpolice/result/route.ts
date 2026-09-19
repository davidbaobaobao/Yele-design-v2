// Renders one stored Web Police text result (verdict, summary, rant, charges,
// personality, says/hears, design year) for the "view result" links in the
// daily report. `?format=json` returns the raw stored result for future
// automated analysis (e.g. an email artifact).

import { NextResponse } from 'next/server'
import { getScanResult } from '@/lib/webpolice/store'

export const runtime = 'nodejs'

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id') ?? ''
  if (!/^[0-9a-f-]{8,40}$/i.test(id)) return NextResponse.json({ error: 'bad id' }, { status: 400 })

  const row = await getScanResult(id)
  if (!row || !row.result) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const r = row.result as Record<string, unknown>

  if (url.searchParams.get('format') === 'json') {
    // Raw text result (screenshot data URL already stripped at store time).
    return NextResponse.json({ url: row.url, host: row.host, locale: row.locale, created_at: row.created_at, screenshot_url: row.screenshot_url ?? null, result: r })
  }

  const charges = Array.isArray(r.charges) ? (r.charges as { title?: string; detail?: string }[]) : []
  const sh = r.saysHears as { says?: string; hears?: string } | null | undefined
  const chargesHtml = charges.map(c => `<li style="margin:0 0 10px"><strong>${esc(c.title)}</strong><br><span style="color:#555">${esc(c.detail)}</span></li>`).join('')

  const html = `<!DOCTYPE html><html lang="${esc(row.locale)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Web Police — ${esc(row.host)}</title></head>
<body style="margin:0;background:#0D0E12;color:#EDEDED;font:15px/1.6 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">
  <div style="max-width:680px;margin:0 auto;padding:32px 20px 60px">
    <p style="font:600 12px/1 sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#D46FC8;margin:0 0 8px">Web Police · Result</p>
    <h1 style="margin:0 0 2px;font-size:26px">${esc(r.quality)}<span style="color:#666;font-size:.5em">/100</span> · ${esc((r.verdict as { label?: string } | undefined)?.label)}</h1>
    <p style="margin:0 0 20px"><a href="${esc(row.url)}" style="color:#D46FC8">${esc(row.host)}</a> · ${esc(row.locale)} · ${esc(row.created_at)}</p>
    ${row.screenshot_url ? `<img src="${esc(row.screenshot_url)}" alt="" style="width:100%;border-radius:12px;border:1px solid #222;margin:0 0 20px">` : ''}
    ${r.summary ? `<p style="font-size:19px;color:#fff;margin:0 0 20px">“${esc(r.summary)}”</p>` : ''}
    ${r.rant ? `<div style="color:#ccc;margin:0 0 24px">${esc(r.rant).split('\n').filter(Boolean).map(p => `<p style="margin:0 0 12px">${p}</p>`).join('')}</div>` : ''}
    ${r.personality ? `<p style="margin:0 0 8px"><strong style="color:#D46FC8">Personality:</strong> ${esc(r.personality)}</p>` : ''}
    ${r.designYear ? `<p style="margin:0 0 8px"><strong style="color:#D46FC8">Design year:</strong> ${esc(r.designYear)}${r.designYearWhy ? ` — ${esc(r.designYearWhy)}` : ''}</p>` : ''}
    ${sh && (sh.says || sh.hears) ? `<p style="margin:0 0 8px"><strong style="color:#D46FC8">Says:</strong> ${esc(sh.says)}<br><strong style="color:#D46FC8">Hears:</strong> ${esc(sh.hears)}</p>` : ''}
    ${chargesHtml ? `<h2 style="font-size:16px;margin:26px 0 8px">Charges</h2><ul style="list-style:none;padding:0;margin:0">${chargesHtml}</ul>` : ''}
  </div>
</body></html>`

  return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } })
}

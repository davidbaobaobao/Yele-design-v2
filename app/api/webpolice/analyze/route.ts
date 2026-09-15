import { NextResponse } from 'next/server'

// The Web Police — satire design analyzer. HYBRID:
//  1. Deterministic pre-pass over the HTML for cheap hints (fonts, tiny text,
//     stock-photo domains, color/gradient counts).
//  2. Screenshot (ScreenshotOne) → Claude Sonnet vision, which scores the six
//     design aspects the user cares about, with a short reason each.
//  3. If the ANTHROPIC_API_KEY or SCREENSHOT_API_KEY env vars are missing, or
//     any step fails, it falls back to a purely deterministic verdict so the
//     tool still works.
//
// Env: ANTHROPIC_API_KEY, SCREENSHOT_API_KEY (ScreenshotOne access key).

export const runtime = 'nodejs'
export const maxDuration = 40

type Charge = { code: string; title: string; detail: string }

function normalizeUrl(raw: string): URL | null {
  let s = (raw || '').trim()
  if (!s) return null
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s
  let u: URL
  try { u = new URL(s) } catch { return null }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
  const host = u.hostname.toLowerCase()
  if (
    host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal') ||
    /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) || host === '0.0.0.0' || host === '::1' || !host.includes('.')
  ) return null
  return u
}

// ---- Deterministic hints from the HTML (fed to the vision model) ----
function htmlHints(html: string): string[] {
  const lower = html.toLowerCase()
  const hints: string[] = []
  const fonts = new Set<string>()
  Array.from(lower.matchAll(/fonts\.googleapis\.com\/css2?\?[^"']*family=([^"'&]+)/gi)).forEach((m: RegExpMatchArray) =>
    m[1].split('|').forEach((f: string) => fonts.add(decodeURIComponent(f.split(':')[0]).replace(/\+/g, ' ').trim()))
  )
  if (fonts.size) hints.push(`Fonts loaded: ${Array.from(fonts).slice(0, 6).join(', ')}`)
  const generic = ['poppins', 'inter', 'montserrat', 'roboto', 'open sans', 'lato'].filter(f => lower.includes(f))
  if (generic.length) hints.push(`Uses over-used generic fonts: ${generic.join(', ')}`)
  const stock = ['unsplash', 'pexels', 'shutterstock', 'istockphoto', 'gettyimages', 'pixabay', 'freepik'].filter(s => lower.includes(s))
  if (stock.length) hints.push(`Stock-photo sources detected in image URLs: ${stock.join(', ')}`)
  if (/bg-gradient|linear-gradient|radial-gradient/.test(lower) && /purple|indigo|violet|#7c3aed|#8b5cf6|#6366f1/.test(lower)) hints.push('Purple/blue gradients present in the CSS.')
  if ((lower.match(/text-xs|text-\[1[0-2]px\]|font-size:\s*1[0-2]px/g) || []).length >= 3) hints.push('Lots of very small text.')
  return hints
}

// ---- Deterministic fallback verdict (no AI) ----
function deterministicCharges(html: string): Charge[] {
  const lower = html.toLowerCase()
  const n = (re: RegExp) => (lower.match(re) || []).length
  const d: { hit: boolean; code: string; title: string; detail: string }[] = [
    { hit: /bg-gradient|linear-gradient/.test(lower) && /purple|indigo|violet|#7c3aed|#8b5cf6|#6366f1/.test(lower), code: 'purple', title: 'Purple-gradient abuse', detail: 'Purple-blue gradients everywhere — everything competes, nothing wins.' },
    { hit: n(/rounded-2xl|rounded-3xl/g) >= 6, code: 'rounded', title: 'Rounded-card soup', detail: 'The page reads like a component-library demo.' },
    { hit: /backdrop-blur|blur\(|shadow-2xl/.test(lower), code: 'glow', title: 'Glow & blur overload', detail: 'Blurred blobs and neon shadows muddy the hierarchy.' },
    { hit: /bg-clip-text|text-transparent/.test(lower), code: 'gradtext', title: 'Gradient text on a random word', detail: 'Decorative, not intentional.' },
    { hit: n(/text-gray-400|text-gray-500|text-slate-400|#9ca3af/g) >= 3, code: 'graytext', title: 'Tiny low-contrast gray text', detail: 'Looks "premium" for 4 seconds, then just hard to read.' },
    { hit: /lucide/.test(lower) || n(/<svg/g) >= 20, code: 'lucide', title: 'Lucide icon spam', detail: 'The same thin-line icon in a rounded square on every card.' },
    { hit: ['unsplash', 'pexels', 'shutterstock', 'istockphoto'].some(s => lower.includes(s)), code: 'stock', title: 'Stock photos', detail: 'Instantly reads as a generic template.' },
    { hit: /poppins|inter|montserrat/.test(lower), code: 'font', title: 'The default AI font', detail: 'Poppins / Inter / Montserrat — every generator’s first pick.' },
  ]
  return d.filter(x => x.hit).map(({ code, title, detail }) => ({ code, title, detail }))
}

// ---- Screenshot via ScreenshotOne ----
async function screenshot(target: string): Promise<string | null> {
  const key = process.env.SCREENSHOT_API_KEY
  if (!key) return null
  const api = new URL('https://api.screenshotone.com/take')
  api.searchParams.set('access_key', key)
  api.searchParams.set('url', target)
  api.searchParams.set('format', 'jpg')
  api.searchParams.set('image_quality', '72')
  api.searchParams.set('viewport_width', '1280')
  api.searchParams.set('viewport_height', '900')
  api.searchParams.set('full_page', 'true')
  api.searchParams.set('full_page_max_height', '2600')
  api.searchParams.set('block_cookie_banners', 'true')
  api.searchParams.set('block_ads', 'true')
  api.searchParams.set('cache', 'true')
  api.searchParams.set('cache_ttl', '86400')
  try {
    const ctrl = new AbortController()
    const to = setTimeout(() => ctrl.abort(), 25000)
    const res = await fetch(api.toString(), { signal: ctrl.signal })
    clearTimeout(to)
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.byteLength < 1000) return null
    return buf.toString('base64')
  } catch {
    return null
  }
}

const ASPECTS = ['typography', 'spacing', 'color', 'clutter', 'hierarchy', 'imagery'] as const
type Aspect = (typeof ASPECTS)[number]

const ASPECT_TITLE: Record<Aspect, string> = {
  typography: 'Typography',
  spacing: 'Spacing',
  color: 'Colour',
  clutter: 'Clutter',
  hierarchy: 'Structure & hierarchy',
  imagery: 'Imagery',
}

const RUBRIC = `You are the "Web Police", a witty design critic judging a website SCREENSHOT for how much it looks like cheap, generic, AI-slop / template design. Be opinionated and a little funny, but ground every judgment in what is actually visible.

Score each aspect from 0 (excellent, clearly intentional custom design) to 100 (awful, textbook slop). Higher = worse.

Aspects and what "bad" means:
- typography: generic fonts (Poppins/Inter/Montserrat), tiny low-contrast text, weak weight/size hierarchy — feels generic and cheap.
- spacing: elements too close together / cramped, or awkward, no comfortable negative space.
- color: too many colors, random or clashing palette, over-saturated, ugly gradients — becomes a clown.
- clutter: disorganized, too much at once, no clear focal point — you don't know where to look.
- hierarchy: no clear layout or path for the eye; unclear where to go; feels lost.
- imagery: obvious stock photos or obviously fake/AI images — instantly reads as a generic template.

Return ONLY a compact JSON object, no markdown, exactly:
{"typography":{"score":N,"reason":"one short sentence"},"spacing":{"score":N,"reason":"..."},"color":{"score":N,"reason":"..."},"clutter":{"score":N,"reason":"..."},"hierarchy":{"score":N,"reason":"..."},"imagery":{"score":N,"reason":"..."},"overall":N,"summary":"one witty sentence"}`

async function visionAnalyze(imageB64: string, hints: string[]): Promise<{ aspects: Record<Aspect, { score: number; reason: string }>; overall: number; summary: string } | null> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return null
  const text = hints.length ? `${RUBRIC}\n\nDeterministic hints from the page's code (use as supporting evidence): ${hints.join(' ')}` : RUBRIC
  try {
    const ctrl = new AbortController()
    const to = setTimeout(() => ctrl.abort(), 30000)
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 900,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageB64 } },
              { type: 'text', text },
            ],
          },
        ],
      }),
    })
    clearTimeout(to)
    if (!res.ok) return null
    const j = await res.json()
    const out: string = j?.content?.[0]?.text ?? ''
    const jsonStr = out.slice(out.indexOf('{'), out.lastIndexOf('}') + 1)
    const parsed = JSON.parse(jsonStr)
    const aspects = {} as Record<Aspect, { score: number; reason: string }>
    for (const a of ASPECTS) {
      const raw = parsed[a] ?? {}
      aspects[a] = { score: Math.max(0, Math.min(100, Number(raw.score) || 0)), reason: String(raw.reason || '').slice(0, 200) }
    }
    const overall = Math.max(0, Math.min(100, Number(parsed.overall) || Math.round(ASPECTS.reduce((s, a) => s + aspects[a].score, 0) / ASPECTS.length)))
    return { aspects, overall, summary: String(parsed.summary || '').slice(0, 200) }
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const u = normalizeUrl(body?.url)
  if (!u) return NextResponse.json({ error: 'Give us a real, public URL to investigate (like example.com).' }, { status: 400 })
  const target = u.toString()

  // Fetch HTML (hints + fallback) and screenshot in parallel.
  let html = ''
  const htmlPromise = (async () => {
    try {
      const ctrl = new AbortController()
      const to = setTimeout(() => ctrl.abort(), 12000)
      const res = await fetch(target, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; YeleWebPolice/1.0)' }, redirect: 'follow', signal: ctrl.signal })
      clearTimeout(to)
      html = (await res.text()).slice(0, 800_000)
    } catch { /* handled below */ }
  })()
  const shotPromise = screenshot(target)
  await htmlPromise
  const imageB64 = await shotPromise

  if (!html && !imageB64) {
    return NextResponse.json({ error: "Couldn't reach that site. Is the address right and the site online?" }, { status: 502 })
  }

  const hints = html ? htmlHints(html) : []
  const vision = imageB64 ? await visionAnalyze(imageB64, hints) : null

  let charges: Charge[]
  let overall: number
  let summary = ''
  let mode: 'vision' | 'basic'

  if (vision) {
    mode = 'vision'
    overall = vision.overall
    summary = vision.summary
    // Charges = aspects scoring "bad", worst first.
    charges = ASPECTS.map(a => ({ a, ...vision.aspects[a] }))
      .filter(x => x.score >= 50)
      .sort((x, y) => y.score - x.score)
      .map(x => ({ code: x.a, title: `${ASPECT_TITLE[x.a]} — ${x.score}/100`, detail: x.reason || 'Reads generic.' }))
    // If the model found nothing bad, keep an empty charge list (clean site).
  } else {
    mode = 'basic'
    charges = deterministicCharges(html)
    overall = Math.min(100, charges.length * 14)
  }

  const crimes = charges.length
  const effort = Math.max(1, Math.round(22 - overall * 0.2))
  const effortFlavor =
    effort <= 4 ? 'Barely longer than ordering a coffee.' :
    effort <= 9 ? 'One lunch break, tops.' :
    effort <= 15 ? 'A solid afternoon of copy-pasting.' :
    'Suspiciously high. Someone may have actually tried.'

  const passed = overall < 40
  const verdict = passed
    ? { level: 'cleared', label: overall < 20 ? 'CLEARED — no slop detected' : 'CLEARED — barely' }
    : overall < 65
      ? { level: 'suspicious', label: 'SUSPICIOUS' }
      : { level: 'guilty', label: 'GUILTY OF DESIGN CRIMES' }

  return NextResponse.json({ url: target, crimes, charges, effort, effortFlavor, passed, verdict, overall, summary, mode })
}

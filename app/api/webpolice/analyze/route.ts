import { NextResponse } from 'next/server'
import { getWP, type Locale } from '@/lib/i18n/webpolice'

function toLocale(v: unknown): Locale {
  return v === 'es' || v === 'zh' ? v : 'en'
}

const YELE_TEXT: Record<Locale, { effortLabel: string; effortFlavor: string; summary: string; rant: string }> = {
  en: { effortLabel: 'Handcrafted by Yele themselves', effortFlavor: 'The suspects ARE the police. Case dismissed with a wink.', summary: 'The only website to ever make the Web Police blush. 105/100, no notes — get a room.', rant: "Look, we tried to find something. We really did. We dusted the whole site for the usual crimes — the purple gradients, the rounded-card soup, the stock photos of people high-fiving a robot — and came back with nothing but fingerprints of actual taste.\n\nEvery pixel looks like a decision, not an accident. The typography has opinions, the spacing can breathe, and nobody bolted on a fake dashboard to look busy. Frankly it's showing off. 105/100, the extra five points are for making the rest of the internet look bad." },
  es: { effortLabel: 'Hecha a mano por el propio Yele', effortFlavor: 'Los sospechosos SON la policía. Caso cerrado con un guiño.', summary: 'La única web que ha hecho sonrojar a la Policía Web. 105/100, sin objeciones — buscaos un cuarto.', rant: 'Mira, lo intentamos. De verdad. Peinamos toda la web buscando los delitos de siempre — los degradados morados, la sopa de tarjetas redondeadas, las fotos de stock de gente chocando los cinco con un robot — y solo encontramos huellas de buen gusto.\n\nCada píxel parece una decisión, no un accidente. La tipografía tiene criterio, el espaciado respira y nadie ha pegado un dashboard falso para parecer ocupado. Sinceramente, está presumiendo. 105/100; los cinco puntos extra son por dejar en evidencia al resto de internet.' },
  zh: { effortLabel: '由 Yele 亲手打造', effortFlavor: '嫌疑人就是警察本人。眨眨眼，结案。', summary: '唯一一个让网页警察脸红的网站。105/100，无可挑剔 —— 你俩开个房吧。', rant: '说真的，我们努力想找茬了。我们把整个网站都排查了一遍常见罪名——紫色渐变、圆角卡片堆成汤、和机器人击掌的图库照片——结果只找到了「有品味」的指纹。\n\n每一个像素都像是深思熟虑的决定，而不是意外。字体有主见，间距能呼吸，也没人硬塞一个假仪表盘来假装很忙。老实说，它在炫技。105/100，多出来的五分是奖励它让互联网上其余的网站相形见绌。' },
}

// The Web Police — satire design analyzer. HYBRID:
//  1. Deterministic pre-pass over the HTML for cheap hints.
//  2. Two screenshots (ScreenshotOne, 3s settle delay): the top/hero viewport
//     and the full page (so the model sees every section), fed to Claude
//     Sonnet vision, which QUALITY-scores six design aspects (0 = awful slop,
//     100 = excellent custom design — higher is BETTER).
//  3. Falls back to a deterministic verdict if keys are missing / a step fails.
//
// Env: ANTHROPIC_API_KEY, SCREENSHOT_API_KEY (ScreenshotOne access key).

export const runtime = 'nodejs'
export const maxDuration = 60

type Charge = { code: string; title: string; detail: string; bg?: string }

function toGradient(colors: unknown): string | undefined {
  if (!Array.isArray(colors)) return undefined
  const hex = colors
    .map(c => String(c).trim())
    .map(c => (c.startsWith('#') ? c : `#${c}`))
    .filter(c => /^#[0-9a-fA-F]{3,8}$/.test(c))
    .slice(0, 2)
  if (hex.length < 2) return undefined
  return `linear-gradient(135deg, ${hex[0]} 0%, ${hex[1]} 100%)`
}

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

function htmlHints(html: string): string[] {
  const lower = html.toLowerCase()
  const hints: string[] = []
  const fonts = new Set<string>()
  Array.from(lower.matchAll(/fonts\.googleapis\.com\/css2?\?[^"']*family=([^"'&]+)/gi)).forEach((m: RegExpMatchArray) =>
    m[1].split('|').forEach((f: string) => fonts.add(decodeURIComponent(f.split(':')[0]).replace(/\+/g, ' ').trim()))
  )
  if (fonts.size) hints.push(`Fonts loaded: ${Array.from(fonts).slice(0, 6).join(', ')}.`)
  const generic = ['poppins', 'inter', 'montserrat', 'roboto', 'open sans', 'lato'].filter(f => lower.includes(f))
  if (generic.length) hints.push(`Over-used generic fonts present: ${generic.join(', ')}.`)
  const stock = ['unsplash', 'pexels', 'shutterstock', 'istockphoto', 'gettyimages', 'pixabay', 'freepik'].filter(s => lower.includes(s))
  if (stock.length) hints.push(`Stock-photo sources in image URLs: ${stock.join(', ')}.`)
  if (/bg-gradient|linear-gradient|radial-gradient/.test(lower) && /purple|indigo|violet|#7c3aed|#8b5cf6|#6366f1/.test(lower)) hints.push('Purple/blue gradients in the CSS.')
  return hints
}

// Deterministic fallback — returns { charges, quality (0-100, higher better) }.
function deterministic(html: string): { charges: Charge[]; quality: number } {
  const lower = html.toLowerCase()
  const n = (re: RegExp) => (lower.match(re) || []).length
  const d: { hit: boolean; code: string; title: string; detail: string }[] = [
    { hit: /bg-gradient|linear-gradient/.test(lower) && /purple|indigo|violet|#7c3aed|#8b5cf6|#6366f1/.test(lower), code: 'purple', title: 'Purple-gradient abuse', detail: 'Purple-blue gradients everywhere — everything competes, nothing wins.' },
    { hit: n(/rounded-2xl|rounded-3xl/g) >= 6, code: 'rounded', title: 'Rounded-card soup', detail: 'Reads like a component-library demo.' },
    { hit: /backdrop-blur|blur\(|shadow-2xl/.test(lower), code: 'glow', title: 'Glow & blur overload', detail: 'Blurred blobs and neon shadows muddy the hierarchy.' },
    { hit: n(/text-gray-400|text-gray-500|text-slate-400|#9ca3af/g) >= 3, code: 'graytext', title: 'Tiny low-contrast gray text', detail: 'Looks "premium" for 4 seconds, then just hard to read.' },
    { hit: /lucide/.test(lower) || n(/<svg/g) >= 20, code: 'lucide', title: 'Lucide icon spam', detail: 'The same thin-line icon in a rounded square on every card.' },
    { hit: ['unsplash', 'pexels', 'shutterstock', 'istockphoto'].some(s => lower.includes(s)), code: 'stock', title: 'Stock photos', detail: 'Instantly reads as a generic template.' },
    { hit: /poppins|inter|montserrat/.test(lower), code: 'font', title: 'The default AI font', detail: 'Poppins / Inter / Montserrat — every generator’s first pick.' },
  ]
  const charges = d.filter(x => x.hit).map(({ code, title, detail }) => ({ code, title, detail }))
  const quality = Math.max(0, 100 - charges.length * 15)
  return { charges, quality }
}

// ---- ScreenshotOne, with a settle delay ----
async function shot(target: string, fullPage: boolean): Promise<string | null> {
  const key = process.env.SCREENSHOT_API_KEY
  if (!key) return null
  const api = new URL('https://api.screenshotone.com/take')
  api.searchParams.set('access_key', key)
  api.searchParams.set('url', target)
  api.searchParams.set('format', 'jpg')
  api.searchParams.set('image_quality', '72')
  api.searchParams.set('viewport_width', '1280')
  api.searchParams.set('viewport_height', '900')
  api.searchParams.set('delay', '3') // wait 3s so the page actually finishes loading
  api.searchParams.set('block_cookie_banners', 'true')
  api.searchParams.set('block_ads', 'true')
  api.searchParams.set('cache', 'true')
  api.searchParams.set('cache_ttl', '86400')
  if (fullPage) {
    api.searchParams.set('full_page', 'true')
    api.searchParams.set('full_page_max_height', '2600')
  }
  try {
    const ctrl = new AbortController()
    const to = setTimeout(() => ctrl.abort(), 30000)
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

const RUBRIC = `You are the "Web Police", a sharp but funny design critic judging a website from screenshots (first image = top/hero, second image = the full page). Rate how GOOD the design is.

Score each aspect 0–100 where HIGHER IS BETTER, and BE STRICT:
- 0–25 = awful, generic AI-slop / cheap builder template.
- 30–50 = average, forgettable, template-y. MOST generic small-business/handyman/agency-template sites belong HERE, not higher.
- 55–70 = good, clearly intentional professional design.
- 75–90 = excellent, distinctive custom design.
- 90–100 = exceptional, world-class.

Punish hard, specifically:
- Obvious STOCK PHOTOS or obviously fake/AI-generated images → imagery must score 20–35. This is a big tell of a template.
- Average, "safe", forgettable template designs (even if tidy) → keep the overall in the 35–50 band. "Inoffensive but generic" is NOT a 60.
Be fair the other way too: genuinely custom, distinctive, professional sites MUST score high, and clean minimal design is good, not a crime.

Aspects (what LOW means):
- typography: generic fonts (Poppins/Inter/Montserrat), tiny low-contrast text, weak hierarchy — cheap/generic feel.
- spacing: cramped, elements too close, no comfortable negative space.
- color: too many colors, random/clashing, over-saturated, ugly gradients — clownish. (Restrained, harmonious palettes score HIGH.)
- clutter: disorganized, too much at once, no clear focal point. (Clean, calm layouts score HIGH.)
- hierarchy: no clear layout or path for the eye; you feel lost. (Clear structure scores HIGH.)
- imagery: obvious stock photos or obviously fake/AI images. (Real, original, well-shot imagery scores HIGH.)

The "summary" is the headline verdict everyone reads — make it FUNNY and a little EDGY: a savage-but-playful one-liner roast (or genuine praise if it's actually good). Punchy, quotable, PG-13. No hedging, no "overall this site…".

For "color", also return "colors": the TWO most dominant or clashing colors actually used on the page, as hex (e.g. ["#39ff14","#7c3aed"]).

The "summary" is a punchy one-line roast (or praise). The "rant" is the longer cut: 1–2 SHORT paragraphs (~60–110 words) expanding it — funnier, more specific about the actual design, easy to read, playful, PG-13, no bullet points.

Return ONLY compact JSON, no markdown:
{"typography":{"score":N,"reason":"one short sentence"},"spacing":{"score":N,"reason":"..."},"color":{"score":N,"reason":"...","colors":["#hex","#hex"]},"clutter":{"score":N,"reason":"..."},"hierarchy":{"score":N,"reason":"..."},"imagery":{"score":N,"reason":"..."},"overall":N,"summary":"one funny, edgy roast (or praise) sentence","rant":"1-2 short funny paragraphs"}`

type VisionData = { aspects: Record<Aspect, { score: number; reason: string }>; overall: number; summary: string; rant: string; colorBg?: string }
type VisionResult = { ok: true; data: VisionData } | { ok: false; reason: string }

async function visionAnalyze(images: string[], hints: string[], languageName: string): Promise<VisionResult> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return { ok: false, reason: 'ANTHROPIC_API_KEY not set' }
  if (images.length === 0) return { ok: false, reason: 'no screenshot captured (check SCREENSHOT_API_KEY)' }
  const lang = `\n\nWrite every "reason" field and the "summary" in ${languageName}.`
  const text = (hints.length ? `${RUBRIC}\n\nHints from the page code: ${hints.join(' ')}` : RUBRIC) + lang
  const content: unknown[] = images.map(data => ({ type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data } }))
  content.push({ type: 'text', text })
  try {
    const ctrl = new AbortController()
    const to = setTimeout(() => ctrl.abort(), 45000)
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({ model: 'claude-sonnet-5', max_tokens: 900, messages: [{ role: 'user', content }] }),
    })
    clearTimeout(to)
    if (!res.ok) return { ok: false, reason: `Anthropic ${res.status}: ${(await res.text()).slice(0, 160)}` }
    const j = await res.json()
    const out: string = j?.content?.[0]?.text ?? ''
    const parsed = JSON.parse(out.slice(out.indexOf('{'), out.lastIndexOf('}') + 1))
    const aspects = {} as Record<Aspect, { score: number; reason: string }>
    for (const a of ASPECTS) {
      const raw = parsed[a] ?? {}
      aspects[a] = { score: Math.max(0, Math.min(100, Number(raw.score) || 0)), reason: String(raw.reason || '').slice(0, 200) }
    }
    const overall = Math.max(0, Math.min(100, Number(parsed.overall) || Math.round(ASPECTS.reduce((s, a) => s + aspects[a].score, 0) / ASPECTS.length)))
    return { ok: true, data: { aspects, overall, summary: String(parsed.summary || '').slice(0, 200), rant: String(parsed.rant || '').slice(0, 900), colorBg: toGradient(parsed.color?.colors) } }
  } catch (err) {
    return { ok: false, reason: `vision error: ${err instanceof Error ? err.message : String(err)}`.slice(0, 160) }
  }
}

// Quality (higher = better) → effort tier index (0 low … 6 high).
function effortTier(quality: number): number {
  if (quality < 20) return 0
  if (quality < 35) return 1
  if (quality < 50) return 2
  if (quality < 58) return 3
  if (quality < 68) return 4
  if (quality < 78) return 5
  return 6
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const locale = toLocale(body?.locale)
  const wp = getWP(locale)
  const u = normalizeUrl(body?.url)
  if (!u) return NextResponse.json({ error: wp.errBadUrl }, { status: 400 })
  const target = u.toString()

  // Easter egg: the suspects ARE the police. Yele always wins.
  if (/(^|\.)yele\.design$/.test(u.hostname.toLowerCase())) {
    const top = await shot(target, false)
    const y = YELE_TEXT[locale]
    return NextResponse.json({
      url: target,
      crimes: 0,
      charges: [],
      quality: 105,
      effortLabel: y.effortLabel,
      effortFlavor: y.effortFlavor,
      passed: true,
      verdict: { level: 'cleared', label: wp.verdict.yele },
      summary: y.summary,
      rant: y.rant,
      mode: 'vision',
      note: '',
      screenshot: top ? `data:image/jpeg;base64,${top}` : null,
    })
  }

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
  // Two screenshots: the hero (top viewport) and the full page.
  const topPromise = shot(target, false)
  const fullPromise = shot(target, true)
  await htmlPromise
  const [topB64, fullB64] = await Promise.all([topPromise, fullPromise])

  if (!html && !topB64 && !fullB64) {
    return NextResponse.json({ error: wp.errUnreachable }, { status: 502 })
  }

  const hints = html ? htmlHints(html) : []
  const images = [topB64, fullB64].filter((x): x is string => !!x)
  const vision = await visionAnalyze(images, hints, wp.languageName)

  let charges: Charge[]
  let quality: number
  let summary = ''
  let rant = ''
  let mode: 'vision' | 'basic'
  let note = ''

  if (vision.ok) {
    mode = 'vision'
    quality = vision.data.overall
    summary = vision.data.summary
    rant = vision.data.rant
    // Charges = the weakest aspects (low quality), worst first.
    charges = ASPECTS.map(a => ({ a, ...vision.data.aspects[a] }))
      .filter(x => x.score <= 55)
      .sort((x, y) => x.score - y.score)
      .map(x => ({
        code: x.a,
        title: `${wp.aspectTitle[x.a]} — ${x.score}/100`,
        detail: x.reason || 'Reads generic.',
        // Paint the colour crime with the site's own clashing colours.
        ...(x.a === 'color' && vision.data.colorBg ? { bg: vision.data.colorBg } : {}),
      }))
  } else {
    mode = 'basic'
    note = vision.reason
    const det = deterministic(html)
    charges = det.charges
    quality = det.quality
  }

  const crimes = charges.length
  const { label: effortLabel, flavor: effortFlavor } = wp.effort[effortTier(quality)]
  const passed = quality >= 60
  const verdict = quality >= 75
    ? { level: 'cleared', label: wp.verdict.gorgeous }
    : quality >= 60
      ? { level: 'cleared', label: wp.verdict.decent }
      : quality >= 40
        ? { level: 'suspicious', label: wp.verdict.average }
        : { level: 'guilty', label: wp.verdict.ugly }

  return NextResponse.json({
    url: target,
    crimes,
    charges,
    quality,
    effortLabel,
    effortFlavor,
    passed,
    verdict,
    summary,
    rant,
    mode,
    note,
    screenshot: topB64 ? `data:image/jpeg;base64,${topB64}` : fullB64 ? `data:image/jpeg;base64,${fullB64}` : null,
  })
}

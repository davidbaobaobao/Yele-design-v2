import { NextResponse } from 'next/server'
import { getWP, type Locale } from '@/lib/i18n/webpolice'
import { logScan, findCachedScan, countScans, lastScanAt, hashIp, clientIp, getSeed } from '@/lib/webpolice/store'

function toLocale(v: unknown): Locale {
  return v === 'es' || v === 'zh' ? v : 'en'
}

const YELE_TEXT: Record<Locale, { effortLabel: string; effortFlavor: string; summary: string; rant: string; says: string; hears: string; personality: string; designYear: number; designYearWhy: string }> = {
  en: { effortLabel: 'Handcrafted by Yele themselves', effortFlavor: 'The suspects ARE the police. Case dismissed with a wink.', summary: 'The only website to ever make the Web Police blush. 105/100, no notes — get a room.', rant: "Look, we tried to find something. We really did. We dusted the whole site for the usual crimes — the purple gradients, the rounded-card soup, the stock photos of people high-fiving a robot — and came back with nothing but fingerprints of actual taste.\n\nEvery pixel looks like a decision, not an accident. The typography has opinions, the spacing can breathe, and nobody bolted on a fake dashboard to look busy. Frankly it's showing off. 105/100, the extra five points are for making the rest of the internet look bad.", says: 'We build beautiful websites.', hears: 'Oh. They actually meant it.', personality: 'The kid who did the homework AND made it look effortless.', designYear: 2026, designYearWhy: 'It looks like next year, honestly.' },
  es: { effortLabel: 'Hecha a mano por el propio Yele', effortFlavor: 'Los sospechosos SON la policía. Caso cerrado con un guiño.', summary: 'La única web que ha hecho sonrojar a la Policía Web. 105/100, sin objeciones — buscaos un cuarto.', rant: 'Mira, lo intentamos. De verdad. Peinamos toda la web buscando los delitos de siempre — los degradados morados, la sopa de tarjetas redondeadas, las fotos de stock de gente chocando los cinco con un robot — y solo encontramos huellas de buen gusto.\n\nCada píxel parece una decisión, no un accidente. La tipografía tiene criterio, el espaciado respira y nadie ha pegado un dashboard falso para parecer ocupado. Sinceramente, está presumiendo. 105/100; los cinco puntos extra son por dejar en evidencia al resto de internet.', says: 'Hacemos webs bonitas.', hears: 'Ah. Va en serio.', personality: 'El empollón que hizo los deberes Y encima queda de guay.', designYear: 2026, designYearWhy: 'Parece del año que viene, la verdad.' },
  zh: { effortLabel: 'Yele 自己做的', effortFlavor: '嫌疑人就是警察本人。眨个眼，结案。', summary: '唯一一个让网页警察脸红的网站。105/100，挑不出毛病，我们决定给它送面锦旗。', rant: '说真的，我们是想挑毛病的。整个站从上到下排查了一遍：紫色渐变、圆角卡片堆成汤、西装大哥握手的图库照片 —— 一个都没抓到，只找到了「有品味」的指纹。\n\n每个像素都像是有人认真决定过的，不是随手摆的。字体有主见，间距能喘气，也没硬塞一个假仪表盘来装忙。说白了就是在炫技。105/100，多出来的五分，是奖励它把互联网上其他网站衬托得那么惨。', says: '我们做好看的网站。', hears: '哦，人家是玩真的。', personality: '那个既写完了作业、还顺手做得毫不费力的学霸。', designYear: 2026, designYearWhy: '说实话，它看着像明年才该有的设计。' },
}

// The Web Police — satire design analyzer. VISION-ONLY:
//  1. A cheap HTML fetch for hint text (fonts, stock-photo hosts).
//  2. A full-page screenshot (ScreenshotOne, else free PageSpeed Insights),
//     fed to Claude Sonnet vision, which QUALITY-scores six design aspects
//     (0 = awful slop, 100 = excellent custom design — higher is BETTER).
//  There is NO deterministic fallback: if the screenshot can't be captured
//  (bot-protected site) or vision fails, we return a funny error instead of a
//  bad guess. Showcase / random-pool sites are served from precomputed "seed"
//  rows so those never call the LLM at all.
//
// Env: ANTHROPIC_API_KEY, SCREENSHOT_API_KEY (ScreenshotOne access key).

export const runtime = 'nodejs'
export const maxDuration = 90

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

export function normalizeUrl(raw: unknown): URL | null {
  let s = (typeof raw === 'string' ? raw : '').trim()
  if (s.length > 2000) return null
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

// ---- Screenshot capture. Returns base64 + mime, or a readable failure. ----
type ShotResult = { b64: string; mime: string } | { error: string }

// ScreenshotOne (fast, paid). Used when SCREENSHOT_API_KEY is set.
async function shot(target: string, fullPage: boolean): Promise<ShotResult> {
  const key = process.env.SCREENSHOT_API_KEY
  if (!key) return { error: 'SCREENSHOT_API_KEY not set' }
  const api = new URL('https://api.screenshotone.com/take')
  api.searchParams.set('access_key', key)
  api.searchParams.set('url', target)
  api.searchParams.set('format', 'jpg')
  api.searchParams.set('image_quality', '72')
  api.searchParams.set('viewport_width', '1280')
  api.searchParams.set('viewport_height', '900')
  // Wait for the network to go quiet, then sit for a few more seconds, so lazy
  // images / cards / fonts have actually rendered before we shoot — otherwise
  // the model roasts half-loaded blank boxes.
  api.searchParams.set('wait_until', 'networkidle2')
  api.searchParams.set('delay', '5')
  api.searchParams.set('timeout', '35') // let ScreenshotOne wait out slow/heavy sites
  // Dismiss the overlays that otherwise cover (and dominate) the screenshot.
  api.searchParams.set('block_cookie_banners', 'true')
  api.searchParams.set('block_ads', 'true')
  api.searchParams.set('block_chats', 'true')
  api.searchParams.set('block_banners_by_heuristics', 'true')
  api.searchParams.set('cache', 'true')
  api.searchParams.set('cache_ttl', '86400')
  if (fullPage) {
    api.searchParams.set('full_page', 'true')
    api.searchParams.set('full_page_max_height', '2600')
  }
  try {
    const ctrl = new AbortController()
    const to = setTimeout(() => ctrl.abort(), 40000)
    const res = await fetch(api.toString(), { signal: ctrl.signal })
    clearTimeout(to)
    if (!res.ok) return { error: `screenshot ${res.status}: ${(await res.text()).slice(0, 140)}` }
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.byteLength < 1000) return { error: 'screenshot came back empty' }
    return { b64: buf.toString('base64'), mime: 'image/jpeg' }
  } catch (err) {
    return { error: `screenshot request failed: ${err instanceof Error ? err.message : String(err)}`.slice(0, 140) }
  }
}

// Free PageSpeed Insights screenshot (fullPageScreenshot). Slower (a full
// Lighthouse run) but $0. Kept lean — one category — to run as fast as PSI
// allows.
async function psiScreenshot(target: string): Promise<ShotResult> {
  const api = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
  api.searchParams.set('url', target)
  api.searchParams.set('strategy', 'desktop')
  api.searchParams.set('category', 'performance')
  const key = process.env.PAGESPEED_API_KEY
  if (key) api.searchParams.set('key', key)
  try {
    const ctrl = new AbortController()
    const to = setTimeout(() => ctrl.abort(), 50000)
    const res = await fetch(api.toString(), { signal: ctrl.signal })
    clearTimeout(to)
    if (!res.ok) return { error: `psi ${res.status}: ${(await res.text()).slice(0, 120)}` }
    const j = await res.json()
    const data: string | undefined = j?.lighthouseResult?.fullPageScreenshot?.screenshot?.data
    if (!data || !data.startsWith('data:')) return { error: 'psi: no screenshot in response' }
    const m = data.match(/^data:([^;]+);base64,(.*)$/)
    if (!m) return { error: 'psi: unexpected screenshot format' }
    // PSI returns the WHOLE page, which is often taller than the vision model
    // accepts (so the analysis silently failed for every long page). Normalise
    // it: scale to a 1280 width and crop to the top ~2600px, same framing as
    // the ScreenshotOne path.
    return await normalizeShot(Buffer.from(m[2], 'base64'))
  } catch (err) {
    return { error: `psi request failed: ${err instanceof Error ? err.message : String(err)}`.slice(0, 140) }
  }
}

// Downscale + top-crop a screenshot so it always fits the vision model's limits.
async function normalizeShot(input: Buffer): Promise<ShotResult> {
  const MAX_W = 1280
  const MAX_H = 2600
  try {
    const sharp = (await import('sharp')).default
    let pipe = sharp(input, { failOn: 'none' }).resize({ width: MAX_W, withoutEnlargement: true })
    const stage = await pipe.toBuffer({ resolveWithObject: true })
    if (stage.info.height > MAX_H) {
      pipe = sharp(stage.data).extract({ left: 0, top: 0, width: stage.info.width, height: MAX_H })
    } else {
      pipe = sharp(stage.data)
    }
    const out = await pipe.jpeg({ quality: 72 }).toBuffer()
    return { b64: out.toString('base64'), mime: 'image/jpeg' }
  } catch (err) {
    // If sharp is unavailable for any reason, fall back to the raw image.
    console.warn('[webpolice] normalizeShot failed:', err instanceof Error ? err.message : String(err))
    return { b64: input.toString('base64'), mime: 'image/jpeg' }
  }
}

// thum.io — free, keyless, returns the image directly and already crops to a
// sane size. Reliable, so it's our default. `wait` lets the page load first.
async function thumIo(target: string): Promise<ShotResult> {
  const api = `https://image.thum.io/get/width/1280/crop/2600/noanimate/wait/6/${target}`
  try {
    const ctrl = new AbortController()
    const to = setTimeout(() => ctrl.abort(), 42000)
    const res = await fetch(api, { signal: ctrl.signal, headers: { 'user-agent': 'Mozilla/5.0 YeleWebPolice/1.0' } })
    clearTimeout(to)
    if (!res.ok) return { error: `thumio ${res.status}` }
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.byteLength < 3000) return { error: 'thumio returned a placeholder' }
    return await normalizeShot(buf) // → capped 1280×2600 JPEG for the vision model
  } catch (err) {
    return { error: `thumio failed: ${err instanceof Error ? err.message : String(err)}`.slice(0, 140) }
  }
}

// Capture order — all free first: thum.io (reliable, pre-cropped), then the
// PageSpeed screenshot, then the paid ScreenshotOne only as a last resort.
async function capture(target: string): Promise<ShotResult> {
  const t = await thumIo(target)
  if ('b64' in t) return t
  const p = await psiScreenshot(target)
  if ('b64' in p) return p
  if (process.env.SCREENSHOT_API_KEY) {
    const s = await shot(target, true)
    if ('b64' in s) return s
  }
  return t
}

const ASPECTS = ['typography', 'spacing', 'color', 'clutter', 'hierarchy', 'imagery'] as const
type Aspect = (typeof ASPECTS)[number]

const RUBRIC = `You are the "Web Police", a sharp but funny design critic judging a website from a full-page screenshot. Rate how GOOD the design is.

Score each aspect 0–100 where HIGHER IS BETTER, and BE STRICT:
- 0–25 = awful, generic AI-slop / cheap builder template.
- 30–50 = average, forgettable, template-y. MOST generic small-business/handyman/agency-template sites belong HERE, not higher.
- 55–70 = good, clearly intentional professional design.
- 75–90 = excellent, distinctive custom design.
- 90–100 = exceptional, world-class.

FIRST, a hard gate — is this even a real website to judge?
If the screenshot is NOT an actual website homepage — e.g. a security / bot check ("Verify you are human", "Checking your browser", Cloudflare "Just a moment", a CAPTCHA), an error page (403/404/500, "Access denied"), a pure login/paywall wall, a cookie-consent full-page interstitial with nothing behind it, or an essentially blank/broken page — then DO NOT score it and DO NOT critique that page. Instead return exactly {"unusable": true, "reason": "<a few plain words: security check / error page / blank>"} and nothing else. Never roast Cloudflare, a CAPTCHA or an error page — they aren't the site's design.
Otherwise ("unusable": false) score it as below.

Punish hard, specifically:
- Obvious STOCK PHOTOS or obviously fake/AI-generated images → imagery must score 20–35. This is a big tell of a template.
- Average, "safe", forgettable template designs (even if tidy) → keep the overall in the 35–50 band. "Inoffensive but generic" is NOT a 60.
Be fair the other way too: genuinely custom, distinctive, professional sites MUST score high, and clean minimal design is good, not a crime.

IMPORTANT — judge the ACTUAL website, not the screenshot's accidents:
- If a cookie/consent/GDPR banner, newsletter popup, chat bubble, age-gate or any modal overlay covers part of the page, IGNORE it completely. Do not mention it, do not let it lower any score. Evaluate the real design behind/around it.
- If areas look blank, grey, or half-rendered (images, cards or sections that clearly just hadn't finished loading when the photo was taken), do NOT treat that as a design crime. Judge the parts that DID render. Never criticize "empty cards" or missing content that is really just a loading artifact.

Aspects (what LOW means):
- typography: generic default fonts (the usual template/AI ones), tiny low-contrast text, messy text — cheap/generic feel. (Detect them, but describe in plain words — never name the font in your output.)
- spacing: cramped, elements too close, no comfortable negative space.
- color: too many colors, random/clashing, over-saturated, ugly gradients — clownish. (Restrained, harmonious palettes score HIGH.)
- clutter: disorganized, too much at once, no clear focal point. (Clean, calm layouts score HIGH.)
- hierarchy: no clear layout or path for the eye; you feel lost. (Clear structure scores HIGH.)
- imagery: obvious stock photos or obviously fake/AI images. (Real, original, well-shot imagery scores HIGH.)

WRITE FOR NORMAL PEOPLE, NOT DESIGNERS. The reader is a regular small-business owner who has never opened Figma. Every joke must land for them.
- NEVER name specific fonts/typefaces in your output (no "Inter", "Poppins", "Montserrat", "Helvetica", "Arial", "Times New Roman", etc.). If a font is a generic template/AI default, say it in plain, funny words instead — "the exact font every AI website builder ships with", "that same font as a thousand other sites", "the free-template font". If a font is genuinely ugly/dated, describe the vibe ("looks like a 2005 word document"), don't name it.
- NO designer jargon at all: no kerning, leading, x-height, grid, baseline, whitespace, "above the fold", hierarchy, ligatures, tracking, etc. Use everyday words a normal person uses.
- Keep every roast broad and universal — someone with zero design knowledge should laugh and get it.

The "summary" is the headline verdict everyone reads — make it FUNNY and a little EDGY: a savage-but-playful one-liner roast (or genuine praise if it's actually good). Punchy, quotable, PG-13. No hedging, no "overall this site…".

For "color", also return "colors": the TWO most dominant or clashing colors actually used on the page, as hex (e.g. ["#39ff14","#7c3aed"]).

The "summary" is a punchy one-line roast (or praise). The "rant" is the longer cut: 1–2 SHORT paragraphs (~60–110 words) expanding it — funnier, more specific about the actual design, easy to read, playful, PG-13, no bullet points.

Also produce these, all in the same language and voice:
- "saysHears": a funny-but-legit UX gap. "says" = the site's boldest claim or main CTA, short and quote-like. "hears" = the honest, funny thing a normal visitor actually thinks. (e.g. says: "We're an innovative full-service digital transformation partner." hears: "I have no idea what this company does." / says: "Book an appointment." hears: "First solve this navigation puzzle.")
- "personality": one conceptual, unhinged-but-funny metaphor for what this site IS — NOT technical. (e.g. "A regional insurance company trying to look like a Silicon Valley startup." / "A PowerPoint that escaped onto the internet.") Return just the descriptor, no "Your website is".
- "designYear": the year this design LOOKS like it is from, as an integer (e.g. 2014). "designYearWhy": one short sentence explaining the giveaway, understandable to a non-designer.

Return ONLY compact JSON, no markdown. If unusable: {"unusable":true,"reason":"..."}. Otherwise:
{"unusable":false,"typography":{"score":N,"reason":"one short sentence"},"spacing":{"score":N,"reason":"..."},"color":{"score":N,"reason":"...","colors":["#hex","#hex"]},"clutter":{"score":N,"reason":"..."},"hierarchy":{"score":N,"reason":"..."},"imagery":{"score":N,"reason":"..."},"overall":N,"summary":"one funny sentence","rant":"1-2 short funny paragraphs","saysHears":{"says":"...","hears":"..."},"personality":"one funny metaphor","designYear":2014,"designYearWhy":"one sentence"}`

type VisionData = { aspects: Record<Aspect, { score: number; reason: string }>; overall: number; summary: string; rant: string; colorBg?: string; saysHears?: { says: string; hears: string }; personality?: string; designYear?: number | null; designYearWhy?: string }
type VisionResult = { ok: true; data: VisionData } | { ok: false; reason: string }

async function visionAnalyze(images: { data: string; mime: string }[], hints: string[], languageName: string, roastStyle: string): Promise<VisionResult> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return { ok: false, reason: 'ANTHROPIC_API_KEY not set' }
  if (images.length === 0) return { ok: false, reason: 'no screenshot captured' }
  const lang = `\n\nWrite every "reason" field, the "summary" and the "rant" in ${languageName}. Do not translate an English joke — write it the way a native speaker would say it.\n\nVOICE: ${roastStyle}`
  const text = (hints.length ? `${RUBRIC}\n\nHints from the page code: ${hints.join(' ')}` : RUBRIC) + lang
  const content: unknown[] = images.map(img => ({ type: 'image', source: { type: 'base64', media_type: img.mime, data: img.data } }))
  content.push({ type: 'text', text })

  // Anthropic sometimes returns a transient 429/overloaded or a truncated body
  // (one run fails, the next works). Retry a few times before giving up so a
  // single blip doesn't discard an otherwise-fine site.
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
  const MAX_ATTEMPTS = 3
  let lastReason = 'vision failed'

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const ctrl = new AbortController()
      const to = setTimeout(() => ctrl.abort(), 45000)
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        signal: ctrl.signal,
        // Generous headroom so verbose Spanish/Chinese JSON can't truncate.
        body: JSON.stringify({ model: 'claude-sonnet-5', max_tokens: 2600, messages: [{ role: 'user', content }] }),
      })
      clearTimeout(to)
      if (!res.ok) {
        lastReason = `Anthropic ${res.status}`
        // 429 (rate limit) / 5xx / 529 (overloaded) are transient → retry.
        if ([408, 409, 429, 500, 502, 503, 529].includes(res.status) && attempt < MAX_ATTEMPTS) {
          await sleep(1200 * attempt)
          continue
        }
        return { ok: false, reason: `${lastReason}: ${(await res.text()).slice(0, 140)}` }
      }
      const j = await res.json()
      const out: string = j?.content?.[0]?.text ?? ''
      let parsed: Record<string, unknown>
      try {
        parsed = JSON.parse(out.slice(out.indexOf('{'), out.lastIndexOf('}') + 1))
      } catch {
        lastReason = 'vision parse error (truncated?)'
        if (attempt < MAX_ATTEMPTS) { await sleep(600); continue }
        return { ok: false, reason: lastReason }
      }
      // The captured page isn't a real site (Cloudflare/CAPTCHA/error/blank).
      if (parsed.unusable === true || parsed.unusable === 'true') {
        return { ok: false, reason: `unusable: ${String(parsed.reason || 'not a real page').slice(0, 80)}` }
      }
      const aspects = {} as Record<Aspect, { score: number; reason: string }>
      for (const a of ASPECTS) {
        const raw = (parsed[a] ?? {}) as { score?: unknown; reason?: unknown }
        aspects[a] = { score: Math.max(0, Math.min(100, Number(raw.score) || 0)), reason: String(raw.reason || '').slice(0, 200) }
      }
      const overall = Math.max(0, Math.min(100, Number(parsed.overall) || Math.round(ASPECTS.reduce((s, a) => s + aspects[a].score, 0) / ASPECTS.length)))
      const sh = parsed.saysHears as { says?: unknown; hears?: unknown } | undefined
      const dy = Number(parsed.designYear)
      return {
        ok: true,
        data: {
          aspects,
          overall,
          summary: String(parsed.summary || '').slice(0, 200),
          rant: String(parsed.rant || '').slice(0, 900),
          colorBg: toGradient((parsed.color as { colors?: unknown } | undefined)?.colors),
          saysHears: sh ? { says: String(sh.says || '').slice(0, 220), hears: String(sh.hears || '').slice(0, 220) } : undefined,
          personality: String(parsed.personality || '').slice(0, 220) || undefined,
          designYear: Number.isFinite(dy) && dy > 1990 && dy < 2100 ? Math.round(dy) : null,
          designYearWhy: String(parsed.designYearWhy || '').slice(0, 240) || undefined,
        },
      }
    } catch (err) {
      lastReason = `vision error: ${err instanceof Error ? err.message : String(err)}`.slice(0, 160)
      if (attempt < MAX_ATTEMPTS) { await sleep(1000 * attempt); continue }
      return { ok: false, reason: lastReason }
    }
  }
  return { ok: false, reason: lastReason }
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

type CoreResult =
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; status: number; error: string }

export async function analyzeCore(u: URL, locale: Locale): Promise<CoreResult> {
  const wp = getWP(locale)
  const target = u.toString()

  // Easter egg: the suspects ARE the police. Yele always wins.
  if (/(^|\.)yele\.design$/.test(u.hostname.toLowerCase())) {
    const s = await capture(target)
    const y = YELE_TEXT[locale]
    return {
      ok: true,
      payload: {
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
        saysHears: { says: y.says, hears: y.hears },
        personality: y.personality,
        designYear: y.designYear,
        designYearWhy: y.designYearWhy,
        mode: 'vision',
        note: '',
        screenshot: 'b64' in s ? `data:${s.mime};base64,${s.b64}` : null,
      },
    }
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
  // One full-page screenshot (ScreenshotOne if configured, else free PSI),
  // used for both the vision analysis and the report thumbnail.
  const shotPromise = capture(target)
  await htmlPromise
  const shotRes = await shotPromise
  const imgB64 = 'b64' in shotRes ? shotRes.b64 : null
  const imgMime = 'b64' in shotRes ? shotRes.mime : 'image/jpeg'
  const shotError = 'error' in shotRes ? shotRes.error : ''

  // No screenshot → almost always a site that blocks bots / screenshots.
  // We refuse to guess from HTML alone (deterministic guesses read badly), so
  // we bail out with a funny "this site is protected" message instead.
  if (!imgB64) {
    if (shotError) console.warn('[webpolice] capture failed:', shotError)
    return { ok: false, status: 502, error: wp.errProtected }
  }

  const hints = html ? htmlHints(html) : []
  const images = [{ data: imgB64, mime: imgMime }]
  const vision = await visionAnalyze(images, hints, wp.languageName, wp.roastStyle)

  // Vision is the ONLY source of truth now — no deterministic fallback.
  if (!vision.ok) {
    console.warn('[webpolice] vision failed:', vision.reason)
    // The screenshot was a Cloudflare/CAPTCHA/error/blank page, not the real
    // site — say we couldn't reach/analyze it (don't roast the block page).
    if (vision.reason.startsWith('unusable')) {
      return { ok: false, status: 502, error: wp.errBlocked }
    }
    return { ok: false, status: 502, error: wp.errAiFailed }
  }

  const mode = 'vision' as const
  const quality = vision.data.overall
  const summary = vision.data.summary
  const rant = vision.data.rant
  const saysHears: { says: string; hears: string } | null = vision.data.saysHears ?? null
  const personality = vision.data.personality ?? ''
  const designYear: number | null = vision.data.designYear ?? null
  const designYearWhy = vision.data.designYearWhy ?? ''
  const note = ''
  // Charges = the weakest aspects (low quality), worst first.
  const charges: Charge[] = ASPECTS.map(a => ({ a, ...vision.data.aspects[a] }))
    .filter(x => x.score <= 55)
    .sort((x, y) => x.score - y.score)
    .map(x => ({
      code: x.a,
      title: wp.aspectTitle[x.a],
      detail: x.reason || 'Reads generic.',
      // Paint the colour crime with the site's own clashing colours.
      ...(x.a === 'color' && vision.data.colorBg ? { bg: vision.data.colorBg } : {}),
    }))

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

  return {
    ok: true,
    payload: {
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
      saysHears,
      personality,
      designYear,
      designYearWhy,
      mode,
      note,
      screenshot: imgB64 ? `data:${imgMime};base64,${imgB64}` : null,
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Guardrails. Each scan costs a screenshot credit plus a vision call, so the
// endpoint only answers same-origin browser traffic, throttles per IP and per
// visitor session, caps the whole day globally, and serves repeat URLs from a
// 24h cache instead of paying twice.
// ─────────────────────────────────────────────────────────────────────────────

const num = (v: string | undefined, d: number) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : d)
const LIMITS = {
  minGapMs: num(process.env.WEBPOLICE_MIN_GAP_MS, 3000),
  perIpHour: num(process.env.WEBPOLICE_MAX_PER_IP_HOUR, 15),
  perIpDay: num(process.env.WEBPOLICE_MAX_PER_IP_DAY, 40),
  perSessionDay: num(process.env.WEBPOLICE_MAX_PER_SESSION_DAY, 25),
  globalDay: num(process.env.WEBPOLICE_MAX_PER_DAY, 500),
}

const BOT_UA = /bot|crawler|spider|curl|wget|python-requests|httpie|axios|node-fetch|go-http|java\/|okhttp|scrapy|headless|phantomjs|puppeteer/i

const GUARD_MSG: Record<Locale, { blocked: string; slow: string; limit: string; closed: string }> = {
  en: {
    blocked: 'The Web Police only take calls from the website itself.',
    slow: 'Easy, officer. Give us a few seconds between cases.',
    limit: "You've filed a lot of reports today. Try again tomorrow — or just hire us.",
    closed: 'The station is closed for today — too many cases. Come back tomorrow.',
  },
  es: {
    blocked: 'La Policía Web solo atiende llamadas desde la propia web.',
    slow: 'Tranquilo, agente. Danos unos segundos entre casos.',
    limit: 'Has presentado muchas denuncias hoy. Prueba mañana — o contrátanos y ya está.',
    closed: 'La comisaría cierra por hoy — demasiados casos. Vuelve mañana.',
  },
  zh: {
    blocked: '网页警察只接这个网站打来的电话。',
    slow: '别急，警官。两个案子之间让我们喘口气。',
    limit: '你今天报的案有点多了。明天再来吧 —— 或者干脆找我们做一个。',
    closed: '今天案子太多，派出所打烊了。明天请早。',
  },
}

function sameOrigin(request: Request): boolean {
  if (process.env.NODE_ENV !== 'production') return true
  const host = request.headers.get('host')
  const src = request.headers.get('origin') ?? request.headers.get('referer')
  if (!host || !src) return false
  try { return new URL(src).host === host } catch { return false }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const locale = toLocale(body?.locale)
  const wp = getWP(locale)
  const msg = GUARD_MSG[locale]

  // 1. Browser traffic only — no scripts, no scrapers.
  const ua = request.headers.get('user-agent') ?? ''
  if (!sameOrigin(request) || !ua || BOT_UA.test(ua)) {
    return NextResponse.json({ error: msg.blocked }, { status: 403 })
  }

  // 2. Valid, public target.
  const u = normalizeUrl(body?.url)
  if (!u) return NextResponse.json({ error: wp.errBadUrl }, { status: 400 })
  const target = u.toString()

  const sessionId = typeof body?.sessionId === 'string' && /^[A-Za-z0-9_-]{8,64}$/.test(body.sessionId)
    ? (body.sessionId as string)
    : null
  const ipHash = hashIp(clientIp(request))
  const country = request.headers.get('x-vercel-ip-country')
  const referer = request.headers.get('referer')

  // 3a. Precomputed showcase / random result → serve instantly. No LLM, no
  //     screenshot credit, and it doesn't burn the visitor's daily quota, so
  //     the "Try random" button can be clicked freely.
  const seeded = await getSeed(target, locale)
  if (seeded) {
    logScan({
      session_id: sessionId, url: target, host: u.hostname, locale,
      quality: typeof seeded.quality === 'number' ? seeded.quality : null,
      verdict: (seeded.verdict as { label?: string } | undefined)?.label ?? null,
      mode: 'seed', cached: true, ip_hash: ipHash, country,
      user_agent: ua.slice(0, 300), referer: referer?.slice(0, 300) ?? null, result: null,
    }).catch(err => console.error('[webpolice] log failed', err))
    return NextResponse.json({ ...seeded, seeded: true })
  }

  // 3. Throttles: a gap between calls, then per-IP, per-session and global caps.
  const last = await lastScanAt(ipHash)
  if (last && Date.now() - last < LIMITS.minGapMs) {
    return NextResponse.json({ error: msg.slow }, { status: 429 })
  }
  const [ipHour, ipDay, sessionDay, globalDay] = await Promise.all([
    countScans({ ipHash, windowMs: 3600_000 }),
    countScans({ ipHash, windowMs: 86_400_000 }),
    sessionId ? countScans({ sessionId, windowMs: 86_400_000 }) : Promise.resolve(0),
    countScans({ windowMs: 86_400_000 }),
  ])
  if (globalDay >= LIMITS.globalDay) return NextResponse.json({ error: msg.closed }, { status: 429 })
  if (ipHour >= LIMITS.perIpHour || ipDay >= LIMITS.perIpDay || sessionDay >= LIMITS.perSessionDay) {
    return NextResponse.json({ error: msg.limit }, { status: 429 })
  }

  const record = (payload: Record<string, unknown>, cached: boolean, store: boolean) =>
    logScan({
      session_id: sessionId,
      url: target,
      host: u.hostname,
      locale,
      quality: typeof payload.quality === 'number' ? payload.quality : null,
      verdict: (payload.verdict as { label?: string } | undefined)?.label ?? null,
      mode: typeof payload.mode === 'string' ? payload.mode : null,
      cached,
      ip_hash: ipHash,
      country,
      user_agent: ua.slice(0, 300),
      referer: referer?.slice(0, 300) ?? null,
      // The screenshot is a multi-hundred-KB data URL — never stored.
      result: store ? { ...payload, screenshot: null } : null,
    }).catch(err => console.error('[webpolice] log failed', err))

  // 4. Same URL again today → reuse the verdict, pay only for the (cached)
  //    screenshot so the report still shows a thumbnail.
  const cachedResult = await findCachedScan(target, locale)
  if (cachedResult) {
    const shotRes = process.env.SCREENSHOT_API_KEY ? await capture(target) : { error: 'skipped' }
    const payload = { ...cachedResult, screenshot: 'b64' in shotRes ? `data:${shotRes.mime};base64,${shotRes.b64}` : null }
    await record(payload, true, false)
    return NextResponse.json(payload)
  }

  const core = await analyzeCore(u, locale)
  if (!core.ok) return NextResponse.json({ error: core.error }, { status: core.status })
  await record(core.payload, false, true)
  return NextResponse.json(core.payload)
}

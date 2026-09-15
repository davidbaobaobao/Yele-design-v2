import { NextResponse } from 'next/server'

// Deterministic "Web Police" analyzer — no AI. It fetches the target page's
// HTML and runs factual checks (builder/template fingerprint, generic fonts,
// design/slop tells) plus Google PageSpeed Insights (speed + mobile). Returns
// structured "charges"; the /webpolice page dresses them up comedically.

export const runtime = 'nodejs'
export const maxDuration = 60

type Severity = 'critical' | 'major' | 'minor' | 'good'
type Charge = { code: string; severity: Severity; title: string; detail: string }

// ---- SSRF guard: only public http(s) hosts ----
function normalizeUrl(raw: string): URL | null {
  let s = (raw || '').trim()
  if (!s) return null
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s
  let u: URL
  try {
    u = new URL(s)
  } catch {
    return null
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
  const host = u.hostname.toLowerCase()
  if (
    host === 'localhost' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) ||
    host === '0.0.0.0' ||
    host === '::1' ||
    !host.includes('.')
  ) {
    return null
  }
  return u
}

// ---- Builder / template fingerprints (HTML + headers) ----
type BuilderHit = { name: string; kind: 'ai' | 'template' | 'ecommerce' | 'custom'; note: string }

function detectBuilder(html: string, headers: Headers): BuilderHit | null {
  const h = html.toLowerCase()
  const server = (headers.get('server') || '').toLowerCase()
  const powered = (headers.get('x-powered-by') || '').toLowerCase()
  const gen = (html.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)["']/i)?.[1] || '').toLowerCase()

  const has = (...needles: string[]) => needles.some(n => h.includes(n) || server.includes(n) || powered.includes(n) || gen.includes(n))

  // AI website builders — the prime suspects.
  if (has('durable.co', 'durable ai')) return { name: 'Durable (AI builder)', kind: 'ai', note: 'A one-click AI website generator.' }
  if (has('hostinger') && has('ai')) return { name: 'Hostinger AI Builder', kind: 'ai', note: 'Auto-generated from a prompt.' }
  if (has('framerusercontent', 'framer.com') || gen.includes('framer')) return { name: 'Framer', kind: 'template', note: 'Often used with AI/templated starts.' }
  // Classic drag-and-drop template builders.
  if (has('static.wixstatic.com', 'wix.com', 'x-wix') || gen.includes('wix')) return { name: 'Wix', kind: 'template', note: 'Drag-and-drop template builder.' }
  if (has('static1.squarespace', 'squarespace.com') || gen.includes('squarespace')) return { name: 'Squarespace', kind: 'template', note: 'Template builder.' }
  if (has('img1.wsimg.com', 'godaddy') && has('websitebuilder', 'wsimg')) return { name: 'GoDaddy Website Builder', kind: 'template', note: 'Template builder.' }
  if (has('weebly.com', 'weeblycloud')) return { name: 'Weebly', kind: 'template', note: 'Template builder.' }
  if (has('carrd.co')) return { name: 'Carrd', kind: 'template', note: 'One-page template builder.' }
  if (has('sites.google.com/embed', 'gstatic.com/_/mss')) return { name: 'Google Sites', kind: 'template', note: 'Free template builder.' }
  if (has('data-wf-', 'assets.website-files.com', 'webflow.io') || gen.includes('webflow')) return { name: 'Webflow', kind: 'template', note: 'Visual builder — quality depends on the designer.' }
  // WordPress + page builders (template-heavy).
  if (has('elementor')) return { name: 'WordPress + Elementor', kind: 'template', note: 'Drag-and-drop page builder on WordPress.' }
  if (has('et_pb_', 'divi')) return { name: 'WordPress + Divi', kind: 'template', note: 'Template page builder on WordPress.' }
  if (has('wp-content', 'wp-includes') || gen.includes('wordpress')) return { name: 'WordPress', kind: 'template', note: 'Could be a default theme — check the design.' }
  if (has('cdn.shopify.com') || gen.includes('shopify')) return { name: 'Shopify', kind: 'ecommerce', note: 'Store platform — usually a template theme.' }
  // Signs of a real, hand-built site.
  if (has('/_next/', '__next_f')) return { name: 'Next.js (custom-coded)', kind: 'custom', note: 'Hand-built — like a proper custom site.' }
  if (has('/_nuxt/')) return { name: 'Nuxt (custom-coded)', kind: 'custom', note: 'Hand-built framework.' }
  if (has('data-reactroot') || has('/static/js/main.')) return { name: 'Custom React build', kind: 'custom', note: 'Hand-built.' }
  return null
}

// ---- Generic / over-used fonts ----
const GENERIC_FONTS = ['poppins', 'inter', 'montserrat', 'roboto', 'open sans', 'lato', 'raleway', 'nunito', 'arial', 'helvetica', 'times new roman', 'georgia', 'verdana']

function detectFonts(html: string): { fonts: string[]; generic: string[] } {
  const found = new Set<string>()
  // Google Fonts links
  Array.from(html.matchAll(/fonts\.googleapis\.com\/css2?\?[^"']*family=([^"'&]+)/gi)).forEach((m: RegExpMatchArray) => {
    m[1].split('|').forEach((fam: string) => found.add(decodeURIComponent(fam.split(':')[0]).replace(/\+/g, ' ').trim()))
  })
  // font-family declarations in inline CSS
  Array.from(html.matchAll(/font-family\s*:\s*([^;"'}]+)/gi)).forEach((m: RegExpMatchArray) => {
    const first = m[1].split(',')[0].replace(/["']/g, '').trim()
    if (first && first.length < 40 && !/var\(|inherit|initial/i.test(first)) found.add(first)
  })
  const fonts = Array.from(found).slice(0, 8)
  const generic = fonts.filter(f => GENERIC_FONTS.includes(f.toLowerCase()))
  return { fonts, generic }
}

// ---- PageSpeed Insights (speed + mobile), keyless-capable ----
async function pageSpeed(url: string, strategy: 'mobile' | 'desktop') {
  const key = process.env.PAGESPEED_API_KEY
  const api = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
  api.searchParams.set('url', url)
  api.searchParams.set('strategy', strategy)
  api.searchParams.set('category', 'performance')
  if (key) api.searchParams.set('key', key)
  const ctrl = new AbortController()
  const to = setTimeout(() => ctrl.abort(), 45000)
  try {
    const res = await fetch(api.toString(), { signal: ctrl.signal })
    if (!res.ok) return null
    const j = await res.json()
    const lh = j.lighthouseResult
    if (!lh) return null
    const score = Math.round((lh.categories?.performance?.score ?? 0) * 100)
    const lcp = lh.audits?.['largest-contentful-paint']?.displayValue ?? null
    const cls = lh.audits?.['cumulative-layout-shift']?.displayValue ?? null
    return { score, lcp, cls }
  } catch {
    return null
  } finally {
    clearTimeout(to)
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const u = normalizeUrl(body?.url)
  if (!u) return NextResponse.json({ error: 'Enter a real, public website URL (like example.com).' }, { status: 400 })

  // Fetch the page HTML.
  let html = ''
  let finalUrl = u.toString()
  let headers = new Headers()
  try {
    const ctrl = new AbortController()
    const to = setTimeout(() => ctrl.abort(), 12000)
    const res = await fetch(u.toString(), {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; YeleWebPolice/1.0; +https://yele.design/webpolice)' },
      redirect: 'follow',
      signal: ctrl.signal,
    })
    clearTimeout(to)
    finalUrl = res.url || finalUrl
    headers = res.headers
    html = (await res.text()).slice(0, 600_000)
  } catch {
    return NextResponse.json({ error: "Couldn't reach that site. Is the address right and the site online?" }, { status: 502 })
  }

  const lower = html.toLowerCase()
  const charges: Charge[] = []

  // Builder / template.
  const builder = detectBuilder(html, headers)
  if (builder) {
    if (builder.kind === 'ai') charges.push({ code: 'ai_builder', severity: 'critical', title: `Built with an AI generator: ${builder.name}`, detail: builder.note })
    else if (builder.kind === 'template') charges.push({ code: 'template', severity: 'major', title: `Template builder detected: ${builder.name}`, detail: builder.note })
    else if (builder.kind === 'ecommerce') charges.push({ code: 'ecom', severity: 'minor', title: `${builder.name} store`, detail: builder.note })
    else charges.push({ code: 'custom', severity: 'good', title: `Looks hand-built: ${builder.name}`, detail: builder.note })
  }

  // Fonts.
  const { fonts, generic } = detectFonts(html)
  if (generic.length) {
    charges.push({ code: 'generic_font', severity: generic.some(f => ['poppins', 'inter', 'montserrat'].includes(f.toLowerCase())) ? 'major' : 'minor', title: `Overused font: ${generic.join(', ')}`, detail: 'These are the fonts every AI/template site reaches for. Distinctive type is a mark of custom design.' })
  }

  // Design / slop tells.
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() || ''
  if (!title || /^(home|untitled|my site|website|document|new page)$/i.test(title)) {
    charges.push({ code: 'title', severity: 'minor', title: 'Generic or missing page title', detail: `Title reads: "${title || '(none)'}". Search engines and tabs show this.` })
  }
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html)
  if (!hasViewport) charges.push({ code: 'viewport', severity: 'major', title: 'No mobile viewport tag', detail: 'The page likely isn’t built to adapt to phones at all.' })
  if (!/<link[^>]+rel=["'][^"']*icon/i.test(html)) charges.push({ code: 'favicon', severity: 'minor', title: 'No favicon', detail: 'That little tab icon is missing — a small but classic unfinished-site tell.' })
  if (!/property=["']og:image["']/i.test(html)) charges.push({ code: 'og', severity: 'minor', title: 'No social preview image', detail: 'Shared on WhatsApp/LinkedIn, this link will look bare.' })
  const placeholders = ['lorem ipsum', 'welcome to our website', 'welcome to my website', 'your business name', 'company name here', 'coming soon', 'lorem'].filter(p => lower.includes(p))
  if (placeholders.length) charges.push({ code: 'placeholder', severity: 'critical', title: 'Placeholder/filler text found', detail: `Detected: "${placeholders[0]}". The template’s demo copy was never replaced.` })
  if (/wix\.com\/website-builder|created with weebly|make a free website with|proudly powered by|carrd\.co|godaddy\.com\/websites/i.test(lower)) {
    charges.push({ code: 'badge', severity: 'major', title: 'Free "Made with…" badge', detail: 'The builder’s own advertising badge is still on the site — a dead giveaway of a free plan.' })
  }

  // Speed + mobile (parallel).
  const [mobile, desktop] = await Promise.all([pageSpeed(finalUrl, 'mobile'), pageSpeed(finalUrl, 'desktop')])
  if (mobile) {
    if (mobile.score < 50) charges.push({ code: 'slow_mobile', severity: 'critical', title: `Painfully slow on mobile (${mobile.score}/100)`, detail: `Largest content paints at ${mobile.lcp ?? '—'}. Visitors leave before it loads.` })
    else if (mobile.score < 80) charges.push({ code: 'okish_mobile', severity: 'minor', title: `Mediocre mobile speed (${mobile.score}/100)`, detail: `Room to improve. LCP ${mobile.lcp ?? '—'}.` })
    else charges.push({ code: 'fast_mobile', severity: 'good', title: `Fast on mobile (${mobile.score}/100)`, detail: 'Loads quickly on a phone. Nice.' })
  }

  // ---- Guilt score: 0 (innocent, human-made) → 100 (throw the book at it) ----
  const weights: Record<Severity, number> = { critical: 34, major: 20, minor: 9, good: -14 }
  let guilt = 0
  for (const c of charges) guilt += weights[c.severity]
  guilt = Math.max(0, Math.min(100, guilt))

  const verdict =
    guilt >= 66
      ? { level: 'guilty', label: 'GUILTY' }
      : guilt >= 30
        ? { level: 'suspicious', label: 'SUSPICIOUS' }
        : { level: 'cleared', label: 'CLEARED' }

  return NextResponse.json({
    url: finalUrl,
    guilt,
    verdict,
    charges: charges.sort((a, b) => weights[b.severity] - weights[a.severity]),
    builder: builder ? { name: builder.name, kind: builder.kind } : null,
    fonts,
    speed: { mobile, desktop },
    mobileFriendly: hasViewport,
  })
}

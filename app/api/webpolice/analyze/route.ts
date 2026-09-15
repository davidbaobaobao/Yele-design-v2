import { NextResponse } from 'next/server'

// The Web Police — a satire tool, not a serious audit. It fetches the target's
// public HTML and hunts for the classic "AI slop" design tells (purple
// gradients, rounded-card soup, glow/blur, giant centered hero, gradient text,
// tiny gray text, Lucide icon spam, bento grids, pill overload, etc.), then
// hands down a comedic verdict + an "effort" estimate. Accuracy is explicitly
// NOT the point — laughs are.

export const runtime = 'nodejs'
export const maxDuration = 20

type Charge = { code: string; title: string; detail: string }

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
    host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal') ||
    /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) || host === '0.0.0.0' || host === '::1' || !host.includes('.')
  ) return null
  return u
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const u = normalizeUrl(body?.url)
  if (!u) return NextResponse.json({ error: 'Give us a real, public URL to investigate (like example.com).' }, { status: 400 })

  let html = ''
  try {
    const ctrl = new AbortController()
    const to = setTimeout(() => ctrl.abort(), 12000)
    const res = await fetch(u.toString(), {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; YeleWebPolice/1.0; +https://yele.design/webpolice)' },
      redirect: 'follow',
      signal: ctrl.signal,
    })
    clearTimeout(to)
    html = (await res.text()).slice(0, 800_000)
  } catch {
    return NextResponse.json({ error: "Couldn't reach that site. Is the address right and the site online?" }, { status: 502 })
  }

  const lower = html.toLowerCase()
  const n = (re: RegExp) => (lower.match(re) || []).length

  const hasGradient = /bg-gradient|linear-gradient|radial-gradient|conic-gradient/.test(lower)
  const hasPurple = /purple|indigo|violet|fuchsia|#7c3aed|#6d28d9|#8b5cf6|#6366f1|#4f46e5|#a855f7|#818cf8|#c084fc/.test(lower)
  const roundedCards = n(/rounded-2xl|rounded-3xl|rounded-\[1[6-9]px\]|rounded-\[2\dpx\]|rounded-\[3\dpx\]/g)
  const roundedFull = n(/rounded-full/g)
  const blurGlow = /backdrop-blur|backdrop-filter|blur\(|drop-shadow|shadow-2xl|shadow-\[0/.test(lower)
  const bigText = /text-6xl|text-7xl|text-8xl|text-9xl/.test(lower)
  const textCenter = n(/text-center/g)
  const mxAuto = n(/mx-auto/g)
  const gradientText = /bg-clip-text|-webkit-background-clip:\s*text|background-clip:\s*text|text-transparent/.test(lower)
  const tinyGray = n(/text-gray-400|text-gray-500|text-slate-400|text-slate-500|text-neutral-400|text-zinc-400|#9ca3af|#6b7280|#94a3b8/g)
  const lucide = /lucide/.test(lower)
  const svgCount = n(/<svg/g)
  const bento = /bento/.test(lower) || n(/col-span-/g) >= 4
  const charts = /recharts|chart\.js|chartjs|apexcharts|highcharts/.test(lower)
  const bigPad = n(/py-24|py-28|py-32|py-40|py-48/g)
  const hover = n(/hover:scale|hover:-translate|group-hover|hover:shadow/g)
  const particles = /tsparticles|particles\.js|particlesjs/.test(lower)
  const darkBg = /bg-black|bg-gray-950|bg-neutral-950|bg-zinc-950|bg-slate-900|#0a0a0a|#0b1120|#0f172a|#111827/.test(lower)
  const genericFont = /poppins|inter|montserrat|roboto|open\+sans|lato/.test(lower)

  // Ordered most→least visually damning (matches the design-cue priority list).
  const detectors: { code: string; hit: boolean; title: string; detail: string }[] = [
    { code: 'purple', hit: hasGradient && hasPurple, title: 'Purple-gradient abuse, first degree', detail: 'The suspect drenched the page in purple-blue gradients. Everything glows, nothing wins.' },
    { code: 'rounded', hit: roundedCards >= 6, title: 'Rounded-card soup', detail: `Counted a suspicious ${roundedCards}+ big rounded rectangles. The page reads like a component-library demo.` },
    { code: 'glow', hit: blurGlow, title: 'Glow & blur overload', detail: 'Blurred blobs, glassmorphism and neon shadows muddying the hierarchy. Squint harder, citizen.' },
    { code: 'hero', hit: bigText && textCenter >= 1, title: 'Giant centered hero, tiny eyebrow, two pill buttons', detail: 'The most predictable hero in the game. We could have drawn it blindfolded.' },
    { code: 'gradtext', hit: gradientText, title: 'Gradient text on one random word', detail: 'One word in the headline mysteriously rainbow. Decorative, not intentional.' },
    { code: 'graytext', hit: tinyGray >= 3, title: 'Tiny low-contrast gray text everywhere', detail: 'Micro gray captions and labels that look "premium" for 4 seconds, then just hard to read.' },
    { code: 'lucide', hit: lucide || svgCount >= 20, title: 'Lucide icon spam', detail: 'The same thin-line sparkle / rocket / bolt / shield in a rounded square, on every card.' },
    { code: 'bento', hit: bento, title: 'Bento grids with no reason to exist', detail: 'Irregular card grid used for content that had zero need to be a grid.' },
    { code: 'pills', hit: roundedFull >= 6, title: 'Pills. Everywhere.', detail: `Around ${roundedFull} capsule-shaped things. Nav, badges, CTAs — soft and toy-like.` },
    { code: 'dashboard', hit: charts, title: 'Fake dashboard cosplay', detail: 'Decorative charts, KPIs and little widgets that measure absolutely nothing.' },
    { code: 'space', hit: bigPad >= 3, title: 'Excessive empty space', detail: 'Enormous gaps between very little information. Stretched, not elegant.' },
    { code: 'centered', hit: textCenter >= 4 && mxAuto >= 6, title: 'Everything centered', detail: 'Centered titles, text, buttons, testimonials — all composition and tension surrendered.' },
    { code: 'combo', hit: hasGradient && blurGlow && roundedCards >= 4 && hover >= 4, title: 'Too many competing effects in one component', detail: 'Gradient + glass + border + shadow + glow + icon + badge, all fighting in the same box.' },
    { code: 'darkmode', hit: darkBg && hasPurple, title: 'Generic neon dark mode', detail: 'Near-black navy with purple/cyan accents. Instantly recognizable, instantly anonymous.' },
    { code: 'hover', hit: hover >= 8, title: 'Overdone hover animations', detail: 'Every card lifts, glows, scales or grows a gradient border. Calm down.' },
    { code: 'particles', hit: particles, title: 'Decorative particles to fill the void', detail: 'Floating dots and stars added purely to hide the emptiness.' },
    { code: 'font', hit: genericFont, title: 'The default AI font', detail: 'Poppins / Inter / Montserrat — the typeface every generator reaches for first.' },
  ]

  const charges: Charge[] = detectors.filter(d => d.hit).map(d => ({ code: d.code, title: d.title, detail: d.detail }))

  // Effort: the more crimes, the less effort was spent. Pure comedy math.
  const crimes = charges.length
  const effort = Math.max(1, 22 - crimes * 2)
  const effortFlavor =
    effort <= 4 ? 'Barely longer than ordering a coffee.' :
    effort <= 9 ? 'One lunch break, tops.' :
    effort <= 15 ? 'A solid afternoon of copy-pasting.' :
    'Suspiciously high. Someone may have actually tried.'

  const passed = crimes <= 2
  const verdict = passed
    ? { level: 'cleared', label: crimes === 0 ? 'CLEARED — no slop detected' : 'CLEARED — barely' }
    : crimes <= 5
      ? { level: 'suspicious', label: 'SUSPICIOUS' }
      : { level: 'guilty', label: 'GUILTY OF DESIGN CRIMES' }

  return NextResponse.json({
    url: u.toString(),
    crimes,
    charges,
    effort,
    effortFlavor,
    passed,
    verdict,
  })
}

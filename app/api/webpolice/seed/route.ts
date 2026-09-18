import { NextResponse } from 'next/server'
import { type Locale } from '@/lib/i18n/webpolice'
import { siteListFor } from '@/lib/webpolice/examples'
import { saveSeed, listSeededUrls } from '@/lib/webpolice/store'
import { analyzeCore, normalizeUrl } from '../analyze/route'

export const runtime = 'nodejs'
export const maxDuration = 300

function toLocales(v: unknown): Locale[] {
  const all: Locale[] = ['en', 'es', 'zh']
  if (typeof v === 'string') {
    const picked = v.split(',').map(s => s.trim()).filter((s): s is Locale => (all as string[]).includes(s))
    if (picked.length) return picked
  }
  return ['en']
}

// GET — the client asks which sites are seeded so it only offers those.
export async function GET(request: Request) {
  const locale = (new URL(request.url).searchParams.get('locale') as Locale) || 'en'
  const loc: Locale = locale === 'es' || locale === 'zh' ? locale : 'en'
  const urls = await listSeededUrls(loc)
  return NextResponse.json({ urls })
}

// POST — precompute scores for a BATCH of sites and store them as seed rows.
// Guarded by SEED_SECRET. Processed in slices so each call stays within the
// serverless time limit; keep calling with the returned nextOffset until it is
// null. Sites whose screenshot can't be captured (bot-protected) are discarded.
export async function POST(request: Request) {
  const secret = process.env.SEED_SECRET
  const given = request.headers.get('x-seed-secret') || new URL(request.url).searchParams.get('secret')
  if (!secret || given !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const sp = new URL(request.url).searchParams
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const locales = toLocales(body.locales ?? sp.get('locales'))
  const offset = Math.max(0, Number(body.offset ?? sp.get('offset')) || 0)
  const limit = Math.min(8, Math.max(1, Number(body.limit ?? sp.get('limit')) || 4))

  // Each locale has its own site list (Spanish uses common Spanish sites); the
  // list to walk is the FIRST requested locale's.
  const SITES = siteListFor(locales[0])
  const batch = SITES.slice(offset, offset + limit)
  const seeded: string[] = []
  const discarded: { url: string; reason: string }[] = []

  for (const site of batch) {
    const u = normalizeUrl(site.url)
    if (!u) { discarded.push({ url: site.url, reason: 'bad url' }); continue }
    for (const locale of locales) {
      const core = await analyzeCore(u, locale)
      if (!core.ok || !core.payload.screenshot) {
        discarded.push({ url: site.url, reason: core.ok ? 'no screenshot' : core.error.slice(0, 60) })
        continue
      }
      await saveSeed({
        url: u.toString(),
        host: u.hostname,
        locale,
        quality: typeof core.payload.quality === 'number' ? core.payload.quality : null,
        verdict: (core.payload.verdict as { label?: string } | undefined)?.label ?? null,
        result: core.payload,
      })
      seeded.push(`${locale}:${site.name}`)
    }
  }

  const nextOffset = offset + limit < SITES.length ? offset + limit : null
  return NextResponse.json({ total: SITES.length, processed: offset + batch.length, nextOffset, locales, seeded, discarded })
}

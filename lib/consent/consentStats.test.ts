import { describe, it, expect, beforeEach } from 'vitest'
import {
  normEvent, normPage, normLocale, pageFromPath, localeFromPath,
  buildConsentPayload, createRateLimiter, CONSENT_EVENTS,
} from './consentStats'
import {
  bumpConsentStat, readConsentStats, sumOutcome, rates, __resetMemForTests,
} from './consentStore'

describe('event allowlist', () => {
  it('accepts exactly the four defined events', () => {
    expect(CONSENT_EVENTS).toEqual(['shown', 'accept', 'reject', 'no_choice'])
    for (const e of CONSENT_EVENTS) expect(normEvent(e)).toBe(e)
  })
  it('rejects invalid / injected event names', () => {
    for (const bad of ['SHOWN', 'click', 'accept ', '', 'drop table', 42, null, undefined, {}]) {
      expect(normEvent(bad as unknown)).toBeNull()
    }
  })
})

describe('page / locale normalisation', () => {
  it('collapses unknown pages/locales to "other" (never a raw URL)', () => {
    expect(normPage('letsbuild')).toBe('letsbuild')
    expect(normPage('https://x.com/?email=a@b.com')).toBe('other')
    expect(normPage(undefined)).toBe('other')
    expect(normLocale('es')).toBe('es')
    expect(normLocale('fr')).toBe('other')
  })
  it('derives page from path (letsbuildnow before letsbuild)', () => {
    expect(pageFromPath('/es/letsbuildnow')).toBe('letsbuildnow')
    expect(pageFromPath('/es/letsbuild')).toBe('letsbuild')
    expect(pageFromPath('/es/tutienda')).toBe('tutienda')
    expect(pageFromPath('/webpolice')).toBe('webpolice')
    expect(pageFromPath('/anything-else')).toBe('other')
    expect(localeFromPath('/es/tutienda')).toBe('es')
    expect(localeFromPath('/zh/letsbuild')).toBe('zh')
    expect(localeFromPath('/letsbuild')).toBe('en')
  })
})

describe('buildConsentPayload — minimal, no PII', () => {
  it('returns ONLY {event,page,locale} and nothing else', () => {
    const p = buildConsentPayload('accept', 'letsbuild', 'es')
    expect(p).not.toBeNull()
    expect(Object.keys(p!).sort()).toEqual(['event', 'locale', 'page'])
    expect(p).toEqual({ event: 'accept', page: 'letsbuild', locale: 'es' })
  })
  it('cannot smuggle extra fields (ids, url, fingerprints)', () => {
    // Even if a caller passes junk, the builder only reads the three args.
    const p = buildConsentPayload('reject', 'tutienda', 'es')
    expect(Object.keys(p!)).not.toContain('id')
    expect(Object.keys(p!)).not.toContain('url')
    expect(Object.keys(p!)).not.toContain('ip')
  })
  it('accept and reject are symmetric (same shape, same validity)', () => {
    const a = buildConsentPayload('accept', 'webpolice', 'es')
    const r = buildConsentPayload('reject', 'webpolice', 'es')
    expect(Object.keys(a!)).toEqual(Object.keys(r!))
    expect(a!.event).toBe('accept')
    expect(r!.event).toBe('reject')
  })
  it('returns null for an invalid event', () => {
    expect(buildConsentPayload('nope', 'letsbuild', 'es')).toBeNull()
  })
})

describe('rate limiter (no persistent identifier)', () => {
  it('allows up to max then blocks within the window, resets after', () => {
    const rl = createRateLimiter({ windowMs: 1000, max: 3 })
    const key = 'hash-abc'
    expect(rl.allow(key, 0)).toBe(true)
    expect(rl.allow(key, 10)).toBe(true)
    expect(rl.allow(key, 20)).toBe(true)
    expect(rl.allow(key, 30)).toBe(false) // 4th in window → blocked
    expect(rl.allow(key, 1001)).toBe(true) // window elapsed → allowed again
  })
  it('limits per key independently', () => {
    const rl = createRateLimiter({ windowMs: 1000, max: 1 })
    expect(rl.allow('a', 0)).toBe(true)
    expect(rl.allow('b', 0)).toBe(true)
    expect(rl.allow('a', 0)).toBe(false)
  })
})

describe('aggregate counters (in-memory fallback, no DB / no visitor id)', () => {
  beforeEach(() => __resetMemForTests())

  it('counts shown / accept / reject / no_choice', async () => {
    const day = '2026-10-06'
    await bumpConsentStat('shown', 'letsbuild', 'es', day)
    await bumpConsentStat('shown', 'letsbuild', 'es', day)
    await bumpConsentStat('accept', 'letsbuild', 'es', day)
    await bumpConsentStat('reject', 'letsbuild', 'es', day)
    await bumpConsentStat('no_choice', 'letsbuild', 'es', day)

    const rows = await readConsentStats(day)
    const o = sumOutcome(rows, { page: 'letsbuild', locale: 'es', day })
    expect(o).toEqual({ shown: 2, accept: 1, reject: 1, no_choice: 1 })
  })

  it('rates use banner_shown as the denominator and never divide by zero', async () => {
    const day = '2026-10-06'
    await bumpConsentStat('shown', 'tutienda', 'es', day)
    await bumpConsentStat('shown', 'tutienda', 'es', day)
    await bumpConsentStat('shown', 'tutienda', 'es', day)
    await bumpConsentStat('shown', 'tutienda', 'es', day)
    await bumpConsentStat('accept', 'tutienda', 'es', day)
    const r = rates(sumOutcome(await readConsentStats(day), { page: 'tutienda', locale: 'es' }))
    expect(r.accept).toBeCloseTo(0.25)

    // No displays → null rates (not NaN / Infinity).
    const none = rates({ shown: 0, accept: 5, reject: 0, no_choice: 0 })
    expect(none.accept).toBeNull()
  })
})

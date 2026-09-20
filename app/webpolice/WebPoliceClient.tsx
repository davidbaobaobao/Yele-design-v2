'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import LeadForm from '@/components/LeadForm'
import { getWP, type WPStrings, type Locale } from '@/lib/i18n/webpolice'
import { showcaseFor, poolFor, faviconUrl } from '@/lib/webpolice/examples'
import { getFunnelDict } from '@/lib/i18n/funnel'
import { useVideoAutoplay } from '@/hooks/useVideoAutoplay'

// A visitor session id, so every site checked in one sitting is emailed as a
// single digest instead of one message per search. Lives in sessionStorage:
// new tab / new visit = new session, and it never leaves this browser except
// as an opaque id.

// Compare URLs ignoring protocol / trailing slash / case, so the pool's
// "https://stripe.com" matches the server's normalized "https://stripe.com/".
const normKey = (u: string) => u.replace(/^https?:\/\//, '').replace(/\/+$/, '').toLowerCase()

function sessionId(): string {
  try {
    const k = 'wp_session'
    let v = sessionStorage.getItem(k)
    if (!v) {
      v = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/[^A-Za-z0-9_-]/g, '')
      sessionStorage.setItem(k, v)
    }
    return v
  } catch {
    return ''
  }
}

// ── Lightweight funnel telemetry (consent-aware) ─────────────────────────────
// Fire-and-forget via sendBeacon so it never blocks or slows the page. Each
// event is sent at most once per page load (deduped here).
//
// Consent model, matching the cookie banner:
//  • Non-EU (US): implied consent — events send immediately.
//  • EU + explicit Accept: events send immediately (+ any buffered ones flush).
//  • EU + explicit Reject: nothing is ever sent.
//  • EU + no choice yet: events are BUFFERED locally and only sent at the end of
//    the session (pagehide) if the visitor hasn't rejected by then.
const firedEvents = new Set<string>()
const eventBuffer: { event: string; locale: string; url?: string }[] = []

function isEuVisitor(): boolean {
  // The middleware sets `yele_eu=0` for detected non-EU (e.g. US). Anything
  // else (incl. unknown) is treated as EU for the stricter consent path.
  try { return !document.cookie.split('; ').some(c => c === 'yele_eu=0') } catch { return true }
}
function analyticsConsent(): 'accept' | 'reject' | 'none' {
  try {
    const raw = localStorage.getItem('cookie-consent')
    if (!raw) return 'none'
    return JSON.parse(raw).analytics ? 'accept' : 'reject'
  } catch { return 'none' }
}
function sendEvent(event: string, locale: string, url?: string) {
  try {
    const payload = JSON.stringify({ event, locale, sessionId: sessionId(), url })
    const blob = new Blob([payload], { type: 'application/json' })
    if (!navigator.sendBeacon?.('/api/webpolice/event', blob)) {
      fetch('/api/webpolice/event', { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
    }
  } catch { /* best-effort */ }
}
// Flush any buffered EU events — unless the visitor has explicitly rejected.
function flushEventBuffer() {
  if (analyticsConsent() === 'reject') { eventBuffer.length = 0; return }
  while (eventBuffer.length) { const e = eventBuffer.shift()!; sendEvent(e.event, e.locale, e.url) }
}
function dropEventBuffer() { eventBuffer.length = 0 }
function track(event: string, locale: string, opts?: { repeat?: boolean; url?: string }) {
  try {
    // `repeat` events (e.g. each search) are counted every time; everything else
    // fires at most once per page load.
    if (!opts?.repeat) {
      if (firedEvents.has(event)) return
      firedEvents.add(event)
    }
    const consent = analyticsConsent()
    if (consent === 'reject') return                          // never send
    if (!isEuVisitor() || consent === 'accept') { sendEvent(event, locale, opts?.url); return }
    eventBuffer.push({ event, locale, url: opts?.url })       // EU, undecided → hold
  } catch { /* best-effort, never throws into the UI */ }
}

// An invisible 1px sentinel that fires a funnel event the first time it scrolls
// into view (IntersectionObserver — cheap, no scroll listeners).
function TrackSeen({ event, locale, url }: { event: string; locale: string; url?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { track(event, locale, { url }); io.disconnect() }
    }, { threshold: 0.01 })
    io.observe(el)
    return () => io.disconnect()
  }, [event, locale, url])
  return <div ref={ref} aria-hidden="true" className="h-px w-full" />
}


// A full-page screenshot can be several thousand pixels tall. The card keeps a
// fixed height and the image is dragged inside it, so a long site can't push
// the whole report off the screen — and you can still see every section.
function EvidenceViewer({ src, hint }: { src: string; hint: string }) {
  const box = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const drag = useRef<{ fromY: number; fromOffset: number } | null>(null)
  const [y, setY] = useState(0)
  const [max, setMax] = useState(0)
  const [thumbPct, setThumbPct] = useState(100)
  const [grabbing, setGrabbing] = useState(false)

  function measure() {
    const b = box.current
    const i = img.current
    if (!b || !i || !i.offsetHeight) return
    const overflow = Math.max(0, i.offsetHeight - b.clientHeight)
    setMax(overflow)
    setThumbPct(Math.max(12, Math.min(100, (b.clientHeight / i.offsetHeight) * 100)))
    setY(v => Math.min(v, overflow))
  }

  useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const clamp = (v: number) => Math.min(max, Math.max(0, v))

  function onDown(e: React.PointerEvent<HTMLDivElement>) {
    if (max <= 0) return
    drag.current = { fromY: e.clientY, fromOffset: y }
    setGrabbing(true)
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* older browsers */ }
  }
  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return
    setY(clamp(drag.current.fromOffset - (e.clientY - drag.current.fromY)))
  }
  function onUp(e: React.PointerEvent<HTMLDivElement>) {
    drag.current = null
    setGrabbing(false)
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
  }

  return (
    <div
      className="relative mb-6 select-none overflow-hidden rounded-2xl border border-white/10 bg-black/25"
      style={{ height: 'clamp(260px, 42vh, 460px)' }}
    >
      <div
        ref={box}
        className="h-full w-full overflow-hidden"
        style={{ touchAction: max > 0 ? 'none' : 'auto', cursor: max > 0 ? (grabbing ? 'grabbing' : 'grab') : 'default' }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- data URI screenshot */}
        <img
          ref={img}
          src={src}
          onLoad={measure}
          draggable={false}
          alt="Evidence: screenshot of the suspect website"
          className="block w-full"
          style={{ transform: `translateY(${-y}px)`, willChange: 'transform' }}
        />
      </div>

      {max > 0 && (
        <>
          {/* position indicator */}
          <div className="pointer-events-none absolute bottom-2 right-2 top-2 w-1 rounded-full bg-white/10">
            <div
              className="absolute left-0 w-full rounded-full bg-white/45"
              style={{ height: `${thumbPct}%`, top: `${(y / max) * (100 - thumbPct)}%` }}
            />
          </div>
          {y === 0 && (
            <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 font-mono text-[11px] text-white/85 backdrop-blur">
              ↕ {hint}
            </span>
          )}
        </>
      )}
    </div>
  )
}

// Fade-in-on-mount + cursor parallax tilt wrapper for the report cards.
function TiltCard({ children, className = '', delay = 0, bg }: { children: React.ReactNode; className?: string; delay?: number; bg?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 150, damping: 18 })
  const sy = useSpring(my, { stiffness: 150, damping: 18 })
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-5, 5])
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { mx.set(0); my.set(0) }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      style={{ rotateX, rotateY, transformPerspective: 1000, ...(bg ? { background: bg } : {}) }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

type Charge = { code: string; title: string; detail: string; bg?: string }
type Result = {
  url: string
  crimes: number
  charges: Charge[]
  quality: number
  effortLabel: string
  effortFlavor: string
  passed: boolean
  verdict: { level: 'guilty' | 'suspicious' | 'cleared'; label: string }
  summary?: string
  rant?: string
  sells?: string
  saysHears?: { says: string; hears: string } | null
  personality?: string
  designYear?: number | null
  designYearWhy?: string
  screenshot?: string | null
  mode?: 'vision' | 'basic'
  note?: string
}

const PINK_TOP = '#edb9ca'
const PINK_BOTTOM = '#d4a6b2'
// Fade all four edges so the video melts into the pink (sides + top/bottom).
const MASK_H = 'linear-gradient(90deg, transparent 0%, #000 30%, #000 70%, transparent 100%)'
const MASK_V = 'linear-gradient(180deg, transparent 0%, #000 20%, #000 80%, transparent 100%)'

const VERDICT_TEXT: Record<string, string> = {
  guilty: 'text-red-400',
  suspicious: 'text-amber-300',
  cleared: 'text-emerald-300',
}

// Module-level so it is NOT recreated on every keystroke — that remount was
// what reset the videos while typing.
function Gorilla({ side, vref, hidden }: { side: 'left' | 'right'; vref: React.RefObject<HTMLVideoElement>; hidden: boolean }) {
  const slide = hidden ? (side === 'left' ? 'translateX(-150%)' : 'translateX(150%)') : 'translateX(0)'
  // iOS won't autoplay from the React attributes alone — force the muted
  // attribute + play() with the shared hook. Low threshold so the gorillas,
  // which sit partly off the screen edges, still count as "visible".
  useVideoAutoplay(vref, 0.05)
  return (
    <video
      ref={vref}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      className={`pointer-events-none absolute top-[15%] md:top-1/2 z-0 w-[42vw] max-w-[260px] md:w-[26vw] md:max-w-[380px] transition-transform duration-500 ease-in ${
        side === 'left' ? 'left-[-9%] md:left-[-2%]' : 'right-[-9%] md:right-[-2%]'
      }`}
      style={
        {
          transform: `${slide} translateY(-50%) ${side === 'right' ? 'scaleX(-1)' : ''}`,
          maskImage: `${MASK_H}, ${MASK_V}`,
          maskComposite: 'intersect',
          WebkitMaskImage: `${MASK_H}, ${MASK_V}`,
          WebkitMaskComposite: 'source-in',
          opacity: 0.96,
        } as React.CSSProperties
      }
    >
      <source src="/media/webpolice/gorilla.mp4" type="video/mp4" />
    </video>
  )
}

// The running gorilla shown during analysis — its own component so the autoplay
// hook runs when the loading state mounts it (iOS-safe).
// The user's own short clips, played BIG in a random order while a scan runs so
// the wait is entertaining — a fresh shuffle each session means the reel opens
// on a different clip every time.
const LOADING_CLIPS = ['esperando', 'agencias', 'gato', 'informatico', 'chase']
function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const clipSrc = (name: string) => `/media/webpolice/loading/${name}.mp4`

// Two stacked <video> buffers: one plays while the other silently PRELOADS the
// next clip, then they swap with a quick crossfade. Because the next clip is
// already buffered, there's no black gap — the clips run back-to-back like one
// continuous film, in a fresh random order that loops forever.
function LoadingReel() {
  const aRef = useRef<HTMLVideoElement>(null)
  const bRef = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(0) // 0 = A visible, 1 = B visible
  const queue = useRef<string[]>([])
  const started = useRef(false)

  const nextClip = () => {
    if (queue.current.length === 0) queue.current = shuffled(LOADING_CLIPS)
    return queue.current.shift() as string
  }
  const prime = (v: HTMLVideoElement | null, name: string) => {
    if (!v) return
    v.setAttribute('muted', '')
    v.setAttribute('playsinline', '')
    v.muted = true
    v.src = clipSrc(name)
    v.load()
  }
  const playFromStart = (v: HTMLVideoElement | null) => {
    if (!v) return
    v.muted = true
    try { v.currentTime = 0 } catch { /* not seekable yet, fine */ }
    v.play().catch(() => setTimeout(() => v.play().catch(() => {}), 250))
  }

  useEffect(() => {
    if (started.current) return
    started.current = true
    prime(aRef.current, nextClip()) // now playing
    prime(bRef.current, nextClip()) // preloaded, waiting
    playFromStart(aRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onEnded = (which: 0 | 1) => {
    const nextVid = which === 0 ? bRef.current : aRef.current
    const finished = which === 0 ? aRef.current : bRef.current
    setActive(which === 0 ? 1 : 0)
    playFromStart(nextVid) // already buffered → starts instantly
    // Reload the just-finished buffer with the NEXT clip only after the
    // crossfade, so its last frame stays put while it fades out.
    setTimeout(() => prime(finished, nextClip()), 220)
  }

  const cls = 'absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ease-linear'
  return (
    <div
      className="relative w-[92vw] max-w-[760px] overflow-hidden rounded-2xl shadow-2xl shadow-black/40"
      style={{ aspectRatio: '1280 / 732', backgroundColor: '#0D0E12' }}
    >
      <video ref={aRef} muted playsInline preload="auto" aria-hidden="true" onEnded={() => onEnded(0)} className={`${cls} ${active === 0 ? 'opacity-100' : 'opacity-0'}`} />
      <video ref={bRef} muted playsInline preload="auto" aria-hidden="true" onEnded={() => onEnded(1)} className={`${cls} ${active === 1 ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  )
}

// Crawlable, keyword-rich SEO content shown below the tool. It renders in the
// server HTML (client components still SSR), so search engines index it.
function SeoSection({ t }: { t: WPStrings }) {
  // Kept in the DOM for SEO (crawlers + the FAQ copy), but visually hidden.
  return (
    <section className="sr-only" aria-hidden="true">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">{t.seoH2}</h2>
        <p className="font-body text-base text-white/70 leading-relaxed mt-4">{t.seoP1}</p>
        <p className="font-body text-base text-white/70 leading-relaxed mt-3">{t.seoP2}</p>

        <div className="mt-10 divide-y divide-white/10 border-t border-b border-white/10">
          {t.faq.map(item => (
            <div key={item.q} className="py-5">
              <h3 className="font-body font-semibold text-base text-white">{item.q}</h3>
              <p className="font-body text-sm text-white/65 leading-relaxed mt-1.5">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function WebPoliceClient({ locale = 'en' }: { locale?: Locale }) {
  const t = getWP(locale)
  const loadingLines = t.loadingLines
  const planOptions = getFunnelDict(locale).pricing.tiers.map(x => x.planValue)
  const [url, setUrl] = useState('')
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done'>('idle')
  const [line, setLine] = useState(0)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const leftVid = useRef<HTMLVideoElement>(null)
  const rightVid = useRef<HTMLVideoElement>(null)
  const progRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // URL currently being analyzed — set while loading, cleared when it finishes.
  // If the visitor leaves while it's still set, we log it as "abandoned".
  const pendingUrl = useRef<string | null>(null)
  // Last site the dice landed on, so the next roll is a different one.
  const lastRandom = useRef<string | undefined>(undefined)
  // Which pool sites are precomputed (seeded) — the dice only rolls these, so a
  // random pick is instant and never spends an LLM call. null = not loaded yet.
  const seededSet = useRef<Set<string> | null>(null)

  const moved = phase !== 'idle'
  const basePath = locale === 'en' ? '/webpolice' : `/${locale}/webpolice`

  const setRate = (r: number) => {
    for (const v of [leftVid.current, rightVid.current]) if (v) v.playbackRate = r
  }

  async function run(override?: string) {
    const value = (override ?? url).trim()
    if (!value || phase === 'loading') return
    track('search', locale, { repeat: true })
    if (override && override !== url) setUrl(override)
    setError('')
    setResult(null)
    setPhase('loading')
    pendingUrl.current = value
    setRate(2)
    setProgress(0)
    // Reflect the analyzed site in the URL so results are shareable/linkable.
    try {
      window.history.replaceState(null, '', `${basePath}?url=${encodeURIComponent(value)}`)
    } catch { /* ignore */ }
    const started = Date.now()
    // Keep the "thinking" animation up for at least this long, even when the
    // answer comes back instantly (e.g. a precomputed showcase/random site).
    const MIN_LOADING_MS = 5000
    const timer = setInterval(() => setLine(l => (l + 1) % loadingLines.length), 1400)
    // Mostly-LINEAR progress so it doesn't shoot to ~98 then freeze (looks
    // glitched). Climbs steadily to 92% over the expected duration, then keeps
    // creeping slowly (never fully stalls) until the answer arrives → 100.
    const EXPECTED_MS = 26000
    progRef.current = setInterval(() => {
      const elapsed = Date.now() - started
      const p = elapsed < EXPECTED_MS
        ? (elapsed / EXPECTED_MS) * 92
        : 92 + (1 - Math.exp(-(elapsed - EXPECTED_MS) / 9000)) * 7 // 92 → 99 slow creep
      setProgress(Math.min(99, Math.round(p)))
    }, 120)
    try {
      const res = await fetch('/api/webpolice/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: value, locale, sessionId: sessionId() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t.errWall)
        setPhase('idle')
        setRate(1)
      } else {
        const wait = MIN_LOADING_MS - (Date.now() - started)
        if (wait > 0) await new Promise(r => setTimeout(r, wait))
        setResult(data)
        setPhase('done')
        track('result_view', locale)
      }
    } catch {
      setError(t.errWall)
      setPhase('idle')
      setRate(1)
    } finally {
      pendingUrl.current = null // finished (success or error) → no longer abandonable
      clearInterval(timer)
      if (progRef.current) clearInterval(progRef.current)
      setProgress(100)
    }
  }

  // If the visitor leaves while a scan is still running, log it as abandoned.
  useEffect(() => {
    const onLeave = () => {
      const u = pendingUrl.current
      if (!u) return
      pendingUrl.current = null
      try {
        const payload = JSON.stringify({ url: u, locale, sessionId: sessionId() })
        navigator.sendBeacon?.('/api/webpolice/abandon', new Blob([payload], { type: 'application/json' }))
      } catch { /* best-effort */ }
    }
    window.addEventListener('pagehide', onLeave)
    return () => window.removeEventListener('pagehide', onLeave)
  }, [locale])

  // Consent-aware flush of buffered funnel events (EU visitors who hadn't yet
  // chosen). On an explicit choice: Accept flushes, Reject discards. At session
  // end (pagehide): flush unless they rejected.
  useEffect(() => {
    const onConsent = () => (analyticsConsent() === 'reject' ? dropEventBuffer() : flushEventBuffer())
    const onHide = () => flushEventBuffer()
    window.addEventListener('cookie-consent-updated', onConsent)
    window.addEventListener('pagehide', onHide)
    return () => {
      window.removeEventListener('cookie-consent-updated', onConsent)
      window.removeEventListener('pagehide', onHide)
    }
  }, [])

  // Shared link support: /webpolice?url=example.com auto-runs on load.
  useEffect(() => {
    track('page_view', locale)
    const p = new URLSearchParams(window.location.search).get('url')
    if (p) run(p)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Learn which pool sites are precomputed so the dice only rolls those.
  useEffect(() => {
    fetch(`/api/webpolice/seed?locale=${locale}`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (d && Array.isArray(d.urls)) seededSet.current = new Set(d.urls.map(normKey)) })
      .catch(() => { /* fall back to the full pool */ })
  }, [locale])

  // Roll the dice — prefer seeded (instant, free) sites; fall back to the full
  // pool if the seed list hasn't loaded or is empty.
  function pickRandom(): string {
    const full = poolFor(locale)
    const set = seededSet.current
    // Prefer the instant/free precomputed set only when it's big enough to give
    // real variety (English has ~50). When it's small (Spanish currently), roll
    // the WHOLE pool instead so the dice stops repeating the same handful — an
    // uncached pick analyses once and then caches, so the pool self-warms.
    const source = set && set.size >= 30 ? full.filter(s => set.has(normKey(s.url))) : full
    const pool = source.length ? source : full
    const avail = pool.filter(s => s.url !== lastRandom.current)
    const list = avail.length ? avail : pool
    return list[Math.floor(Math.random() * list.length)].url
  }

  return (
    <main className="relative">
      <section className="relative min-h-[100svh] overflow-hidden" style={{ background: `linear-gradient(180deg, ${PINK_TOP} 0%, ${PINK_BOTTOM} 100%)` }}>
      <Gorilla side="left" vref={leftVid} hidden={moved} />
      <Gorilla side="right" vref={rightVid} hidden={moved} />

      {/* Hero — bottom half on mobile (gorillas take the top half); centered
          on desktop. Uses 100svh so the bottom (chips) isn't hidden behind the
          mobile browser UI. Slides fully up when the case opens. */}
      <div
        className={`relative z-10 mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-end md:justify-center px-6 pb-[2.5vh] md:pb-0 text-center transition-transform duration-500 ease-in ${
          moved ? '-translate-y-[110vh]' : 'translate-y-0'
        }`}
      >
        <h1 className="font-display font-bold text-[#16161A] tracking-tight leading-[1.05]" style={{ fontSize: 'clamp(1.7rem, 5.4vw, 3.6rem)', textShadow: '0 6px 20px rgba(120,40,90,0.18), 0 2px 4px rgba(0,0,0,0.08)' }}>
          {t.heroPre}
          <span className="font-normal italic" style={{ fontFamily: '"Snell Roundhand", "Brush Script MT", "Segoe Script", cursive' }}>
            {t.heroCursive}
          </span>
          {t.heroPost}
        </h1>

        <ul className="mt-3 md:mt-6 mx-auto inline-flex flex-col gap-1.5 md:gap-2.5 text-left">
          {t.questions.map(q => (
            <li key={q} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#16161A] font-body text-xs font-bold text-white shadow-[0_4px_10px_rgba(0,0,0,0.20)]">?</span>
              <span className="font-body font-semibold text-[#16161A]/80 leading-snug" style={{ fontSize: 'clamp(0.92rem, 2.4vw, 1.2rem)', textShadow: '0 2px 8px rgba(120,40,90,0.12)' }}>{q}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 md:mt-8 flex w-full max-w-lg flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            placeholder={t.placeholder}
            style={{ color: '#16161A', caretColor: '#16161A' }}
            className="flex-1 rounded-full bg-white/85 backdrop-blur border border-white/60 px-5 py-3.5 font-body text-base placeholder-[#16161A]/40 shadow-[0_12px_32px_rgba(120,40,90,0.16)] focus:outline-none focus:border-[#16161A]/40 transition-colors"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => run()}
              disabled={phase === 'loading'}
              className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-full bg-[#16161A] px-7 py-3.5 font-body font-semibold text-base text-white shadow-[0_12px_30px_rgba(0,0,0,0.28)] transition-colors hover:animate-[wpSirenBtn_0.6s_linear_infinite] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {phase === 'loading' ? t.ctaLoading : t.ctaIdle}
            </button>
            <button
              type="button"
              onClick={() => {
                const pick = pickRandom()
                lastRandom.current = pick
                run(pick)
              }}
              disabled={phase === 'loading'}
              title={t.randomCta}
              aria-label={t.randomCta}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[#16161A]/15 bg-white/80 px-4 py-3.5 font-body font-semibold text-base text-[#16161A]/80 shadow-[0_10px_26px_rgba(120,40,90,0.16)] backdrop-blur transition-colors hover:border-[#16161A]/40 hover:text-[#16161A] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span aria-hidden>🎲</span>
            </button>
          </div>
        </div>

        {/* Consent note under the CTA */}
        <p className="mt-2.5 max-w-lg text-center font-body text-[11px] leading-snug text-[#16161A]/45">
          {t.consentPre}{' '}
          <a href={locale === 'es' ? '/es/terms' : '/terms'} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#16161A]/70">{t.consentTerms}</a>
          {' '}{t.consentAnd}{' '}
          <a href={locale === 'es' ? '/es/privacy-policy' : '/privacy-policy'} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#16161A]/70">{t.consentPrivacy}</a>.
        </p>

        {/* Known sites to try in one tap — good ones and famously rough ones. */}
        <div className="mt-3 md:mt-4 flex w-full max-w-lg flex-wrap items-center gap-2">
          <span className="font-body text-xs text-[#16161A]/55">{t.tryLabel}</span>
          {showcaseFor(locale).map(sIt => (
            <button
              key={sIt.url}
              type="button"
              onClick={() => run(sIt.url)}
              disabled={phase === 'loading'}
              className="inline-flex items-center gap-1.5 font-body text-xs font-medium text-[#16161A]/70 transition-colors hover:text-[#16161A] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- third-party favicon */}
              <img
                src={faviconUrl(sIt.domain)}
                alt=""
                width={16}
                height={16}
                loading="lazy"
                className="h-4 w-4 rounded-[3px]"
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
              {sIt.name}
            </button>
          ))}
        </div>

        {error && <p className="mt-5 font-body text-sm text-red-700">{error}</p>}
      </div>
      </section>

      {/* SEO content — crawlable copy + FAQ, visible on scroll in the idle state */}
      <SeoSection t={t} />

      {/* Loading — funny text on top, a BIG random reel of clips in the middle,
          the progress indicator pinned at the bottom. */}
      {phase === 'loading' && (
        <div className="fixed inset-0 z-20 flex flex-col items-center px-4 py-6 md:py-8 pointer-events-none">
          <p className="shrink-0 font-display font-bold text-[#16161A] text-center leading-snug" style={{ fontSize: 'clamp(1.2rem, 3.6vw, 2rem)' }}>
            {loadingLines[line]}
          </p>

          <div className="flex min-h-0 flex-1 items-center justify-center py-4 w-full">
            <LoadingReel />
          </div>

          <div className="shrink-0 flex flex-col items-center">
            <div className="relative h-14 w-14 md:h-16 md:w-16">
              <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90" aria-hidden="true">
                <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(22,22,26,0.15)" strokeWidth="3.5" />
                <circle
                  cx="20"
                  cy="20"
                  r="17"
                  fill="none"
                  stroke="#16161A"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 17}
                  strokeDashoffset={2 * Math.PI * 17 * (1 - Math.min(progress, 100) / 100)}
                  style={{ transition: 'stroke-dashoffset 0.15s linear' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold text-[#16161A]">
                {Math.round(progress)}%
              </span>
            </div>
            <p className="mt-3 max-w-xs text-center font-body text-sm text-[#16161A]/60">{t.loadingNote}</p>
          </div>
        </div>
      )}

      {/* Report — full-screen panel that slides up to cover everything */}
      <div
        className={`fixed inset-0 z-30 overflow-y-auto overflow-x-hidden bg-[#0D0E12] transition-transform duration-700 ease-out ${
          phase === 'done' ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        <div className="mx-auto max-w-2xl px-6 py-10 md:py-14">
          {result && (
            <Report
              result={result}
              t={t}
              locale={locale}
              planOptions={planOptions}
              basePath={basePath}
              onReset={() => {
                setPhase('idle')
                setResult(null)
                setRate(1)
                try { window.history.replaceState(null, '', basePath) } catch { /* ignore */ }
              }}
            />
          )}
        </div>
      </div>
    </main>
  )
}

const ICONS: Record<string, string> = {
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
}

// Reads the verdict + rant aloud with a deliberately robotic, Loquendo-ish
// voice (Web Speech API — free, on-device, no server cost). Click to start,
// click again to stop.
function RantSpeaker({ parts, lang, t, onPlay }: { parts: string[]; lang: string; t: WPStrings; onPlay?: () => void }) {
  const [speaking, setSpeaking] = useState(false)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cancelledRef = useRef(false)

  // Warm up the voice list (some browsers populate it lazily) and always stop
  // any narration when this leaves the screen.
  useEffect(() => {
    if (!supported) return
    const warm = () => window.speechSynthesis.getVoices()
    warm()
    window.speechSynthesis.addEventListener?.('voiceschanged', warm)
    return () => {
      window.speechSynthesis.removeEventListener?.('voiceschanged', warm)
      if (timerRef.current) clearTimeout(timerRef.current)
      window.speechSynthesis.cancel()
    }
  }, [supported])

  if (!supported) return null

  const base = lang.split('-')[0]
  // Per-language voice character: English = a robotic-ish MALE voice; Spanish =
  // a subtly robotic "Loquendo"-style voice (not the smooth natural one — that
  // read too plain); Chinese = a steady robotic voice. rate/pitch tuned for a
  // funny, subtly mechanical feel, plus a short pause between sentences.
  const cfg = (
    base === 'es' ? { male: false, robotic: true, rate: 1.0, pitchA: 0.82, pitchB: 0.76, pause: 150 }
    : base === 'zh' ? { male: false, robotic: true, rate: 1.02, pitchA: 0.9, pitchB: 0.82, pause: 150 }
    : { male: true, robotic: true, rate: 1.04, pitchA: 0.86, pitchB: 0.8, pause: 150 }
  )

  const MALE_RE = /david|daniel|alex|fred|jorge|pablo|diego|carlos|miguel|male|james|george|mark|guy|aaron|arthur|liam|nathan|thomas|paul/i
  const ROBOTIC_RE = /microsoft|espeak|loquendo|desktop|driver|pico|festival/i

  const pickVoice = (): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices()
    if (!voices.length) return null
    const inLang = voices.filter(v => v.lang === lang || v.lang.startsWith(base))
    if (!inLang.length) return null
    let pool = inLang
    if (cfg.male) { const m = pool.filter(v => MALE_RE.test(v.name)); if (m.length) pool = m }
    // Prefer a more mechanical engine (Microsoft / eSpeak / local) for the
    // Loquendo-ish robotic character, over the smooth cloud voices.
    if (cfg.robotic) {
      const r = pool.filter(v => ROBOTIC_RE.test(v.name) || v.localService === true)
      if (r.length) pool = r
    }
    return pool[0] || inLang[0]
  }

  const stop = () => {
    cancelledRef.current = true
    if (timerRef.current) clearTimeout(timerRef.current)
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  const start = () => {
    onPlay?.()
    window.speechSynthesis.cancel()
    cancelledRef.current = false
    const voice = pickVoice()
    // Drop emojis/symbols so the voice doesn't read "smiling face…".
    const clean = (s: string) =>
      s.replace(/([\uD800-\uDBFF][\uDC00-\uDFFF])|[←-⇿☀-➿⬀-⯿️]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    // Break into SENTENCES (incl. CJK punctuation) — we speak them one at a
    // time with a real pause between, so it never runs on in a flat monotone.
    const sentences = parts
      .flatMap(p => p.split(/\n+/))
      .flatMap(p => p.match(/[^.!?…。！？；]+[.!?…。！？；]*/g) || [p])
      .map(clean)
      .filter(Boolean)
    if (!sentences.length) return
    setSpeaking(true)

    let i = 0
    const speakNext = () => {
      if (cancelledRef.current) return
      if (i >= sentences.length) { setSpeaking(false); return }
      const u = new SpeechSynthesisUtterance(sentences[i])
      if (voice) u.voice = voice
      u.lang = voice?.lang || lang
      u.rate = cfg.rate
      // Subtle alternation for a funny, slightly mechanical (not flat) cadence.
      u.pitch = i % 2 === 0 ? cfg.pitchA : cfg.pitchB
      u.volume = 1
      u.onend = () => { timerRef.current = setTimeout(speakNext, cfg.pause) } // short pause
      u.onerror = () => setSpeaking(false)
      i++
      window.speechSynthesis.speak(u)
    }
    speakNext()
  }

  return (
    <button
      type="button"
      onClick={() => (speaking ? stop() : start())}
      aria-label={speaking ? t.stopListen : t.listen}
      title={speaking ? t.stopListen : t.listen}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
        speaking
          ? 'border-[#D46FC8]/60 bg-[#D46FC8]/20 text-[#DE85D2]'
          : 'border-white/15 bg-white/[0.05] text-white/85 hover:text-white hover:bg-white/15 hover:border-white/30'
      }`}
    >
      {speaking ? (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" stroke="none" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 6a9 9 0 0 1 0 12" />
        </svg>
      )}
    </button>
  )
}

function ShareBar({ result, t, basePath, locale }: { result: Result; t: WPStrings; basePath: string; locale: string }) {
  const [copied, setCopied] = useState(false)
  const link = typeof window !== 'undefined' ? `${window.location.origin}${basePath}?url=${encodeURIComponent(result.url)}` : ''
  const headline = t.shareHeadline(result.quality)
  const subtitle = t.shareSubtitle(result.quality)
  const text = `${headline} ${subtitle}` // for web-intent channels that take one text field

  const open = (u: string) => window.open(u, '_blank', 'noopener,noreferrer')
  // The native OS share sheet reliably attaches the link and lets the visitor
  // pick any app (Instagram, Stories, DMs, Messages…). It exists on mobile
  // Safari/Chrome, so we PREFER it there for every button; on desktop (no
  // navigator.share) we fall back to each network's own web-intent URL.
  const shareNative = async (): Promise<boolean> => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try { await navigator.share({ title: headline, text: subtitle, url: link }); return true } catch { return false }
    }
    return false
  }
  const targets: { key: string; label: string; go: () => void }[] = [
    { key: 'instagram', label: 'Instagram', go: async () => { if (await shareNative()) return; try { await navigator.clipboard.writeText(link) } catch { /* ignore */ } open('https://www.instagram.com/') } },
    { key: 'whatsapp', label: 'WhatsApp', go: async () => { if (await shareNative()) return; open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + link)}`) } },
    { key: 'facebook', label: 'Facebook', go: async () => { if (await shareNative()) return; open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(text)}`) } },
    { key: 'x', label: 'X', go: async () => { if (await shareNative()) return; open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`) } },
  ]
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* ignore */ }
  }

  const iconBtn = 'flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-white/85 hover:text-white hover:bg-white/15 hover:border-white/30 transition-colors'

  return (
    <div className="mt-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 mb-3">{t.shareTitle}</p>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {targets.map(t => (
          <button key={t.key} type="button" onClick={() => { track('share_click', locale); t.go() }} className={iconBtn} aria-label={`Share on ${t.label}`}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d={ICONS[t.key]} /></svg>
          </button>
        ))}
        <button type="button" onClick={() => { track('share_click', locale); copy() }} className={iconBtn} aria-label="Copy link">
          {copied ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
          )}
        </button>
      </div>
    </div>
  )
}

function Report({ result, t, locale, planOptions, basePath, onReset }: { result: Result; t: WPStrings; locale: Locale; planOptions: string[]; basePath: string; onReset: () => void }) {
  const [showAll, setShowAll] = useState(false)
  const host = result.url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const main = result.charges.slice(0, 3)
  const extra = result.charges.slice(3, 8)
  const shown = showAll ? [...main, ...extra] : main

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">🚨 {t.reportLabel}</span>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full bg-white px-4 py-2 font-body text-sm font-semibold text-[#0D0E12] shadow-lg shadow-black/20 hover:bg-white/90 transition-colors"
        >
          {t.newSearch}
        </button>
      </div>

      <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/40 break-all mb-4">{t.caseFile} {result.url}</p>

      {result.mode === 'basic' && (
        <div className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 font-body text-sm text-amber-200/90">
          {t.aiFailed}
        </div>
      )}

      {result.screenshot && <EvidenceViewer src={result.screenshot} hint={t.dragHint} />}

      {/* Score · verdict · site name · share */}
      <div className="text-center my-8">
        <p className="font-display font-bold tracking-tighter text-white leading-none" style={{ fontSize: 'clamp(4.5rem, 22vw, 9rem)' }}>
          {result.quality}
          <span className="text-white/35" style={{ fontSize: '0.32em' }}>/100</span>
        </p>
        <p className={`font-display font-bold text-xl md:text-2xl tracking-tight mt-2 ${VERDICT_TEXT[result.verdict.level]}`}>
          {result.verdict.label}
        </p>
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-body text-sm text-white/45 underline underline-offset-4 decoration-white/25 hover:text-white hover:decoration-white/60 transition-colors break-all mt-2"
        >
          {host}
        </a>

        <ShareBar result={result} t={t} basePath={basePath} locale={locale} />

        {result.summary && <p className="font-body text-lg md:text-2xl text-white/90 mt-8 max-w-xl mx-auto leading-snug">“{result.summary}”</p>}

        <div className="mt-4 flex justify-center">
          <RantSpeaker
            parts={[
              [result.verdict.label, result.summary].filter(Boolean).join('. '),
              result.rant || '',
              result.sells ? `${t.sellsLabel}: ${result.sells}` : '',
              result.personality ? `${t.personalityLabel}: ${result.personality}` : '',
              result.designYear ? `${t.designYearLabel}: ${result.designYear}.${result.designYearWhy ? ' ' + result.designYearWhy : ''}` : '',
              result.saysHears && (result.saysHears.says || result.saysHears.hears)
                ? [
                    result.saysHears.says ? `${t.saysLabel}: ${result.saysHears.says}` : '',
                    result.saysHears.hears ? `${t.hearsLabel}: ${result.saysHears.hears}` : '',
                  ].filter(Boolean).join('. ')
                : '',
              result.effortLabel ? `${t.looksLikeTook}: ${result.effortLabel}.${result.effortFlavor ? ' ' + result.effortFlavor : ''}` : '',
              result.charges && result.charges.length
                ? `${t.mainCharges(Math.min(3, result.crimes))}. ` +
                  result.charges.slice(0, 3).map(c => `${c.title}. ${c.detail}`).join(' ')
                : '',
              // Keep reading into the "Now what?" pitch after the roast.
              t.nowWhatTitle,
              ...t.nowWhatBody.map(s => s.replace(/\[u\]/g, '')),
            ].filter(Boolean)}
            lang={t.ttsLang}
            t={t}
            onPlay={() => track('speaker_click', locale)}
          />
        </div>
      </div>

      {/* The long roast — always shown, no expand. */}
      {result.rant && (
        <div className="space-y-3">
          {result.rant.split('\n').filter(p => p.trim()).map((p, i) => (
            <p key={i} className="font-body text-base md:text-lg text-white/75 leading-relaxed">{p}</p>
          ))}
        </div>
      )}

      {/* What I think you sell — guessed only from hero/CTA/images (white card) */}
      {result.sells && (
        <TiltCard className="mt-8 rounded-3xl bg-white p-6 md:p-7 shadow-2xl shadow-black/30">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] mb-2" style={{ color: '#B23FA3' }}>{t.sellsLabel}</p>
          <p className="font-display font-bold text-xl md:text-2xl leading-snug tracking-tight" style={{ color: '#16161A' }}>“{result.sells}”</p>
        </TiltCard>
      )}

      {/* Website personality diagnosis */}
      {result.personality && (
        <TiltCard className="mt-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 mb-2">{t.personalityLabel}</p>
          <p className="font-display font-bold text-xl md:text-2xl text-white leading-snug tracking-tight">“{result.personality}”</p>
        </TiltCard>
      )}

      {/* Estimated design year — mid-page marker for the funnel report */}
      <TrackSeen event="scroll_mid" locale={locale} url={result.url} />
      {result.designYear && (
        <TiltCard className="mt-4 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-7 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">{t.designYearLabel}</p>
          <p className="font-display font-bold tracking-tighter text-white leading-none mt-1" style={{ fontSize: 'clamp(2.6rem, 12vw, 4.5rem)' }}>
            {result.designYear}
          </p>
          {result.designYearWhy && (
            <p className="font-body text-sm md:text-base text-white/60 mt-2 max-w-md mx-auto">{result.designYearWhy}</p>
          )}
        </TiltCard>
      )}

      {/* Your website says vs. Visitors hear */}
      {result.saysHears && (result.saysHears.says || result.saysHears.hears) && (
        <TiltCard className="mt-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-7 text-left">
          {result.saysHears.says && (
            <>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#D46FC8]">{t.saysLabel}</p>
              <p className="font-body text-base md:text-lg text-white/90 mt-1 mb-4">“{result.saysHears.says}”</p>
            </>
          )}
          {result.saysHears.hears && (
            <>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-amber-300">{t.hearsLabel}</p>
              <p className="font-body text-base md:text-lg text-white/90 mt-1">“{result.saysHears.hears}”</p>
            </>
          )}
        </TiltCard>
      )}

      {/* Time to make this website */}
      <TiltCard className="mt-4 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-7 text-center mb-10">
        <p className="font-body text-sm text-white/50">{t.looksLikeTook}</p>
        <p className="font-display font-bold tracking-tight text-white mt-1" style={{ fontSize: 'clamp(1.6rem, 6vw, 2.8rem)' }}>
          {result.effortLabel}
        </p>
        <p className="font-body text-base text-white/70 mt-1.5">{result.effortFlavor}</p>
      </TiltCard>

      {/* Charges */}
      <h2 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight mb-4">
        {result.crimes === 0 ? t.noCharges : t.mainCharges(Math.min(3, result.crimes))}
      </h2>
      <div className="space-y-3">
        {result.crimes === 0 && (
          <p className="font-body text-sm text-white/60">{t.noChargesBody}</p>
        )}
        {shown.map((c, i) => (
          <TiltCard
            key={c.code}
            delay={i * 0.06}
            bg={c.bg}
            className={`relative overflow-hidden rounded-2xl border p-4 ${c.bg ? 'border-white/25' : 'border-white/10 bg-white/[0.03]'}`}
          >
            {/* Legibility scrim over the site's own (often hideous) colours. */}
            {c.bg && <div className="pointer-events-none absolute inset-0 bg-black/50" aria-hidden="true" />}
            <div className="relative flex items-start gap-3">
              <span className="flex-shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white font-display text-sm font-bold text-[#0D0E12]">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="font-body font-semibold text-sm text-white" style={c.bg ? { textShadow: '0 1px 3px rgba(0,0,0,0.7)' } : undefined}>{c.title}</p>
                <p className="font-body text-sm text-white/70 mt-0.5" style={c.bg ? { textShadow: '0 1px 3px rgba(0,0,0,0.7)' } : undefined}>{c.detail}</p>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>

      {!showAll && extra.length > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-4 w-full rounded-2xl border border-dashed border-white/20 py-3 font-body text-sm font-medium text-white/70 hover:text-white hover:border-white/40 transition-colors"
        >
          {t.loadMore(extra.length)}
        </button>
      )}

      {/* Now what? — the point of the whole thing, right before the plug. */}
      <div className="mt-12">
        <style>{`
          .wp-underline {
            display: inline-block;
            padding-bottom: 2px;
            background-image: linear-gradient(90deg, #D46FC8, #DE85D2, #F0A6E4, #DE85D2, #D46FC8);
            background-repeat: no-repeat;
            background-position: 0% 100%;
            background-size: 200% 2px;
            color: inherit;
            cursor: default;
            transform-origin: center bottom;
            transition: color .3s ease, transform .3s cubic-bezier(.34,1.56,.64,1), background-size .3s ease;
            will-change: transform;
          }
          .wp-underline:hover {
            color: #DE85D2;
            background-size: 200% 3px;
            transform: translateY(-2px) scale(1.06) rotate(-1.2deg);
            animation: wp-underline-shimmer 1.1s linear infinite;
          }
          /* Slide the wider gradient under the word for a living, shimmering underline. */
          @keyframes wp-underline-shimmer {
            from { background-position: 0% 100%; }
            to   { background-position: 100% 100%; }
          }
          @media (prefers-reduced-motion: reduce) {
            .wp-underline { transition: color .3s ease; }
            .wp-underline:hover { transform: none; animation: none; color: #DE85D2; }
          }
        `}</style>
        <h2 className="font-display font-bold text-white tracking-tight" style={{ fontSize: 'clamp(2rem, 8vw, 3.4rem)' }}>
          {t.nowWhatTitle}
        </h2>
        <div className="mt-4 space-y-4">
          {t.nowWhatBody.map((p, i) => (
            <p
              key={i}
              className={`font-body leading-relaxed ${i === t.nowWhatBody.length - 1 ? 'text-lg md:text-xl font-semibold text-white' : 'text-base md:text-lg text-white/75'}`}
            >
              {p.split('[u]').map((seg, k) =>
                k % 2 === 1 ? (
                  <span key={k} className="wp-underline">
                    {seg}
                  </span>
                ) : (
                  seg
                ),
              )}
            </p>
          ))}
        </div>
      </div>

      {/* Shameless plug + form — light card to highlight */}
      <TrackSeen event="plug_view" locale={locale} url={result.url} />
      <TiltCard className="mt-6 rounded-3xl bg-[#F7F6F3] p-6 md:p-8 shadow-2xl shadow-black/30">
        <p className="font-mono text-xs uppercase tracking-[0.16em] mb-2" style={{ color: '#B23FA3' }}>{t.plugKicker}</p>
        <h3 className="font-display font-bold text-2xl md:text-3xl tracking-tight" style={{ color: '#16161A' }}>
          {result.quality >= 60 ? t.plugTitleGood : t.plugTitleBad}
        </h3>
        <p className="font-body text-base mt-2 mb-6 whitespace-pre-line" style={{ color: '#4A4550' }}>
          {t.plugBody}
        </p>
        <LeadForm variant="light" ctaLabel={t.plugCta} planOptions={planOptions} leadSource="Web Police" sendWelcome locale={locale} />
      </TiltCard>

      {/* But seriously — full-bleed gorilla banner (breaks out of the max-w-2xl
          report column), text overlaid on the left. */}
      <div
        className="relative left-1/2 right-1/2 -mx-[50vw] mt-10 w-screen bg-cover bg-no-repeat bg-[#EEBFCF] [background-position:38%_center] md:[background-position:right_center]"
        style={{ backgroundImage: 'url(/media/webpolice/gorilla-suit.jpg)' }}
      >
        {/* Dark plum scrim on the left so the WHITE copy stays legible over the pink. */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{ background: 'linear-gradient(90deg, rgba(26,15,26,0.82) 0%, rgba(26,15,26,0.55) 40%, rgba(26,15,26,0) 70%)' }}
        />
        <div className="relative z-10 mx-auto flex min-h-[80vh] md:min-h-screen max-w-5xl items-center px-6 md:px-10">
          <div className="max-w-[64%] sm:max-w-[56%] py-8 md:py-14">
            <p className="font-display font-bold tracking-tight text-white leading-tight" style={{ fontSize: 'clamp(1.4rem, 5vw, 2.6rem)' }}>
              {t.seriouslyLead}
            </p>
            <p className="font-body text-white/90 mt-1.5 leading-snug" style={{ fontSize: 'clamp(1rem, 3.4vw, 1.45rem)' }}>
              {t.seriouslyBody}
            </p>
            <a
              href={locale === 'en' ? '/letsbuild' : `/${locale}/letsbuild`}
              onClick={() => track('letsbuild_click', locale)}
              className="mt-5 inline-flex items-center font-body font-semibold text-white underline underline-offset-4 decoration-white/50 hover:decoration-white transition-colors"
              style={{ fontSize: 'clamp(0.95rem, 3vw, 1.2rem)' }}
            >
              {t.seriouslyCta}
            </a>
          </div>
        </div>
      </div>

      <p className="font-body text-xs text-white/30 mt-8 text-center">
        {t.footer}
      </p>

      {/* Yele logo → home */}
      <div className="mt-8 flex justify-center">
        <a href="/" aria-label="Yele — home" className="inline-flex opacity-60 hover:opacity-100 transition-opacity">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo */}
          <img src="/media/logomedia/mainlogo.svg" alt="Yele" className="h-7 w-auto" />
        </a>
      </div>
    </div>
  )
}

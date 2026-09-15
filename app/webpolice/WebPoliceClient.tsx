'use client'

import { useRef, useState } from 'react'

type Severity = 'critical' | 'major' | 'minor' | 'good'
type Charge = { code: string; severity: Severity; title: string; detail: string }
type Speed = { score: number; lcp: string | null; cls: string | null } | null
type Result = {
  url: string
  guilt: number
  verdict: { level: 'guilty' | 'suspicious' | 'cleared'; label: string }
  charges: Charge[]
  builder: { name: string; kind: string } | null
  fonts: string[]
  speed: { mobile: Speed; desktop: Speed }
  mobileFriendly: boolean
}

const LOADING_LINES = [
  'Reading the site its rights…',
  'Dusting for template fingerprints…',
  'Running the fonts through the database…',
  'Checking speed on the radar gun…',
  'Consulting the gorilla…',
  'Cross-checking against known AI slop…',
]

// Pink sampled from the gorilla clip so the video edges melt into the page.
const PINK_TOP = '#edb9ca'
const PINK_BOTTOM = '#d4a6b2'
// Fade the left/right sides so the video melts into the pink background.
const VIDEO_MASK = 'linear-gradient(90deg, transparent 0%, #000 30%, #000 70%, transparent 100%)'

const VERDICT_STYLE: Record<string, { ring: string; text: string; blurb: string }> = {
  guilty: { ring: 'border-red-500 text-red-400', text: 'text-red-400', blurb: 'Caught red-handed. This site did minimal time in the design studio.' },
  suspicious: { ring: 'border-amber-400 text-amber-300', text: 'text-amber-300', blurb: 'A few priors on record. Not the worst, but the jury has questions.' },
  cleared: { ring: 'border-emerald-400 text-emerald-300', text: 'text-emerald-300', blurb: 'Free to go. This one looks like actual humans were involved.' },
}

const SEV: Record<Severity, { tag: string; cls: string; icon: string }> = {
  critical: { tag: 'FELONY', cls: 'text-red-400 border-red-500/40 bg-red-500/10', icon: '🚨' },
  major: { tag: 'MISDEMEANOR', cls: 'text-amber-300 border-amber-400/40 bg-amber-400/10', icon: '⚠️' },
  minor: { tag: 'PARKING TICKET', cls: 'text-white/70 border-white/15 bg-white/[0.04]', icon: '🅿️' },
  good: { tag: 'CLEAN RECORD', cls: 'text-emerald-300 border-emerald-400/40 bg-emerald-400/10', icon: '✅' },
}

export default function WebPoliceClient() {
  const [url, setUrl] = useState('')
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done'>('idle')
  const [line, setLine] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const leftVid = useRef<HTMLVideoElement>(null)
  const rightVid = useRef<HTMLVideoElement>(null)

  const moved = phase !== 'idle'

  function speedUpGorillas() {
    for (const v of [leftVid.current, rightVid.current]) {
      if (v) v.playbackRate = 2
    }
  }
  function resetGorillas() {
    for (const v of [leftVid.current, rightVid.current]) {
      if (v) v.playbackRate = 1
    }
  }

  async function run() {
    if (!url.trim() || phase === 'loading') return
    setError('')
    setResult(null)
    setPhase('loading')
    speedUpGorillas()
    const timer = setInterval(() => setLine(l => (l + 1) % LOADING_LINES.length), 1400)
    try {
      const res = await fetch('/api/webpolice/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'The investigation hit a wall. Try another URL.')
        setPhase('idle')
        resetGorillas()
      } else {
        setResult(data)
        setPhase('done')
      }
    } catch {
      setError('The investigation hit a wall. Try another URL.')
      setPhase('idle')
      resetGorillas()
    } finally {
      clearInterval(timer)
    }
  }

  const Gorilla = ({ side, vref }: { side: 'left' | 'right'; vref: React.RefObject<HTMLVideoElement> }) => (
    <video
      ref={vref}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 z-0 w-[46vw] max-w-[300px] md:w-[26vw] md:max-w-[380px] ${
        side === 'left' ? 'left-[-9%] md:left-[-2%]' : 'right-[-9%] md:right-[-2%]'
      }`}
      style={{
        transform: `translateY(-50%) ${side === 'right' ? 'scaleX(-1)' : ''}`,
        maskImage: VIDEO_MASK,
        WebkitMaskImage: VIDEO_MASK,
        opacity: 0.96,
      }}
    >
      <source src="/media/webpolice/gorilla.mp4" type="video/mp4" />
    </video>
  )

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${PINK_TOP} 0%, ${PINK_BOTTOM} 100%)` }}
    >
      <Gorilla side="left" vref={leftVid} />
      <Gorilla side="right" vref={rightVid} />

      {/* Hero — slides up when an analysis starts */}
      <div
        className={`relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center transition-transform duration-700 ease-out ${
          moved ? '-translate-y-[26vh] md:-translate-y-[24vh]' : 'translate-y-0'
        }`}
      >
        <h1
          className="font-display font-bold text-[#16161A] tracking-tight leading-[1.08]"
          style={{ fontSize: 'clamp(1.7rem, 4.6vw, 3rem)' }}
        >
          Is my page ugly?<br />
          Did my developer lie to me?<br />
          Did he spend 20 min on my website?
        </h1>

        <div className="mt-8 flex w-full max-w-lg flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            placeholder="type your website"
            style={{ color: '#16161A', caretColor: '#16161A' }}
            className="flex-1 rounded-full bg-white/85 backdrop-blur border border-white/60 px-5 py-3.5 font-body text-base placeholder-[#16161A]/40 shadow-lg shadow-black/5 focus:outline-none focus:border-[#16161A]/40 transition-colors"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={run}
            disabled={phase === 'loading'}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#16161A] hover:bg-black px-7 py-3.5 font-body font-semibold text-base text-white shadow-lg shadow-black/10 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {phase === 'loading' ? 'Dispatching…' : 'Call the Web Police'}
          </button>
        </div>

        {phase === 'loading' && <p className="mt-5 font-mono text-sm text-[#16161A]/60 animate-pulse">{LOADING_LINES[line]}</p>}
        {error && <p className="mt-5 font-body text-sm text-red-700">{error}</p>}
      </div>

      {/* Report — full-screen panel that slides up to cover everything */}
      <div
        className={`fixed inset-0 z-30 overflow-y-auto bg-[#0D0E12] transition-transform duration-700 ease-out ${
          phase === 'done' ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
          {result && (
            <Report
              result={result}
              onReset={() => {
                setPhase('idle')
                setResult(null)
                resetGorillas()
              }}
            />
          )}
        </div>
      </div>
    </main>
  )
}

function Report({ result, onReset }: { result: Result; onReset: () => void }) {
  const v = VERDICT_STYLE[result.verdict.level]
  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-white/15 px-3.5 py-1.5 font-body text-xs font-medium text-white/70 hover:text-white hover:border-white/30 transition-colors"
        >
          ↺ New search
        </button>
      </div>
      {/* Verdict */}
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-4 break-all">Case file: {result.url}</p>
        <div className={`mx-auto flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 ${v.ring}`}>
          <span className="font-display text-3xl font-bold leading-none">{result.guilt}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest mt-1 text-white/50">guilt</span>
        </div>
        <h2 className={`font-display font-bold text-4xl md:text-5xl tracking-tight mt-5 ${v.text}`}>{result.verdict.label}</h2>
        <p className="font-body text-base text-white/70 mt-3 max-w-md mx-auto">{v.blurb}</p>
      </div>

      {/* Quick stats */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Mobile speed" value={result.speed.mobile ? `${result.speed.mobile.score}` : '—'} suffix="/100" />
        <Stat label="Desktop speed" value={result.speed.desktop ? `${result.speed.desktop.score}` : '—'} suffix="/100" />
        <Stat label="Mobile-ready" value={result.mobileFriendly ? 'Yes' : 'No'} />
        <Stat label="Built with" value={result.builder ? result.builder.name.split(' ')[0] : 'Unknown'} />
      </div>

      {/* Charges */}
      <h3 className="font-display font-bold text-xl text-white mt-8 mb-4">The charges ({result.charges.length})</h3>
      <div className="space-y-3">
        {result.charges.length === 0 && (
          <p className="font-body text-sm text-white/60">No charges filed. Suspiciously clean. Are you a designer?</p>
        )}
        {result.charges.map(c => {
          const s = SEV[c.severity]
          return (
            <div key={c.code} className={`rounded-xl border p-4 ${s.cls}`}>
              <div className="flex items-center gap-2 mb-1">
                <span aria-hidden className="select-none">{s.icon}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest">{s.tag}</span>
              </div>
              <p className="font-body font-semibold text-sm text-white">{c.title}</p>
              <p className="font-body text-sm text-white/60 mt-0.5">{c.detail}</p>
            </div>
          )
        })}
      </div>

      {result.fonts.length > 0 && <p className="font-body text-xs text-white/40 mt-6">Fonts spotted: {result.fonts.join(', ')}</p>}

      <p className="font-body text-xs text-white/30 mt-8 text-center">
        A tongue-in-cheek tool by Yele. We fetch the page&apos;s public HTML and run Google PageSpeed — nothing stored.
      </p>
    </div>
  )
}

function Stat({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center">
      <p className="font-display font-bold text-xl text-white leading-none">
        {value}
        {suffix && <span className="font-body text-xs text-white/40">{suffix}</span>}
      </p>
      <p className="font-body text-[11px] text-white/45 mt-1">{label}</p>
    </div>
  )
}

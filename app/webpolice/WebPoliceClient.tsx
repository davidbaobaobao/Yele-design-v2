'use client'

import { useState } from 'react'

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
  'Interrogating the hero section…',
  'Cross-checking against known AI slop…',
]

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
  const [loading, setLoading] = useState(false)
  const [line, setLine] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  async function run() {
    if (!url.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)
    const timer = setInterval(() => setLine(l => (l + 1) % LOADING_LINES.length), 1400)
    try {
      const res = await fetch('/api/webpolice/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'The investigation hit a wall. Try another URL.')
      else setResult(data)
    } catch {
      setError('The investigation hit a wall. Try another URL.')
    } finally {
      clearInterval(timer)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#0D0E12' }}>
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D46FC8]/15 text-4xl select-none">
            🚨
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#D46FC8] mb-3">Web Police · Design Crimes Unit</p>
          <h1 className="font-display font-bold text-white tracking-tight leading-[1.05]" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Did a robot build your website in 10 minutes?
          </h1>
          <p className="font-body text-base md:text-lg text-white/70 mt-4 max-w-xl mx-auto">
            Paste any website below. We&apos;ll run a background check for AI slop, cheap templates, ugly generic fonts,
            and whether it even survives on a phone. Strictly for laughs.
          </p>
        </div>

        {/* Input */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            placeholder="yourcompetitor.com"
            className="flex-1 rounded-xl bg-white/5 border border-white/15 px-4 py-3.5 font-body text-base text-white placeholder-white/35 focus:outline-none focus:border-[#D46FC8]/60 transition-colors"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={run}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-[#D46FC8] hover:bg-[#DE85D2] px-6 py-3.5 font-body font-semibold text-base text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Investigating…' : 'Run the check'}
          </button>
        </div>

        {loading && (
          <p className="mt-5 text-center font-mono text-sm text-white/50 animate-pulse">{LOADING_LINES[line]}</p>
        )}
        {error && <p className="mt-5 text-center font-body text-sm text-red-400">{error}</p>}

        {/* Results */}
        {result && !loading && <Report result={result} />}

        {/* Footer disclaimer */}
        <p className="mt-16 text-center font-body text-xs text-white/30">
          A tongue-in-cheek tool by Yele. We fetch the page&apos;s public HTML and run Google PageSpeed — no accounts, no
          data stored. Verdicts are opinionated and meant in good fun.
        </p>
      </div>
    </main>
  )
}

function Report({ result }: { result: Result }) {
  const v = VERDICT_STYLE[result.verdict.level]
  return (
    <div className="mt-12">
      {/* Verdict card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 mb-4 break-all">Case file: {result.url}</p>
        <div className={`mx-auto flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 ${v.ring}`}>
          <span className="font-display text-3xl font-bold leading-none">{result.guilt}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest mt-1 text-white/50">guilt</span>
        </div>
        <h2 className={`font-display font-bold text-4xl md:text-5xl tracking-tight mt-5 ${v.text}`}>{result.verdict.label}</h2>
        <p className="font-body text-base text-white/70 mt-3 max-w-md mx-auto">{v.blurb}</p>
      </div>

      {/* Quick stats */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Mobile speed" value={result.speed.mobile ? `${result.speed.mobile.score}` : '—'} suffix="/100" />
        <Stat label="Desktop speed" value={result.speed.desktop ? `${result.speed.desktop.score}` : '—'} suffix="/100" />
        <Stat label="Mobile-ready" value={result.mobileFriendly ? 'Yes' : 'No'} />
        <Stat label="Built with" value={result.builder ? result.builder.name.split(' ')[0] : 'Unknown'} />
      </div>

      {/* Charges */}
      <h3 className="font-display font-bold text-xl text-white mt-10 mb-4">The charges ({result.charges.length})</h3>
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

      {result.fonts.length > 0 && (
        <p className="font-body text-xs text-white/40 mt-6">Fonts spotted: {result.fonts.join(', ')}</p>
      )}
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

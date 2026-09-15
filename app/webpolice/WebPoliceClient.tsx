'use client'

import { useRef, useState } from 'react'
import LeadForm from '@/components/LeadForm'

type Charge = { code: string; title: string; detail: string }
type Result = {
  url: string
  crimes: number
  charges: Charge[]
  effort: number
  effortFlavor: string
  passed: boolean
  verdict: { level: 'guilty' | 'suspicious' | 'cleared'; label: string }
}

const PLAN_OPTIONS = ['Launch — $699', 'Business — $1,199', 'Pro — $2,799']

const LOADING_LINES = [
  'Reading the site its rights…',
  'Dusting for purple gradients…',
  'Counting the rounded cards…',
  'Bagging the Lucide icons as evidence…',
  'Consulting the gorilla…',
  'Cross-checking against known AI slop…',
]

const PINK_TOP = '#edb9ca'
const PINK_BOTTOM = '#d4a6b2'
const VIDEO_MASK = 'linear-gradient(90deg, transparent 0%, #000 30%, #000 70%, transparent 100%)'

const VERDICT_TEXT: Record<string, string> = {
  guilty: 'text-red-400',
  suspicious: 'text-amber-300',
  cleared: 'text-emerald-300',
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

  const setRate = (r: number) => {
    for (const v of [leftVid.current, rightVid.current]) if (v) v.playbackRate = r
  }

  async function run() {
    if (!url.trim() || phase === 'loading') return
    setError('')
    setResult(null)
    setPhase('loading')
    setRate(2)
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
        setRate(1)
      } else {
        setResult(data)
        setPhase('done')
      }
    } catch {
      setError('The investigation hit a wall. Try another URL.')
      setPhase('idle')
      setRate(1)
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
    <main className="relative min-h-screen overflow-hidden" style={{ background: `linear-gradient(180deg, ${PINK_TOP} 0%, ${PINK_BOTTOM} 100%)` }}>
      <Gorilla side="left" vref={leftVid} />
      <Gorilla side="right" vref={rightVid} />

      {/* Hero — slides up when the case opens */}
      <div
        className={`relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center transition-transform duration-700 ease-out ${
          moved ? '-translate-y-[26vh] md:-translate-y-[24vh]' : 'translate-y-0'
        }`}
      >
        <h1 className="font-display font-bold text-[#16161A] tracking-tight leading-[1.08]" style={{ fontSize: 'clamp(1.7rem, 4.6vw, 3rem)' }}>
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
        <div className="mx-auto max-w-2xl px-6 py-10 md:py-14">
          {result && (
            <Report
              result={result}
              onReset={() => {
                setPhase('idle')
                setResult(null)
                setRate(1)
              }}
            />
          )}
        </div>
      </div>
    </main>
  )
}

function Report({ result, onReset }: { result: Result; onReset: () => void }) {
  const [showAll, setShowAll] = useState(false)
  const main = result.charges.slice(0, 3)
  const extra = result.charges.slice(3, 8)
  const shown = showAll ? [...main, ...extra] : main

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">🚨 Web Police report</span>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-white/15 px-3.5 py-1.5 font-body text-xs font-medium text-white/70 hover:text-white hover:border-white/30 transition-colors"
        >
          ↺ New search
        </button>
      </div>

      <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/40 break-all mb-6">Case file: {result.url}</p>

      {/* Charges */}
      <h2 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight mb-4">
        {result.crimes === 0 ? 'No charges filed 😳' : `The ${Math.min(3, result.crimes)} main charges`}
      </h2>
      <div className="space-y-3">
        {result.crimes === 0 && (
          <p className="font-body text-sm text-white/60">Suspiciously clean. Either a real designer made this… or you built it yourself. Respect.</p>
        )}
        {shown.map((c, i) => (
          <div key={c.code} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#D46FC8]/20 font-display text-sm font-bold text-[#D46FC8]">
                {i + 1}
              </span>
              <div>
                <p className="font-body font-semibold text-sm text-white">{c.title}</p>
                <p className="font-body text-sm text-white/60 mt-0.5">{c.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showAll && extra.length > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-4 w-full rounded-2xl border border-dashed border-white/20 py-3 font-body text-sm font-medium text-white/70 hover:text-white hover:border-white/40 transition-colors"
        >
          Load {extra.length} more crime{extra.length > 1 ? 's' : ''} ↓
        </button>
      )}

      {/* Verdict — effort */}
      <div className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-7 text-center">
        <p className="font-body text-sm text-white/50">Effort used to create this website</p>
        <p className="font-display font-bold tracking-tight text-white mt-1" style={{ fontSize: 'clamp(2.6rem, 9vw, 4.5rem)' }}>
          {result.effort} min
        </p>
        <p className="font-body text-sm text-white/60 mt-1">{result.effortFlavor}</p>
        <p className={`font-display font-bold text-xl md:text-2xl tracking-tight mt-4 ${VERDICT_TEXT[result.verdict.level]}`}>
          {result.verdict.label}
        </p>
      </div>

      {/* Shameless plug + form */}
      <div className="mt-10 rounded-3xl border border-[#D46FC8]/30 bg-[#D46FC8]/[0.06] p-6 md:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#D46FC8] mb-2">Shameless plug</p>
        <h3 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">
          We&apos;ll build you a better website — from $699.
        </h3>
        <p className="font-body text-base text-white/70 mt-2 mb-6">
          Custom-designed, no template, no AI slop. It passes the Web Police test — we checked.
        </p>
        <LeadForm variant="dark" ctaLabel="Get my better website" planOptions={PLAN_OPTIONS} leadSource="Web Police" sendWelcome />
      </div>

      <p className="font-body text-xs text-white/30 mt-8 text-center">
        A tongue-in-cheek tool by Yele. We fetch the page&apos;s public HTML and look for design clichés — nothing stored,
        verdicts strictly for laughs.
      </p>
    </div>
  )
}

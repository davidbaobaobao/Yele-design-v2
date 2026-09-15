'use client'

import { useRef, useState } from 'react'
import LeadForm from '@/components/LeadForm'

type Charge = { code: string; title: string; detail: string }
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
  screenshot?: string | null
  mode?: 'vision' | 'basic'
  note?: string
}

const PLAN_OPTIONS = ['Launch — $699', 'Business — $1,199', 'Pro — $2,799']

const LOADING_LINES = [
  'Sending in the gorilla unit…',
  'Judging your font choices…',
  'Checking for stolen stock photos…',
  'Measuring the amount of purple…',
  'Comparing it to actual good websites…',
  'Trying not to laugh…',
]

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
  return (
    <video
      ref={vref}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 z-0 w-[46vw] max-w-[300px] md:w-[26vw] md:max-w-[380px] transition-transform duration-500 ease-in ${
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
    const started = Date.now()
    // Let the running gorilla play for at least this long, even if the API
    // comes back sooner.
    const MIN_LOADING_MS = 2400
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
        const wait = MIN_LOADING_MS - (Date.now() - started)
        if (wait > 0) await new Promise(r => setTimeout(r, wait))
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

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: `linear-gradient(180deg, ${PINK_TOP} 0%, ${PINK_BOTTOM} 100%)` }}>
      <Gorilla side="left" vref={leftVid} hidden={moved} />
      <Gorilla side="right" vref={rightVid} hidden={moved} />

      {/* Hero — slides fully up (leaving the screen empty) when the case opens */}
      <div
        className={`relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center transition-transform duration-500 ease-in ${
          moved ? '-translate-y-[110vh]' : 'translate-y-0'
        }`}
      >
        <h1 className="font-display font-bold text-[#16161A] tracking-tight leading-[1.05]" style={{ fontSize: 'clamp(2rem, 5.4vw, 3.6rem)' }}>
          Is my website{' '}
          <span className="font-normal italic" style={{ fontFamily: '"Snell Roundhand", "Brush Script MT", "Segoe Script", cursive' }}>
            objectively
          </span>{' '}
          ugly?
        </h1>

        <p className="mt-5 font-body font-semibold text-[#16161A]/75 leading-snug" style={{ fontSize: 'clamp(0.95rem, 2.4vw, 1.25rem)' }}>
          Is my website ugly? generic?<br />
          Did my developer lie to me?<br />
          Did he use ChatGPT to generate my website in 10 min?
        </p>

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
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#16161A] px-7 py-3.5 font-body font-semibold text-base text-white shadow-lg shadow-black/10 transition-colors hover:animate-[wpSirenBtn_0.6s_linear_infinite] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {phase === 'loading' ? 'Dispatching…' : 'Call the Web Police'}
          </button>
        </div>

        {error && <p className="mt-5 font-body text-sm text-red-700">{error}</p>}
      </div>

      {/* Loading — funny text on top, the police gorilla runs to the scene,
          plus a circular spinner. Plays ≥2.4s. */}
      {phase === 'loading' && (
        <div className="fixed inset-0 z-20 flex flex-col items-center justify-center px-6 pointer-events-none">
          <p className="mb-4 font-display font-bold text-[#16161A] text-center leading-snug" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.6rem)' }}>
            {LOADING_LINES[line]}
          </p>
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="w-[70vw] max-w-[320px]"
            style={
              {
                maskImage: `${MASK_H}, ${MASK_V}`,
                maskComposite: 'intersect',
                WebkitMaskImage: `${MASK_H}, ${MASK_V}`,
                WebkitMaskComposite: 'source-in',
              } as React.CSSProperties
            }
          >
            <source src="/media/webpolice/gorilla-run.mp4" type="video/mp4" />
          </video>
          <div className="mt-4 h-9 w-9 rounded-full border-[3px] border-[#16161A]/20 border-t-[#16161A] animate-spin" aria-hidden="true" />
        </div>
      )}

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

      <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/40 break-all mb-4">Case file: {result.url}</p>

      {result.mode === 'basic' && (
        <div className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 font-body text-xs text-amber-200/90">
          ⚠️ Running basic (keyword) mode, not the accurate AI vision analysis{result.note ? ` — ${result.note}` : ''}. Add both env vars in Vercel for real results.
        </div>
      )}

      {result.screenshot && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element -- data URI screenshot */}
          <img src={result.screenshot} alt="Evidence: screenshot of the suspect website" className="block max-h-64 w-full object-cover object-top" />
        </div>
      )}

      {/* Charges */}
      <h2 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight mb-4">
        {result.crimes === 0 ? 'No charges filed ✅' : `The ${Math.min(3, result.crimes)} main charges`}
      </h2>
      <div className="space-y-3">
        {result.crimes === 0 && (
          <p className="font-body text-sm text-white/60">Clean record. This actually looks like real, considered design. The Web Police tip their hats.</p>
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
        <p className="font-body text-sm text-white/50">Design score: <span className="font-semibold text-white/80">{result.quality}/100</span></p>
        <p className="font-body text-sm text-white/50 mt-4">Looks like it took</p>
        <p className="font-display font-bold tracking-tight text-white mt-1" style={{ fontSize: 'clamp(1.6rem, 6vw, 2.8rem)' }}>
          {result.effortLabel}
        </p>
        <p className="font-body text-sm text-white/60 mt-1">{result.effortFlavor}</p>
        <p className={`font-display font-bold text-xl md:text-2xl tracking-tight mt-4 ${VERDICT_TEXT[result.verdict.level]}`}>
          {result.verdict.label}
        </p>
        {result.summary && <p className="font-body text-sm italic text-white/60 mt-3 max-w-md mx-auto">“{result.summary}”</p>}
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

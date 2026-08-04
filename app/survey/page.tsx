'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Loader2, Mail, Palette, Sparkles, Target, UserRound } from 'lucide-react'
import SelectCard from './_components/SelectCard'
import ImagePanel from './_components/ImagePanel'
import {
  COLOR_OPTIONS,
  EMPTY_ANSWERS,
  GOAL_OPTIONS,
  STYLE_OPTIONS,
  TOTAL_STEPS,
  isStepValid,
  type ColorId,
  type StyleId,
  type SurveyAnswers,
} from './_lib/data'

const SESSION_KEY = 'yele_survey_id'
const ANSWERS_KEY = 'yele_survey_answers'
const STEP_KEY = 'yele_survey_step'

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default function SurveyPage() {
  const [sessionId, setSessionId] = useState('')
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [answers, setAnswers] = useState<SurveyAnswers>(EMPTY_ANSWERS)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [hydrated, setHydrated] = useState(false)

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Restore session + answers on mount ──────────────────────────────────
  useEffect(() => {
    let id = localStorage.getItem(SESSION_KEY)
    if (!id) {
      id = uuid()
      localStorage.setItem(SESSION_KEY, id)
    }
    setSessionId(id)

    try {
      const savedAnswers = localStorage.getItem(ANSWERS_KEY)
      if (savedAnswers) setAnswers({ ...EMPTY_ANSWERS, ...JSON.parse(savedAnswers) })
    } catch {
      // ignore corrupt localStorage
    }

    const savedStep = Number(localStorage.getItem(STEP_KEY))
    if (savedStep >= 1 && savedStep <= TOTAL_STEPS) setStep(savedStep)

    setHydrated(true)
  }, [])

  // ── Persist to localStorage on every change ─────────────────────────────
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers))
  }, [answers, hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STEP_KEY, String(step))
  }, [step, hydrated])

  // ── Debounced autosave via the server (service-role key stays server-side) ─
  useEffect(() => {
    if (!hydrated || !sessionId || done) return

    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sessionId, ...answers, currentStep: step }),
        keepalive: true,
      }).catch((err) => console.error('[survey] autosave error', err))
    }, 800)

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, step, sessionId, hydrated, done])

  const valid = useMemo(() => isStepValid(step, answers), [step, answers])

  const update = useCallback(<K extends keyof SurveyAnswers>(key: K, value: SurveyAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }, [])

  const toggleMulti = useCallback((key: 'styles' | 'colors', id: StyleId | ColorId) => {
    setAnswers((prev) => {
      const list = prev[key] as string[]
      const next = list.includes(id) ? list.filter((v) => v !== id) : [...list, id]
      return { ...prev, [key]: next }
    })
  }, [])

  const goBack = useCallback(() => {
    setStep((s) => Math.max(1, s - 1))
  }, [])

  const handleComplete = useCallback(async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sessionId, ...answers, completed: true, currentStep: TOTAL_STEPS }),
      })
      if (!res.ok) throw new Error('request failed')
      setDone(true)
    } catch {
      setSubmitError("Couldn't submit — please try again.")
    } finally {
      setSubmitting(false)
    }
  }, [sessionId, answers])

  const goForward = useCallback(() => {
    if (!valid || submitting) return
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1)
    } else {
      handleComplete()
    }
  }, [valid, submitting, step, handleComplete])

  const handleEnterAdvance = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        goForward()
      }
    },
    [goForward]
  )

  if (!hydrated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#D46FC8] to-[#7B8CDE]">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
    )
  }

  if (done) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-[#D46FC8] via-[#B784D8] to-[#7B8CDE] px-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
            <Sparkles className="h-8 w-8 text-white" strokeWidth={1.5} />
          </span>
          <h1 className="font-display max-w-lg text-3xl font-bold text-white md:text-4xl">
            Got it — we&apos;ll contact you very soon.
          </h1>
        </div>
        <Link
          href="/"
          className="rounded-full bg-white px-7 py-3.5 font-body text-sm font-bold text-ink shadow-lg transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transition-none"
        >
          Back to site
        </Link>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-y-auto bg-gradient-to-br from-[#D46FC8] via-[#B784D8] to-[#7B8CDE]">
      {/* Progress bar */}
      <div className="fixed left-0 right-0 top-0 z-20 h-1 bg-white/20">
        <div
          className="h-full bg-white transition-[width] duration-500 motion-reduce:transition-none"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
      <div className="fixed left-5 top-5 z-20 rounded-full bg-white/15 px-3 py-1 font-mono text-xs text-white backdrop-blur-sm md:left-8 md:top-8">
        Step {step} of {TOTAL_STEPS}
      </div>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-24 md:px-10">
        {step === 1 && (
          <SplitStep
            icon={UserRound}
            eyebrow="Step 1"
            quote="Every great website starts with knowing who it's for."
          >
            <StepTitle split>Who are we designing for?</StepTitle>
            <FieldLabel>Name</FieldLabel>
            <TextInput
              autoFocus
              value={answers.name}
              onChange={(v) => update('name', v)}
              onKeyDown={handleEnterAdvance}
              placeholder="Your name"
            />
            <FieldLabel className="mt-5">Company (optional)</FieldLabel>
            <TextInput
              value={answers.company}
              onChange={(v) => update('company', v)}
              onKeyDown={handleEnterAdvance}
              placeholder="Your business name"
            />
          </SplitStep>
        )}

        {step === 2 && (
          <SplitStep icon={Mail} eyebrow="Step 2" quote="So we can reach you when it's ready.">
            <StepTitle split>How can we reach you?</StepTitle>
            <FieldLabel>Email</FieldLabel>
            <TextInput
              autoFocus
              type="email"
              value={answers.email}
              onChange={(v) => update('email', v)}
              onKeyDown={handleEnterAdvance}
              placeholder="you@email.com"
            />
            <div className="my-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted md:text-white/80">
              <span className="h-px flex-1 bg-black/10 md:bg-white/25" />
              or
              <span className="h-px flex-1 bg-black/10 md:bg-white/25" />
            </div>
            <FieldLabel>Phone</FieldLabel>
            <TextInput
              type="tel"
              value={answers.phone}
              onChange={(v) => update('phone', v)}
              onKeyDown={handleEnterAdvance}
              placeholder="(555) 555-5555"
            />
            <p className="mt-3 text-xs text-muted md:text-white/70">At least one is required.</p>
          </SplitStep>
        )}

        {step === 3 && (
          <div className="mx-auto w-full max-w-3xl">
            <StepTitle center>What&apos;s your website goal?</StepTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {GOAL_OPTIONS.slice(0, 2).map((g) => (
                <SelectCard
                  key={g.id}
                  title={g.title}
                  description={g.description}
                  selected={answers.goal === g.id}
                  onClick={() => update('goal', g.id)}
                />
              ))}
              <SelectCard
                className="sm:col-span-2"
                title={GOAL_OPTIONS[2].title}
                description={GOAL_OPTIONS[2].description}
                selected={answers.goal === GOAL_OPTIONS[2].id}
                onClick={() => update('goal', GOAL_OPTIONS[2].id)}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="mx-auto w-full max-w-4xl">
            <StepTitle center>What style do you like?</StepTitle>
            <p className="mb-6 -mt-4 text-center text-sm text-white/85">Choose as many as you like.</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {STYLE_OPTIONS.map((s) => (
                <SelectCard
                  key={s.id}
                  title={s.label}
                  swatch={s.swatch}
                  selected={answers.styles.includes(s.id)}
                  onClick={() => toggleMulti('styles', s.id)}
                />
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="mx-auto w-full max-w-4xl">
            <StepTitle center>What colours do you like?</StepTitle>
            <p className="mb-6 -mt-4 text-center text-sm text-white/85">Choose as many as you like.</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {COLOR_OPTIONS.map((c) => (
                <SelectCard
                  key={c.id}
                  title={c.label}
                  swatch={c.swatch}
                  selected={answers.colors.includes(c.id)}
                  onClick={() => toggleMulti('colors', c.id)}
                />
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <SplitStep icon={Target} eyebrow="Step 6" quote="The one-liner people see first.">
            <StepTitle split>What do you do?</StepTitle>
            <FieldLabel>In one line — what does your business do?</FieldLabel>
            <TextInput
              autoFocus
              value={answers.business}
              onChange={(v) => update('business', v)}
              onKeyDown={handleEnterAdvance}
              placeholder="e.g. We repair and sell vintage bicycles"
            />
          </SplitStep>
        )}

        {step === 7 && (
          <SplitStep icon={Palette} eyebrow="Step 7" quote="What sets you apart from everyone else.">
            <StepTitle split>What you sell / your edge</StepTitle>
            <FieldLabel>What do you sell, and what makes you different?</FieldLabel>
            <TextInput
              autoFocus
              value={answers.sells}
              onChange={(v) => update('sells', v)}
              onKeyDown={handleEnterAdvance}
              placeholder="e.g. Custom-built frames, lifetime tune-ups"
            />
          </SplitStep>
        )}

        {submitError && (
          <p className="mx-auto mt-4 max-w-md text-center text-sm font-semibold text-white">{submitError}</p>
        )}
      </main>

      {/* Back / forward nav */}
      <div className="fixed bottom-6 right-5 z-20 flex flex-col gap-2 md:bottom-10 md:right-10">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          aria-label="Previous step"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={goForward}
          disabled={!valid || submitting}
          aria-label="Next step"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
        >
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}

// ── Small presentational helpers ──────────────────────────────────────────

function SplitStep({
  icon,
  eyebrow,
  quote,
  children,
}: {
  icon: React.ComponentProps<typeof ImagePanel>['icon']
  eyebrow: string
  quote: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-10">
      <ImagePanel icon={icon} eyebrow={eyebrow} quote={quote} />
      <div className="flex flex-col justify-center rounded-3xl bg-white/95 p-7 shadow-xl md:rounded-none md:bg-transparent md:p-0 md:shadow-none">
        {children}
      </div>
    </div>
  )
}

function StepTitle({ children, center, split }: { children: React.ReactNode; center?: boolean; split?: boolean }) {
  return (
    <h1
      className={`font-display mb-6 text-2xl font-bold md:text-3xl ${center ? 'text-center' : ''} ${
        split ? 'text-ink md:text-white' : 'text-white'
      }`}
    >
      {children}
    </h1>
  )
}

function FieldLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={`mb-2 block text-xs font-semibold uppercase tracking-wider text-muted md:text-white/80 ${className}`}>
      {children}
    </label>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  autoFocus,
  onKeyDown,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent) => void
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className="w-full rounded-xl border-2 border-black/10 bg-white px-4 py-3.5 font-body text-base text-ink outline-none transition-colors duration-200 placeholder:text-muted/70 focus:border-[#D46FC8]"
    />
  )
}

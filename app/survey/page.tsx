'use client'

export const dynamic = 'force-dynamic'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Sparkles } from 'lucide-react'
import { trackMetaSurveyComplete } from '@/lib/metaPixel'
import SelectCard from './_components/SelectCard'
import StyleImageCard from './_components/StyleImageCard'
import ColorImageCard from './_components/ColorImageCard'
import SplitLayout from './_components/SplitLayout'
import FullLayout from './_components/FullLayout'
import ImmersiveGridLayout from './_components/ImmersiveGridLayout'
import PersistentLeftVideo from './_components/PersistentLeftVideo'
import ArrowNav from './_components/ArrowNav'
import { FieldLabel, TextInput, Textarea, Checkbox } from './_components/Fields'
import {
  CHANNEL_OPTIONS,
  COLOR_OPTIONS,
  EMPTY_ANSWERS,
  STYLE_OPTIONS,
  TOTAL_STEPS,
  isEmailValid,
  isImmersiveStep,
  isStepValid,
  isUrlLikelyValid,
  normalizeUrl,
  stepKeyAt,
  stepMode,
  styleKey,
  type ColorId,
  type StyleId,
  type StyleRound,
  type SurveyAnswers,
} from './_lib/data'

const SESSION_KEY = 'yele_survey_id'
const ANSWERS_KEY = 'yele_survey_answers'
const STEP_KEY = 'yele_survey_step'
const SWIPE_THRESHOLD = 60

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function SurveyPageInner() {
  const searchParams = useSearchParams()
  const [sessionId, setSessionId] = useState('')
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [answers, setAnswers] = useState<SurveyAnswers>(EMPTY_ANSWERS)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [hydrated, setHydrated] = useState(false)

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  // ── Restore session + answers on mount ──────────────────────────────────
  useEffect(() => {
    let id = localStorage.getItem(SESSION_KEY)
    if (!id) {
      id = uuid()
      localStorage.setItem(SESSION_KEY, id)
    }
    setSessionId(id)

    let restoredFromStorage = false
    try {
      const savedAnswers = localStorage.getItem(ANSWERS_KEY)
      if (savedAnswers) {
        const parsed = JSON.parse(savedAnswers)
        setAnswers({
          ...EMPTY_ANSWERS,
          ...parsed,
          links: { ...EMPTY_ANSWERS.links, ...parsed.links },
          address: { ...EMPTY_ANSWERS.address, ...parsed.address },
          hours: {
            ...EMPTY_ANSWERS.hours,
            ...parsed.hours,
            custom: { ...EMPTY_ANSWERS.hours.custom, ...parsed.hours?.custom },
          },
        })
        restoredFromStorage = true
      }
    } catch {
      // ignore corrupt localStorage
    }

    // Prefill from the lead-funnel query params (/received -> /survey) —
    // only on a genuinely fresh session. A returning visitor's in-progress
    // answers (restored above) always win, so query params can never
    // clobber something they already typed.
    if (!restoredFromStorage) {
      const qName = searchParams.get('name')?.trim() ?? ''
      const qCompany = searchParams.get('company')?.trim() ?? ''
      const qEmail = searchParams.get('email')?.trim() ?? ''
      if (qName || qCompany || qEmail) {
        setAnswers((prev) => ({
          ...prev,
          name: qName || prev.name,
          company: qCompany || prev.company,
          email: qEmail || prev.email,
        }))
      }
    }

    const savedStep = Number(localStorage.getItem(STEP_KEY))
    if (savedStep >= 1 && savedStep <= TOTAL_STEPS) setStep(savedStep)

    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const updateLink = useCallback((key: keyof SurveyAnswers['links'], value: string) => {
    setAnswers((prev) => ({ ...prev, links: { ...prev.links, [key]: value } }))
  }, [])

  const blurNormalizeLink = useCallback((key: keyof SurveyAnswers['links']) => {
    setAnswers((prev) => ({ ...prev, links: { ...prev.links, [key]: normalizeUrl(prev.links[key]) } }))
  }, [])

  const toggleStyle = useCallback((id: StyleId, round: StyleRound) => {
    const key = styleKey(id, round)
    setAnswers((prev) => ({
      ...prev,
      styles: prev.styles.includes(key) ? prev.styles.filter((v) => v !== key) : [...prev.styles, key],
    }))
  }, [])

  const toggleColor = useCallback((id: ColorId) => {
    setAnswers((prev) => ({
      ...prev,
      colors: prev.colors.includes(id) ? prev.colors.filter((v) => v !== id) : [...prev.colors, id],
    }))
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
      // A finished survey is a stronger buying-intent signal than the
      // initial Lead — lets Meta's delivery optimize toward people who
      // actually complete it, not just people who start it.
      trackMetaSurveyComplete()
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

  // ── Keyboard ArrowLeft/ArrowRight (bonus nav) — ignored while typing ────
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (document.activeElement?.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goForward()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goBack()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goForward, goBack])

  // ── Horizontal swipe (mobile bonus nav) ──────────────────────────────────
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dy) > Math.abs(dx)) return
    if (dx < 0) goForward()
    else goBack()
  }

  if (!hydrated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-survey-bg-soft">
        <Loader2 className="h-6 w-6 animate-spin text-ink" />
      </div>
    )
  }

  if (done) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-8 bg-survey-bg-soft px-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink/10">
            <Sparkles className="h-8 w-8 text-ink" strokeWidth={1.5} />
          </span>
          <h1 className="font-display max-w-lg text-3xl font-bold text-ink md:text-4xl">Got it — we&apos;re on it. 🚀</h1>
          <p className="max-w-md font-body text-base text-ink/80">
            You&apos;ll hear from us within 24 hours with your design plan.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-full bg-ink px-7 py-3.5 font-body text-sm font-bold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transition-none"
        >
          Back to site
        </Link>
      </div>
    )
  }

  const mode = stepMode(step)
  const immersive = isImmersiveStep(step)
  const key = stepKeyAt(step)

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-y-auto bg-survey-bg-soft"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Mounted once for the whole survey — see PersistentLeftVideo's own
          comment for why it can't live inside a per-step component. Only
          the merged contact step uses it now — the merged "about" step
          uses its own static leftImage instead (see below). */}
      <PersistentLeftVideo visible={key === 'contact'} />

      {/* SPLIT steps: no wrapper padding/max-width here — SplitLayout itself
          is the full-bleed two-column grid, so its two panel colors reach
          all four screen edges. FULL steps have no color-seam concern (the
          soft pink already covers the whole viewport via the root div
          above), so this keeps the existing centered/padded content width
          for readability — except the two immersive grid steps, which need
          the full height/width themselves. */}
      <main
        className={
          mode === 'split'
            ? 'flex w-full flex-1'
            : immersive
              ? 'mx-auto flex w-full max-w-[1800px] flex-1 flex-col px-3 pb-24 pt-6 md:px-6 md:pb-28 md:pt-8'
              : 'mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pb-24 pt-12 md:px-10 md:pb-28 md:pt-16'
        }
      >
        {key === 'contact' && (
          <SplitLayout title="Who are we designing for?">
            <FieldLabel>Name</FieldLabel>
            <TextInput autoFocus value={answers.name} onChange={(v) => update('name', v)} onKeyDown={handleEnterAdvance} placeholder="Your name" />
            <FieldLabel className="mt-4">Company</FieldLabel>
            <TextInput value={answers.company} onChange={(v) => update('company', v)} onKeyDown={handleEnterAdvance} placeholder="Your business name" />
            <p className="mt-3 text-xs text-ink/60">At least one is required.</p>

            <FieldLabel className="mt-6">Email</FieldLabel>
            <TextInput type="email" value={answers.email} onChange={(v) => update('email', v)} onKeyDown={handleEnterAdvance} placeholder="you@email.com" />
            {answers.email.trim() !== '' && !isEmailValid(answers.email) && (
              <p className="mt-1.5 text-xs text-ink/70">That email doesn&apos;t look quite right.</p>
            )}
            <FieldLabel className="mt-4">Phone</FieldLabel>
            <TextInput type="tel" value={answers.phone} onChange={(v) => update('phone', v)} onKeyDown={handleEnterAdvance} placeholder="(555) 555-5555" />
            <p className="mt-3 text-xs text-ink/60">At least one is required.</p>
          </SplitLayout>
        )}

        {key === 'style1' && (
          <ImmersiveGridLayout title="Which designs catch your eye?" microcopy="Pick as many as you like.">
            <div className="flex h-full items-center justify-center">
              <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 md:gap-4">
                {STYLE_OPTIONS.map((s) => (
                  <StyleImageCard
                    key={s.id}
                    fileKey={s.fileKey}
                    round={1}
                    label={s.label}
                    fallbackBg={s.fallbackBg}
                    fallbackText={s.fallbackText}
                    selected={answers.styles.includes(styleKey(s.id, 1))}
                    onClick={() => toggleStyle(s.id, 1)}
                  />
                ))}
              </div>
            </div>
          </ImmersiveGridLayout>
        )}

        {key === 'colors' && (
          <ImmersiveGridLayout title="What colours do you like?" microcopy="Choose as many as you like.">
            <div className="grid h-full grid-cols-2 grid-rows-4 gap-2 sm:grid-cols-4 sm:grid-rows-2 md:gap-3">
              {COLOR_OPTIONS.map((c) => (
                <ColorImageCard
                  key={c.id}
                  filename={c.filename}
                  label={c.label}
                  fallbackBg={c.fallbackBg}
                  fallbackText={c.fallbackText}
                  selected={answers.colors.includes(c.id)}
                  onClick={() => toggleColor(c.id)}
                />
              ))}
            </div>
          </ImmersiveGridLayout>
        )}

        {key === 'about' && (
          <SplitLayout title="Tell us about your business" leftImage="page11">
            <FieldLabel>What does your business do? Be as detailed as possible.</FieldLabel>
            <Textarea autoFocus value={answers.business} onChange={(v) => update('business', v)} placeholder="e.g. We repair and restore vintage bicycles, and build custom frames to order..." />
            <FieldLabel className="mt-4">What do you sell, and how much does it cost approximately?</FieldLabel>
            <Textarea value={answers.sells} onChange={(v) => update('sells', v)} placeholder="e.g. Custom-built frames from $800, tune-ups from $60..." />
          </SplitLayout>
        )}

        {key === 'links' && (
          <SplitLayout title="Are you already online somewhere?" leftImage="page12">
            <FieldLabel>Website</FieldLabel>
            <TextInput
              type="url"
              value={answers.links.website}
              onChange={(v) => updateLink('website', v)}
              onBlur={() => blurNormalizeLink('website')}
              onKeyDown={handleEnterAdvance}
              placeholder="yoursite.com"
              disabled={answers.noWebPresence}
            />
            {!answers.noWebPresence && answers.links.website.trim() !== '' && !isUrlLikelyValid(answers.links.website) && (
              <p className="mt-1 text-xs text-ink/70">That link doesn&apos;t look quite right.</p>
            )}
            <FieldLabel className="mt-4">Social media</FieldLabel>
            <TextInput
              type="url"
              value={answers.links.other}
              onChange={(v) => updateLink('other', v)}
              onBlur={() => blurNormalizeLink('other')}
              onKeyDown={handleEnterAdvance}
              placeholder="instagram.com/yourbusiness"
              disabled={answers.noWebPresence}
            />
            {!answers.noWebPresence && answers.links.other.trim() !== '' && !isUrlLikelyValid(answers.links.other) && (
              <p className="mt-1 text-xs text-ink/70">That link doesn&apos;t look quite right.</p>
            )}
            <div className="mt-3">
              <Checkbox checked={answers.noWebPresence} onChange={(v) => update('noWebPresence', v)} label="I'm not online yet" />
            </div>
          </SplitLayout>
        )}

        {key === 'channel' && (
          <FullLayout title="Which is your preferred communication channel?">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {CHANNEL_OPTIONS.map((c) => (
                <SelectCard
                  key={c.id}
                  title={c.title}
                  selected={answers.preferredChannel === c.id}
                  onClick={() => update('preferredChannel', c.id)}
                />
              ))}
            </div>
          </FullLayout>
        )}

        {submitError && <p className="mx-auto mt-4 max-w-md text-center text-sm font-semibold text-ink">{submitError}</p>}
      </main>

      <ArrowNav
        onBack={goBack}
        onForward={goForward}
        backDisabled={step === 1}
        forwardDisabled={!valid || submitting}
        submitting={submitting}
        step={step}
        total={TOTAL_STEPS}
      />
    </div>
  )
}

export default function SurveyPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-survey-bg-soft">
          <Loader2 className="h-6 w-6 animate-spin text-ink" />
        </div>
      }
    >
      <SurveyPageInner />
    </Suspense>
  )
}

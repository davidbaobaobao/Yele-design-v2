'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Loader2, Sparkles } from 'lucide-react'
import SelectCard from './_components/SelectCard'
import SplitLayout from './_components/SplitLayout'
import FullLayout from './_components/FullLayout'
import ArrowNav from './_components/ArrowNav'
import ProgressBar from './_components/ProgressBar'
import ServicesRepeater from './_components/ServicesRepeater'
import HoursPicker from './_components/HoursPicker'
import UploadZone from './_components/UploadZone'
import { FieldLabel, TextInput, Checkbox, Toggle, Select } from './_components/Fields'
import {
  COLOR_OPTIONS,
  EMPTY_ANSWERS,
  FUNCTIONALITY_OPTIONS,
  GOAL_OPTIONS,
  PLAN_OPTIONS,
  STYLE_OPTIONS,
  TOTAL_STEPS,
  UPDATE_OFTEN_OPTIONS,
  US_STATES,
  getFeatureBadge,
  isStepValid,
  needsManualEntry,
  normalizeUrl,
  stepMode,
  type ColorId,
  type FunctionalityId,
  type StyleId,
  type SurveyAnswers,
  type UpdateOftenId,
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

export default function SurveyPage() {
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
      }
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
  const linksProvided = useMemo(() => !needsManualEntry(answers), [answers])

  const update = useCallback(<K extends keyof SurveyAnswers>(key: K, value: SurveyAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }, [])

  const updateLink = useCallback((key: keyof SurveyAnswers['links'], value: string) => {
    setAnswers((prev) => ({ ...prev, links: { ...prev.links, [key]: value } }))
  }, [])

  const blurNormalizeLink = useCallback((key: keyof SurveyAnswers['links']) => {
    setAnswers((prev) => ({ ...prev, links: { ...prev.links, [key]: normalizeUrl(prev.links[key]) } }))
  }, [])

  const toggleStyle = useCallback((id: StyleId) => {
    setAnswers((prev) => ({
      ...prev,
      styles: prev.styles.includes(id) ? prev.styles.filter((v) => v !== id) : [...prev.styles, id],
    }))
  }, [])

  const toggleColor = useCallback((id: ColorId) => {
    setAnswers((prev) => ({
      ...prev,
      colors: prev.colors.includes(id) ? prev.colors.filter((v) => v !== id) : [...prev.colors, id],
    }))
  }, [])

  const toggleUpdateOften = useCallback((id: UpdateOftenId) => {
    setAnswers((prev) => {
      if (id === 'nothing') {
        return { ...prev, updateOften: prev.updateOften.includes('nothing') ? [] : ['nothing'] }
      }
      const withoutExclusive = prev.updateOften.filter((v) => v !== 'nothing')
      const next = withoutExclusive.includes(id) ? withoutExclusive.filter((v) => v !== id) : [...withoutExclusive, id]
      return { ...prev, updateOften: next }
    })
  }, [])

  const toggleFunctionality = useCallback((id: FunctionalityId) => {
    setAnswers((prev) => ({
      ...prev,
      functionality: prev.functionality.includes(id)
        ? prev.functionality.filter((v) => v !== id)
        : [...prev.functionality, id],
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
      <div className="fixed inset-0 flex items-center justify-center bg-survey-bg">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
    )
  }

  if (done) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-8 bg-survey-bg px-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
            <Sparkles className="h-8 w-8 text-white" strokeWidth={1.5} />
          </span>
          <h1 className="font-display max-w-lg text-3xl font-bold text-ink md:text-4xl">Got it — we&apos;re on it. 🚀</h1>
          <p className="max-w-md font-body text-base text-white">
            You&apos;ll hear from us within 24 hours with your design plan.
          </p>
          {answers.planInterest === 'not_sure' && (
            <p className="max-w-md font-body text-sm text-white/85">
              We&apos;ll recommend the right plan based on your answers — no pressure.
            </p>
          )}
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

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-y-auto bg-survey-bg"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <ProgressBar step={step} total={TOTAL_STEPS} />

      <main className={`mx-auto flex w-full flex-1 flex-col px-5 pb-28 pt-20 md:px-10 ${mode === 'split' ? 'max-w-5xl justify-center' : 'max-w-6xl justify-center'}`}>
        {step === 1 && (
          <SplitLayout title="Who are we designing for?">
            <FieldLabel>Name</FieldLabel>
            <TextInput autoFocus value={answers.name} onChange={(v) => update('name', v)} onKeyDown={handleEnterAdvance} placeholder="Your name" />
            <FieldLabel className="mt-5">Company (optional)</FieldLabel>
            <TextInput value={answers.company} onChange={(v) => update('company', v)} onKeyDown={handleEnterAdvance} placeholder="Your business name" />
          </SplitLayout>
        )}

        {step === 2 && (
          <SplitLayout title="How can we reach you?">
            <FieldLabel>Email</FieldLabel>
            <TextInput autoFocus type="email" value={answers.email} onChange={(v) => update('email', v)} onKeyDown={handleEnterAdvance} placeholder="you@email.com" />
            <div className="my-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-white/70">
              <span className="h-px flex-1 bg-white/25" />
              or
              <span className="h-px flex-1 bg-white/25" />
            </div>
            <FieldLabel>Phone</FieldLabel>
            <TextInput type="tel" value={answers.phone} onChange={(v) => update('phone', v)} onKeyDown={handleEnterAdvance} placeholder="(555) 555-5555" />
            <p className="mt-3 text-xs text-white/70">At least one is required.</p>
          </SplitLayout>
        )}

        {step === 3 && (
          <FullLayout title="Which plan are you leaning towards?" microcopy="No commitment — you can change this anytime.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PLAN_OPTIONS.map((p) => (
                <SelectCard
                  key={p.id}
                  title={p.title}
                  price={p.price}
                  description={p.description}
                  selected={answers.planInterest === p.id}
                  onClick={() => update('planInterest', p.id)}
                />
              ))}
            </div>
          </FullLayout>
        )}

        {step === 4 && (
          <FullLayout title="What's your website goal?">
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
              {GOAL_OPTIONS.slice(0, 2).map((g) => (
                <SelectCard key={g.id} title={g.title} description={g.description} selected={answers.goal === g.id} onClick={() => update('goal', g.id)} />
              ))}
              <SelectCard
                className="sm:col-span-2"
                title={GOAL_OPTIONS[2].title}
                description={GOAL_OPTIONS[2].description}
                selected={answers.goal === GOAL_OPTIONS[2].id}
                onClick={() => update('goal', GOAL_OPTIONS[2].id)}
              />
            </div>
          </FullLayout>
        )}

        {step === 5 && (
          <FullLayout title="What style do you like?" microcopy="Choose as many as you like.">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {STYLE_OPTIONS.map((s) => (
                <SelectCard key={s.id} title={s.label} swatch={s.swatch} selected={answers.styles.includes(s.id)} onClick={() => toggleStyle(s.id)} />
              ))}
            </div>
          </FullLayout>
        )}

        {step === 6 && (
          <FullLayout title="What colours do you like?" microcopy="Choose as many as you like.">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {COLOR_OPTIONS.map((c) => (
                <SelectCard key={c.id} title={c.label} swatch={c.swatch} selected={answers.colors.includes(c.id)} onClick={() => toggleColor(c.id)} />
              ))}
            </div>
          </FullLayout>
        )}

        {step === 7 && (
          <SplitLayout title="What do you do?">
            <FieldLabel>In one line — what does your business do?</FieldLabel>
            <TextInput autoFocus value={answers.business} onChange={(v) => update('business', v)} onKeyDown={handleEnterAdvance} placeholder="e.g. We repair and sell vintage bicycles" />
          </SplitLayout>
        )}

        {step === 8 && (
          <SplitLayout title="What you sell / your edge">
            <FieldLabel>What do you sell, and what makes you different?</FieldLabel>
            <TextInput autoFocus value={answers.sells} onChange={(v) => update('sells', v)} onKeyDown={handleEnterAdvance} placeholder="e.g. Custom-built frames, lifetime tune-ups" />
          </SplitLayout>
        )}

        {step === 9 && (
          <SplitLayout title="Are you already online somewhere?">
            <p className="mb-5 text-sm text-white/80">
              Drop your links — we&apos;ll pull your services, photos, reviews and hours so you don&apos;t have to type them.
            </p>
            <div className="flex flex-col gap-3">
              {(
                [
                  ['website', 'Website'],
                  ['googleBusiness', 'Google Business Profile'],
                  ['instagram', 'Instagram'],
                  ['facebook', 'Facebook'],
                  ['yelp', 'Yelp'],
                  ['other', 'Other'],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <FieldLabel>{label}</FieldLabel>
                  <TextInput
                    type="url"
                    value={answers.links[key]}
                    onChange={(v) => updateLink(key, v)}
                    onBlur={() => blurNormalizeLink(key)}
                    onKeyDown={handleEnterAdvance}
                    placeholder="yoursite.com"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5">
              <Checkbox checked={answers.noWebPresence} onChange={(v) => update('noWebPresence', v)} label="I'm not online yet — this is my first web presence." />
            </div>
          </SplitLayout>
        )}

        {step === 10 && (
          <SplitLayout title="What should we list on your site?">
            {linksProvided && (
              <button
                type="button"
                onClick={() => {
                  update('servicesFromLinks', true)
                  goForward()
                }}
                className="mb-5 self-start rounded-full bg-ink px-5 py-2.5 font-body text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Skip — pull it from my links
              </button>
            )}
            <p className="mb-4 text-sm text-white/80">Rough is fine — we&apos;ll polish the wording.</p>
            <ServicesRepeater rows={answers.services} onChange={(rows) => update('services', rows)} />
          </SplitLayout>
        )}

        {step === 11 && (
          <SplitLayout title="Where and when can customers find you?">
            {linksProvided && (
              <button
                type="button"
                onClick={() => {
                  update('hours', { ...answers.hours, mode: 'google' })
                  goForward()
                }}
                className="mb-5 self-start rounded-full bg-ink px-5 py-2.5 font-body text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Skip — use my Google Business hours
              </button>
            )}
            <FieldLabel>Location</FieldLabel>
            <div className="mb-5">
              <Toggle
                value={answers.address.hasPhysical}
                options={['I have a physical location', 'Online only / mobile business']}
                onChange={(v) => update('address', { ...answers.address, hasPhysical: v })}
              />
            </div>
            {answers.address.hasPhysical && (
              <div className="mb-6 flex flex-col gap-3">
                <TextInput value={answers.address.line1} onChange={(v) => update('address', { ...answers.address, line1: v })} placeholder="Street address" />
                <div className="grid grid-cols-2 gap-3">
                  <TextInput value={answers.address.city} onChange={(v) => update('address', { ...answers.address, city: v })} placeholder="City" />
                  <TextInput value={answers.address.zip} onChange={(v) => update('address', { ...answers.address, zip: v })} placeholder="ZIP" />
                </div>
                <Select value={answers.address.state} onChange={(v) => update('address', { ...answers.address, state: v })}>
                  <option value="">State</option>
                  {US_STATES.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}
            <FieldLabel>Hours</FieldLabel>
            <HoursPicker hours={answers.hours} onChange={(h) => update('hours', h)} />
          </SplitLayout>
        )}

        {step === 12 && (
          <FullLayout title="What changes regularly in your business?" microcopy="These become sections you can edit yourself — no need to call us.">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {UPDATE_OFTEN_OPTIONS.map((u) => (
                <SelectCard key={u.id} title={u.label} selected={answers.updateOften.includes(u.id)} onClick={() => toggleUpdateOften(u.id)} />
              ))}
            </div>
          </FullLayout>
        )}

        {step === 13 && (
          <FullLayout title="What should your website do?">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {FUNCTIONALITY_OPTIONS.map((f) => (
                <SelectCard
                  key={f.id}
                  title={f.label}
                  badge={getFeatureBadge(f.minPlan, answers.planInterest)}
                  selected={answers.functionality.includes(f.id)}
                  onClick={() => toggleFunctionality(f.id)}
                />
              ))}
            </div>
          </FullLayout>
        )}

        {step === 14 && (
          <SplitLayout title="Show us what you've got">
            <p className="mb-5 text-sm text-white/80">You can always send more later.</p>
            <FieldLabel>Logo</FieldLabel>
            <div className="mb-2">
              <UploadZone
                sessionId={sessionId}
                folder="logo"
                accept=".png,.svg,.jpg,.jpeg,.pdf"
                maxFiles={1}
                urls={answers.logoUrl ? [answers.logoUrl] : []}
                onChange={(urls) => update('logoUrl', urls[0] ?? '')}
                label="Upload logo"
                disabled={answers.needsBranding}
              />
            </div>
            <div className="mb-6">
              <Checkbox checked={answers.needsBranding} onChange={(v) => update('needsBranding', v)} label="I don't have a logo — I need one" />
            </div>

            <FieldLabel>Photos</FieldLabel>
            <div className="mb-2">
              <UploadZone
                sessionId={sessionId}
                folder="photos"
                accept="image/*"
                maxFiles={10}
                urls={answers.photoUrls}
                onChange={(urls) => update('photoUrls', urls)}
                label="Add photos"
                disabled={answers.usePhotosFromLinks || answers.noGoodPhotos}
              />
            </div>
            <div className="flex flex-col gap-2">
              {linksProvided && (
                <Checkbox
                  checked={answers.usePhotosFromLinks}
                  onChange={(v) => update('usePhotosFromLinks', v)}
                  label="Use photos from my website / Instagram"
                />
              )}
              <Checkbox checked={answers.noGoodPhotos} onChange={(v) => update('noGoodPhotos', v)} label="I don't have good photos yet" />
            </div>
          </SplitLayout>
        )}

        {submitError && <p className="mx-auto mt-4 max-w-md text-center text-sm font-semibold text-ink">{submitError}</p>}
      </main>

      <ArrowNav onBack={goBack} onForward={goForward} backDisabled={step === 1} forwardDisabled={!valid || submitting} submitting={submitting} />
    </div>
  )
}

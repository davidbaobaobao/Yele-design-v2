'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { trackOnboardingFormSubmit } from '@/lib/gtag'
import { trackMetaLead, getMetaCookies } from '@/lib/metaPixel'

type FormData = {
  name: string
  email: string
  phone: string
  company: string
}

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Shared discovery-lead form — same /api/lead backend and /received redirect
// regardless of which page renders it. Used by /start and /websites (both
// Google Ads traffic, light/dark theme respectively) and /newwebsite (Meta
// ads only). No RGPD checkbox — consent is implied by submitting, disclosed
// as fine print under the CTA instead.
export default function LeadForm({
  variant = 'light',
  ctaLabel = "Let's chat",
  id,
  platform = 'google',
  planOptions,
  trackMeta = true,
}: {
  variant?: 'light' | 'dark'
  ctaLabel?: string
  id?: string
  // Optional plan-interest pills, only used on /letsbuild. When set, renders
  // "Which plan are you interested in?" after the company field and listens
  // for a `letsbuild:selectplan` window event (dispatched by the pricing
  // CTAs) to pre-select a tier and scroll this form into view.
  planOptions?: string[]
  // When false, the browser Meta Pixel "Lead" event is NOT fired on submit —
  // used by the organic /start page, which is intentionally not treated as a
  // Meta-ads landing (unlike /letsbuild). The Google Ads conversion still
  // fires for platform 'google'.
  trackMeta?: boolean
  // Which ad platform this submit should count toward. 'google' (default,
  // /start + /websites) fires the existing onboarding_form_submit Google
  // Ads conversion. 'meta' (/newwebsite only) fires the Meta Pixel "Lead"
  // event instead — and NEVER the Google conversion, since /newwebsite is
  // explicitly Meta-exclusive traffic that shouldn't count toward Google
  // Ads. A shared event_id is generated and sent to /api/lead so Meta's
  // Conversions API can dedupe against the browser-pixel fire once CAPI is
  // wired up — see lib/metaPixel.ts.
  platform?: 'google' | 'meta'
}) {
  const router = useRouter()
  const isDark = variant === 'dark'

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  // Guards onboarding_form_submit against firing twice — the button
  // disabling on `loading` already prevents a normal re-click, but this
  // makes "exactly once" true regardless of how handleSubmit is re-entered
  // (e.g. a double-click landing before the disabled state has committed).
  const conversionFiredRef = useRef(false)
  const [selectedPlan, setSelectedPlan] = useState('')

  // Pricing CTAs on /letsbuild dispatch this to pre-select a tier + scroll
  // the form up into view. Only wired when planOptions is provided.
  useEffect(() => {
    if (!planOptions) return
    function onSelect(e: Event) {
      const detail = (e as CustomEvent<string>).detail
      if (detail) setSelectedPlan(detail)
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    window.addEventListener('letsbuild:selectplan', onSelect as EventListener)
    return () => window.removeEventListener('letsbuild:selectplan', onSelect as EventListener)
  }, [planOptions, id])

  function set(key: keyof FormData, value: string) {
    setFormData(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!formData.name.trim()) e.name = 'Your name is required'
    if (!formData.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setLoading(true)
    setSubmitError('')

    // Generated for every submit now — the Meta Pixel is site-wide (see
    // components/MetaPixelScript.tsx), so every lead is a potential Meta
    // conversion regardless of which page/ad-platform it came from, not
    // just /newwebsite's Meta-exclusive traffic.
    const metaEventId = uuid()
    const metaCookies = getMetaCookies()

    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        packageInterest: selectedPlan ? [selectedPlan] : undefined,
        eventId: metaEventId,
        source: platform,
        fbc: metaCookies.fbc,
        fbp: metaCookies.fbp,
      }),
    })

    if (!response.ok) {
      setSubmitError('Something went wrong. Please try again or email us at info@yele.design')
      setLoading(false)
      return
    }

    // Fire only after /api/lead confirms the submit succeeded, so failed/
    // aborted submits never count — and only once, ever, per mount. Meta
    // Lead fires on every submit (site-wide pixel); the Google conversion
    // stays scoped to platform === 'google' only (/start, /websites) —
    // /newwebsite must never count toward Google Ads, unchanged from before.
    if (!conversionFiredRef.current) {
      conversionFiredRef.current = true
      if (trackMeta) {
        trackMetaLead(metaEventId, { email: formData.email, phone: formData.phone, name: formData.name })
      }
      if (platform === 'google') {
        trackOnboardingFormSubmit(formData.email)
      }
    }

    const params = new URLSearchParams({
      name: formData.name,
      email: formData.email,
      company: formData.company,
    })
    router.push(`/received?${params.toString()}`)
  }

  const inputClass = isDark
    ? 'w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 font-body text-base text-white placeholder-white/35 focus:outline-none focus:border-[#D46FC8]/60 transition-colors'
    : 'w-full bg-white border border-hairline rounded-xl px-4 py-3 font-body text-base text-ink placeholder-muted focus:outline-none focus:border-ink transition-colors'
  const labelClass = isDark
    ? 'font-body text-sm text-white/60 mb-1 block'
    : 'font-body text-sm text-muted mb-1 block'
  const errorClass = 'font-body text-xs text-red-500 mt-1'
  const fineprintClass = isDark
    ? 'text-center font-body text-xs text-white/50 leading-relaxed'
    : 'text-center font-body text-xs text-muted leading-relaxed'
  const linkClass = isDark
    ? 'underline hover:text-white transition-colors'
    : 'underline hover:text-ink transition-colors'
  const outlineClass = isDark ? 'focus-visible:outline-white' : 'focus-visible:outline-ink'

  return (
    <div id={id} className="space-y-2.5">
      <div>
        <label className={labelClass}>
          Name <span className="text-[#D46FC8]">*</span>
        </label>
        <input
          type="text"
          className={inputClass}
          placeholder="Your full name"
          value={formData.name}
          onChange={e => set('name', e.target.value)}
          autoComplete="name"
        />
        {errors.name && <p className={errorClass}>{errors.name}</p>}
      </div>

      <div>
        <label className={labelClass}>
          Email <span className="text-[#D46FC8]">*</span>
        </label>
        <input
          type="email"
          className={inputClass}
          placeholder="you@email.com"
          value={formData.email}
          onChange={e => set('email', e.target.value)}
          autoComplete="email"
        />
        {errors.email && <p className={errorClass}>{errors.email}</p>}
      </div>

      <div>
        <label className={labelClass}>Phone</label>
        <input
          type="tel"
          className={inputClass}
          placeholder="+1 (213) 555-0123"
          value={formData.phone}
          onChange={e => set('phone', e.target.value)}
          autoComplete="tel"
        />
      </div>

      <div>
        <label className={labelClass}>Describe your company</label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={1}
          placeholder="What do you do, and who do you do it for?"
          value={formData.company}
          onChange={e => set('company', e.target.value)}
        />
      </div>

      {planOptions && (
        <div className="pb-1.5">
          <label className={labelClass}>Which plan are you interested in? (optional)</label>
          <div className="grid grid-cols-3 gap-2">
            {planOptions.map(p => {
              const active = selectedPlan === p
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPlan(active ? '' : p)}
                  className={`w-full text-center font-body text-xs sm:text-[13px] px-2 py-2 rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#D46FC8] border-[#D46FC8] text-white'
                      : isDark
                        ? 'bg-white/5 border-white/15 text-white/80 hover:border-white/40'
                        : 'bg-white border-hairline text-ink hover:border-ink'
                  }`}
                >
                  {p}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {submitError && (
        <p className="font-body text-xs text-red-500 text-center">{submitError}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full inline-flex items-center justify-center gap-2 font-body font-medium text-base bg-[#D46FC8] hover:bg-[#DE85D2] text-white px-6 py-3.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 ${outlineClass}`}
      >
        {loading ? 'Sending…' : ctaLabel}
      </button>

      <p className={fineprintClass}>
        By clicking &quot;{ctaLabel}&quot;, you agree to our{' '}
        <Link href="/privacy-policy" className={linkClass}>
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}

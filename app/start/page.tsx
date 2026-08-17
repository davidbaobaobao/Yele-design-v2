'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { trackOnboardingFormSubmit } from '@/lib/gtag'

type FormData = {
  name: string
  email: string
  phone: string
  company: string
}

const inputClass =
  'w-full bg-white border border-hairline rounded-xl px-4 py-3 font-body text-base text-ink placeholder-muted focus:outline-none focus:border-ink transition-colors'
const labelClass = 'font-body text-sm text-muted mb-1 block'
const errorClass = 'font-body text-xs text-red-500 mt-1'

// Path 1 of the split onboarding flow — public discovery form. Captures
// lead details for any visitor (no auth, no plan/payment involved) and
// hands off to the sales team via /api/lead. Distinct from /signup (Path
// 2), the private paid flow reachable only by direct link — see the
// "Already decided?" zone below, which is the one place this page links
// there. No RGPD checkbox — consent is implied by submitting, disclosed as
// fine print under the CTA instead (see the button's sibling <p> below).
export default function StartPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

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

    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
      }),
    })

    if (!response.ok) {
      setSubmitError('Something went wrong. Please try again or email us at info@yele.design')
      setLoading(false)
      return
    }

    // Fire only after /api/lead confirms the submit succeeded, so failed/
    // aborted submits never count — same guard pattern the old /empezar
    // form used for this same conversion.
    trackOnboardingFormSubmit(formData.email)

    router.push(`/received?name=${encodeURIComponent(formData.name)}`)
  }

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-white flex items-center justify-center px-6 py-8 md:py-4">
      <div className="w-full max-w-md">
        <h1 className="sr-only">Let&apos;s build the best website in your industry</h1>

        <Link href="/" className="inline-flex items-center mb-5 focus-visible:outline-none" aria-label="yele">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG, Next's image optimizer refuses to serve those */}
          <img src="/media/logomedia/mainlogo.svg" alt="" className="h-8 w-auto" />
        </Link>

        <div className="mb-5">
          <h2 className="font-display font-semibold text-4xl text-ink tracking-tight leading-[1.08] mb-2.5">
            Let&apos;s build the best website in your industry.
          </h2>
          <p className="font-body text-base text-muted leading-relaxed">
            Share a few details and we&apos;ll come back with how Yele can elevate your business — bringing you more calls, bookings and customers.
          </p>
        </div>

        <div className="space-y-3">
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
              rows={2}
              placeholder="What do you do, and who do you do it for?"
              value={formData.company}
              onChange={e => set('company', e.target.value)}
            />
          </div>

          {submitError && (
            <p className="font-body text-xs text-red-500 text-center">{submitError}</p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 font-body font-medium text-base bg-[#D46FC8] hover:bg-[#DE85D2] text-white px-6 py-3.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {loading ? 'Sending…' : "Let's chat"}
          </button>

          <p className="text-center font-body text-xs text-muted leading-relaxed">
            By clicking &quot;Let&apos;s chat&quot;, you agree to our{' '}
            <Link href="/privacy-policy" className="underline hover:text-ink transition-colors">
              Privacy Policy
            </Link>.
          </p>
        </div>

        {/* Secondary zone — visually separated so it never competes with
            the primary form/CTA above. */}
        <div className="mt-5 pt-4 border-t border-hairline text-center">
          <p className="font-body text-xs text-muted mb-2.5">Already decided?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link
              href="/signup"
              className="font-body text-xs font-medium text-ink hover:text-muted border border-hairline rounded-full px-4 py-2 transition-colors"
            >
              Sign up now
            </Link>
            <Link
              href="/schedule"
              className="font-body text-xs text-muted hover:text-ink transition-colors"
            >
              Prefer to talk? Book a free 10-min intro call
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

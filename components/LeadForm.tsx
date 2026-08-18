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

// Shared discovery-lead form — same /api/lead backend, onboarding_form_submit
// conversion, and /received redirect regardless of which page renders it.
// Used by /start (Path 1 of the split onboarding flow, light theme) and
// /websites (Meta-ads landing, dark theme) so the two never drift apart.
// No RGPD checkbox — consent is implied by submitting, disclosed as fine
// print under the CTA instead.
export default function LeadForm({
  variant = 'light',
  ctaLabel = "Let's chat",
  id,
}: {
  variant?: 'light' | 'dark'
  ctaLabel?: string
  id?: string
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
    // aborted submits never count.
    trackOnboardingFormSubmit(formData.email)

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
    <div id={id} className="space-y-3">
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

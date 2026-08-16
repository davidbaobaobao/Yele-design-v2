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
  rgpd: boolean
}

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-body text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#D46FC8]/60 transition-colors'
const labelClass = 'font-body text-xs text-white/50 mb-1.5 block'
const errorClass = 'font-body text-xs text-red-400 mt-1'

// Path 1 of the split onboarding flow — public discovery form. Captures
// lead details for any visitor (no auth, no plan/payment involved) and
// hands off to the sales team via /api/lead. Distinct from /signup (Path
// 2), the private paid flow reachable only by direct link — see the
// "Already decided?" zone below, which is the one place this page links
// there.
export default function StartPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    rgpd: false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function set(key: keyof FormData, value: string | boolean) {
    setFormData(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!formData.name.trim()) e.name = 'Your name is required'
    if (!formData.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email'
    if (!formData.rgpd) e.rgpd = 'You must accept the privacy policy'
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

    router.push('/received')
  }

  return (
    <div className="min-h-screen bg-[#0D0E12] px-6 py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <h1 className="sr-only">Let&apos;s build the best website in your industry</h1>

        <Link href="/" className="inline-flex items-center gap-1.5 mb-10 focus-visible:outline-none">
          <span className="w-2 h-2 rounded-full bg-[#D46FC8]" aria-hidden="true" />
          <span className="font-display font-semibold text-sm text-white">
            yele<span className="text-white/50 font-normal">.design</span>
          </span>
        </Link>

        <div className="mb-8">
          <h2 className="font-display font-semibold text-3xl text-white tracking-tight leading-tight mb-3">
            Let&apos;s build the best website in your industry.
          </h2>
          <p className="font-body text-sm text-white/60 leading-relaxed">
            Share a few details and we&apos;ll come back with how Yele can elevate your business — bringing you more calls, bookings and customers.
          </p>
        </div>

        <div className="space-y-5">
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
              placeholder="+34 600 000 000"
              value={formData.phone}
              onChange={e => set('phone', e.target.value)}
              autoComplete="tel"
            />
          </div>

          <div>
            <label className={labelClass}>Describe your company</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="What do you do, and who do you do it for?"
              value={formData.company}
              onChange={e => set('company', e.target.value)}
            />
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rgpd}
                onChange={e => set('rgpd', e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#D46FC8] flex-shrink-0"
              />
              <span className="font-body text-sm text-white/80">
                I have read and accept the{' '}
                <Link href="/privacy-policy" target="_blank" className="underline hover:text-white transition-colors">
                  privacy policy
                </Link>
                <span className="text-[#D46FC8] ml-0.5">*</span>
              </span>
            </label>
            {errors.rgpd && <p className={`${errorClass} ml-7`}>{errors.rgpd}</p>}
          </div>

          {submitError && (
            <p className="font-body text-xs text-red-400 text-center">{submitError}</p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 font-body font-medium text-sm bg-[#D46FC8] hover:bg-[#DE85D2] text-white px-6 py-3.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {loading ? 'Sending…' : "Let's chat"}
          </button>
        </div>

        {/* Secondary zone — visually separated so it never competes with
            the primary form/CTA above. */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="font-body text-xs text-white/40 mb-4">Already decided?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="font-body text-xs font-medium text-white/70 hover:text-white border border-white/15 rounded-full px-4 py-2 transition-colors"
            >
              Sign up now
            </Link>
            <Link
              href="/schedule"
              className="font-body text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Prefer to talk? Book a free 10-min intro call
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="font-body text-xs text-white/40 hover:text-white/70 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { trackOnboardingFormSubmit } from '@/lib/gtag'
import { trackMetaLead, getMetaCookies } from '@/lib/metaPixel'

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const NEEDS = [
  'New website',
  'Website redesign',
  'Booking system',
  'Online payments',
  'E-commerce',
  'SEO',
  'Advertising',
  'Content / media',
  'AI Chat',
  'AI Phone',
  'Automations',
]

const PACKAGES = [
  'Launch — $599',
  'Business — $1,299',
  'Pro — From $2,299',
  'Not sure — recommend one',
]

// Richer discovery form for /letsbuild — same /api/lead backend + /received
// redirect + conversion tracking as the shared LeadForm, plus the extra
// business-name / current-website / needs / package fields the API now emails
// (all optional, backward-compatible with the other pages' forms).
export default function BuildLeadForm({ id }: { id?: string }) {
  const router = useRouter()

  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [currentWebsite, setCurrentWebsite] = useState('')
  const [company, setCompany] = useState('')
  const [needs, setNeeds] = useState<string[]>([])
  const [packageInterest, setPackageInterest] = useState<string[]>([])

  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const firedRef = useRef(false)

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter(v => v !== value) : [...list, value])
  }

  function validate(): boolean {
    const e: { name?: string; email?: string } = {}
    if (!name.trim()) e.name = 'Your name is required'
    if (!email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setLoading(true)
    setSubmitError('')

    const metaEventId = uuid()
    const metaCookies = getMetaCookies()

    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        phone,
        company,
        businessName,
        currentWebsite,
        needs,
        packageInterest,
        eventId: metaEventId,
        source: 'google',
        fbc: metaCookies.fbc,
        fbp: metaCookies.fbp,
      }),
    })

    if (!response.ok) {
      setSubmitError('Something went wrong. Please try again or email us at info@yele.design')
      setLoading(false)
      return
    }

    if (!firedRef.current) {
      firedRef.current = true
      trackMetaLead(metaEventId, { email, phone, name })
      trackOnboardingFormSubmit(email)
    }

    const params = new URLSearchParams({ name, email, company: businessName || company })
    router.push(`/received?${params.toString()}`)
  }

  const inputClass =
    'w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 font-body text-base text-white placeholder-white/35 focus:outline-none focus:border-[#D46FC8]/60 transition-colors'
  const labelClass = 'font-body text-sm text-white/60 mb-1 block'

  return (
    <div id={id} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>
            Name <span className="text-[#D46FC8]">*</span>
          </label>
          <input className={inputClass} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
          {errors.name && <p className="font-body text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className={labelClass}>Business name</label>
          <input className={inputClass} placeholder="Business name" value={businessName} onChange={e => setBusinessName(e.target.value)} autoComplete="organization" />
        </div>
        <div>
          <label className={labelClass}>
            Email <span className="text-[#D46FC8]">*</span>
          </label>
          <input type="email" className={inputClass} placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          {errors.email && <p className="font-body text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input type="tel" className={inputClass} placeholder="+1 (213) 555-0123" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Current website (optional)</label>
        <input className={inputClass} placeholder="Website URL — optional" value={currentWebsite} onChange={e => setCurrentWebsite(e.target.value)} />
      </div>

      <div>
        <label className={labelClass}>What does your business do?</label>
        <textarea className={`${inputClass} resize-none`} rows={2} placeholder="Tell us briefly about your business" value={company} onChange={e => setCompany(e.target.value)} />
      </div>

      <fieldset>
        <legend className={labelClass}>What do you need?</legend>
        <div className="flex flex-wrap gap-2">
          {NEEDS.map(n => {
            const active = needs.includes(n)
            return (
              <button
                key={n}
                type="button"
                onClick={() => toggle(needs, n, setNeeds)}
                className={`font-body text-sm px-3.5 py-2 rounded-full border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#D46FC8] border-[#D46FC8] text-white'
                    : 'bg-white/5 border-white/15 text-white/80 hover:border-white/40'
                }`}
              >
                {n}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>Which package are you interested in?</legend>
        <div className="flex flex-wrap gap-2">
          {PACKAGES.map(p => {
            const active = packageInterest.includes(p)
            return (
              <button
                key={p}
                type="button"
                onClick={() => toggle(packageInterest, p, setPackageInterest)}
                className={`font-body text-sm px-3.5 py-2 rounded-full border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#D46FC8] border-[#D46FC8] text-white'
                    : 'bg-white/5 border-white/15 text-white/80 hover:border-white/40'
                }`}
              >
                {p}
              </button>
            )
          })}
        </div>
      </fieldset>

      {submitError && <p className="font-body text-xs text-red-500 text-center">{submitError}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 font-body font-medium text-base bg-[#D46FC8] hover:bg-[#DE85D2] text-white px-6 py-3.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {loading ? 'Sending…' : 'Get My Website'}
      </button>

      <p className="text-center font-body text-xs text-white/50 leading-relaxed">
        No obligation. We&apos;ll review your information and contact you about the next step. By
        clicking &quot;Get My Website&quot;, you agree to our{' '}
        <Link href="/privacy-policy" className="underline hover:text-white transition-colors">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  )
}

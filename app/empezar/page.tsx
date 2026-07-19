'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import ClarityScript from '@/components/ClarityScript'

const inputClass = 'w-full bg-white border border-black/[0.12] rounded-xl px-4 py-3 font-manrope text-sm text-[#1D1D1F] placeholder-[#6B7280] focus:outline-none focus:border-[#1D1D1F] transition-colors'
const labelClass = 'font-manrope text-xs text-[#6B7280] mb-1.5 block'
const errorClass = 'font-manrope text-xs text-red-500 mt-1'

type FormData = {
  nombre_negocio: string
  nombre_contacto: string
  ciudad: string
  email: string
  telefono: string
  descripcion: string
  rgpd: boolean
}

export default function EmpezarPage() {
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [formData, setFormData] = useState<FormData>({
    nombre_negocio: '',
    nombre_contacto: '',
    ciudad: '',
    email: '',
    telefono: '',
    descripcion: '',
    rgpd: false,
  })

  function set(key: keyof FormData, value: string | boolean) {
    setFormData(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!formData.nombre_contacto.trim()) e.nombre_contacto = 'Your name is required'
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

    const { data: { session } } = await supabase.auth.getSession()

    const response = await fetch('/api/intake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      setSubmitError('Something went wrong. Please try again or email us at info@yele.design')
      setLoading(false)
      return
    }

    const result = await response.json()
    const clientId = result.clientId ?? ''
    const selectedPlan = sessionStorage.getItem('yele_plan') || 'starter-es'

    const checkoutRes = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: selectedPlan, billing: 'monthly', clientId }),
    })

    const { url, error: checkoutError } = await checkoutRes.json()
    if (checkoutError || !url) {
      setSubmitError(checkoutError || 'Payment setup failed. Please try again.')
      setLoading(false)
      return
    }

    window.location.href = url
  }

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <ClarityScript />
      <div className="max-w-md mx-auto">

        <h1 className="sr-only">Tell us about your business</h1>

        <Link href="/" className="inline-flex items-center gap-1.5 mb-10 focus-visible:outline-none">
          <span className="w-2 h-2 rounded-full bg-[#34C759]" aria-hidden="true" />
          <span className="font-outfit font-semibold text-sm text-[#1D1D1F]">
            yele<span className="text-[#6B7280] font-normal">.design</span>
          </span>
        </Link>

        <div className="mb-8">
          <h2 className="font-outfit font-semibold text-2xl text-[#1D1D1F] tracking-tight mb-1">
            Tell us about your business
          </h2>
          <p className="font-manrope text-sm text-[#6B7280]">
            We'll set everything up for you. Takes less than 2 minutes.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className={labelClass}>Company name</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Barber Montserrat"
              value={formData.nombre_negocio}
              onChange={e => set('nombre_negocio', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>
              Your name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="Your full name"
              value={formData.nombre_contacto}
              onChange={e => set('nombre_contacto', e.target.value)}
            />
            {errors.nombre_contacto && <p className={errorClass}>{errors.nombre_contacto}</p>}
          </div>

          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. Barcelona"
              value={formData.ciudad}
              onChange={e => set('ciudad', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>
              Email <span className="text-red-500">*</span>
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
            <label className={labelClass}>Phone number</label>
            <input
              type="tel"
              className={inputClass}
              placeholder="+34 600 000 000"
              value={formData.telefono}
              onChange={e => set('telefono', e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Describe your business in a few words</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="e.g. Family barbershop in central Barcelona, open for 10 years..."
              value={formData.descripcion}
              onChange={e => set('descripcion', e.target.value)}
            />
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rgpd}
                onChange={e => set('rgpd', e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#1D1D1F] flex-shrink-0"
              />
              <span className="font-manrope text-sm text-[#1D1D1F]">
                I have read and accept the{' '}
                <Link href="/politica-privacidad" target="_blank" className="underline hover:text-[#6B7280] transition-colors">
                  privacy policy
                </Link>
                <span className="text-red-500 ml-0.5">*</span>
              </span>
            </label>
            {errors.rgpd && <p className={`${errorClass} ml-7`}>{errors.rgpd}</p>}
          </div>

          {submitError && (
            <p className="font-manrope text-xs text-red-500 text-center">{submitError}</p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 font-manrope font-medium text-sm bg-[#1D1D1F] text-white px-6 py-3.5 rounded-xl hover:bg-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
          >
            {loading ? 'Setting up your trial…' : 'Start my free month →'}
          </button>

          <p className="text-center font-manrope text-xs text-[#6B7280]">
            No charge today. Your free month starts now.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="font-manrope text-xs text-[#6B7280] hover:text-[#1D1D1F] transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

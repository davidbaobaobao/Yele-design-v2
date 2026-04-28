'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { motion, type Transition } from 'framer-motion'
import Link from 'next/link'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function RegistroPage() {
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogle() {
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setError(error.message)
  }

  async function handleEmailLink() {
    if (!email) return
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)
    if (!error) setSent(true)
    else setError(error.message)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 } as Transition}
        >
          <div className="w-12 h-12 rounded-full bg-[#34C759]/10 flex items-center justify-center mx-auto mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-outfit font-semibold text-3xl text-[#1D1D1F] mb-3">
            Revisa tu email
          </h1>
          <p className="font-manrope text-[#86868B] text-base leading-relaxed mb-8">
            Te hemos enviado un enlace mágico a <strong className="text-[#1D1D1F]">{email}</strong>. Haz clic en él para continuar.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="font-manrope text-sm text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer"
          >
            ← Usar otro email
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-1.5 mb-10"
          {...fadeUp}
          transition={{ duration: 0.5 } as Transition}
        >
          <Link href="/" className="flex items-center gap-1.5 focus-visible:outline-none">
            <span className="w-2 h-2 rounded-full bg-[#34C759]" aria-hidden="true" />
            <span className="font-outfit font-semibold text-sm text-[#1D1D1F]">
              yele<span className="text-[#86868B] font-normal">.design</span>
            </span>
          </Link>
        </motion.div>

        {/* Heading */}
        <motion.div
          className="mb-8"
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.05 } as Transition}
        >
          <h1 className="font-outfit font-semibold text-3xl text-[#1D1D1F] tracking-tight mb-2">
            Crea tu cuenta
          </h1>
          <p className="font-manrope text-[#86868B] text-base">
            Empieza a construir tu web hoy.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-4"
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 } as Transition}
        >
          {/* Google OAuth button */}
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 font-manrope font-medium text-sm text-[#1D1D1F] bg-white border border-black/[0.12] rounded-xl px-5 py-3.5 hover:bg-[#F5F5F7] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
          >
            {/* Google icon */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-black/[0.07]" />
            <span className="font-manrope text-xs text-[#86868B]">o</span>
            <div className="flex-1 h-px bg-black/[0.07]" />
          </div>

          {/* Email magic link */}
          <div>
            <label htmlFor="email" className="font-manrope text-xs text-[#86868B] mb-1.5 block">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEmailLink()}
              className="w-full bg-white border border-black/[0.12] rounded-xl px-4 py-3.5 font-manrope text-sm text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:border-[#1D1D1F] transition-colors"
              autoComplete="email"
            />
          </div>

          <button
            type="button"
            onClick={handleEmailLink}
            disabled={loading || !email}
            className="w-full flex items-center justify-center gap-2 font-manrope font-medium text-sm bg-[#1D1D1F] text-white rounded-xl px-5 py-3.5 hover:bg-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
          >
            {loading ? 'Enviando…' : 'Continuar con email'}
          </button>

          {error && (
            <p className="font-manrope text-xs text-red-500 text-center">{error}</p>
          )}
        </motion.div>

        {/* Footer */}
        <motion.p
          className="mt-8 font-manrope text-xs text-[#86868B] text-center leading-relaxed"
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.15 } as Transition}
        >
          Al continuar aceptas nuestros{' '}
          <Link href="/aviso-legal" className="underline hover:text-[#1D1D1F] transition-colors">
            Términos de servicio
          </Link>{' '}
          y{' '}
          <Link href="/politica-privacidad" className="underline hover:text-[#1D1D1F] transition-colors">
            Política de privacidad
          </Link>.
        </motion.p>

        <motion.div
          className="mt-4 text-center"
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 } as Transition}
        >
          <Link
            href="/"
            className="font-manrope text-xs text-[#86868B] hover:text-[#1D1D1F] transition-colors"
          >
            ← Volver al inicio
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

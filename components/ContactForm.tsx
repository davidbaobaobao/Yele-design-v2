'use client'

import { useState } from 'react'
import { motion, type Transition } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

type FormState = 'idle' | 'loading' | 'success' | 'error'

const tiposNegocio = [
  { es: 'Restaurante / Cafetería', en: 'Restaurant / Café' },
  { es: 'Salud / Bienestar', en: 'Health / Wellness' },
  { es: 'Servicios profesionales', en: 'Professional services' },
  { es: 'Comercio / Tienda', en: 'Shop / Retail' },
  { es: 'Arte / Diseño / Fotografía', en: 'Art / Design / Photography' },
  { es: 'Construcción / Reformas', en: 'Construction / Renovation' },
  { es: 'Otro', en: 'Other' },
]

export default function ContactForm() {
  const { t } = useLang()
  const [formState, setFormState] = useState<FormState>('idle')
  const [form, setForm] = useState({ nombre: '', email: '', negocio: '', mensaje: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormState('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setFormState('success')
      setForm({ nombre: '', email: '', negocio: '', mensaje: '' })
    } catch {
      setFormState('error')
    }
  }

  const inputClass = 'w-full bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-3.5 font-manrope text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors'

  return (
    <section id="contacto" className="py-24 md:py-32 bg-[#1D1D1F]">
      <div className="max-w-3xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' } as Transition}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-12"
        >
          <span className="font-manrope text-xs tracking-[0.15em] uppercase text-white/30 mb-4 block">
            {t('Contacto', 'Contact')}
          </span>
          <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-white tracking-tight mb-4">
            {t('Cuéntanos sobre', 'Tell us about')}<br />
            <span className="text-white/40">{t('tu negocio.', 'your business.')}</span>
          </h2>
          <p className="font-manrope text-white/50 text-lg">
            {t('Respondemos en menos de 24 horas.', 'We respond within 24 hours.')}
          </p>
        </motion.div>

        {formState === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-12 h-12 rounded-full bg-[#34C759]/10 flex items-center justify-center mx-auto mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12l5 5L19 7" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-outfit font-semibold text-2xl text-white mb-2">
              {t('¡Recibido!', 'Received!')}
            </p>
            <p className="font-manrope text-white/50 text-base">
              {t('Te contactamos en menos de 24 horas.', "We'll contact you within 24 hours.")}
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' } as Transition}
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col gap-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="font-manrope text-xs text-white/40 mb-1.5 block">
                  {t('Nombre', 'Name')}
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder={t('Tu nombre', 'Your name')}
                  className={inputClass}
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="email" className="font-manrope text-xs text-white/40 mb-1.5 block">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t('tu@email.com', 'you@email.com')}
                  className={inputClass}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="negocio" className="font-manrope text-xs text-white/40 mb-1.5 block">
                {t('Tipo de negocio', 'Business type')}
              </label>
              <select
                id="negocio"
                name="negocio"
                required
                value={form.negocio}
                onChange={handleChange}
                className={`${inputClass} appearance-none`}
              >
                <option value="" disabled className="bg-[#1D1D1F]">
                  {t('Selecciona tu sector', 'Select your industry')}
                </option>
                {tiposNegocio.map(tipo => (
                  <option key={tipo.es} value={tipo.es} className="bg-[#1D1D1F]">
                    {t(tipo.es, tipo.en)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="mensaje" className="font-manrope text-xs text-white/40 mb-1.5 block">
                {t('Cuéntanos más', 'Tell us more')}
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={4}
                value={form.mensaje}
                onChange={handleChange}
                placeholder={t(
                  '¿Qué haces? ¿Tienes web ahora? ¿Qué quieres mejorar?',
                  'What do you do? Do you have a website? What do you want to improve?'
                )}
                className={`${inputClass} resize-none`}
              />
            </div>

            {formState === 'error' && (
              <p className="font-manrope text-sm text-red-400">
                {t('Algo salió mal. Inténtalo de nuevo o escríbenos a info@yele.design', 'Something went wrong. Try again or email us at info@yele.design')}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={formState === 'loading'}
              className="relative overflow-hidden self-start flex items-center gap-2 font-manrope font-medium text-base bg-white text-[#1D1D1F] px-8 py-3.5 rounded-2xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              whileHover={formState !== 'loading' ? 'hover' : undefined}
              whileTap={formState !== 'loading' ? { scale: 0.97, transition: { duration: 0.15 } as Transition } : undefined}
              initial="rest"
            >
              <motion.span
                className="absolute inset-0 bg-[#F5F5F7]"
                variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                transition={{ duration: 0.3, ease: 'easeOut' } as Transition}
                style={{ originX: 0 }}
                aria-hidden="true"
              />
              <span className="relative z-10">
                {formState === 'loading'
                  ? t('Enviando…', 'Sending…')
                  : t('Enviar mensaje', 'Send message')}
              </span>
              {formState !== 'loading' && <span className="relative z-10" aria-hidden="true">→</span>}
            </motion.button>
          </motion.form>
        )}

      </div>
    </section>
  )
}

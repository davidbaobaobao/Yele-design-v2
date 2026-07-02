'use client'

import { useState } from 'react'
import { motion, type Transition } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import { InfiniteGrid } from '@/components/ui/the-infinite-grid'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm({ waLink }: { waLink?: string } = {}) {
  const { t } = useLang()
  const [formState, setFormState] = useState<FormState>('idle')
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })

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
      setForm({ nombre: '', email: '', mensaje: '' })
    } catch {
      setFormState('error')
    }
  }

  const inputClass = 'w-full bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-3.5 font-manrope text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors'

  return (
    <section id="contacto" className="relative overflow-hidden py-24 md:py-32 bg-[#1D1D1F]">
      <InfiniteGrid />
      <div className="relative z-10 max-w-3xl mx-auto px-6">

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
            {t('Dudas, cuestiones, preguntas.', 'Questions, queries, doubts.')}
          </h2>
        </motion.div>

        {waLink && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' } as Transition}
            viewport={{ once: true, margin: '-80px' }}
            className="mb-8"
          >
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-manrope font-semibold text-base bg-[#25D366] text-white px-7 py-4 rounded-2xl hover:bg-[#20B858] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Escríbenos por WhatsApp
            </a>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex-1 h-px bg-white/10" />
              <span className="font-manrope text-xs text-white/30 uppercase tracking-wider">o por formulario</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          </motion.div>
        )}

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

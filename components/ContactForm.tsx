'use client'

import { useState, type ReactNode } from 'react'
import { motion, type Transition } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import { useLang } from '@/context/LanguageContext'
import { TextGradient } from '@/components/ui/text-gradient'

// Same number the floating WhatsApp button used before it was retired in
// favor of the card below.
const WHATSAPP_URL = 'https://wa.me/34655517760'
const PRIVACY_POLICY_URL = 'https://webgate.digital/wp-content/uploads/2023/10/privacy-policy.pdf'
const SCHEDULE_URL = '/schedule'
const SURVEY_URL = '/survey'

type FormState = 'idle' | 'loading' | 'success' | 'error'

// Rendered twice back-to-back inside a track that animates translateX(0 ->
// -50%) — the classic seamless-loop marquee trick (see hero-marquee-track /
// marqueeLeft in globals.css, already used by presupuesto's HeroBento).
function MarqueeRun() {
  return (
    <div className="flex items-center shrink-0">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex items-center shrink-0">
          <span
            className="font-display font-bold text-white whitespace-nowrap text-[clamp(2.5rem,6vw,5rem)]"
          >
            CONTACT US
          </span>
          <TextGradient
            as="span"
            className="font-display font-bold mx-6 md:mx-10 text-[clamp(2.5rem,6vw,5rem)]"
          >
            *
          </TextGradient>
        </div>
      ))}
    </div>
  )
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

// Plain outline card — no brand color, just white/muted on the dark bg, per
// request ("simple non-colored/monochrome icon cards").
function IconCard({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex-1 flex flex-col items-center justify-center gap-3 py-8 rounded-2xl border border-white/15 text-white/70 hover:text-white hover:border-white/35 transition-colors cursor-pointer"
    >
      {icon}
      <span className="font-body text-xs tracking-[0.15em] uppercase">{label}</span>
    </a>
  )
}

export default function ContactForm() {
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

  const inputClass = 'w-full bg-white/[0.06] border border-hairlineDark rounded-xl px-4 py-3.5 font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors'

  return (
    <section id="contacto" className="relative overflow-hidden py-24 md:py-32" style={{ backgroundColor: '#0D0E12' }}>
      <div className="overflow-hidden py-6 md:py-8 border-y border-white/10 mb-20 md:mb-28">
        <div className="hero-marquee-track flex items-center" style={{ width: 'max-content' }}>
          <MarqueeRun />
          <MarqueeRun />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 md:gap-24">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' } as Transition}
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col"
        >
          <h2 className="font-display font-semibold text-4xl md:text-5xl text-white tracking-tight leading-tight mb-8">
            {t('Hablemos', "Let's talk")}
            <br />
            {t('de cómo llevar', 'about how to set up')}
            <br />
            {t('tu web al', 'your website to the')}
            <br />
            {/* whitespace-nowrap keeps the trailing period glued to the
                gradient span — an inline-block followed by plain text can
                otherwise wrap independently, orphaning the "." on its own
                line. */}
            <span className="whitespace-nowrap">
              <TextGradient as="span">{t('siguiente nivel', 'next level')}</TextGradient>.
            </span>
          </h2>

          <a
            href="mailto:info@yele.design"
            className="font-display text-2xl md:text-3xl text-white/90 hover:text-white transition-colors mb-12 w-fit"
          >
            info@yele.design
          </a>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <IconCard href={WHATSAPP_URL} icon={<WhatsAppGlyph />} label="WhatsApp" />
            <IconCard href={SCHEDULE_URL} icon={<CalendarDays size={26} strokeWidth={1.5} aria-hidden="true" />} label={t('Agendar llamada', 'Book a call')} />
          </div>

          {/* Distinct from the two outline IconCards above — a wide pink-glow
              banner (same ambient-light recipe as CTAButton's Glow, scaled
              to a full-width shape) so the quiz reads as the "if you're not
              sure, start here" option rather than a third equal-weight card. */}
          <a
            href={SURVEY_URL}
            className="group relative mt-4 flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#F2F0EB] px-6 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-2px_5px_rgba(0,0,0,0.07)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#F8F7F4] active:translate-y-0 active:scale-[0.99] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D46FC8]"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -z-10 rounded-full opacity-100 blur-3xl transition-[filter] duration-300 ease-out group-hover:blur-[48px] motion-safe:animate-[cta-glow-drift_4.5s_ease-in-out_infinite]"
              style={{
                top: '-40%',
                left: '5%',
                right: '5%',
                bottom: '-40%',
                background:
                  'radial-gradient(60% 70% at 50% 40%, rgba(212,111,200,1) 0%, rgba(212,111,200,0.55) 55%, transparent 78%)',
              }}
            />
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-display text-lg font-bold text-[#16161A] md:text-xl">
                {t('Haz el quiz de estilo de 2 minutos', 'Take the 2-minute style quiz')}
              </span>
              <span className="mt-1 font-body text-sm text-[#16161A]/60">
                {t(
                  'Descubre el estilo de tu web y recibe un plan a medida.',
                  "Discover your website's look — get a tailored plan."
                )}
              </span>
            </div>
            <span
              aria-hidden="true"
              className="relative z-10 text-xl text-[#16161A] transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </motion.div>

        {/* RIGHT — form */}
        <div>
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
              <p className="font-display font-semibold text-2xl text-white mb-2">
                {t('¡Recibido!', 'Received!')}
              </p>
              <p className="font-body text-white/50 text-base">
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
                  <label htmlFor="nombre" className="font-body text-xs text-white/40 mb-1.5 block">
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
                  <label htmlFor="email" className="font-body text-xs text-white/40 mb-1.5 block">
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
                <label htmlFor="mensaje" className="font-body text-xs text-white/40 mb-1.5 block">
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
                <p className="font-body text-sm text-red-400">
                  {t('Algo salió mal. Inténtalo de nuevo o escríbenos a info@yele.design', 'Something went wrong. Try again or email us at info@yele.design')}
                </p>
              )}

              <motion.button
                type="submit"
                disabled={formState === 'loading'}
                className="relative overflow-hidden self-start flex items-center gap-2 font-body font-medium text-base bg-white text-ink px-8 py-3.5 rounded-2xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                whileHover={formState !== 'loading' ? 'hover' : undefined}
                whileTap={formState !== 'loading' ? { scale: 0.97, transition: { duration: 0.15 } as Transition } : undefined}
                initial="rest"
              >
                <motion.span
                  className="absolute inset-0 bg-base"
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

              <p className="font-body text-xs text-white/35 leading-relaxed mt-1 max-w-sm">
                {t('Al hacer clic en el botón, acepto la recogida y tratamiento de mis datos personales según se describe en la ', 'By clicking the button, I agree with the collection and processing of my personal data as described in the ')}
                <a
                  href={PRIVACY_POLICY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white/60 transition-colors"
                >
                  {t('Política de Privacidad', 'Privacy Policy')}
                </a>
                .
              </p>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

const testimonials = [
  {
    author: 'Sara M.',
    es: { role: 'Instructora de yoga, Madrid', text: 'Tenía la web pendiente desde hacía dos años. Con Yele la tuve lista en cuatro días. Ahora mis alumnas me encuentran en Google.' },
    en: { role: 'Yoga instructor, Madrid', text: "I'd been putting off my website for two years. Yele had it ready in four days. Now my students find me on Google." },
  },
  {
    author: 'Carlos R.',
    es: { role: 'Fontanero autónomo, Bilbao', text: 'Pensé que tener web era complicado y caro. Por €20 al mes tengo algo que parece de empresa grande.' },
    en: { role: 'Self-employed plumber, Bilbao', text: 'I thought having a website was complicated and expensive. For €20 a month I have something that looks like a big company.' },
  },
  {
    author: 'Elena T.',
    es: { role: 'Propietaria de estudio de cerámica, Gràcia', text: 'El proceso fue rapidísimo. Me hicieron preguntas concretas, y tres días después tenía una web que realmente me representa.' },
    en: { role: 'Ceramics studio owner, Gràcia', text: 'The process was incredibly fast. They asked me specific questions, and three days later I had a website that truly represents me.' },
  },
  {
    author: 'Miguel A.',
    es: { role: 'Abogado, Valencia', text: 'Necesitaba algo serio, no un template de Wix. Yele entendió eso desde el primer mensaje.' },
    en: { role: 'Lawyer, Valencia', text: 'I needed something serious, not a Wix template. Yele understood that from the first message.' },
  },
  {
    author: 'Lucía P.',
    es: { role: 'Nutricionista, Sevilla', text: 'Increíble relación calidad-precio. En menos de una semana tenía una web que antes me hubiera costado €2.000.' },
    en: { role: 'Nutritionist, Seville', text: 'Incredible value for money. In less than a week I had a website that would have cost me €2,000 before.' },
  },
  {
    author: 'Pau V.',
    es: { role: 'Fotógrafo freelance, Barcelona', text: 'El portfolio quedó exactamente como lo imaginaba. Rápido, bonito y sin estrés. No pedí más.' },
    en: { role: 'Freelance photographer, Barcelona', text: 'The portfolio turned out exactly as I imagined. Fast, beautiful and stress-free. What more could I ask for.' },
  },
]

const doubled = [...testimonials, ...testimonials]

export default function Testimonios() {
  const { t } = useLang()

  return (
    <section className="py-24 md:py-32 bg-[#F5F5F7] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#86868B] mb-4 block">
            {t('Clientes reales', 'Real clients')}
          </span>
          <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight">
            {t('Lo que dicen nuestros clientes.', 'What our clients say.')}
          </h2>
        </motion.div>
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-[#F5F5F7] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-[#F5F5F7] to-transparent" />

        <motion.div
          className="flex gap-5"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
        >
          {doubled.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-80 bg-white rounded-2xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            >
              <p className="font-manrope text-[#1D1D1F] text-sm leading-relaxed mb-5">
                &ldquo;{t(item.es.text, item.en.text)}&rdquo;
              </p>
              <footer>
                <p className="font-outfit font-medium text-sm text-[#1D1D1F]">{item.author}</p>
                <p className="font-manrope text-xs text-[#86868B] mt-0.5">
                  {t(item.es.role, item.en.role)}
                </p>
              </footer>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

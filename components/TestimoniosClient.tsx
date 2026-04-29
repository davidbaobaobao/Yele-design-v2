'use client'

import { motion, type Transition } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

export type Testimonial = {
  author_name: string
  role: string
  body: string
  rating: number
}

export default function TestimoniosClient({ testimonials }: { testimonials: Testimonial[] }) {
  const { t } = useLang()
  const doubled = [...testimonials, ...testimonials]

  return (
    <section className="py-24 md:py-32 bg-[#F5F5F7] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' } as Transition}
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

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-[#F5F5F7] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-[#F5F5F7] to-transparent" />

        <motion.div
          className="flex gap-5"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, ease: 'linear', repeat: Infinity } as Transition}
        >
          {doubled.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-80 bg-white rounded-2xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            >
              <p className="font-manrope text-[#1D1D1F] text-sm leading-relaxed mb-5">
                &ldquo;{item.body}&rdquo;
              </p>
              <footer>
                <p className="font-outfit font-medium text-sm text-[#1D1D1F]">{item.author_name}</p>
                <p className="font-manrope text-xs text-[#86868B] mt-0.5">{item.role}</p>
              </footer>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

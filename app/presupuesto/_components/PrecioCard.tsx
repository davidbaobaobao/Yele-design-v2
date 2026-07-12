'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const PURPLE = '#7C3AED'

const features = [
  'Diseño Alucinante',
  'Adaptada a móvil',
  'Mantenimiento incluido',
  'Dominio incluido',
  'Panel de Control',
  'Soporte continuo 24/7',
]

export default function PrecioCard() {
  return (
    <section id="precios" className="py-14 md:py-20">
      <div className="max-w-md mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-8"
        >
          <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#6B7280] mb-4 block">
            Precios
          </span>
          <h2 className="font-outfit font-semibold text-5xl md:text-6xl text-[#1D1D1F] tracking-tight">
            Sin letra pequeña.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="relative bg-[#1D1D1F] text-white rounded-3xl p-8
                     shadow-[0_24px_64px_rgba(0,0,0,0.2)] ring-1 ring-white/10"
        >
          {/* Purple promo pill */}
          <div className="flex justify-center mb-6">
            <span
              style={{ background: PURPLE }}
              className="font-manrope font-semibold text-sm text-white px-4 py-1.5 rounded-full"
            >
              Primer mes gratuito
            </span>
          </div>

          {/* Price */}
          <div className="mb-7">
            <div className="flex items-end gap-1">
              <span className="font-outfit font-semibold text-6xl tracking-tight leading-none">
                49€
              </span>
              <span className="font-manrope text-sm text-white/50 mb-1.5">/mes</span>
            </div>
          </div>

          {/* Features */}
          <ul className="flex flex-col gap-3.5 mb-8">
            {features.map(feat => (
              <li key={feat} className="flex items-center gap-2.5">
                <Check size={15} className="flex-shrink-0 text-[#34C759]" aria-hidden="true" />
                <span className="font-manrope text-sm text-white/80">{feat}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href="/registro?plan=starter"
            className="block text-center font-manrope font-semibold text-sm py-3.5 rounded-xl
                       bg-white text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
          >
            Empezar por 0€
          </a>
        </motion.div>

        <p className="text-center font-manrope text-sm text-[#6B7280] mt-6">
          Sin permanencia. Cancela cuando quieras.
        </p>
      </div>
    </section>
  )
}

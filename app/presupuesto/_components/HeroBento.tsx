'use client'

import { RegistroButton, WAButton } from './CTAButtons'
import ScrollHintArrow from './ScrollHintArrow'

const FEATURES = ['Sin pago inicial', 'Lista en 1 semana', 'Sin permanencia', 'Precio fijo mensual']

export default function HeroBento() {
  return (
    <section className="flex flex-col min-h-screen bg-white">

      {/* Top 70% — empty */}
      <div className="flex-[7]" />

      {/* Bottom 30% — split layout */}
      <div className="flex-[3] w-full max-w-6xl mx-auto px-6 pb-10 flex flex-col justify-end">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end">

          {/* Left — small supporting text */}
          <div className="flex flex-col gap-5">
            <p className="font-manrope text-[10px] tracking-[0.22em] uppercase text-[#9CA3AF]">
              Tu agencia de diseño web
            </p>
            <ul className="flex flex-col gap-2.5">
              {FEATURES.map(feat => (
                <li key={feat} className="flex items-center gap-2.5">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#34C759]" aria-hidden="true" />
                  <span className="font-manrope text-xs text-[#6B7280]">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — extra-large heading + CTAs */}
          <div className="flex flex-col items-start">
            <h1
              className="font-outfit font-extrabold text-[#1D1D1F] leading-[0.97] tracking-tight mb-7"
              style={{ fontSize: 'clamp(52px, 7.5vw, 112px)' }}
            >
              Diseño web<br />
              profesional<br />
              <span className="text-[#34C759]">29€/mes</span>
            </h1>
            <div className="flex flex-row gap-3 w-full flex-wrap">
              <RegistroButton
                href="/registro?plan=starter"
                className="inline-flex items-center justify-center gap-2 font-manrope font-semibold text-sm bg-[#1D1D1F] text-white px-6 py-3.5 rounded-xl hover:bg-black transition-colors"
                aria-label="Empezar con el plan Starter"
              >
                Empezar →
              </RegistroButton>
              <WAButton className="inline-flex items-center justify-center gap-2 font-manrope font-medium text-sm bg-[#F5F5F7] text-[#1D1D1F] px-6 py-3.5 rounded-xl hover:bg-[#E8E8ED] transition-colors">
                Pregúntanos
              </WAButton>
            </div>
          </div>

        </div>

        {/* Scroll hint */}
        <div className="pt-8 flex justify-start">
          <ScrollHintArrow />
        </div>
      </div>

    </section>
  )
}

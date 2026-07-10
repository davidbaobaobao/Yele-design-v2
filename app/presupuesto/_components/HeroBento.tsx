'use client'

import Image from 'next/image'
import { RegistroButton } from './CTAButtons'
import ScrollHintArrow from './ScrollHintArrow'

const CHECK = (
  <div className="shrink-0 w-5 h-5 rounded-full bg-[#34C759] flex items-center justify-center">
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 5l2.5 2.5 3.5-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
)

const FEATURES = ['Sin pago inicial', 'Lista en 1 semana', 'Sin permanencia', 'Precio fijo mensual']

export default function HeroBento() {
  return (
    <section className="pt-8 md:pt-10 pb-0 flex flex-col min-h-[90vh]">

      {/* ── Bento grid ── */}
      <div className="
        flex-1 min-h-0
        max-w-6xl mx-auto px-4 md:px-6 w-full
        grid gap-2.5
        grid-cols-1
        md:grid-cols-3
        md:grid-rows-[1fr_1.6fr]
      ">

        {/* CELL 1 — tagline, top-left */}
        <div className="
          md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2
          bg-[#F5F5F7] rounded-3xl px-7 py-6
          flex flex-col justify-between
          min-h-[140px] md:min-h-0
        ">
          <p className="font-manrope text-[11px] tracking-[0.18em] uppercase text-[#9CA3AF]">
            Tu agencia de diseño web
          </p>
          <p className="font-outfit font-semibold text-[#1D1D1F] text-[22px] leading-snug mt-auto">
            Sin complicaciones.
          </p>
        </div>

        {/* CELL 2 — large image, top spanning 2 cols */}
        <div className="
          md:col-start-2 md:col-end-4 md:row-start-1 md:row-end-2
          relative rounded-3xl overflow-hidden
          min-h-[220px] md:min-h-0
          order-first md:order-none
        ">
          <Image
            src="/showcase/archi-01.jpg"
            alt="Diseño web profesional Yele"
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20" />
        </div>

        {/* CELL 3 — features checklist, bottom-left */}
        <div className="
          md:col-start-1 md:col-end-2 md:row-start-2 md:row-end-3
          bg-[#F5F5F7] rounded-3xl px-7 py-6
          flex flex-col justify-center gap-4
          min-h-[160px] md:min-h-0
        ">
          {FEATURES.map(feat => (
            <div key={feat} className="flex items-center gap-3">
              {CHECK}
              <span className="font-manrope text-sm text-[#374151]">{feat}</span>
            </div>
          ))}
        </div>

        {/* CELL 4 — second image, bottom-center */}
        <div className="
          md:col-start-2 md:col-end-3 md:row-start-2 md:row-end-3
          relative rounded-3xl overflow-hidden
          min-h-[200px] md:min-h-0
        ">
          <Image
            src="/showcase/studio-01.jpg"
            alt="Portfolio webs clientes Yele"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <span className="absolute bottom-4 left-5 font-manrope text-white/80 text-xs tracking-wide">
            Clientes reales
          </span>
        </div>

        {/* CELL 5 — main heading + CTAs, bottom-right */}
        <div className="
          md:col-start-3 md:col-end-4 md:row-start-2 md:row-end-3
          bg-[#1D1D1F] rounded-3xl px-7 py-7 md:px-8 md:py-8
          flex flex-col justify-end
          min-h-[240px] md:min-h-0
        ">
          <h1
            className="font-outfit font-extrabold text-white leading-[1.05] tracking-tight mb-5"
            style={{ fontSize: 'clamp(30px, 2.8vw, 48px)' }}
          >
            Diseño web<br />
            profesional<br />
            <span className="text-[#34C759]">29€/mes</span>
          </h1>
          <div className="flex flex-col gap-2.5">
            <RegistroButton
              href="/registro?plan=starter"
              className="inline-flex items-center justify-center gap-2 font-manrope font-semibold text-sm bg-white text-[#1D1D1F] px-5 py-3 rounded-xl hover:bg-[#F5F5F7] transition-colors"
              aria-label="Empezar con el plan Starter"
            >
              Empezar →
            </RegistroButton>
            <a
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 font-manrope font-medium text-sm text-white/75 border border-white/[0.15] px-5 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              Pregúntanos
            </a>
          </div>
        </div>

      </div>

      {/* Scroll hint — below bento, more space */}
      <div className="py-7 flex justify-center">
        <ScrollHintArrow />
      </div>

    </section>
  )
}

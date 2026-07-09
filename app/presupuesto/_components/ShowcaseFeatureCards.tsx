'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Paintbrush, Zap, LayoutDashboard, MapPin, Smartphone, CheckCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const cards: {
  img: string
  sector: string
  Icon: LucideIcon
  title: string
  desc: string
}[] = [
  {
    img: '/showcase/barber-01.jpg',
    sector: 'Barbería',
    Icon: Paintbrush,
    title: 'Diseño a medida',
    desc: 'Sin plantillas. Tu web diseñada desde cero para tu negocio.',
  },
  {
    img: '/showcase/tattoo-01.jpg',
    sector: 'Tattoo Studio',
    Icon: Zap,
    title: 'Entrega en 1 semana',
    desc: 'Tu web publicada en tu dominio en menos de una semana.',
  },
  {
    img: '/showcase/car-01.jpg',
    sector: 'Taller',
    Icon: LayoutDashboard,
    title: 'Panel de control',
    desc: 'Actualiza fácilmente tus servicios, menús, precios o fotos.',
  },
  {
    img: '/showcase/mecanica-01.jpg',
    sector: 'Mecánica',
    Icon: MapPin,
    title: 'SEO local optimizado',
    desc: 'Apareces cuando te buscan. Sin pagar a un especialista aparte.',
  },
  {
    img: '/showcase/archi-01.jpg',
    sector: 'Arquitectura',
    Icon: Smartphone,
    title: 'Mobile-first',
    desc: 'Perfecta en el móvil — donde te busca el 80% de tus clientes.',
  },
  {
    img: '/showcase/studio-01.jpg',
    sector: 'Studio Digital',
    Icon: CheckCircle,
    title: 'Todo incluido',
    desc: 'Hosting, dominio, mantenimiento y soporte. Un precio fijo, sin sorpresas.',
  },
]

export default function ShowcaseFeatureCards() {
  return (
    <section className="pt-6 pb-16 md:pt-8 md:pb-20">
      <h2 className="sr-only">Características</h2>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {cards.map(({ img, sector, Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: 'easeOut' }}
              viewport={{ once: true, margin: '-60px' }}
              className="group bg-white border border-black/[0.06] rounded-2xl overflow-hidden
                         cursor-default select-none
                         shadow-[0_2px_14px_rgba(0,0,0,0.05)]
                         hover:shadow-[0_18px_56px_rgba(0,0,0,0.11)]
                         hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* ── Image ── */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#111]">
                <Image
                  src={img}
                  alt={`Web para ${sector}`}
                  fill
                  sizes="(max-width: 640px) 95vw, (max-width: 1024px) 48vw, 32vw"
                  quality={75}
                  className="object-cover object-center
                             group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                />
                {/* Bottom gradient so badge is always readable */}
                <div className="absolute inset-x-0 bottom-0 h-16
                                bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                {/* Sector badge */}
                <span className="absolute bottom-3 left-3 z-10
                                 inline-flex items-center font-manrope font-medium text-[11px]
                                 tracking-wide text-white/90
                                 bg-white/10 backdrop-blur-md border border-white/20
                                 px-3 py-1.5 rounded-full">
                  {sector}
                </span>
              </div>

              {/* ── Content ── */}
              <div className="px-6 pt-5 pb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center
                                  flex-shrink-0 mt-0.5 transition-colors duration-300
                                  group-hover:bg-[#34C759]/10">
                    <Icon
                      size={15}
                      strokeWidth={1.5}
                      className="text-[#34C759]"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3 className="font-outfit font-semibold text-[#1D1D1F] text-[15px]
                                   leading-tight tracking-tight mb-1.5">
                      {title}
                    </h3>
                    <p className="font-manrope text-[13px] text-[#6B7280] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

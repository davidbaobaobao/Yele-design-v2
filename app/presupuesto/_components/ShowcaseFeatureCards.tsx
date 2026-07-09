'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const cards = [
  {
    img: '/showcase/barber-01.jpg',
    sector: 'Barbería',
    title: 'Diseño a medida',
    desc: 'Sin plantillas. Tu web diseñada desde cero para tu negocio.',
  },
  {
    img: '/showcase/tattoo-01.jpg',
    sector: 'Tattoo Studio',
    title: 'Entrega en 1 semana',
    desc: 'Tu web publicada en tu dominio en menos de una semana.',
  },
  {
    img: '/showcase/car-01.jpg',
    sector: 'Taller',
    title: 'Panel de control',
    desc: 'Actualiza fácilmente tus servicios, menús, precios o fotos.',
  },
  {
    img: '/showcase/mecanica-01.jpg',
    sector: 'Mecánica',
    title: 'SEO local optimizado',
    desc: 'Apareces cuando te buscan. Sin pagar a un especialista aparte.',
  },
  {
    img: '/showcase/archi-01.jpg',
    sector: 'Arquitectura',
    title: 'Mobile-first',
    desc: 'Perfecta en el móvil — donde te busca el 80% de tus clientes.',
  },
  {
    img: '/showcase/studio-01.jpg',
    sector: 'Studio Digital',
    title: 'Todo incluido',
    desc: 'Hosting, dominio, mantenimiento y soporte. Un precio fijo, sin sorpresas.',
  },
]

export default function ShowcaseFeatureCards() {
  return (
    <section className="pt-6 pb-16 md:pt-8 md:pb-20">
      <h2 className="sr-only">Características</h2>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 gap-6">
          {cards.map(({ img, sector, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: 'easeOut' }}
              viewport={{ once: true, margin: '-60px' }}
              className="group bg-white border border-black/[0.06] rounded-3xl overflow-hidden
                         cursor-default select-none
                         shadow-[0_2px_14px_rgba(0,0,0,0.05)]
                         hover:shadow-[0_22px_60px_rgba(0,0,0,0.12)]
                         hover:-translate-y-2 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-72 md:h-80 overflow-hidden bg-[#111]">
                <Image
                  src={img}
                  alt={`Web para ${sector}`}
                  fill
                  sizes="(max-width: 640px) 95vw, 48vw"
                  quality={80}
                  className="object-cover object-center
                             group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-x-0 bottom-0 h-20
                                bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
                <span className="absolute bottom-4 left-4 z-10
                                 inline-flex items-center font-manrope font-medium text-[11px]
                                 tracking-wide text-white/90
                                 bg-white/10 backdrop-blur-md border border-white/20
                                 px-3 py-1.5 rounded-full">
                  {sector}
                </span>
              </div>

              {/* Text */}
              <div className="px-7 pt-6 pb-7">
                <h3 className="font-outfit font-semibold text-[#1D1D1F] text-[17px]
                               leading-tight tracking-tight mb-2">
                  {title}
                </h3>
                <p className="font-manrope text-[14px] text-[#6B7280] leading-relaxed">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

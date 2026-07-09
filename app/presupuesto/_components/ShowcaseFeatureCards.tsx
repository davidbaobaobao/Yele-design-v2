'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const cards = [
  { img: '/showcase/barber-01.jpg',   sector: 'Barbería',       title: 'Diseño a medida',        desc: 'Sin plantillas. Tu web diseñada desde cero para tu negocio.' },
  { img: '/showcase/tattoo-01.jpg',   sector: 'Tattoo Studio',  title: 'Entrega en 1 semana',    desc: 'Tu web publicada en tu dominio en menos de una semana.' },
  { img: '/showcase/car-01.jpg',      sector: 'Taller',         title: 'Panel de control',       desc: 'Actualiza fácilmente tus servicios, menús, precios o fotos.' },
  { img: '/showcase/mecanica-01.jpg', sector: 'Mecánica',       title: 'SEO local optimizado',   desc: 'Apareces cuando te buscan. Sin pagar a un especialista aparte.' },
  { img: '/showcase/archi-01.jpg',    sector: 'Arquitectura',   title: 'Mobile-first',           desc: 'Perfecta en el móvil — donde te busca el 80% de tus clientes.' },
  { img: '/showcase/studio-01.jpg',   sector: 'Studio Digital', title: 'Todo incluido',          desc: 'Hosting, dominio, mantenimiento y soporte. Un precio fijo, sin sorpresas.' },
]

function ParallaxCard({ img, sector, title, desc, i }: (typeof cards)[0] & { i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: i * 0.07, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-50px' }}
      className="group bg-white border border-black/[0.07] rounded-3xl overflow-hidden
                 cursor-default select-none
                 shadow-[0_8px_32px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.08)]
                 hover:shadow-[0_28px_72px_rgba(0,0,0,0.22),0_4px_16px_rgba(0,0,0,0.1)]
                 hover:-translate-y-2 transition-all duration-300"
    >
      {/* Parallax image */}
      <div className="relative h-72 md:h-84 overflow-hidden bg-[#0a0a0a]">
        <motion.div
          style={{ y }}
          className="absolute inset-x-0 top-[-10%] bottom-[-10%]"
        >
          <Image
            src={img}
            alt={`Web para ${sector}`}
            fill
            unoptimized
            sizes="(max-width: 640px) 95vw, 48vw"
            className="object-cover object-center
                       group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          />
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-24
                        bg-gradient-to-t from-black/65 to-transparent pointer-events-none" />
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
  )
}

export default function ShowcaseFeatureCards() {
  return (
    <section className="pt-6 pb-16 md:pt-8 md:pb-20">
      <h2 className="sr-only">Características</h2>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 gap-7">
          {cards.map((card, i) => (
            <ParallaxCard key={card.title} {...card} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

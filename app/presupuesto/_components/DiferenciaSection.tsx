'use client'

import { motion } from 'framer-motion'
import { InfiniteGrid } from '@/components/ui/the-infinite-grid'

export default function DiferenciaSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay muted loop playsInline
        poster="/media/diferencia/orbital_poster.jpg"
        aria-hidden="true"
      >
        <source src="/media/diferencia/orbital_hero.webm" type="video/webm" />
        <source src="/media/diferencia/orbital_hero.mp4"  type="video/mp4" />
      </video>

      {/* Dark scrim */}
      <div className="absolute inset-0 bg-[#0a0a0f]/60" aria-hidden="true" />

      {/* Grid mouse-reveal — attaches to parent section automatically */}
      <InfiniteGrid revealRadius={320} revealOpacity={0.5} />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-20">

        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="font-outfit font-extrabold text-white tracking-tight leading-none mb-10"
          style={{ fontSize: 'clamp(52px, 10vw, 128px)' }}
        >
          LA DIFERENCIA
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="font-manrope leading-relaxed mb-12 space-y-2"
          style={{ fontSize: 'clamp(16px, 2vw, 22px)' }}
        >
          <p className="text-white/60">
            Otras agencias te entregan la web… y ahí se lavan las manos
          </p>
          <p className="text-white">
            Nosotros estamos... <strong className="font-bold">Siempre.</strong>
          </p>
          <p className="text-white/60">
            Mejora constante, Siempre al día
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <a
            href="/registro?plan=starter"
            className="font-manrope font-semibold text-base bg-white text-[#1D1D1F]
                       px-8 py-3.5 rounded-xl hover:bg-[#F5F5F7] transition-colors"
          >
            Empezar por 0€
          </a>
          <a
            href="#contacto"
            className="font-manrope font-semibold text-base text-white
                       border border-white/25 px-8 py-3.5 rounded-xl
                       hover:bg-white/10 transition-colors"
          >
            Contáctanos
          </a>
        </motion.div>

      </div>
    </section>
  )
}

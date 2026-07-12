'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'

const cards = [
  { img: '/showcase/barber-01.jpg',   video: '/media/6card/6card1', title: 'Diseño a medida',      desc: 'Sin plantillas. Tu web diseñada desde cero para tu negocio.' },
  { img: '/showcase/tattoo-01.jpg',   video: '/media/6card/6card2', title: 'Entrega en 1 semana',  desc: 'Tu web publicada en tu dominio en menos de una semana.' },
  { img: '/showcase/car-01.jpg',      video: '/media/6card/6card3', title: 'Panel de control',     desc: 'Actualiza fácilmente tus servicios, menús, precios o fotos.' },
  { img: '/showcase/mecanica-01.jpg', video: '/media/6card/6card4', title: 'SEO local optimizado', desc: 'Apareces cuando te buscan. Sin pagar a un especialista aparte.' },
  { img: '/showcase/archi-01.jpg',    video: '/media/6card/6card5', title: 'Mobile-first',         desc: 'Perfecta en el móvil — donde te busca el 80% de tus clientes.' },
  { img: '/showcase/studio-01.jpg',   video: '/media/6card/6card6', title: 'Todo incluido',        desc: 'Hosting, dominio, mantenimiento y soporte. Un precio fijo, sin sorpresas.' },
]

function ParallaxCard({ img, video, title, desc, i }: (typeof cards)[0] & { i: number }) {
  const ref      = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Scroll-based image parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  // Mouse-follow 3D tilt
  const rawX  = useMotionValue(0)
  const rawY  = useMotionValue(0)
  const rotateX = useSpring(rawX, { stiffness: 280, damping: 22 })
  const rotateY = useSpring(rawY, { stiffness: 280, damping: 22 })
  const scale   = useSpring(useMotionValue(1), { stiffness: 280, damping: 22 })

  function onMouseEnter() {
    videoRef.current?.play().catch(() => {})
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = (e.clientX - left) / width  - 0.5
    const y = (e.clientY - top)  / height - 0.5
    rawX.set(y * -10)
    rawY.set(x *  10)
    scale.set(1.025)
  }

  function onMouseLeave() {
    rawX.set(0)
    rawY.set(0)
    scale.set(1)
    const v = videoRef.current
    if (v) { v.pause(); v.currentTime = 0 }
  }

  return (
    <div style={{ perspective: '900px' }}>
      <motion.div
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: i * 0.07, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-50px' }}
        style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
        className="group bg-white border border-black/[0.07] rounded-3xl overflow-hidden
                   cursor-default select-none will-change-transform
                   shadow-[0_8px_32px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.08)]
                   hover:shadow-[0_28px_72px_rgba(0,0,0,0.22),0_4px_16px_rgba(0,0,0,0.1)]
                   transition-shadow duration-300"
      >
        {/* Image + video layer — both inside the same parallax wrapper */}
        <div className="relative h-80 md:h-96 overflow-hidden bg-[#0a0a0a]">
          <motion.div
            style={{ y: imageY }}
            className="absolute inset-x-0 top-[-10%] bottom-[-10%]"
          >
            {/* Static image — fades out on hover */}
            <Image
              src={img}
              alt={title}
              fill
              unoptimized
              sizes="(max-width: 640px) 95vw, 33vw"
              className="object-cover object-center transition-opacity duration-500 group-hover:opacity-0"
            />

            {/* Video — same crop/zoom as image, fades in on hover */}
            <video
              ref={videoRef}
              loop
              muted
              playsInline
              preload="metadata"
              poster={img}
              className="absolute inset-0 w-full h-full object-cover object-center
                         opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            >
              <source src={`${video}.webm`} type="video/webm" />
              <source src={`${video}.mp4`}  type="video/mp4" />
            </video>
          </motion.div>

          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-24
                          bg-gradient-to-t from-black/65 to-transparent pointer-events-none" />
        </div>

        {/* Text */}
        <div className="px-5 pt-5 pb-5">
          <h3 className="font-outfit font-semibold text-[#1D1D1F] text-[15px]
                         leading-tight tracking-tight mb-1.5">
            {title}
          </h3>
          <p className="font-manrope text-[13px] text-[#6B7280] leading-relaxed">
            {desc}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function ShowcaseFeatureCards() {
  return (
    <section id="showcase-cards" className="pt-2 pb-6 md:pt-4 md:pb-8">
      <h2 className="sr-only">Características</h2>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <ParallaxCard key={card.title} {...card} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

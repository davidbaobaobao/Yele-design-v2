'use client'

import Image from 'next/image'
import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'

const cards = [
  {
    img: '/showcase/barber-01.webp',
    video: '/media/6card/6card1',
    es: { title: 'Diseño a medida',              desc: 'Sin plantillas. Un sitio web construido desde cero para tu negocio.' },
    en: { title: 'Custom design',                desc: 'No templates. A website built from scratch for your business.' },
  },
  {
    img: '/showcase/tattoo-01.webp',
    video: '/media/6card/6card2',
    es: { title: 'Entrega rápida',               desc: 'Tu web publicada en tu dominio en menos de una semana.' },
    en: { title: 'Fast delivery',                desc: 'Your site live from one week.' },
  },
  {
    img: '/showcase/car-01.webp',
    video: '/media/6card/6card3',
    es: { title: 'Control fácil del contenido',  desc: 'Actualiza tus servicios, menú, precios o fotos tú mismo, cuando quieras.' },
    en: { title: 'Easy content control',         desc: 'Update your services, menu, prices, or photos yourself, anytime.' },
  },
  {
    img: '/showcase/mecanica-01.webp',
    video: '/media/6card/6card4',
    es: { title: 'SEO local',                    desc: 'Apareces cuando te buscan.' },
    en: { title: 'Local SEO',                    desc: 'Show up when people search for you.' },
  },
  {
    img: '/showcase/archi-01.webp',
    video: '/media/6card/6card5',
    es: { title: 'Mobile-first',                 desc: 'Perfecto en el móvil, donde el 80% de tus clientes te encuentran.' },
    en: { title: 'Mobile-first',                 desc: 'Looks great on mobile, where 80% of your customers find you.' },
  },
  {
    img: '/showcase/studio-01.webp',
    video: '/media/6card/6card6',
    es: { title: 'Todo incluido',                desc: 'Hosting, dominio, mantenimiento, marketing y soporte. Un precio fijo, sin sorpresas.' },
    en: { title: 'All-in-one',                   desc: 'Hosting, domain, maintenance, marketing and support. One flat price, no surprises.' },
  },
]

function ParallaxCard({ img, video, title, desc, i }: { img: string; video: string; title: string; desc: string; i: number }) {
  const ref      = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.setAttribute('muted', '')
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    v.muted = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { v.muted = true; v.play().catch(() => {}) }
        else { v.pause() }
      },
      { threshold: 0.25 }
    )
    observer.observe(v)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  const rawX    = useMotionValue(0)
  const rawY    = useMotionValue(0)
  const rotateX = useSpring(rawX, { stiffness: 280, damping: 22 })
  const rotateY = useSpring(rawY, { stiffness: 280, damping: 22 })
  const scale   = useSpring(useMotionValue(1), { stiffness: 280, damping: 22 })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    rawX.set(((e.clientY - top)  / height - 0.5) * -10)
    rawY.set(((e.clientX - left) / width  - 0.5) *  10)
    scale.set(1.025)
  }

  function onMouseLeave() {
    rawX.set(0); rawY.set(0); scale.set(1)
  }

  return (
    <div style={{ perspective: '900px' }} className="h-full">
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: i * 0.07, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-50px' }}
        style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
        className="group bg-white border border-black/[0.07] rounded-3xl overflow-hidden
                   cursor-default select-none will-change-transform h-full
                   shadow-[0_8px_32px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.08)]
                   hover:shadow-[0_28px_72px_rgba(0,0,0,0.22),0_4px_16px_rgba(0,0,0,0.1)]
                   transition-shadow duration-300"
      >
        <div className="relative h-44 md:h-52 overflow-hidden bg-[#0a0a0a]">
          <motion.div
            style={{ y: imageY }}
            className="absolute inset-x-0 top-[-10%] bottom-[-10%]"
          >
            <Image
              src={img}
              alt={title}
              fill
              sizes="(max-width: 767px) 48vw, 33vw"
              className="object-cover object-center"
            />
            <video
              ref={videoRef}
              loop muted autoPlay playsInline
              preload="metadata"
              poster={img}
              className="absolute inset-0 w-full h-full object-cover object-center"
            >
              <source src={`${video}.mp4`}  type="video/mp4" />
              <source src={`${video}.webm`} type="video/webm" />
            </video>
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 to-transparent pointer-events-none" />
        </div>

        <div className="px-5 pt-5 pb-5">
          <h3 className="font-outfit font-semibold text-[#1D1D1F] text-[15px] leading-tight tracking-tight mb-1.5">
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
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)

  // 250ms scroll lock on desktop — gives users a moment to register the grid
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let locked = false
    let lockTimer: ReturnType<typeof setTimeout>

    function preventScroll(e: WheelEvent) {
      if (locked) e.preventDefault()
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (window.innerWidth < 768) return
      if (entry.isIntersecting && !locked) {
        locked = true
        const { top } = el.getBoundingClientRect()
        if (Math.abs(top) > 20) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        window.addEventListener('wheel', preventScroll, { passive: false })
        clearTimeout(lockTimer)
        lockTimer = setTimeout(() => {
          locked = false
          window.removeEventListener('wheel', preventScroll)
        }, 250)
      } else if (!entry.isIntersecting) {
        locked = false
        window.removeEventListener('wheel', preventScroll)
        clearTimeout(lockTimer)
      }
    }, { threshold: 0.3 })

    observer.observe(el)
    return () => {
      observer.disconnect()
      clearTimeout(lockTimer)
      window.removeEventListener('wheel', preventScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} id="showcase-cards" className="min-h-screen flex flex-col justify-center py-6">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-60px' }}
          className="font-outfit font-semibold text-3xl md:text-4xl text-[#1D1D1F] tracking-tight mb-10"
        >
          {t('Mantente por delante de la competencia', 'Stay ahead of the competition')}
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <ParallaxCard
              key={card.en.title}
              img={card.img}
              video={card.video}
              title={t(card.es.title, card.en.title)}
              desc={t(card.es.desc, card.en.desc)}
              i={i}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

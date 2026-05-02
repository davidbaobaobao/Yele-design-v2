'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import { Paintbrush, Zap, LayoutDashboard, MapPin, Smartphone, CheckCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const cards = [
  {
    Icon: Paintbrush,
    es: { title: 'Diseño a medida', desc: 'Sin plantillas. Diseñamos a partir de tu negocio real: tu sector, tu ciudad, tus clientes. El resultado es una web que solo podría ser tuya.' },
    en: { title: 'Custom design', desc: 'No templates. We design from your real business: your sector, your city, your clients. The result is a website that could only be yours.' },
  },
  {
    Icon: Zap,
    es: { title: 'Live en 3 a 5 días', desc: 'No semanas ni meses. Tu web profesional publicada y apuntando a tu dominio en menos de una semana.' },
    en: { title: 'Live in 3 to 5 days', desc: 'Not weeks or months. Your professional website published and pointing to your domain in under a week.' },
  },
  {
    Icon: LayoutDashboard,
    es: { title: 'Panel sin código', desc: 'Actualiza menú, precios, fotos, horarios o servicios. Cambios en tu web live en menos de 60 segundos.' },
    en: { title: 'No-code panel', desc: 'Update menu, prices, photos, hours or services. Changes on your live website in under 60 seconds.' },
  },
  {
    Icon: MapPin,
    es: { title: 'SEO local optimizado', desc: 'Apareces cuando alguien busca lo que haces cerca de donde estás. Sin contratar a un especialista en SEO aparte.' },
    en: { title: 'Local SEO optimised', desc: 'You appear when someone searches for what you do near where you are. No need to hire a separate SEO specialist.' },
  },
  {
    Icon: Smartphone,
    es: { title: 'Mobile-first', desc: 'Rápida, ligera y perfecta en el móvil — donde te busca el 80% de tus clientes.' },
    en: { title: 'Mobile-first', desc: 'Fast, light and perfect on mobile — where 80% of your customers will find you.' },
  },
  {
    Icon: CheckCircle,
    es: { title: 'Todo incluido', desc: 'Hosting, dominio, certificado SSL, mantenimiento y soporte. Un precio fijo, sin extras.' },
    en: { title: 'All-inclusive', desc: 'Hosting, domain, SSL certificate, maintenance and support. One fixed price, no extras.' },
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

function BeneficioCard({
  Icon,
  title,
  desc,
}: {
  Icon: LucideIcon
  title: string
  desc: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 })

  const spotX = useTransform(smoothX, [-0.5, 0.5], [0, 100])
  const spotY = useTransform(smoothY, [-0.5, 0.5], [0, 100])
  const spotlight = useMotionTemplate`radial-gradient(circle at ${spotX}% ${spotY}%, rgba(99,120,255,0.13) 0%, transparent 60%)`

  // Icon circle tint follows mouse
  const iconTint = useMotionTemplate`radial-gradient(circle at ${spotX}% ${spotY}%, rgba(99,120,255,0.10) 0%, transparent 80%)`

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      variants={cardVariant}
      transition={{ duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-white border border-black/[0.06] rounded-2xl p-8 cursor-default overflow-hidden"
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.09)', transition: { duration: 0.2 } }}
    >
      {/* Spotlight overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: spotlight }}
        aria-hidden="true"
      />

      {/* Icon with tinted circle */}
      <motion.div
        className="relative w-10 h-10 rounded-full bg-[#F5F5F7] flex items-center justify-center mb-5 overflow-hidden"
        style={{ background: iconTint }}
      >
        <motion.div
          className="absolute inset-0 bg-[#F5F5F7] -z-10 rounded-full"
        />
        <Icon size={18} strokeWidth={1.5} className="text-[#1D1D1F] relative z-10" aria-hidden="true" />
      </motion.div>

      <h3 className="relative font-outfit font-semibold text-lg text-[#1D1D1F] mb-2">
        {title}
      </h3>
      <p className="relative font-manrope text-sm text-[#86868B] leading-relaxed">
        {desc}
      </p>
    </motion.div>
  )
}

export default function Beneficios() {
  const { t } = useLang()

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-14"
        >
          <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#86868B] mb-4 block">
            {t('Beneficios', 'Benefits')}
          </span>
          <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-4">
            {t('Calidad de agencia', 'Agency quality')}<br />
            {t('al precio de una suscripción.', 'at subscription price.')}
          </h2>
          <p className="font-manrope text-[#86868B] text-lg max-w-xl">
            {t(
              'Sin agencias, sin complicaciones, sin permanencia.',
              'No agencies, no hassle, no lock-in.'
            )}
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-5"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {cards.map(({ Icon, es, en }) => (
            <BeneficioCard
              key={es.title}
              Icon={Icon}
              title={t(es.title, en.title)}
              desc={t(es.desc, en.desc)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

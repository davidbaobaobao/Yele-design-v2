'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, type Transition } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import type { ShowcaseProject } from './Showcase'

function ShowcaseCard({ item, index, isLarge }: { item: ShowcaseProject; index: number; isLarge: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 25 })
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 25 })

  const maxTilt = isLarge ? 7 : 5
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt])

  const imgX = useTransform(smoothX, [-0.5, 0.5], [8, -8])
  const imgY = useTransform(smoothY, [-0.5, 0.5], [8, -8])

  const spotX = useTransform(smoothX, [-0.5, 0.5], [0, 100])
  const spotY = useTransform(smoothY, [-0.5, 0.5], [0, 100])
  const spotlight = useMotionTemplate`radial-gradient(circle at ${spotX}% ${spotY}%, rgba(255,255,255,0.18) 0%, transparent 55%)`

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
      className={`relative overflow-hidden rounded-2xl ${
        isLarge ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
      }`}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' } as Transition}
      viewport={{ once: true, margin: '-80px' }}
    >
      <Link href={`/ejemplos#${item.id}`} className="block w-full h-full focus-visible:outline-none">
        {/* Parallax image layer */}
        <motion.div className="absolute inset-0" style={{ x: imgX, y: imgY, scale: 1.12 }}>
          <Image
            src={item.main_image}
            alt={`Web de ${item.name} — diseñada por Yele`}
            fill
            sizes={isLarge ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
            className="object-cover"
            priority={index === 0}
          />
        </motion.div>

        {/* Spotlight overlay */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: spotlight }}
          aria-hidden="true"
        />

        {/* Hover info overlay */}
        <motion.div
          className="absolute inset-0 z-20 bg-gradient-to-t from-black/65 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 } as Transition}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-30 p-4"
          initial={{ opacity: 0, y: 6 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 } as Transition}
        >
          <p className="font-outfit font-medium text-white text-sm">{item.name}</p>
          {item.description && (
            <p className="font-manrope text-white/70 text-xs mt-0.5">{item.description}</p>
          )}
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default function ShowcaseClient({ projects }: { projects: ShowcaseProject[] }) {
  const { t } = useLang()

  return (
    <section id="trabajos" className="py-24 md:py-32 bg-[#F5F5F7]">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' } as Transition}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-12"
        >
          <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#86868B] mb-4 block">
            {t('Ejemplos reales', 'Real examples')}
          </span>
          <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-4">
            {t('Webs que hemos construido.', "Websites we've built.")}
          </h2>
          <p className="font-manrope text-[#86868B] text-lg">
            {t('Para negocios reales, en toda España.', 'For real businesses, all across Spain.')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[220px]">
          {projects.slice(0, 5).map((item, i) => (
            <ShowcaseCard key={item.id} item={item} index={i} isLarge={i === 0} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/ejemplos"
            className="inline-flex items-center gap-2 font-manrope font-medium text-sm text-[#86868B] hover:text-[#1D1D1F] transition-colors"
          >
            {t('Ver todos los trabajos', 'See all work')} →
          </Link>
        </div>

      </div>
    </section>
  )
}

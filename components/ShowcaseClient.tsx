'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, type Transition } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import type { ShowcaseProject } from './Showcase'

function parseImages(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((v): v is string => typeof v === 'string')
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) } catch { return [] }
  }
  return []
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

type CardData = { project: ShowcaseProject; image: string; key: string }

function buildRow(projects: ShowcaseProject[], seed: number): CardData[] {
  const shuffled = shuffle(projects)
  // Pick 4 items (with wraparound if fewer than 4 projects)
  return Array.from({ length: 4 }, (_, i) => {
    const project = shuffled[i % shuffled.length]
    const all = [project.main_image, ...parseImages(project.additional_images)].filter(Boolean)
    const image = all[Math.floor(Math.random() * all.length)]
    return { project, image, key: `${seed}-${i}-${project.id}` }
  })
}

function ScrollRow({ cards, reverse }: { cards: CardData[]; reverse: boolean }) {
  // Repeat 4x so we always fill any viewport before halving for the seamless loop
  const base = [...cards, ...cards, ...cards, ...cards]
  const doubled = [...base, ...base]

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: 40, ease: 'linear', repeat: Infinity } as Transition}
      >
        {doubled.map((card, i) => (
          <Link
            key={`${card.key}-${i}`}
            href={`/ejemplos#${card.project.id}`}
            className="flex-shrink-0 w-72 h-48 relative rounded-2xl overflow-hidden group block focus-visible:outline-none"
          >
            <Image
              src={card.image}
              alt={`Web de ${card.project.name} — Yele`}
              fill
              sizes="288px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="absolute bottom-3 left-3 right-3 font-outfit font-medium text-white text-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 truncate">
              {card.project.name}
            </p>
          </Link>
        ))}
      </motion.div>
    </div>
  )
}

export default function ShowcaseClient({ projects }: { projects: ShowcaseProject[] }) {
  const { t } = useLang()
  const [rows, setRows] = useState<[CardData[], CardData[]] | null>(null)

  useEffect(() => {
    setRows([buildRow(projects, 0), buildRow(projects, 1)])
  }, [projects])

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
      </div>

      <div className="relative space-y-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-[#F5F5F7] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-[#F5F5F7] to-transparent" />

        {rows ? (
          <>
            <ScrollRow cards={rows[0]} reverse={false} />
            <ScrollRow cards={rows[1]} reverse={true} />
          </>
        ) : (
          // SSR skeleton — two rows of placeholder blocks
          <>
            {[0, 1].map(row => (
              <div key={row} className="flex gap-4 px-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-72 h-48 rounded-2xl bg-black/[0.06]" />
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6">
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

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, type MotionValue, type Transition } from 'framer-motion'
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

function makeCard(project: ShowcaseProject, rowSeed: number, i: number): CardData {
  const all = [project.main_image, ...parseImages(project.additional_images)].filter(Boolean)
  const image = all[Math.floor(Math.random() * all.length)]
  return { project, image, key: `${rowSeed}-${i}-${project.id}` }
}

// 5 cards per row — shuffle once and split so no project repeats across rows
function buildRows(projects: ShowcaseProject[]): [CardData[], CardData[]] {
  const pool = shuffle(projects)
  const row1 = pool.slice(0, 5)
  // Row 2: take next 5; if pool is small, fill from a fresh shuffle of remaining
  const remainder = pool.slice(5)
  const row2 = remainder.length >= 5
    ? remainder.slice(0, 5)
    : [...remainder, ...shuffle(pool).filter(p => !remainder.includes(p))].slice(0, 5)

  return [
    row1.map((p, i) => makeCard(p, 0, i)),
    row2.map((p, i) => makeCard(p, 1, i)),
  ]
}

// Card sized so 3.5 cards fill the viewport:
//   3.5 * cardWidth + 3 gaps(16px) = 100vw  →  cardWidth ≈ 28.57vw
const CARD_W = 'calc((100vw - 48px) / 3.5)'

// Parallax travel expressed in vw (Framer Motion interpolates same-unit strings):
//   Row 1: 50% of cardWidth left  = 100vw / (3.5 * 2) ≈ 14.3vw
//   Row 2: 35% of cardWidth right = 100vw / (3.5 / 0.35) ≈ 10vw
const ROW1_START = '0vw'
const ROW1_END   = '-14.3vw'   // moves left
const ROW2_START = '0vw'
const ROW2_END   = '10vw'      // moves right

function ScrollRow({ cards, xMotion }: { cards: CardData[]; xMotion: MotionValue<string> }) {
  return (
    <div className="overflow-hidden">
      <motion.div className="flex gap-4 w-max" style={{ x: xMotion }}>
        {cards.map((card, i) => (
          <Link
            key={`${card.key}-${i}`}
            href={`/ejemplos#${card.project.id}`}
            style={{ width: CARD_W }}
            className="flex-shrink-0 aspect-video relative rounded-2xl overflow-hidden group block focus-visible:outline-none"
          >
            <Image
              src={card.image}
              alt={`Web de ${card.project.name} — Yele`}
              fill
              sizes="(max-width: 768px) 90vw, 30vw"
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
  const sectionRef = useRef<HTMLElement>(null)

  // Track scroll progress of the section entering/exiting the viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Direct useTransform — no spring so there's zero lag or overshoot on direction change
  const row1X = useTransform(scrollYProgress, [0, 1], [ROW1_START, ROW1_END])
  const row2X = useTransform(scrollYProgress, [0, 1], [ROW2_START, ROW2_END])

  useEffect(() => {
    setRows(buildRows(projects))
  }, [projects])

  return (
    <section ref={sectionRef} id="trabajos" className="py-24 md:py-32 bg-white">
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
        {/* Edge fades — wider to cleanly clip the half-visible edge cards */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-[#F5F5F7] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-[#F5F5F7] to-transparent" />

        {rows ? (
          <>
            <ScrollRow cards={rows[0]} xMotion={row1X} />
            <ScrollRow cards={rows[1]} xMotion={row2X} />
          </>
        ) : (
          // SSR placeholder — matches final card sizing to prevent layout shift
          <>
            {[0, 1].map(row => (
              <div key={row} className="flex gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    style={{ width: CARD_W }}
                    className="flex-shrink-0 aspect-video rounded-2xl bg-black/[0.06]"
                  />
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

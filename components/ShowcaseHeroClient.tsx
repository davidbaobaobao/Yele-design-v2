'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
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
  return { project, image, key: `hero-${rowSeed}-${i}-${project.id}` }
}

function buildRows(projects: ShowcaseProject[]): [CardData[], CardData[]] {
  const pool = shuffle(projects)
  const row1 = pool.slice(0, 5)
  const remainder = pool.slice(5)
  const row2 = remainder.length >= 5
    ? remainder.slice(0, 5)
    : [...remainder, ...shuffle(pool).filter(p => !remainder.includes(p))].slice(0, 5)

  return [
    row1.map((p, i) => makeCard(p, 0, i)),
    row2.map((p, i) => makeCard(p, 1, i)),
  ]
}

// 1.6 cards fill the full viewport width
const CARD_W = 'calc((100vw - 16px) / 1.6)'

const ROW1_START = '0vw'
const ROW1_END   = '-10vw'
const ROW2_START = '0vw'
const ROW2_END   = '7vw'

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
              sizes="(max-width: 768px) 90vw, 60vw"
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

export default function ShowcaseHeroClient({ projects }: { projects: ShowcaseProject[] }) {
  const [rows, setRows] = useState<[CardData[], CardData[]] | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const row1X = useTransform(scrollYProgress, [0, 1], [ROW1_START, ROW1_END])
  const row2X = useTransform(scrollYProgress, [0, 1], [ROW2_START, ROW2_END])

  useEffect(() => {
    setRows(buildRows(projects))
  }, [projects])

  return (
    <section ref={sectionRef} className="py-16 bg-white overflow-hidden">
      <div className="relative space-y-4">
        {rows ? (
          <>
            <ScrollRow cards={rows[0]} xMotion={row1X} />
            <ScrollRow cards={rows[1]} xMotion={row2X} />
          </>
        ) : (
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
    </section>
  )
}

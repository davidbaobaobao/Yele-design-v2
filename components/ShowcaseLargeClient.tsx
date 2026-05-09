'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useMotionValue, type MotionValue } from 'framer-motion'

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

function buildRows(projects: ShowcaseProject[]): [CardData[], CardData[]] {
  const pool = shuffle(projects)
  const row1 = pool.slice(0, 4)
  const remainder = pool.slice(4)
  const row2 = remainder.length >= 5
    ? remainder.slice(0, 5)
    : [...remainder, ...shuffle(pool).filter(p => !remainder.includes(p))].slice(0, 5)

  return [
    row1.map((p, i) => makeCard(p, 0, i)),
    row2.map((p, i) => makeCard(p, 1, i)),
  ]
}

const CARD_W_DESKTOP = 'calc((100vw - 32px) / 2.5)'
const CARD_W_MOBILE = 'calc(100vw - 16px)'

const ROW1_START = '0vw'
const ROW1_END   = '-20vw'
const ROW2_START = '-14vw'
const ROW2_END   = '0vw'

function ScrollRow({ cards, xMotion }: { cards: CardData[]; xMotion: MotionValue<string> }) {
  return (
    <div className="overflow-hidden">
      <motion.div className="flex gap-4 w-max" style={{ x: xMotion }}>
        {cards.map((card, i) => (
          <Link
            key={`${card.key}-${i}`}
            href={`/ejemplos#${card.project.id}`}
            style={{ width: CARD_W_DESKTOP }}
            className="flex-shrink-0 aspect-video relative rounded-2xl overflow-hidden group block focus-visible:outline-none"
          >
            <Image
              src={card.image}
              alt={`Web de ${card.project.name} — Yele`}
              fill
              sizes="42vw"
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

function MobileGallery({ rows }: { rows: [CardData[], CardData[]] }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const travelMV = useMotionValue(0)
  const [wrapperH, setWrapperH] = useState('200vh')

  useEffect(() => {
    const compute = () => {
      const cardW = window.innerWidth - 16
      const travel = 2.5 * cardW
      travelMV.set(travel)
      setWrapperH(`${window.innerHeight + travel}px`)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [travelMV])

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end end'] })
  const x = useTransform(
    [scrollYProgress, travelMV],
    ([p, t]: number[]) => -(p * t)
  )
  const x2 = useTransform(
    [scrollYProgress, travelMV],
    ([p, t]: number[]) => -(p * t) - (t / 2.5) * 0.3
  )

  return (
    <div ref={wrapperRef} style={{ height: wrapperH }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="relative space-y-3">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 z-10 bg-gradient-to-r from-[#F5F5F7] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-[#F5F5F7] to-transparent" />
          {rows.map((rowCards, rowIdx) => (
            <div key={rowIdx} className="overflow-visible">
              <motion.div
                className="flex gap-3 w-max"
                style={{ x: rowIdx === 1 ? x2 : x, paddingLeft: '8px' }}
              >
                {rowCards.map((card, i) => (
                  <Link
                    key={`${card.key}-${i}`}
                    href={`/ejemplos#${card.project.id}`}
                    style={{ width: CARD_W_MOBILE }}
                    className="flex-shrink-0 aspect-[4/3] relative rounded-2xl overflow-hidden group block focus-visible:outline-none"
                  >
                    <Image
                      src={card.image}
                      alt={`Web de ${card.project.name} — Yele`}
                      fill
                      sizes="95vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <p className="absolute bottom-3 left-3 right-3 font-outfit font-medium text-white text-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 truncate">
                      {card.project.name}
                    </p>
                  </Link>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ShowcaseLargeClient({ projects }: { projects: ShowcaseProject[] }) {
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

  const heading = (
    <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight">
      <span className="block">Tener página web</span>
      <span className="block">nunca fue tan fácil.</span>
    </h2>
  )

  return (
    <section ref={sectionRef} className="bg-[#F5F5F7]">
      {/* Desktop */}
      <div className="hidden md:block py-10">
        <div className="max-w-6xl mx-auto px-6 mb-10">
          {heading}
        </div>
        <div className="relative space-y-4 overflow-x-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-40 z-10 bg-gradient-to-r from-[#F5F5F7] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-40 z-10 bg-gradient-to-l from-[#F5F5F7] to-transparent" />
          {rows ? (
            <>
              <ScrollRow cards={rows[0]} xMotion={row1X} />
              <ScrollRow cards={rows[1]} xMotion={row2X} />
            </>
          ) : (
            <>
              {[0, 1].map(row => (
                <div key={row} className="flex gap-4">
                  {Array.from({ length: row === 1 ? 5 : 4 }).map((_, i) => (
                    <div
                      key={i}
                      style={{ width: CARD_W_DESKTOP }}
                      className="flex-shrink-0 aspect-video rounded-2xl bg-black/[0.06]"
                    />
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="px-4 pt-8 pb-3">
          {heading}
        </div>
        {rows ? (
          <MobileGallery rows={rows} />
        ) : (
          <div className="space-y-3 px-4 py-10">
            {[0, 1].map(row => (
              <div key={row} className="flex gap-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    style={{ width: CARD_W_MOBILE }}
                    className="flex-shrink-0 aspect-video rounded-2xl bg-black/[0.06]"
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

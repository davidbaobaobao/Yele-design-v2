'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, animate } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
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

  // Row 1 — 4 unique cards; rotate so last card is first in DOM (fills left edge at loop reset)
  const r1 = pool.slice(0, 4)
  const r1rot: ShowcaseProject[] = [r1[3], r1[0], r1[1], r1[2]]

  // Row 2 — 5 unique cards; same rotation logic
  const remainder = pool.slice(4)
  const r2: ShowcaseProject[] = remainder.length >= 5
    ? remainder.slice(0, 5)
    : [...remainder, ...shuffle(pool).filter(p => !remainder.includes(p))].slice(0, 5)
  const r2rot: ShowcaseProject[] = [r2[4], r2[0], r2[1], r2[2], r2[3]]

  // Double each set — the duplicate makes the loop-reset invisible
  return [
    [...r1rot, ...r1rot].map((p, i) => makeCard(p, 0, i)),
    [...r2rot, ...r2rot].map((p, i) => makeCard(p, 1, i)),
  ]
}


// Scroll speeds in px/s — slightly faster than the previous implementation
const ROW1_SPEED = 65
const ROW2_SPEED = 50

function ScrollRow({
  cards,
  xMotion,
  motionRef,
}: {
  cards: CardData[]
  xMotion: MotionValue<number>
  motionRef: React.RefObject<HTMLDivElement>
}) {
  return (
    <div className="overflow-hidden">
      <motion.div ref={motionRef} className="flex gap-4 w-max" style={{ x: xMotion }}>
        {cards.map((card, i) => (
          <Link
            key={`${card.key}-${i}`}
            href={`/ejemplos#${card.project.id}`}
            className="flex-shrink-0 aspect-video relative rounded-2xl overflow-hidden group block focus-visible:outline-none w-[calc(100vw-16px)] md:w-[calc((100vw-16px)/1.5)]"
          >
            <Image
              src={card.image}
              alt={`Web de ${card.project.name} — Yele`}
              fill
              sizes="(max-width: 768px) 95vw, 65vw"
              quality={75}
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

export default function ShowcaseHeroClient({ projects, noBg }: { projects: ShowcaseProject[]; noBg?: boolean }) {
  const [rows, setRows] = useState<[CardData[], CardData[]] | null>(null)
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)
  const row1X = useMotionValue(0)
  const row2X = useMotionValue(0)

  useEffect(() => {
    setRows(buildRows(projects))
  }, [projects])

  // Start row 1 loop once the DOM is measured
  useEffect(() => {
    if (!rows || !row1Ref.current) return
    const halfW = row1Ref.current.scrollWidth / 2
    if (!halfW) return
    const c = animate(row1X, -halfW, {
      duration: halfW / ROW1_SPEED,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    })
    return () => c.stop()
  }, [rows, row1X])

  // Start row 2 loop once the DOM is measured
  useEffect(() => {
    if (!rows || !row2Ref.current) return
    const halfW = row2Ref.current.scrollWidth / 2
    if (!halfW) return
    const c = animate(row2X, -halfW, {
      duration: halfW / ROW2_SPEED,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    })
    return () => c.stop()
  }, [rows, row2X])

  return (
    <section className={`pt-6 pb-16 ${noBg ? '' : 'bg-white'}`}>
      <div className="relative space-y-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" />

        {rows ? (
          <>
            <ScrollRow cards={rows[0]} xMotion={row1X} motionRef={row1Ref} />
            <ScrollRow cards={rows[1]} xMotion={row2X} motionRef={row2Ref} />
          </>
        ) : (
          <>
            {[0, 1].map(row => (
              <div key={row} className="flex gap-4">
                {Array.from({ length: row === 0 ? 4 : 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 aspect-video rounded-2xl bg-black/[0.06] w-[calc(100vw-16px)] md:w-[calc((100vw-16px)/1.5)]"
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

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useMotionValue, animate, type MotionValue } from 'framer-motion'
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

// ~1.5 cards fill the full viewport width
const CARD_W = 'calc((100vw - 16px) / 1.5)'

// Scroll-based travel (same as the main showcase)
const ROW1_SCROLL_END = -14.3 // vw, moves left
const ROW2_SCROLL_END = 7     // vw, moves right

// Pre-scroll ambient drift: row 1 slowly moves left before user scrolls
const AUTO_DRIFT_DEST = -5   // vw
const AUTO_DRIFT_SECS = 8

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
              sizes="(max-width: 768px) 90vw, 65vw"
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

  // autoX drives the ambient left-drift before the user scrolls
  const autoX = useMotionValue(0)

  // Anchor progress=0 to page-load state (hero=75vh, section peeking at viewport bottom 25%).
  // "start 0.75" fires when section.top aligns with 75% down the viewport, which is exactly
  // where it sits on load when hero is 75vh tall.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.75', 'end start'],
  })

  // Row 1: ambient drift + scroll-based parallax combined
  const row1ScrollX = useTransform(scrollYProgress, [0, 1], [0, ROW1_SCROLL_END])
  const row1X = useTransform(
    [autoX, row1ScrollX] as MotionValue<number>[],
    ([auto, scroll]: number[]) => `${auto + scroll}vw`,
  )

  // Row 2: scroll-based only, moves right
  const row2X = useTransform(scrollYProgress, [0, 1], ['0vw', `${ROW2_SCROLL_END}vw`])

  useEffect(() => {
    // Slowly drift row 1 left; stop the moment the user starts scrolling
    const controls = animate(autoX, AUTO_DRIFT_DEST, {
      duration: AUTO_DRIFT_SECS,
      ease: 'linear',
    })

    const onScroll = () => {
      if (window.scrollY > 10) {
        controls.stop()
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      controls.stop()
      window.removeEventListener('scroll', onScroll)
    }
  }, [autoX])

  useEffect(() => {
    setRows(buildRows(projects))
  }, [projects])

  return (
    <section ref={sectionRef} className="pt-6 pb-16 bg-white">
      <div className="relative space-y-4 overflow-hidden">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" />

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

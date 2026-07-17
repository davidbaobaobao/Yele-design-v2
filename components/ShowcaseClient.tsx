'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useMotionValue, type MotionValue, type Transition } from 'framer-motion'
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
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type CardData = { project: ShowcaseProject; image: string; key: string }

function makeCard(project: ShowcaseProject, rowSeed: number, i: number): CardData {
  const all = [project.main_image, ...parseImages(project.additional_images)].filter(Boolean)
  const image = all[Math.floor(Math.random() * all.length)]
  return { project, image, key: `${rowSeed}-${i}-${project.id}` }
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

const CARD_W_DESKTOP         = 'calc((100vw - 48px) / 3.5)'
const CARD_W_DESKTOP_BIG     = 'calc((100vw - 48px) / 2.2)'
const CARD_W_DESKTOP_GALLERY = 'calc((100vw - 48px) / 3.0)'
const CARD_W_MOBILE = 'calc(100vw - 16px)'

const ROW1_START = '0vw'
const ROW1_END   = '-14.3vw'
const ROW2_START = '0vw'
const ROW2_END   = '10vw'

function ScrollRow({ cards, xMotion, big }: { cards: CardData[]; xMotion: MotionValue<string>; big?: boolean }) {
  const cardW = big ? CARD_W_DESKTOP_BIG : CARD_W_DESKTOP
  return (
    <div className="overflow-hidden">
      <motion.div className="flex gap-4 w-max" style={{ x: xMotion }}>
        {cards.map((card, i) => (
          <div
            key={`${card.key}-${i}`}
            style={{ width: cardW }}
            className={`flex-shrink-0 relative rounded-2xl overflow-hidden group cursor-default ${big ? 'aspect-[3/2]' : 'aspect-video'}`}
          >
            <Image
              src={card.image}
              alt={`Web de ${card.project.name} — Yele`}
              fill
              sizes="(max-width: 640px) 95vw, 29vw"
              quality={75}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="absolute bottom-3 left-3 right-3 font-outfit font-medium text-white text-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 truncate">
              {card.project.name}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/* ── Desktop sticky-scroll gallery (fullScreen mode) ── */
function DesktopGallery({ rows, noBg }: { rows: [CardData[], CardData[]]; noBg?: boolean }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const travelMV   = useMotionValue(0)
  const [wrapperH, setWrapperH] = useState('250vh')

  useEffect(() => {
    const compute = () => {
      const vw     = window.innerWidth
      const cardW  = (vw - 48) / 3.0
      // Exact travel to reveal the last card at the right edge (5 cards × width + 4 gaps + 24px paddingLeft − viewport)
      const travel = Math.max(0, 5 * cardW + 88 - vw)
      travelMV.set(travel)
      setWrapperH(`${window.innerHeight + travel * 0.56}px`)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [travelMV])

  // Prevent fast trackpad/wheel flicks from jumping past the section
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const MAX_DELTA = 80
    function onWheel(e: WheelEvent) {
      // Never run on mobile — avoids any interaction with iOS scroll/media behaviour
      if (window.innerWidth < 768) return
      const rect = wrapper!.getBoundingClientRect()
      // Only active while the sticky animation is running (wrapper straddles the viewport)
      if (rect.top > 0 || rect.bottom < window.innerHeight) return
      if (Math.abs(e.deltaY) > MAX_DELTA) {
        e.preventDefault()
        window.scrollBy({ top: Math.sign(e.deltaY) * MAX_DELTA })
      }
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end end'] })
  const x  = useTransform([scrollYProgress, travelMV], ([p, t]: number[]) => -(p * t))
  const x2 = useTransform([scrollYProgress, travelMV], ([p, t]: number[]) => -(p * t) - t * 0.08)

  const gradFrom = noBg ? 'from-white' : 'from-[#F5F5F7]'

  return (
    <div ref={wrapperRef} style={{ height: wrapperH }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="relative space-y-4">
          <div className={`pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r ${gradFrom} to-transparent`} />
          <div className={`pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l ${gradFrom} to-transparent`} />
          {rows.map((rowCards, rowIdx) => (
            <div key={rowIdx} className="overflow-visible">
              <motion.div
                className="flex gap-4 w-max"
                style={{ x: rowIdx === 1 ? x2 : x, paddingLeft: '24px' }}
              >
                {rowCards.map((card, i) => (
                  <div
                    key={`${card.key}-${i}`}
                    style={{ width: CARD_W_DESKTOP_GALLERY }}
                    className="flex-shrink-0 aspect-video relative rounded-2xl overflow-hidden group cursor-default"
                  >
                    <Image
                      src={card.image}
                      alt={`Web de ${card.project.name} — Yele`}
                      fill
                      sizes="32vw"
                      quality={75}
                      loading="eager"
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <p className="absolute bottom-3 left-3 right-3 font-outfit font-medium text-white text-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 truncate">
                      {card.project.name}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Mobile sticky-scroll gallery ── */
function MobileGallery({ rows }: { rows: [CardData[], CardData[]] }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const travelMV = useMotionValue(0)
  const [wrapperH, setWrapperH] = useState('200vh')

  useEffect(() => {
    const compute = () => {
      const cardW = window.innerWidth - 16
      const gap   = 12
      const travel = 4 * (cardW + gap)
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
    ([p, t]: number[]) => -(p * t) - t * 0.08
  )

  return (
    <div ref={wrapperRef} style={{ height: wrapperH }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="relative space-y-3">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 z-10 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-white to-transparent" />
          {rows.map((rowCards, rowIdx) => (
            <div key={rowIdx} className="overflow-visible">
              <motion.div
                className="flex gap-3 w-max"
                style={{ x: rowIdx === 1 ? x2 : x, paddingLeft: '8px' }}
              >
                {rowCards.map((card, i) => (
                  <div
                    key={`${card.key}-${i}`}
                    style={{ width: CARD_W_MOBILE }}
                    className="flex-shrink-0 aspect-[4/3] relative rounded-2xl overflow-hidden group cursor-default"
                  >
                    <Image
                      src={card.image}
                      alt={`Web de ${card.project.name} — Yele`}
                      fill
                      sizes="95vw"
                      quality={75}
                      loading="eager"
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <p className="absolute bottom-3 left-3 right-3 font-outfit font-medium text-white text-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 truncate">
                      {card.project.name}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ShowcaseClient({ projects, noHeader, noBg, fullScreen }: { projects: ShowcaseProject[]; noHeader?: boolean; noBg?: boolean; fullScreen?: boolean }) {
  const { t } = useLang()
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
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' } as Transition}
      viewport={{ once: true, margin: '-80px' }}
    >
      <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-4">
        {t('Webs que hemos construido.', "Websites we've built.")}
      </h2>
      <p className="font-manrope text-[#6B7280] text-lg">
        {t('Para negocios reales', 'For real businesses.')}
      </p>
    </motion.div>
  )

  const seeAllLink = (
    <Link
      href="/ejemplos"
      className="inline-flex items-center gap-2 font-manrope font-medium text-sm text-[#6B7280] hover:text-[#1D1D1F] transition-colors"
    >
      {t('Ver todos los trabajos', 'See all work')} →
    </Link>
  )

  const gradFrom = noBg ? 'from-white' : 'from-[#F5F5F7]'

  return (
    <section ref={sectionRef} id={noHeader ? undefined : 'trabajos'} className={noBg ? '' : 'bg-white'}>
      {/* Desktop */}
      <div className={`hidden md:block ${noHeader ? (fullScreen ? '' : 'py-10') : 'py-32'}`}>
        {!noHeader && (
          <div className="max-w-6xl mx-auto px-6 mb-12">
            {heading}
          </div>
        )}

        {/* Sticky horizontal scroll on fullScreen; parallax on regular */}
        {fullScreen && rows ? (
          <DesktopGallery rows={rows} noBg={noBg} />
        ) : (
          <div className="relative space-y-4 overflow-hidden">
            <div className={`pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r ${gradFrom} to-transparent`} />
            <div className={`pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l ${gradFrom} to-transparent`} />
            {rows ? (
              <>
                <ScrollRow cards={rows[0]} xMotion={row1X} big={fullScreen} />
                <ScrollRow cards={rows[1]} xMotion={row2X} big={fullScreen} />
              </>
            ) : (
              <>
                {[0, 1].map(row => (
                  <div key={row} className="flex gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        style={{ width: fullScreen ? CARD_W_DESKTOP_BIG : CARD_W_DESKTOP }}
                        className={`flex-shrink-0 rounded-2xl bg-black/[0.06] ${fullScreen ? 'aspect-[3/2]' : 'aspect-video'}`}
                      />
                    ))}
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {!noHeader && (
          <div className="max-w-6xl mx-auto px-6 mt-8 text-center">
            {seeAllLink}
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        {!noHeader && (
          <div className="px-4 pt-10 pb-3">
            {heading}
          </div>
        )}
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
        {!noHeader && (
          <div className="px-4 py-3 text-center">
            {seeAllLink}
          </div>
        )}
      </div>
    </section>
  )
}

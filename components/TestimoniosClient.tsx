'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useLang } from '@/context/LanguageContext'

export type Testimonial = {
  author_name: string
  role: string
  body: string
  rating: number
}

// Ordered to align with FALLBACK entries in Testimonios.tsx
const AVATAR_POOL = [
  '/media/avatarreview/saraM.jpeg',
  '/media/avatarreview/carlos.jpeg',
  '/media/avatarreview/miguel.jpeg',
  '/media/avatarreview/davidB.jpeg',
  '/media/avatarreview/ruben.jpeg',
  '/media/avatarreview/Elaine.jpeg',
  '/media/avatarreview/Eustaquio.jpeg',
  '/media/avatarreview/Jorge.jpeg',
  '/media/avatarreview/saraL.jpeg',
]

const MAX_CHARS = 220

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 fill-[#FBBC05]" aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
  )
}

function ReviewCard({
  item,
  avatarSrc,
  t,
}: {
  item: Testimonial
  avatarSrc: string
  t: (es: string, en: string) => string
}) {
  const [expanded, setExpanded] = useState(false)
  const isLong   = item.body.length > MAX_CHARS
  const bodyText = isLong && !expanded ? item.body.slice(0, MAX_CHARS).trimEnd() + '…' : item.body

  return (
    <div
      className="flex-shrink-0 flex flex-col rounded-2xl p-6"
      style={{ width: 296, background: '#161616', minHeight: 260 }}
    >
      <p className="font-manrope text-[#555] text-[10px] tracking-[0.12em] uppercase mb-4">
        / Review
      </p>

      <p className="font-manrope text-white/80 text-[13px] leading-[1.7] flex-1">
        &ldquo;{bodyText}&rdquo;
        {isLong && (
          <button
            // stop pointer events from the rail's drag handler
            onPointerDown={e => e.stopPropagation()}
            onClick={() => setExpanded(v => !v)}
            className="text-[#e2482f] ml-1.5 text-[11px] font-semibold cursor-pointer hover:underline"
          >
            {expanded ? t('Ver menos', 'Collapse') : t('Ver más', 'Expand')}
          </button>
        )}
      </p>

      <div
        className="flex items-center justify-between mt-5 pt-5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src={avatarSrc}
            alt={item.author_name}
            width={36}
            height={36}
            className="rounded-full object-cover flex-shrink-0"
            style={{ width: 36, height: 36 }}
          />
          <div className="min-w-0">
            <p className="font-outfit font-medium text-white text-[13px] leading-tight truncate">
              {item.author_name}
            </p>
            <p className="font-manrope text-[#666] text-[11px] mt-0.5 truncate">
              {item.role}
            </p>
          </div>
        </div>

        <div className="flex gap-0.5 flex-shrink-0 ml-3">
          {Array.from({ length: Math.min(item.rating, 5) }).map((_, s) => (
            <StarIcon key={s} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TestimoniosClient({
  testimonials,
  // noBg kept for API compat but ignored — section is always dark
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  noBg: _noBg,
}: {
  testimonials: Testimonial[]
  noBg?: boolean
}) {
  const { t }     = useLang()
  const railRef   = useRef<HTMLDivElement>(null)
  const dragging  = useRef(false)
  const startX    = useRef(0)
  const startScroll = useRef(0)
  const velRef    = useRef(0)
  const lastX     = useRef(0)
  const rafId     = useRef<number>(0)
  const [grabbing, setGrabbing] = useState(false)

  const cancelMomentum = useCallback(() => cancelAnimationFrame(rafId.current), [])

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!railRef.current) return
    cancelMomentum()
    dragging.current  = true
    startX.current    = e.clientX
    lastX.current     = e.clientX
    startScroll.current = railRef.current.scrollLeft
    velRef.current    = 0
    setGrabbing(true)
    railRef.current.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current || !railRef.current) return
    const dx = e.clientX - startX.current
    railRef.current.scrollLeft = startScroll.current - dx
    velRef.current = e.clientX - lastX.current
    lastX.current  = e.clientX
  }

  function onPointerUp() {
    if (!dragging.current) return
    dragging.current = false
    setGrabbing(false)
    // Momentum glide
    let vel = -velRef.current * 1.4
    function glide() {
      if (!railRef.current || Math.abs(vel) < 0.5) return
      railRef.current.scrollLeft += vel
      vel *= 0.91
      rafId.current = requestAnimationFrame(glide)
    }
    glide()
  }

  useEffect(() => () => cancelAnimationFrame(rafId.current), [])

  return (
    <section className="bg-[#0a0a0a] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-white tracking-tight">
          {t('Lo que dicen nuestros clientes.', 'What our clients say.')}
        </h2>
      </div>

      {/* Drag-to-scroll card rail */}
      <div
        ref={railRef}
        className="flex gap-4 overflow-x-scroll hide-scrollbar"
        style={{
          paddingLeft:  24,
          paddingRight: 24,
          cursor: grabbing ? 'grabbing' : 'grab',
          WebkitOverflowScrolling: 'touch',
        } as React.CSSProperties}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {testimonials.map((item, i) => (
          <ReviewCard
            key={i}
            item={item}
            avatarSrc={AVATAR_POOL[i % AVATAR_POOL.length]}
            t={t}
          />
        ))}
        {/* Trailing spacer so last card clears the viewport edge */}
        <div className="flex-shrink-0 w-2" aria-hidden />
      </div>
    </section>
  )
}

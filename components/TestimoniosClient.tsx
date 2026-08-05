'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useLang } from '@/context/LanguageContext'

export type Testimonial = {
  author_name: string
  role: string
  body: string
  rating: number
}

// Default pool, cycled positionally for anyone not named below — this is
// what's actually shown when testimonials come from Supabase rather than
// the FALLBACK array, so their order can't be relied on to line up with a
// fixed position.
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

// Eustaquio<->Sara L. and Elaine<->Miguel are swapped from their "correct"
// avatar on purpose, per request. Matched by NAME (normalized: lowercased,
// periods stripped) rather than array position — testimonials can come
// from Supabase in whatever order the table returns them, which won't
// generally match FALLBACK's order, so a positional swap could silently
// swap the wrong two people's avatars instead. "sara l" (not just "sara")
// disambiguates from "Sara M.", the other Sara in the set.
const NAME_AVATAR_OVERRIDE: Record<string, string> = {
  eustaquio: '/media/avatarreview/saraL.jpeg',
  'sara l': '/media/avatarreview/Eustaquio.jpeg',
  elaine: '/media/avatarreview/miguel.jpeg',
  miguel: '/media/avatarreview/Elaine.jpeg',
}

function avatarFor(authorName: string, index: number) {
  // Strips both periods AND commas — live data has been seen as both
  // "Sara L." and "Sara, L", and only stripping periods left the comma
  // form ("sara, l") not matching the "sara l" key at all.
  const normalized = authorName.toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, ' ').trim()
  const override = Object.keys(NAME_AVATAR_OVERRIDE).find(key => normalized.startsWith(key))
  return override ? NAME_AVATAR_OVERRIDE[override] : AVATAR_POOL[index % AVATAR_POOL.length]
}

const MAX_CHARS = 280

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="#FBBC05" aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
  )
}

// Grey initials-circle — shown instead of a broken-image icon whenever an
// avatar file is missing/404s (onError below) or never had a photo to begin
// with. Sits inside the same grayscale(1)-filtered card as the real photos,
// so no separate desaturation is needed here.
function AvatarFallback({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <div
      aria-hidden="true"
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        flexShrink: 0,
        backgroundColor: '#3A3A3A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display), sans-serif',
        fontWeight: 500,
        fontSize: 16,
        color: '#DDD',
      }}
    >
      {initial}
    </div>
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
  const [avatarFailed, setAvatarFailed] = useState(false)
  const isLong   = item.body.length > MAX_CHARS
  const bodyText = isLong && !expanded ? item.body.slice(0, MAX_CHARS).trimEnd() + '…' : item.body

  return (
    // filter: grayscale(1) is a single post-processing pass over this
    // whole card's rendered subtree — it desaturates the avatar photo and
    // the (otherwise gold, #FBBC05) star icons together in one shot, for a
    // more realistic, less "AI stock photo" look.
    <div
      className="flex-shrink-0 flex flex-col rounded-2xl"
      style={{ width: 360, background: '#161616', minHeight: 340, padding: '28px 28px 24px', filter: 'grayscale(1)' }}
    >
      <p style={{ fontFamily: 'var(--font-body), sans-serif', color: '#555', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>
        / Review
      </p>

      <p style={{ fontFamily: 'var(--font-body), sans-serif', color: 'rgba(255,255,255,0.82)', fontSize: 14, lineHeight: 1.75, flex: 1, margin: 0 }}>
        &ldquo;{bodyText}&rdquo;
        {isLong && (
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={() => setExpanded(v => !v)}
            style={{ color: '#e2482f', marginLeft: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          >
            {expanded ? t('Ver menos', 'Collapse') : t('Ver más', 'Expand')}
          </button>
        )}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          {avatarFailed ? (
            <AvatarFallback name={item.author_name} />
          ) : (
            // Plain img — bypasses Next.js optimizer, loads directly from /public
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarSrc}
              alt={item.author_name}
              width={44}
              height={44}
              style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              onError={() => setAvatarFailed(true)}
            />
          )}
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: 'var(--font-display), sans-serif', fontWeight: 500, color: '#fff', fontSize: 14, lineHeight: 1.2, margin: 0 }}>
              {item.author_name}
            </p>
            <p style={{ fontFamily: 'var(--font-body), sans-serif', color: '#666', fontSize: 12, marginTop: 3, margin: '3px 0 0' }}>
              {item.role}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 2, flexShrink: 0, marginLeft: 12 }}>
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
  const { t }       = useLang()
  const railRef     = useRef<HTMLDivElement>(null)
  const dragging    = useRef(false)
  const startX      = useRef(0)
  const startScroll = useRef(0)
  const velRef      = useRef(0)
  const lastX       = useRef(0)
  const rafId       = useRef<number>(0)
  const [grabbing, setGrabbing] = useState(false)

  const cancelMomentum = useCallback(() => cancelAnimationFrame(rafId.current), [])

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!railRef.current) return
    cancelMomentum()
    dragging.current    = true
    startX.current      = e.clientX
    lastX.current       = e.clientX
    startScroll.current = railRef.current.scrollLeft
    velRef.current      = 0
    setGrabbing(true)
    railRef.current.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current || !railRef.current) return
    railRef.current.scrollLeft = startScroll.current - (e.clientX - startX.current)
    velRef.current = e.clientX - lastX.current
    lastX.current  = e.clientX
  }

  function onPointerUp() {
    if (!dragging.current) return
    dragging.current = false
    setGrabbing(false)
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
    <section data-nav-dark className="py-20 md:py-28" style={{ backgroundColor: '#0D0E12' }}>
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <h2 className="font-display font-semibold text-4xl md:text-5xl text-white tracking-tight">
          {t('Lo que dicen nuestros clientes.', 'What our clients say.')}
        </h2>
      </div>

      <div
        ref={railRef}
        className="flex gap-5 overflow-x-scroll hide-scrollbar"
        style={{
          paddingLeft:              24,
          paddingRight:             24,
          cursor:                   grabbing ? 'grabbing' : 'grab',
          WebkitOverflowScrolling:  'touch',
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
            avatarSrc={avatarFor(item.author_name, i)}
            t={t}
          />
        ))}
        <div className="flex-shrink-0 w-2" aria-hidden />
      </div>
    </section>
  )
}

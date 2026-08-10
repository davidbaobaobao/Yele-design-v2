'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { useIsMobile } from '@/hooks/useIsMobile'
import { TextGradient } from '@/components/ui/text-gradient'

const VIDEO_DIR = '/media/whysubs'
const POSTER = `${VIDEO_DIR}/whysubs_poster.jpg`

// Vertical gap (px) between adjacent reasons in the right-hand list — the
// unit the continuous scroll-driven offset is measured in.
const SLOT_HEIGHT = 108

const REASONS = [
  { title: 'Fixed monthly price', subtitle: 'One flat rate. No surprises, no end-of-month invoices.' },
  { title: 'Low entry barrier', subtitle: 'No big upfront cost. Start for as little as $99/month.' },
  { title: 'Cancel anytime', subtitle: 'No lock-in, no penalties. Stay because it works.' },
  { title: 'Constant maintenance', subtitle: 'Hosting, security and updates, handled continuously.' },
  { title: 'Constant improvement', subtitle: 'Your site keeps evolving — never outdated.' },
  { title: 'Constant support', subtitle: "We're here whenever you need us, 24/7." },
]

// ffmpeg -i wesubs.mp4 -vf "select=eq(n\,0)" -frames:v 1 whysubs_poster.jpg
// ffmpeg -i in.mp4 -vf "scale=1920:-2" -c:v libx264 -profile:v high -crf 24
//   -preset slow -pix_fmt yuv420p -movflags +faststart -an whysubs.mp4
// (+ webm sibling — came out smaller here, 252KB vs 868KB, so webm-first)
//
// ffmpeg -i whysubs.mp4 -vf "scale=640:-2" -c:v libx264 -profile:v main
//   -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart -an
//   whysubs_mobile.mp4 — 848KB desktop mp4 -> 60KB. iOS (Safari AND
//   Chrome-iOS, both WebKit) doesn't support webm at all; a media-query
//   <source> means mobile never even considers the webm/desktop-mp4
//   pair below — desktop's own source order/files are untouched since
//   the query never matches there.
function BgSources() {
  return (
    <>
      <source media="(max-width: 767px)" src={`${VIDEO_DIR}/whysubs_mobile.mp4`} type="video/mp4" />
      <source src={`${VIDEO_DIR}/whysubs.webm`} type="video/webm" />
      <source src={`${VIDEO_DIR}/whysubs.mp4`} type="video/mp4" />
    </>
  )
}

// One reason in the right-hand list. Every item is absolutely stacked at the
// SAME center point (its own natural/untransformed position); the shared
// scroll progress drives each one's OWN y/opacity/scale as a continuous
// function of its distance from the current focus index, so items smoothly
// fade and shrink as they approach or leave the center focus line — never a
// hard cut between "active" and "inactive".
function ReasonItem({ index, title, continuousIndex }: { index: number; title: string; continuousIndex: MotionValue<number> }) {
  const y = useTransform(continuousIndex, v => (index - v) * SLOT_HEIGHT)
  const opacity = useTransform(continuousIndex, v => Math.max(0, 1 - Math.abs(index - v) * 0.75))
  const scale = useTransform(continuousIndex, v => Math.max(0.75, 1 - Math.abs(index - v) * 0.18))

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-end md:justify-end"
      style={{ y, opacity, scale }}
    >
      <span
        className="font-display text-[clamp(1.5rem,3.6vw,3.25rem)] leading-none whitespace-nowrap text-right"
        style={{ color: '#F2F0EB' }}
      >
        {title}
      </span>
    </motion.div>
  )
}

export default function WhySubs() {
  const reduceMotion = !!useHydratedReducedMotion()
  const isMobile = useIsMobile()
  // The video's `poster` attribute has no near-view gate (meant to be
  // visible immediately) — set directly in SSR'd markup, a mobile
  // browser's native HTML parser fetches it before any JS (including the
  // isMobile check below) ever runs. Gating it on this — which, like
  // isMobile, starts false on both server and first client render — keeps
  // it out of that initial markup entirely; React 18 batches this effect
  // with useIsMobile's own from the same commit, so on mobile the
  // `if (isMobile) return null` below wins before this ever paints with a
  // real poster URL, while desktop only sees a few-ms-later attach.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  // Sits well below the fold (after Contact) — the video must not fetch on
  // initial load. `src` (via <BgSources/>) stays off entirely until the
  // section is close to view; same 600px rootMargin/pattern as
  // TryForFreeSection's nearView. preload="none" unconditionally (was
  // isMobile ? 'none' : 'auto' — but useIsMobile() starts false on both
  // server and first client render, so that eager-loaded on every device's
  // initial paint, not just desktop).
  const [nearView, setNearView] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // 0 -> reason 0 sits exactly at the center focus line (right at the top of
  // the pin), 1 -> the last reason does (right as the pin is about to
  // release) — evenly spaced in between, continuous (not stepped), so the
  // list glides rather than jumps.
  const continuousIndex = useTransform(scrollYProgress, v => v * (REASONS.length - 1))

  useEffect(() => {
    if (reduceMotion) return
    setActiveIndex(Math.round(continuousIndex.get()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion])

  useMotionValueEvent(continuousIndex, 'change', v => {
    const idx = Math.max(0, Math.min(REASONS.length - 1, Math.round(v)))
    setActiveIndex(prev => (prev === idx ? prev : idx))
  })

  useEffect(() => {
    if (reduceMotion) return
    const el = sectionRef.current
    if (!el || !('IntersectionObserver' in window)) {
      setNearView(true)
      return
    }
    const io = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setNearView(true)
          io.disconnect()
        }
      },
      { rootMargin: '600px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduceMotion])

  // Pause the bg video once the (very tall) section is nowhere near the
  // viewport — it's always visible while any part of the section is on
  // screen (that's the whole point of the pin), so no per-frame play/pause
  // logic is needed beyond this coarse on/off.
  useEffect(() => {
    if (reduceMotion) return
    const el = sectionRef.current
    const video = videoRef.current
    if (!el || !video) return

    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.muted = true

    const play = () => {
      video.muted = true
      if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) video.load()
      video.play().catch(() => {
        setTimeout(() => {
          if (video.paused || video.ended) {
            video.muted = true
            video.play().catch(err => console.warn('[video autoplay] rejected after retry:', err?.name, err?.message, video.currentSrc))
          }
        }, 300)
      })
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) play()
          else video.pause()
        })
      },
      { threshold: 0, rootMargin: '200px 0px' }
    )
    observer.observe(el)

    const onLoadedMetadata = () => {
      video.muted = true
      if (video.paused) play()
    }
    video.addEventListener('loadedmetadata', onLoadedMetadata)

    return () => {
      observer.disconnect()
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
    }
  }, [reduceMotion])

  // Mobile: disabled entirely — no list, no video/poster loaded. All hooks
  // above still run unconditionally (Rules of Hooks); with nothing
  // rendered, their refs stay null and their effects become no-ops. Takes
  // priority over the reduceMotion branch below (that one still shows a
  // static fallback on desktop; mobile shows nothing at all here).
  if (isMobile) return null

  const heading = (
    <h2 className="font-display text-left leading-tight text-[clamp(1.75rem,3.2vw,3rem)] max-w-md" style={{ color: '#F2F0EB' }}>
      Why subscription is <TextGradient as="span">better?</TextGradient>
    </h2>
  )

  // ---- Reduced motion: static list, no scroll-jack, no rotate — just the
  // reasons stacked plainly with the first subtitle shown. ----
  if (reduceMotion) {
    return (
      <section data-nav-dark className="relative overflow-hidden py-24 px-6" style={{ backgroundColor: '#0D0E12' }}>
        <div className="absolute inset-0">
          <img src={POSTER} alt="" className="absolute inset-0 w-full h-full object-cover" />
          {/* Dark wash so the video reads as background texture behind the
              now-white text, instead of the light wash this used when text
              was ink/black. */}
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(13, 14, 18, 0.75)' }} aria-hidden="true" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20">
          <div className="md:w-[40%] shrink-0">{heading}</div>
          <div className="flex-1 flex flex-col gap-6">
            <div className="border-t border-hairlineDark" aria-hidden="true" />
            {REASONS.map((r, i) => (
              <div key={r.title}>
                <p
                  className="font-display text-[clamp(1.25rem,2.4vw,1.75rem)] leading-tight"
                  style={{ color: i === 0 ? '#F2F0EB' : 'rgba(242, 240, 235, 0.4)' }}
                >
                  {r.title}
                </p>
                {i === 0 && (
                  <p className="relative z-10 font-body text-sm mt-1" style={{ color: '#F2F0EB' }}>
                    {r.subtitle}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} data-nav-dark className="relative" style={{ height: `${(REASONS.length + 1) * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={mounted ? POSTER : undefined}
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          {nearView && <BgSources />}
        </video>
        {/* Dark wash so the video reads as background texture behind the
            now-white text, instead of the light wash this used when text
            was ink/black. */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(13, 14, 18, 0.75)' }} aria-hidden="true" />

        {/* Heading and list are both absolutely positioned within the same
            full-height box (rather than sharing a flex row) so the list's
            own vertical center always lands on true 100vh center regardless
            of the heading's height at any breakpoint — a flex-col stack on
            mobile would otherwise shrink the list's available box and shift
            its focus line away from the heading's. */}
        <div className="relative z-10 h-full max-w-6xl mx-auto px-6">
          {/* LEFT — fixed, never moves while the section is pinned. */}
          <div className="absolute top-24 left-6 md:top-1/2 md:-translate-y-1/2 md:left-6 md:w-[40%]">{heading}</div>

          {/* RIGHT — the scrolling list. */}
          <div className="absolute inset-0">
            {REASONS.map((r, i) => (
              <ReasonItem key={r.title} index={i} title={r.title} continuousIndex={continuousIndex} />
            ))}
          </div>
        </div>

        {/* Subtitle — cross-fades with the active reason, no abrupt swap.
            Anchored near the bottom of the viewport rather than relative to
            the center focus line, so it never collides with a dimmed
            neighbor item sitting just below the active one in the list.
            Raised ~50px from the previous bottom-12/16 so it isn't so close
            to the bottom edge. */}
        <div className="absolute inset-x-0 bottom-[100px] md:bottom-[120px] z-20 max-w-6xl mx-auto px-6 flex flex-col items-end gap-4">
          <div className="w-full max-w-sm border-t border-white/10" aria-hidden="true" />
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-20 font-body text-sm md:text-base text-right max-w-sm"
              style={{ color: '#F2F0EB' }}
            >
              {REASONS[activeIndex].subtitle}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

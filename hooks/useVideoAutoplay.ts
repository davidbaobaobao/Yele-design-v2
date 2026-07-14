'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Reliable iOS autoplay for muted background videos.
 * - Sets playsinline + webkit-playsinline via DOM (JSX alone is not enough on iOS)
 * - Forces muted + defaultMuted via DOM (prevents unmuting on load())
 * - Calls play() explicitly (JSX `autoPlay` is not reliable on iOS Safari/Chrome)
 * - Retries on canplay event (covers iOS slow-load / cold start)
 * - Resumes after tab visibility change (iOS pauses videos when app backgrounds)
 * - Resumes on pageshow (iOS PWA / back-forward cache restore)
 */
export function useVideoAutoplay(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const v = ref.current
    if (!v) return

    // React JSX `muted` sets the DOM *property* but never writes the HTML *attribute*.
    // iOS Safari checks the attribute for autoplay eligibility — so we must set it explicitly.
    v.setAttribute('muted', '')
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    v.muted = true
    // defaultMuted keeps the video muted even if load() is called internally
    ;(v as HTMLVideoElement & { defaultMuted?: boolean }).defaultMuted = true

    const tryPlay = () => {
      v.muted = true
      v.play().catch(() => {})
    }

    // Try immediately, then retry when enough data is buffered (iOS cold start)
    tryPlay()
    v.addEventListener('canplay', tryPlay, { once: true })

    const onVisibility = () => { if (!document.hidden) tryPlay() }
    const onPageShow = (e: PageTransitionEvent) => { if (e.persisted) tryPlay() }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pageshow', onPageShow)

    return () => {
      v.removeEventListener('canplay', tryPlay)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pageshow', onPageShow as EventListener)
    }
  }, [ref])
}

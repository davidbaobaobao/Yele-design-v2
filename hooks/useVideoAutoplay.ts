'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Reliable iOS autoplay for muted background videos.
 * - Sets playsinline + webkit-playsinline via DOM (JSX alone is not enough on iOS)
 * - Forces muted via DOM property (React JSX `muted` prop doesn't set the DOM attribute)
 * - Calls play() explicitly (JSX `autoPlay` is not reliable on iOS Safari/Chrome)
 * - Resumes after tab visibility change (iOS pauses videos when app backgrounds)
 * - Resumes on pageshow (iOS PWA / back-forward cache restore)
 */
export function useVideoAutoplay(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const v = ref.current
    if (!v) return

    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    v.muted = true

    const tryPlay = () => {
      v.muted = true
      v.play().catch(() => {})
    }

    tryPlay()

    const onVisibility = () => { if (!document.hidden) tryPlay() }
    const onPageShow = (e: PageTransitionEvent) => { if (e.persisted) tryPlay() }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pageshow', onPageShow)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pageshow', onPageShow as EventListener)
    }
  }, [ref])
}

'use client'

import { useEffect, type RefObject } from 'react'

// Kicks a video into fetching (preload bumped to 'metadata' + an explicit
// .load() to actually invoke the browser's resource-selection algorithm —
// changing the `preload` attribute alone doesn't retrigger it once an
// element has already mounted) once its own element is within ~1.25
// viewport heights of the real viewport — well before the separate
// play-trigger observer (threshold 0.3, on-screen) fires. Safari is
// comparatively slow to fetch+decode; giving it this head start before
// it's actually asked to play is what keeps the poster-to-video handoff
// from reading as a grey flash once the card is scrolled to.
export function useEarlyLoad(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.preload = 'metadata'
        el.load()
        io.disconnect()
      },
      { rootMargin: `0px 0px ${Math.round(window.innerHeight * 1.25)}px 0px`, threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

'use client'

import { useEffect, type RefObject } from 'react'

export function useVideoAutoplay(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const v = ref.current
    if (!v) return

    // iOS Safari requires these as HTML attributes (not just DOM properties).
    v.setAttribute('muted', '')
    v.setAttribute('autoplay', '')
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    v.muted = true
    ;(v as HTMLVideoElement & { defaultMuted?: boolean }).defaultMuted = true

    function play() {
      if (!v || (!v.paused && !v.ended)) return
      v.muted = true
      if (v.ended) v.currentTime = 0
      // For preload="none" videos: kick off network load first.
      if (v.networkState === HTMLMediaElement.NETWORK_EMPTY) {
        v.load()
      }
      // iOS Safari can reject play() when data isn't buffered yet.
      // Retry once after a short delay so the load has time to start.
      v.play().catch(() => {
        setTimeout(() => {
          if (v && (v.paused || v.ended)) {
            v.muted = true
            v.play().catch(() => {})
          }
        }, 300)
      })
    }

    // Immediate attempt (works when video is already in viewport and cached)
    play()
    v.addEventListener('canplay',        play, { once: true })
    v.addEventListener('loadeddata',     play, { once: true })
    // Extra retry — Safari sometimes fires neither event reliably
    v.addEventListener('loadedmetadata', play, { once: true })

    // iOS Safari often ignores the `loop` attribute and fires `ended` instead.
    // Restart manually on every loop boundary to guarantee continuous play.
    v.addEventListener('ended', play)

    // Play when entering viewport; PAUSE when leaving.
    // Critical on iOS: only one muted video can truly play at a time.
    // Without pausing off-screen videos, iOS silently stops them all.
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            play()
          } else if (v && !v.paused) {
            v.pause()
          }
        })
      },
      { threshold: 0.5 }
    )
    observer.observe(v)

    // Recover from iOS background-tab suspend
    const onVisibility = () => { if (!document.hidden) play() }
    // Recover from bfcache restore (Safari back-swipe)
    const onPageShow = (e: PageTransitionEvent) => { if (e.persisted) play() }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pageshow', onPageShow)

    return () => {
      if (!v) return
      v.removeEventListener('canplay',        play)
      v.removeEventListener('loadeddata',     play)
      v.removeEventListener('loadedmetadata', play)
      v.removeEventListener('ended',          play)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pageshow', onPageShow as EventListener)
    }
  }, [ref])
}

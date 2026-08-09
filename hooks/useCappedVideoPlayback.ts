'use client'

import { useEffect, type RefObject } from 'react'
import { isSafariEngine } from '@/hooks/useIsSafari'

// Shared play/pause-on-intersection driver for card-grid videos (WhyYele,
// BeyondWebsite via FeatureCard, HowWeWork, WhatWeDo) — plays each video
// once it's >=30% visible, pauses otherwise, same as before. On Safari
// specifically, also caps how many can be simultaneously playing: WebKit's
// decoder has a real concurrent-decode ceiling that Chrome doesn't share,
// and asking it to start N videos at once (e.g. every card in a wide grid
// crossing the 30% threshold together) is what serializes into the
// one-by-one staggered start — Safari itself queues the excess, we're just
// doing it explicitly and promoting the next queued video the instant a
// slot frees up (another pauses or scrolls out) instead of leaving that to
// chance. Chrome/Firefox never hit the cap path at all.
export function useCappedVideoPlayback(
  videoRefs: RefObject<HTMLVideoElement | null>[],
  { reduceMotion, cap = 4 }: { reduceMotion: boolean; cap?: number }
) {
  useEffect(() => {
    if (reduceMotion) return
    const videos = videoRefs.map(r => r.current).filter((v): v is HTMLVideoElement => !!v)
    if (videos.length === 0) return

    const capPlays = isSafariEngine()
    const playing = new Set<HTMLVideoElement>()
    const pending = new Set<HTMLVideoElement>()

    videos.forEach(v => {
      v.setAttribute('muted', '')
      v.setAttribute('playsinline', '')
      v.setAttribute('webkit-playsinline', '')
      v.muted = true
    })

    const doPlay = (v: HTMLVideoElement) => {
      playing.add(v)
      if (!v.paused && !v.ended) return
      v.muted = true
      if (v.ended) v.currentTime = 0
      if (v.networkState === HTMLMediaElement.NETWORK_EMPTY) v.load()
      v.play().catch(() => {
        setTimeout(() => {
          if (v.paused || v.ended) {
            v.muted = true
            v.play().catch(err => console.warn('[video autoplay] rejected after retry:', err?.name, err?.message, v.currentSrc))
          }
        }, 300)
      })
    }

    const promoteNext = () => {
      if (!capPlays) return
      // Array.from rather than for-of over the Set directly — this
      // codebase's tsconfig target doesn't have downlevel Set iteration.
      for (const v of Array.from(pending)) {
        if (playing.size >= cap) break
        pending.delete(v)
        doPlay(v)
      }
    }

    const requestPlay = (v: HTMLVideoElement) => {
      pending.delete(v)
      if (!capPlays || playing.size < cap) doPlay(v)
      else pending.add(v)
    }

    const requestPause = (v: HTMLVideoElement) => {
      pending.delete(v)
      const wasPlaying = playing.delete(v)
      v.pause()
      if (wasPlaying) promoteNext()
    }

    const onEnded = (e: Event) => {
      const v = e.target as HTMLVideoElement
      playing.delete(v)
      requestPlay(v)
    }
    videos.forEach(v => v.addEventListener('ended', onEnded))

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const v = entry.target as HTMLVideoElement
          if (entry.isIntersecting) requestPlay(v)
          else requestPause(v)
        })
      },
      { threshold: 0.3 }
    )
    videos.forEach(v => observer.observe(v))

    return () => {
      observer.disconnect()
      videos.forEach(v => v.removeEventListener('ended', onEnded))
    }
    // videoRefs is an array of stable ref objects for the grid's lifetime
    // (same length/identity every render) — only .current targets matter,
    // read once above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, cap])
}

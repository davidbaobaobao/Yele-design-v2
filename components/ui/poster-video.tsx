'use client'

import { useEffect, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'

// Shared card-video poster/crossfade pattern — used by WhyYele/
// BeyondWebsite (via FeatureCard.tsx), HowWeWork.tsx, and WhatWeDo.tsx to
// fix the Safari "grey card" bug. The poster <img> renders underneath at
// all times; the <video> starts at opacity 0 and only crossfades in on the
// browser's own 'playing' event — the point it's ACTUALLY rendering
// frames, not just "loaded enough to maybe play soon" (canplay/loadeddata
// can fire before Safari has a decoded frame ready, which is exactly the
// grey gap this replaces). The native `poster` attribute is also still set
// on the video itself as a backstop for the sliver of time before
// hydration/JS runs. Once a video has played once, it's left visible even
// if later paused off-screen — its paused frame is fine to show, and
// reverting to the poster on every pause would flash back to frame 0.
//
// Takes `videoRef` as a plain prop rather than using forwardRef — this is
// an internal, single-use component (not a reusable library primitive
// consumers attach arbitrary refs/callback-refs to), and every caller
// already owns a real RefObject<HTMLVideoElement | null> it also passes
// to useEarlyLoad/useCappedVideoPlayback, so there's no forwarding need.
export default function PosterVideo({
  videoRef,
  poster,
  posterAlt,
  preload = 'none',
  className,
  style,
  children,
  resetKey,
}: {
  videoRef: RefObject<HTMLVideoElement | null>
  poster: string
  posterAlt: string
  preload?: 'none' | 'metadata' | 'auto'
  className?: string
  style?: CSSProperties
  children: ReactNode
  // Callers that swap the <source> under an already-mounted PosterVideo
  // (e.g. a slideshow reusing one <video> element across projects) pass a
  // value that changes with the source — the crossfade's `playing`-gated
  // reveal is otherwise sticky (see the file comment) and would keep
  // showing the outgoing video's last frame instead of falling back to
  // the new poster while the new source loads.
  resetKey?: string | number
}) {
  const [videoVisible, setVideoVisible] = useState(false)

  useEffect(() => {
    if (resetKey === undefined) return
    setVideoVisible(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- sits under a <video> at the exact same fixed box; no responsive-size negotiation needed. */}
      <img src={poster} alt={posterAlt} className={className} style={style} aria-hidden="true" />
      <video
        // TS quirk, not a real type gap: RefObject<HTMLVideoElement | null>
        // (this codebase's standard video-ref parameter type — see
        // useVideoAutoplay.ts) and React's own RefObject<HTMLVideoElement>
        // (what a native JSX `ref` attribute expects) resolve to the exact
        // same runtime shape, but TS's generic instantiation matching
        // doesn't unify them positionally. Safe cast.
        ref={videoRef as RefObject<HTMLVideoElement>}
        muted
        loop
        playsInline
        preload={preload}
        poster={poster}
        onPlaying={() => setVideoVisible(true)}
        className={className ? `${className} transition-opacity duration-300` : 'transition-opacity duration-300'}
        style={{ ...style, opacity: videoVisible ? 1 : 0 }}
        aria-hidden="true"
      >
        {children}
      </video>
    </>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useVideoAlwaysAutoplay } from '@/hooks/useVideoAlwaysAutoplay'

const VIDEO_DIR = '/media/tryforfree'
const POSTER = `${VIDEO_DIR}/tryforfree2_poster.jpg`

// ffmpeg -i tryforfree2.mp4 -vf "scale=1920:-2" -c:v libx264 -profile:v main
//   -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart -an
//   tryforfree2_hq.mp4 — source was a 14.9MB/19.4Mbps 1920x1440 export with
//   an unused audio track. mp4-only (webm sibling dropped): this section
//   sits below the fold, so shipping two formats meant paying for whichever
//   one the browser didn't need on top of deferring the load in the first
//   place.
const SRC = `${VIDEO_DIR}/tryforfree2_hq.mp4`

// Full-screen, video-only — no text/CTA of its own. id="tryforfree" is the
// top anchor FloatingStartFreeCTA measures to decide when to show the fixed
// pink pill (see that component for the full visibility range); moving this
// section's position in HomePage.tsx is all that's needed to move the
// pill's trigger point too, since that lookup is by id, not DOM order.
export default function TryForFreeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  // Sits well below the fold — the 2.6MB video must not be part of the
  // initial page load. `src` (and preload) stay off entirely until the
  // section is close to scrolling into view, so nothing is fetched before
  // then; a generous rootMargin gives it a head start so playback is
  // already underway by the time it's actually on screen.
  const [nearView, setNearView] = useState(false)

  useEffect(() => {
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
  }, [])

  useVideoAlwaysAutoplay(videoRef, nearView)

  return (
    <section id="tryforfree" ref={sectionRef} data-nav-dark className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
      <video
        ref={videoRef}
        src={nearView ? SRC : undefined}
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        preload={nearView ? 'auto' : 'none'}
        poster={POSTER}
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />
    </section>
  )
}

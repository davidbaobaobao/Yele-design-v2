'use client'

import { useEffect, useRef } from 'react'

// Small decorative card video for the Yele Care pillars. Poster shows
// instantly; the video is muted/loop/playsInline (iOS-safe) with an mp4
// fallback after the webm (Safari can't play webm), and only plays while
// in view (preload="none" + IntersectionObserver) so three of these don't
// weigh down the page.
export default function CareVideo({
  webm,
  mp4,
  poster,
}: {
  webm: string
  mp4: string
  poster: string
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    v.playsInline = true
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const p = v.play()
          if (p) p.catch(() => {})
        } else {
          v.pause()
        }
      },
      { rootMargin: '200px' }
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      className="w-full h-36 object-cover rounded-xl mb-4 bg-[#0D0E12]"
      aria-hidden="true"
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  )
}

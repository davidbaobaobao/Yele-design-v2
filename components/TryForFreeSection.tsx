'use client'

import { useRef } from 'react'
import { useVideoAlwaysAutoplay } from '@/hooks/useVideoAlwaysAutoplay'

const VIDEO_DIR = '/media/tryforfree'
const POSTER = `${VIDEO_DIR}/tryforfree_poster.jpg`

// ffmpeg -i tryforfree.mp4 -vf "scale=1920:-2" -c:v libx264 -profile:v high
//   -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart -an
//   tryforfree_hq.mp4 (+ webm sibling via libvpx-vp9) — source was an
//   8.2MB/14.3Mbps 1926x1440 export with an unused audio track.
function Sources() {
  return (
    <>
      <source src={`${VIDEO_DIR}/tryforfree_hq.webm`} type="video/webm" />
      <source src={`${VIDEO_DIR}/tryforfree_hq.mp4`} type="video/mp4" />
    </>
  )
}

// Full-screen, video-only — no text/CTA of its own. id="tryforfree" is the
// top anchor FloatingStartFreeCTA measures to decide when to show the fixed
// pink pill (see that component for the full visibility range); moving this
// section's position in HomePage.tsx is all that's needed to move the
// pill's trigger point too, since that lookup is by id, not DOM order.
export default function TryForFreeSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  useVideoAlwaysAutoplay(videoRef)

  return (
    <section id="tryforfree" data-nav-dark className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="auto"
        poster={POSTER}
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <Sources />
      </video>
    </section>
  )
}

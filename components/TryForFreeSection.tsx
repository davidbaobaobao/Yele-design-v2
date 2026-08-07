'use client'

import { useRef } from 'react'
import { useVideoAlwaysAutoplay } from '@/hooks/useVideoAlwaysAutoplay'
import { CTAButton } from '@/components/ui/cta-button'

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

// Full-screen video beat right before Pricing — id="tryforfree" is the top
// anchor FloatingStartFreeCTA measures to decide when to show the fixed
// pink pill (see that component for the full visibility range).
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

      <div className="absolute inset-0 bg-black/35 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h2
          className="font-display font-semibold leading-tight text-[clamp(1.75rem,4vw,3.5rem)]"
          style={{ color: '#F2F0EB' }}
        >
          Ready when you are.
        </h2>
        <p className="font-body mt-4 max-w-md text-base md:text-lg" style={{ color: 'rgba(242, 240, 235, 0.7)' }}>
          Start building your website today — no cost, no commitment.
        </p>
        <div className="mt-8">
          <CTAButton href="/registro" variant="pink">
            Start for free
          </CTAButton>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useRef } from 'react'
import { useVideoAutoplay } from '@/hooks/useVideoAutoplay'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { TypewriterWord } from '@/components/ui/typewriter-word'

const VIDEO_DIR = '/media/hero6'
const POSTER = `${VIDEO_DIR}/hero6_poster.jpg`
const WHITE = '#F2F0EB'

const WORDS = [
  'memorable',
  'professional',
  'trustworthy',
  'iconic',
  'streamlined',
  'smooth',
  'engaging',
  'balanced',
]

// ffmpeg -i hero6.mp4 -vf "scale=1280:-2" -c:v libx264 -profile:v main
//   -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart -an
//   hero6_lite.mp4 — source was a 24MB/20.7Mbps 2560x1440 export. mp4-only
//   (no webm sibling): shipping both formats downloads whichever the
//   browser doesn't need too, for no benefit on modern browsers that all
//   support H.264.
const SRC = `${VIDEO_DIR}/hero6_lite.mp4`

// Short video-background beat right before Pricing — same hero6 footage as
// the (since-reverted) hero redesign, same TypewriterWord component the
// hero itself uses (see components/ui/typewriter-word.tsx) so the rotating
// word is pixel-identical in behavior, just with this section's own word
// list. Unlike the hero, this section isn't always the first thing on
// screen, so it uses useVideoAutoplay's IntersectionObserver-gated
// play/pause (pauses off-screen) rather than useVideoAlwaysAutoplay.
export default function WebsiteWordsVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = !!useHydratedReducedMotion()

  useVideoAutoplay(videoRef)

  return (
    <section data-nav-dark className="relative h-[80vh] w-full overflow-hidden">
      <video
        ref={videoRef}
        src={SRC}
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        preload="metadata"
        poster={POSTER}
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />

      {/* Dark scrim over the whole frame so centered white/pink text stays
          readable regardless of what's playing behind it at any given
          moment. */}
      <div className="absolute inset-0 bg-black/35 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <h2 className="font-display leading-tight" style={{ fontSize: 'clamp(1.75rem, 4.5vw, 4rem)', color: WHITE }}>
          {/* Real, static text for SEO/a11y — the animated span below is
              purely decorative and hidden from assistive tech so its
              rapidly-changing partial-word states are never announced. */}
          <span className="sr-only">
            We make your website memorable, professional, trustworthy, iconic, streamlined, smooth, engaging, and balanced.
          </span>
          <span aria-hidden="true">
            We make your website
            <br />
            <TypewriterWord words={WORDS} reduceMotion={reduceMotion} />
          </span>
        </h2>
      </div>
    </section>
  )
}

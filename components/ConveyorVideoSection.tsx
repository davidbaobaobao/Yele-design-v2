'use client'

import { useEffect, useRef } from 'react'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { TypewriterWord } from '@/components/ui/typewriter-word'

// ffmpeg -i public/media/conveyor/conveyor.mp4 -vframes 1 -q:v 3 conveyor_poster.jpg
// then cwebp -q 70 conveyor_poster.jpg -o conveyor_poster.webp — first-frame
// poster so the section looks complete instantly, before the video itself
// has fetched/decoded anything.
const POSTER = '/media/conveyor_poster.webp'
// ffmpeg -i public/media/conveyor/conveyor.mp4 -c:v libx264 -profile:v main
//   -pix_fmt yuv420p -movflags +faststart -an -crf 25 -preset slow
//   -vf "scale=1920:-2" public/media/conveyor.mp4
// Source was a 2588x1440/9.2MB export; this real screen-recording (not a
// synthetic gradient) compresses far less than the site's other CRF-24-28
// clips at this resolution — 1.4MB, still comfortably "a few MB, not tens".
const VIDEO_SRC = '/media/conveyor.mp4'

const WORDS = ['Fast', 'Secure', 'Reliable', 'Responsive']

// Sits right after ContentShowcase (the animation section) — replaces the
// temporarily-disabled ConveyorCards WebGL embed at that exact spot (see
// the TODO that used to be in HomePage.tsx) with a recorded video of the
// same conveyor scene instead, avoiding a second live WebGL context on the
// page entirely.
export default function ConveyorVideoSection() {
  const reduceMotion = !!useHydratedReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)

  // Belt-and-suspenders alongside the `muted` attribute below — iOS Safari
  // has a long history of only reliably treating a video as muted (and so
  // eligible for autoplay) once the JS property is also set directly, not
  // just the HTML attribute.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true
  }, [])

  return (
    <section
      data-nav-dark
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: '#0D0E12' }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={POSTER}
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Same left→right scrim treatment as the hero — full-bleed footage
          behind left-aligned text needs it for legibility. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 60%)' }}
        aria-hidden="true"
      />

      {/* Top-edge fade into the dark section above — same #0D0E12, so the
          video's top edge blends in instead of cutting off hard against it. */}
      <div
        className="absolute inset-x-0 top-0 h-40 md:h-56 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #0D0E12 0%, rgba(13,14,18,0) 100%)' }}
        aria-hidden="true"
      />

      {/* Top-left anchored, same left inset as the hero's own text column;
          items-start (not the hero's items-center) + top padding to clear
          the fixed nav instead of vertically centering. Standard non-hero
          section-header size, not the hero's own larger scale. */}
      <div className="relative z-10 h-full flex items-start pt-28 md:pt-36 pl-8 sm:pl-16 md:pl-28 lg:pl-40 xl:pl-48 pr-6 md:pr-8 pointer-events-none">
        <h2 className="font-display leading-tight text-[clamp(1.5rem,2.6vw,2.75rem)]" style={{ color: '#F2F0EB' }}>
          <span className="sr-only">We make your website fast, secure, reliable, responsive.</span>
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

'use client'

import { useEffect, useRef } from 'react'
import { Check } from 'lucide-react'

const VIDEO_DIR = '/media/surveymedia'

interface VideoOptionCardProps {
  fileKey: string
  label: string
  caption: string
  selected: boolean
  onClick: () => void
}

// Same full-bleed tile recipe as ColorImageCard (sized by its grid cell via
// h-full, pink ring+glow when selected), swapped to a looping muted video
// instead of a static image, with a two-line caption (label + short
// explanation) in the bottom scrim. No visibility/lazy-play plumbing is
// needed here the way PersistentLeftVideo needs it: each survey step's 4
// cards only exist in the DOM while that step is the active one (the
// `{step === N && ...}` block that renders them), so navigating away
// unmounts these <video> elements automatically — there's nothing to pause
// manually, and nothing preloads before its step is actually visited.
export default function VideoOptionCard({ fileKey, label, caption, selected, onClick }: VideoOptionCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // The autoplay attribute alone is sometimes flaky on iOS Safari right
    // after mount — an explicit play() call is the standard belt-and-braces
    // fix, harmless where autoplay already worked.
    videoRef.current?.play().catch(() => {})
  }, [])

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative h-full w-full overflow-hidden rounded-2xl text-left transition-all duration-300 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D0E12] ${
        selected ? 'ring-[3px] ring-survey-bg shadow-[0_0_28px_rgba(212,111,200,0.65)]' : ''
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={`${VIDEO_DIR}/${fileKey}_poster.jpg`}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={`${VIDEO_DIR}/${fileKey}_hq.webm`} type="video/webm" />
        <source src={`${VIDEO_DIR}/${fileKey}_hq.mp4`} type="video/mp4" />
      </video>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-4 pb-3 pt-14">
        <div className="font-display text-base font-bold text-white md:text-lg">{label}</div>
        <div className="mt-0.5 text-xs text-white/80 md:text-sm">{caption}</div>
      </div>

      {selected && <div className="absolute inset-0 bg-ink/30" aria-hidden="true" />}

      <span
        className={`absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300 motion-reduce:transition-none ${
          selected ? 'border-survey-bg bg-survey-bg' : 'border-white/70 bg-black/25 backdrop-blur-sm'
        }`}
      >
        {selected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
      </span>
    </button>
  )
}

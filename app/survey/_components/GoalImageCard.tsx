'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

const IMAGE_DIR = '/media/surveymedia'
const EXT_CANDIDATES = ['webp', 'jpg', 'jpeg', 'png']

interface GoalImageCardProps {
  fileKey: string
  title: string
  description: string
  selected: boolean
  onClick: () => void
  className?: string
}

// Same image-tile recipe as ColorImageCard/VideoOptionCard (pink ring+glow
// selected state), but portrait-ish (aspect-[3/4]) rather than landscape —
// the "statement"/"sell" source photos are tall, and a 16:9 crop was losing
// most of them. Step 4 isn't one of the full-height immersive grids, just
// two cards side by side at FullLayout's normal size, so a fixed ratio
// reads better than stretching to an arbitrary flex height.
export default function GoalImageCard({ fileKey, title, description, selected, onClick, className = '' }: GoalImageCardProps) {
  const [extIndex, setExtIndex] = useState(0)
  const [failed, setFailed] = useState(false)
  const src = `${IMAGE_DIR}/${fileKey}.${EXT_CANDIDATES[extIndex]}`

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative aspect-[3/4] w-full overflow-hidden rounded-2xl text-left transition-all duration-300 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D0E12] ${
        selected ? 'ring-[3px] ring-survey-bg shadow-[0_0_28px_rgba(212,111,200,0.65)]' : ''
      } ${className}`}
    >
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center px-4" style={{ backgroundColor: '#1A1A1A' }}>
          <span className="font-display text-center text-lg font-bold text-white md:text-xl">{title}</span>
        </div>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- extension probed at runtime via onError */}
          <img
            src={src}
            alt={title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => {
              if (extIndex < EXT_CANDIDATES.length - 1) setExtIndex((i) => i + 1)
              else setFailed(true)
            }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-4 pb-4 pt-20">
            <div className="font-display text-lg font-extrabold text-white md:text-xl">{title}</div>
            <div className="mt-1 text-xs text-white/90 md:text-sm">{description}</div>
          </div>
        </>
      )}

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

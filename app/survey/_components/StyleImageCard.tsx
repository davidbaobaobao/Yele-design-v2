'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

const IMAGE_DIR = '/media/surveystyle'
// Tried in order — webp first if present, otherwise whatever's actually
// there. Each <img> probes independently (onError advances to the next
// candidate) so round 1 and round 2 of the same style can have different
// extensions, which they currently do (e.g. editorial1.jpg, editorial2.png).
const EXT_CANDIDATES = ['webp', 'jpg', 'jpeg', 'png']

interface StyleImageCardProps {
  fileKey: string
  round: 1 | 2
  label: string
  fallbackBg: string
  fallbackText: string
  selected: boolean
  onClick: () => void
}

// Full-bleed image tile with a bottom label scrim. If every extension 404s
// (image not uploaded yet), falls back to a flat color block evocative of
// the style with the label centered — the grid must still work before all
// 16 images exist.
export default function StyleImageCard({ fileKey, round, label, fallbackBg, fallbackText, selected, onClick }: StyleImageCardProps) {
  const [extIndex, setExtIndex] = useState(0)
  const [failed, setFailed] = useState(false)
  const src = `${IMAGE_DIR}/${fileKey}${round}.${EXT_CANDIDATES[extIndex]}`

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative aspect-[3/2] w-full overflow-hidden rounded-2xl text-left transition-all duration-300 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
        selected ? 'ring-4 ring-white' : ''
      }`}
    >
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center px-3" style={{ backgroundColor: fallbackBg }}>
          <span className="font-display text-center text-base font-bold" style={{ color: fallbackText }}>
            {label}
          </span>
        </div>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- extension probed at runtime via onError; next/image needs a known-good src up front */}
          <img
            src={src}
            alt={label}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => {
              if (extIndex < EXT_CANDIDATES.length - 1) setExtIndex((i) => i + 1)
              else setFailed(true)
            }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-3 pb-2.5 pt-8">
            <span className="font-body text-sm font-semibold text-white">{label}</span>
          </div>
        </>
      )}

      {selected && <div className="absolute inset-0 bg-ink/30" aria-hidden="true" />}

      <span
        className={`absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 motion-reduce:transition-none ${
          selected ? 'border-white bg-white' : 'border-white/70 bg-black/25 backdrop-blur-sm'
        }`}
      >
        {selected && <Check className="h-3.5 w-3.5 text-ink" strokeWidth={3} />}
      </span>
    </button>
  )
}

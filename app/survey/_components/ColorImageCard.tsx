'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

const IMAGE_DIR = '/media/surveycolors'

interface ColorImageCardProps {
  filename: string
  label: string
  fallbackBg: string
  fallbackText: string
  selected: boolean
  onClick: () => void
}

// Same full-bleed image-tile recipe as StyleImageCard, sized by its parent
// grid cell (h-full) rather than a fixed viewport height so it slots into
// the no-scroll 8-card grid. Filenames here are exact uploaded names (not a
// `{key}.ext` pattern), so no extension probing — just a graceful fallback
// to a flat color block if the file is ever missing. Selected state is
// brand-pink border + glow (this survey's original selection language)
// layered with the same dark wash used elsewhere, per spec — distinct from
// StyleImageCard's white-ring treatment.
export default function ColorImageCard({ filename, label, fallbackBg, fallbackText, selected, onClick }: ColorImageCardProps) {
  const [failed, setFailed] = useState(false)
  const src = `${IMAGE_DIR}/${filename}`

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative h-full w-full overflow-hidden rounded-2xl text-left transition-all duration-300 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D0E12] ${
        selected ? 'ring-[3px] ring-survey-bg shadow-[0_0_28px_rgba(212,111,200,0.65)]' : ''
      }`}
    >
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center px-4" style={{ backgroundColor: fallbackBg }}>
          <span className="font-display text-center text-lg font-bold md:text-xl" style={{ color: fallbackText }}>
            {label}
          </span>
        </div>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- fixed known filename, but still wants a graceful onError fallback */}
          <img
            src={src}
            alt={label}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setFailed(true)}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pb-3 pt-12">
            <span className="font-display text-base font-bold text-white md:text-lg">{label}</span>
          </div>
        </>
      )}

      {selected && <div className="absolute inset-0 bg-ink/35" aria-hidden="true" />}

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

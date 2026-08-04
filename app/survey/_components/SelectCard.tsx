'use client'

interface SelectCardProps {
  selected: boolean
  onClick: () => void
  title: string
  description?: string
  price?: string
  badge?: string
  swatch?: string[]
  className?: string
}

// White-on-pink card: unselected cards read as translucent white outlines on
// the flat pink background; selected flips to a solid dark fill so the
// (always-white) label stays legible in both states.
export default function SelectCard({
  selected,
  onClick,
  title,
  description,
  price,
  badge,
  swatch,
  className = '',
}: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative flex flex-col gap-3 rounded-2xl border-2 py-5 pl-5 pr-9 text-left transition-all duration-300 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
        selected
          ? 'border-ink bg-ink shadow-[0_8px_28px_rgba(0,0,0,0.35)]'
          : 'border-white/40 bg-white/10 hover:border-white/80 hover:bg-white/15'
      } ${className}`}
    >
      {swatch && (
        <div className="flex h-14 w-full overflow-hidden rounded-xl">
          {swatch.map((color, i) => (
            <span key={i} className="h-full flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-display text-base font-bold text-white">{title}</div>
          {price && <div className="mt-0.5 font-display text-sm font-bold text-white/90">{price}</div>}
          {description && <div className="mt-1 text-sm text-white/75">{description}</div>}
        </div>
        {badge && (
          <span className="shrink-0 whitespace-nowrap rounded-full border border-white/30 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white">
            {badge}
          </span>
        )}
      </div>
      <span
        className={`absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300 motion-reduce:transition-none ${
          selected ? 'border-white bg-white' : 'border-white/40 bg-transparent'
        }`}
      >
        {selected && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4.5L4 7.5L10 1" stroke="#16161A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  )
}

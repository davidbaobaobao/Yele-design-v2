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
  size?: 'default' | 'large'
}

// Light card by default (white surface, dark ink text) so it reads clearly
// against the pink background; flips to a solid black (#0D0E12) fill with
// white text once selected — the same "light → black" pattern used for
// plan, style, colour and goal cards.
export default function SelectCard({
  selected,
  onClick,
  title,
  description,
  price,
  badge,
  swatch,
  className = '',
  size = 'default',
}: SelectCardProps) {
  const large = size === 'large'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative flex flex-col gap-3 rounded-2xl border-2 text-left transition-all duration-300 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D0E12] ${
        large ? 'py-7 pl-6 pr-11' : 'py-5 pl-5 pr-9'
      } ${
        selected
          ? 'border-[#0D0E12] bg-[#0D0E12] shadow-[0_8px_28px_rgba(0,0,0,0.35)]'
          : 'border-ink/12 bg-white shadow-[0_2px_14px_rgba(0,0,0,0.10)] hover:border-survey-bg/60'
      } ${className}`}
    >
      {swatch && (
        <div className={`flex w-full overflow-hidden rounded-xl ${large ? 'h-28 md:h-36' : 'h-14'}`}>
          {swatch.map((color, i) => (
            <span key={i} className="h-full flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className={`font-display font-bold ${large ? 'text-xl md:text-2xl' : 'text-base'} ${selected ? 'text-white' : 'text-ink'}`}>
            {title}
          </div>
          {price && (
            <div className={`mt-0.5 font-display font-bold ${large ? 'text-base' : 'text-sm'} ${selected ? 'text-white/90' : 'text-ink/80'}`}>
              {price}
            </div>
          )}
          {description && (
            <div className={`mt-1 ${large ? 'text-base' : 'text-sm'} ${selected ? 'text-white/75' : 'text-ink/60'}`}>{description}</div>
          )}
        </div>
        {badge && (
          <span
            className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
              selected ? 'border-white/30 bg-white/10 text-white' : 'border-ink/20 bg-ink/5 text-ink'
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      <span
        className={`absolute flex items-center justify-center rounded-full border-2 transition-all duration-300 motion-reduce:transition-none ${
          large ? 'right-5 top-5 h-6 w-6' : 'right-4 top-4 h-5 w-5'
        } ${selected ? 'border-white bg-white' : 'border-ink/25 bg-transparent'}`}
      >
        {selected && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4.5L4 7.5L10 1" stroke="#0D0E12" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  )
}

'use client'

interface SelectCardProps {
  selected: boolean
  onClick: () => void
  title: string
  description?: string
  swatch?: string[]
  className?: string
}

export default function SelectCard({ selected, onClick, title, description, swatch, className = '' }: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative flex flex-col gap-3 rounded-2xl border-2 bg-white/90 p-5 text-left transition-all duration-300 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D46FC8] ${
        selected
          ? 'border-[#C7488F] shadow-[0_0_0_4px_rgba(212,111,200,0.25),0_8px_28px_rgba(199,72,143,0.35)]'
          : 'border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:border-[#D46FC8]/40'
      } ${className}`}
    >
      {swatch && (
        <div className="flex h-14 w-full overflow-hidden rounded-xl">
          {swatch.map((color, i) => (
            <span key={i} className="h-full flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>
      )}
      <div>
        <div className="font-display text-base font-bold text-ink">{title}</div>
        {description && <div className="mt-1 text-sm text-muted">{description}</div>}
      </div>
      <span
        className={`absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300 motion-reduce:transition-none ${
          selected ? 'border-[#C7488F] bg-[#C7488F]' : 'border-black/15 bg-white'
        }`}
      >
        {selected && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  )
}

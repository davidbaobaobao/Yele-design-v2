'use client'

export function FieldLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={`mb-2 block text-xs font-semibold uppercase tracking-wider text-white/80 ${className}`}>
      {children}
    </label>
  )
}

interface TextInputProps {
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  placeholder?: string
  type?: string
  autoFocus?: boolean
  onKeyDown?: (e: React.KeyboardEvent) => void
  className?: string
}

// White text on a translucent white fill — same recipe as the homepage's
// dark-section inputs (components/ContactForm.tsx's inputClass), just tuned
// for a flat pink field instead of near-black.
export function TextInput({ value, onChange, onBlur, placeholder, type = 'text', autoFocus, onKeyDown, className = '' }: TextInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className={`w-full rounded-xl border-2 border-white/40 bg-white/10 px-4 py-3.5 font-body text-base text-white outline-none transition-colors duration-200 placeholder:text-white/50 focus:border-white ${className}`}
    />
  )
}

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: React.ReactNode
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm text-white">
      <span
        onClick={() => onChange(!checked)}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200 ${
          checked ? 'border-ink bg-ink' : 'border-white/50 bg-white/10'
        }`}
      >
        {checked && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span onClick={() => onChange(!checked)}>{label}</span>
    </label>
  )
}

export function Toggle({
  value,
  options,
  onChange,
}: {
  value: boolean
  options: [string, string]
  onChange: (v: boolean) => void
}) {
  return (
    <div className="inline-flex rounded-full border-2 border-white/40 bg-white/10 p-1">
      {options.map((label, i) => {
        const isActive = i === 0 ? value : !value
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(i === 0)}
            className={`rounded-full px-4 py-2 font-body text-sm font-semibold transition-colors duration-200 ${
              isActive ? 'bg-ink text-white' : 'text-white/80 hover:text-white'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export function Select({
  value,
  onChange,
  children,
  className = '',
}: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-xl border-2 border-white/40 bg-white/10 px-4 py-3.5 font-body text-base text-white outline-none transition-colors duration-200 focus:border-white [&>option]:text-ink ${className}`}
    >
      {children}
    </select>
  )
}

'use client'

// Field labels sit directly on the (light) survey-bg-soft panel, not on a
// dark card — treated like a mini question-title (ink), not "answer" text.
export function FieldLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={`mb-2 block text-xs font-semibold uppercase tracking-wider text-ink/70 ${className}`}>
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
  disabled?: boolean
}

// White card surface, dark ink text, subtle border, pink focus ring — reads
// as a plain form field regardless of which pink panel it sits on.
export function TextInput({ value, onChange, onBlur, placeholder, type = 'text', autoFocus, onKeyDown, className = '', disabled }: TextInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      autoFocus={autoFocus}
      disabled={disabled}
      className={`w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-3.5 font-body text-base text-ink outline-none transition-all duration-200 placeholder:text-muted focus:border-survey-bg focus:ring-4 focus:ring-survey-bg/25 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  )
}

interface TextareaProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoFocus?: boolean
  rows?: number
  className?: string
}

// Same surface/border/focus treatment as TextInput — deliberately has no
// onKeyDown/Enter-to-advance wiring, unlike TextInput: Enter in a multi-line
// field should insert a newline, not submit the step.
export function Textarea({ value, onChange, placeholder, autoFocus, rows = 4, className = '' }: TextareaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      rows={rows}
      className={`w-full resize-none rounded-xl border-2 border-ink/15 bg-white px-4 py-3.5 font-body text-base text-ink outline-none transition-all duration-200 placeholder:text-muted focus:border-survey-bg focus:ring-4 focus:ring-survey-bg/25 ${className}`}
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
    <label className="flex cursor-pointer items-start gap-3 text-sm text-ink/80">
      <span
        onClick={() => onChange(!checked)}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200 ${
          checked ? 'border-ink bg-ink' : 'border-ink/35 bg-ink/10'
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
    <div className="inline-flex rounded-full border-2 border-ink/25 bg-ink/40 p-1">
      {options.map((label, i) => {
        const isActive = i === 0 ? value : !value
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(i === 0)}
            className={`rounded-full px-4 py-2 font-body text-sm font-semibold transition-colors duration-200 ${
              isActive ? 'bg-ink text-white' : 'text-white/85 hover:text-white'
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
      className={`w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-3.5 font-body text-base text-ink outline-none transition-all duration-200 focus:border-survey-bg focus:ring-4 focus:ring-survey-bg/25 ${className}`}
    >
      {children}
    </select>
  )
}

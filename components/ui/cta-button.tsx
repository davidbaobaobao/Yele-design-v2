import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Shared "Start for free" pill: soft light/dark surface, subtle inner shadow
// for a 3D pill feel, and an irregular blurred pink glow bloom sitting behind
// it (offset/asymmetric rather than a perfectly centered halo, so it reads
// like ambient light rather than a UI ring). `variant` picks the surface —
// "light" (bone) reads best on dark sections, "dark" (near-black) on light
// sections, same as the rest of the site's own light/dark pairing.
const VARIANT_CLASS = {
  light: 'bg-[#F2F0EB] text-[#16161A] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-2px_5px_rgba(0,0,0,0.07)]',
  dark: 'bg-[#1A1A1F] text-[#F2F0EB] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-2px_5px_rgba(0,0,0,0.35)]',
} as const

type Variant = keyof typeof VARIANT_CLASS

const PILL_CLASS =
  'group relative inline-flex items-center justify-center gap-1.5 rounded-full cursor-pointer ' +
  'font-body text-sm font-medium px-6 py-3 whitespace-nowrap ' +
  'transition-all duration-300 ease-out ' +
  'shadow-[0_8px_36px_-6px_rgba(212,111,200,0.55)] hover:shadow-[0_14px_56px_-8px_rgba(212,111,200,0.85)] ' +
  'hover:-translate-y-0.5 active:translate-y-0 active:scale-95 active:shadow-[0_4px_16px_-6px_rgba(212,111,200,0.4)] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D46FC8]'

// Irregular/offset (not evenly inset) blurred pink bloom — bigger on one
// side than the other so it reads as ambient light spilling from behind the
// pill, not a centered ring. Intensifies (bigger, brighter, more blur) on
// hover; pointer-events-none so it never intercepts the click itself.
function Glow() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -z-10 rounded-full opacity-70 blur-xl transition-all duration-300 ease-out group-hover:opacity-100 group-hover:blur-2xl group-hover:scale-110"
      style={{
        top: '-20px',
        left: '-14px',
        right: '-30px',
        bottom: '-16px',
        background:
          'radial-gradient(60% 70% at 38% 35%, rgba(212,111,200,1) 0%, rgba(212,111,200,0.55) 55%, transparent 78%)',
      }}
    />
  )
}

type CommonProps = {
  variant?: Variant
  className?: string
  children: ReactNode
}

type LinkCTAProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
    href: string
    prefetch?: boolean
  }

type ButtonCTAProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined
  }

export type CTAButtonProps = LinkCTAProps | ButtonCTAProps

export function CTAButton({ variant = 'light', className, children, ...rest }: CTAButtonProps) {
  const pillClass = cn(PILL_CLASS, VARIANT_CLASS[variant], className)

  if ('href' in rest && rest.href) {
    const { href, prefetch, ...anchorRest } = rest as LinkCTAProps
    return (
      <Link href={href} prefetch={prefetch} className={pillClass} {...anchorRest}>
        <Glow />
        <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
      </Link>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stripped so it can't leak onto <button>
  const { href, ...buttonRest } = rest as ButtonCTAProps
  return (
    <button type="button" className={pillClass} {...buttonRest}>
      <Glow />
      <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
    </button>
  )
}

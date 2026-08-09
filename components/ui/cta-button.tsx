import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Shared "Start for free" pill: soft surface, subtle inner shadow for a 3D
// pill feel, and an irregular blurred pink glow bloom sitting behind it
// (offset/asymmetric rather than a perfectly centered halo, so it reads
// like ambient light rather than a UI ring). `variant` picks the surface —
// "light" (bone) reads best on dark sections, "dark" (near-black) on light
// sections, same as the rest of the site's own light/dark pairing; "pink"
// (brand #D46FC8) is the primary nav/hero CTA treatment — unlike light/dark,
// its surface IS the brand pink, with the same glow still bleeding out
// behind it as ambient light. hover just lifts the surface's own lightness
// a touch on every variant.
const VARIANT_CLASS = {
  light:
    'bg-[#F2F0EB] hover:bg-[#F8F7F4] text-[#16161A] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-2px_5px_rgba(0,0,0,0.07)]',
  dark: 'bg-[#1A1A1F] hover:bg-[#26262C] text-[#F2F0EB] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-2px_5px_rgba(0,0,0,0.35)]',
  pink: 'bg-[#D46FC8] hover:bg-[#DE85D2] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-2px_5px_rgba(0,0,0,0.15)]',
  // Pure white surface (not "light"'s warm bone tone) + a subtle grey hover —
  // used by the hero's primary CTA specifically, kept separate from "light"
  // so that variant's existing bone styling elsewhere on the site is
  // untouched.
  white:
    'bg-white hover:bg-[#F0F0F0] text-[#16161A] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-2px_5px_rgba(0,0,0,0.07)]',
  // Solid near-black, white text, no pink glow (see Glow below) — currently
  // just the nav's "Contact us". #1A1A1F rather than pure #000 so it stays
  // visible against the site's own near-black (#0D0E12) dark sections; the
  // thin light border reinforces the edge further on top of that.
  black:
    'bg-[#1A1A1F] hover:bg-[#26262C] text-white border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-2px_5px_rgba(0,0,0,0.35)]',
} as const

type Variant = keyof typeof VARIANT_CLASS

// No box-shadow (and so no pink) on the pill itself — the Glow span below is
// the sole source of the ambient pink light, kept fully separate from the
// button's own surface/fill.
const PILL_CLASS =
  'group relative inline-flex items-center justify-center gap-1.5 rounded-full cursor-pointer ' +
  'font-body text-sm font-medium px-6 py-3 whitespace-nowrap ' +
  'transition-all duration-300 ease-out ' +
  'hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D46FC8]'

// Irregular/offset (not evenly inset) blurred pink bloom — bigger on one
// side than the other so it reads as ambient light spilling from behind the
// pill, not a centered ring. Slowly drifts on its own via a CSS keyframe
// (transform: translate, ~4.5s loop — twice the speed of the old 9s — see
// cta-glow-drift in globals.css) and separately grows further (bigger
// inset spread + more blur, no transform property overlap with the drift
// animation) on hover. The resting footprint/opacity/blur is what used to
// be the HOVER state (it read as the right size); hover now grows past
// that rather than past the old, larger default. pointer-events-none so it
// never intercepts the click itself.
function Glow({ variant }: { variant: Variant }) {
  // The "white" pill (hero + nav CTA on dark sections) reads as a clean
  // white button — no pink bloom behind it. Its own VARIANT_CLASS shadow
  // is the only depth cue it gets. "black" (nav's "Contact us") is the same
  // deal — explicitly no pink shade/glow, by request.
  if (variant === 'white' || variant === 'black') return null
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute -z-10 rounded-full opacity-100 blur-2xl',
        'top-[-10px] left-[-7px] right-[-15px] bottom-[-8px]',
        'transition-[filter,top,left,right,bottom] duration-300 ease-out',
        'group-hover:blur-3xl group-hover:top-[-20px] group-hover:left-[-14px] group-hover:right-[-30px] group-hover:bottom-[-16px]',
        'motion-safe:animate-[cta-glow-drift_4.5s_ease-in-out_infinite]'
      )}
      style={{
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
        <Glow variant={variant} />
        <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
      </Link>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stripped so it can't leak onto <button>
  const { href, ...buttonRest } = rest as ButtonCTAProps
  return (
    <button type="button" className={pillClass} {...buttonRest}>
      <Glow variant={variant} />
      <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
    </button>
  )
}

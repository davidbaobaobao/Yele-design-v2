import Link from 'next/link'
import { Check } from 'lucide-react'
import PayButton from '@/components/received/PayButton'

const DARK = '#0D0E12'

const CARE_BENEFITS = [
  'Content updates whenever you need them',
  'A full website redesign every year',
  'Hosting, security, backups & uptime monitoring',
  'Ongoing maintenance, updates & bug fixes',
  'Support whenever you need it',
]

// Shared layout for /paylaunch, /paybusiness, /paypro — the final (remaining
// 50%) payment + Yele Care subscription (first month free). Left: copy + CTA.
// Right: compressed looping video panel.
export default function FinalPayLayout({
  plan,
  payAmount,
  careAmount,
  name = '',
  email = '',
  company = '',
}: {
  plan: 'launch' | 'business' | 'pro'
  payAmount: string
  careAmount: string
  name?: string
  email?: string
  company?: string
}) {
  return (
    <main style={{ backgroundColor: DARK }} className="min-h-[100svh]">
      <div className="mx-auto grid min-h-[100svh] max-w-6xl grid-cols-1 items-stretch gap-0 md:grid-cols-2">
        {/* LEFT — copy + CTA */}
        <div className="flex flex-col justify-center px-6 py-14 md:px-10 md:py-16">
          <Link href="/" className="mb-8 inline-flex items-center focus-visible:outline-none" aria-label="yele">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/logomedia/mainlogo.svg" alt="" width={102} height={32} className="h-7 w-auto" />
          </Link>

          <h1 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-[1.05] mb-4">
            Your website is ready.
          </h1>
          <p className="font-body text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-md">
            Your final version is ready to set it live.
            <br />
            From now, with <span className="text-[#D46FC8] font-medium">Yele Care</span>:
          </p>

          <ul className="space-y-2.5 mb-8">
            {CARE_BENEFITS.map(b => (
              <li key={b} className="flex items-start gap-2.5">
                <Check size={18} className="text-[#D46FC8] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="font-body text-sm md:text-base text-white/85">{b}</span>
              </li>
            ))}
          </ul>

          <div className="max-w-sm">
            <PayButton
              action="/api/final-checkout"
              plan={plan}
              name={name}
              email={email}
              company={company}
              label="Pay and subscribe"
              popular
            />
            <p className="mt-3 font-body text-sm text-white/55 leading-relaxed">
              You pay the remaining {payAmount} today to go live, and subscribe to Yele Care at {careAmount}/month —
              <span className="text-white/80"> your first month is free.</span>
            </p>
          </div>
        </div>

        {/* RIGHT — contained 16:9 video card (not cropped) */}
        <div className="flex items-center justify-center px-6 pb-14 md:px-10 md:py-16">
          <video
            className="w-full max-w-xl aspect-video rounded-2xl object-cover border border-white/10 shadow-2xl shadow-black/40"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/media/payhero_poster.jpg"
          >
            <source src="/media/payhero.webm" type="video/webm" />
            <source src="/media/payhero.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </main>
  )
}

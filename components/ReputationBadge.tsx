import Image from 'next/image'
import { Star } from 'lucide-react'

const AVATARS = ['/media/miniavatar/1.webp', '/media/miniavatar/2.webp', '/media/miniavatar/3.webp', '/media/miniavatar/4.webp']

// Shared across the homepage hero (components/Hero.tsx), /websites and
// /newwebsite — same overlapping pink-tinted avatars + white stars + copy
// everywhere so the trust signal stays consistent across landing pages.
export default function ReputationBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 justify-center sm:justify-start ${className}`}>
      <div className="flex items-center" aria-hidden="true">
        {AVATARS.map((src, i) => (
          <div
            key={src}
            className={`relative w-10 h-10 rounded-full ring-2 ring-[#D46FC8]/60 border border-white/20 overflow-hidden ${i > 0 ? '-ml-3' : ''}`}
          >
            <Image src={src} alt="" width={40} height={40} className="w-full h-full object-cover" />
            {/* Subtle brand-pink tint over the photo — soft-light keeps the
                underlying image visible instead of flattening it into a
                solid color like a normal opacity overlay would. */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ backgroundColor: '#D46FC8', opacity: 0.28, mixBlendMode: 'soft-light' }}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col leading-tight">
        <span className="flex gap-0.5 text-white" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} fill="#FFFFFF" strokeWidth={0} />
          ))}
        </span>
        <span className="font-body text-sm text-white/80">Delivered over 100+ projects</span>
      </div>
    </div>
  )
}

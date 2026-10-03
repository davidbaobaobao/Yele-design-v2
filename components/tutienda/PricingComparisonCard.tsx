// Cost-comparison card for the /tutienda hero — "Comparativa de costes".
// Refined glassmorphism aesthetic: Yele (dominant, soft-pink accent) vs
// Shopify, three sales-volume tiers. Data-driven rows, responsive (stacks on
// mobile with explicit Yele/Shopify labels), and accessible (list semantics,
// decorative dividers/arrow hidden from screen readers). No logos, no claims.
import type { CompareRow } from '@/lib/i18n/tutienda'

// Soft-pink pill for the savings badges.
const PINK_PILL = 'border border-[#D46FC8]/35 bg-[#D46FC8]/12 text-[#E8A9DE]'

function SavingBadge({ text }: { text: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-body text-[11px] font-semibold whitespace-nowrap ${PINK_PILL}`}>
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="flex-shrink-0">
        <path d="M6 1.5v9M6 10.5 2.5 7M6 10.5 9.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {text}
    </span>
  )
}

export default function PricingComparisonCard({
  title,
  rows,
}: {
  title: string
  rows: CompareRow[]
}) {
  return (
    <section
      aria-label="Yele vs Shopify"
      className="relative w-full overflow-hidden rounded-[26px] border border-white/15 bg-gradient-to-b from-white/[0.1] to-white/[0.03] backdrop-blur-2xl p-5 sm:p-6 md:p-7 shadow-[0_32px_80px_rgba(0,0,0,0.5)] ring-1 ring-inset ring-white/10"
    >
      {/* Shine — a soft highlight sweeping the top edge for the glass look. */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-28 bg-gradient-to-b from-white/15 to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-[#D46FC8]/20 blur-3xl" aria-hidden="true" />

      <h2 className="relative font-display font-semibold tracking-tight text-white/95" style={{ fontSize: 'clamp(1.1rem, 1.7vw, 1.35rem)' }}>
        {title}
      </h2>

      {/* Comparison header: Yele (dominant) · VS · Shopify */}
      <div className="relative mt-2.5 flex items-center gap-3">
        <span className="font-display font-bold text-white flex-shrink-0" style={{ fontSize: 'clamp(1.25rem, 1.9vw, 1.6rem)' }}>Yele</span>
        <span className="flex-1 h-px bg-white/12" aria-hidden="true" />
        <span className="font-body text-xs font-medium text-white/40" aria-hidden="true">VS</span>
        <span className="flex-1 h-px bg-white/12" aria-hidden="true" />
        <span className="font-display font-medium text-white/45 flex-shrink-0" style={{ fontSize: 'clamp(1.1rem, 1.7vw, 1.45rem)' }}>
          Shopify
        </span>
      </div>

      <ul className="relative mt-4 flex flex-col gap-2.5">
        {rows.map(r => (
          <li key={r.volume} className="rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3.5 transition-colors duration-200 hover:border-[#D46FC8]/30 hover:bg-white/[0.08]">
            <p className="font-body text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-white/40 mb-2">{r.volume}</p>
            {/* Yele price + savings badge (left) and Shopify price (right), one line. */}
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className="sr-only">Yele: </span>
                <span className="font-display font-semibold text-white leading-none" style={{ fontSize: 'clamp(1.3rem, 2.1vw, 1.7rem)' }}>
                  {r.yele}
                </span>
                <SavingBadge text={r.saving} />
              </div>
              <span className="font-display font-medium text-white/40 flex-shrink-0" style={{ fontSize: 'clamp(1.05rem, 1.7vw, 1.3rem)' }}>
                {r.shopify}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

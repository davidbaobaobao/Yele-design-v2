// Cost-comparison card for the /es/tutienda hero — "Comparativa de costes".
// Refined glassmorphism aesthetic: Yele (dominant, soft-pink accent) vs
// Shopify, three sales-volume tiers. Data-driven rows, responsive (stacks on
// mobile with explicit Yele/Shopify labels), and accessible (list semantics,
// decorative dividers/arrow hidden from screen readers). No logos, no claims.

type Row = { volume: string; yele: string; shopify: string; saving: string }

const ROWS: Row[] = [
  { volume: '5.000 € EN VENTAS/MES', yele: '99 €', shopify: '167 €', saving: '40,7 % menos' },
  { volume: '20.000 € EN VENTAS/MES', yele: '309 €', shopify: '572 €', saving: '46,0 % menos' },
  { volume: '50.000 € EN VENTAS/MES', yele: '729 €', shopify: '1.292 €', saving: '43,6 % menos' },
]

// Soft-pink pill, reused for the "Más rentable" tag and the savings badges.
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

export default function PricingComparisonCard() {
  return (
    <section
      aria-label="Comparativa de costes entre Yele y Shopify"
      className="relative w-full overflow-hidden rounded-[26px] border border-white/15 bg-gradient-to-b from-white/[0.1] to-white/[0.03] backdrop-blur-2xl p-5 sm:p-6 md:p-7 shadow-[0_32px_80px_rgba(0,0,0,0.5)] ring-1 ring-inset ring-white/10"
    >
      {/* Shine — a soft highlight sweeping the top edge for the glass look. */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-28 bg-gradient-to-b from-white/15 to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-[#D46FC8]/20 blur-3xl" aria-hidden="true" />

      <h2 className="relative font-display font-semibold tracking-tight text-white/95" style={{ fontSize: 'clamp(1.1rem, 1.7vw, 1.35rem)' }}>
        Comparativa de costes
      </h2>

      {/* Comparison header: Yele (dominant) + pill · VS · Shopify */}
      <div className="relative mt-2.5 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-display font-bold text-white" style={{ fontSize: 'clamp(1.25rem, 1.9vw, 1.6rem)' }}>Yele</span>
          <span className={`rounded-full px-2.5 py-0.5 font-body text-[10px] sm:text-[11px] font-semibold whitespace-nowrap ${PINK_PILL}`}>
            Más rentable
          </span>
        </div>
        <span className="hidden sm:block flex-1 h-px bg-white/12" aria-hidden="true" />
        <span className="font-body text-xs font-medium text-white/40" aria-hidden="true">VS</span>
        <span className="hidden sm:block flex-1 h-px bg-white/12" aria-hidden="true" />
        <span className="font-display font-medium text-white/45 flex-shrink-0 ml-auto sm:ml-0" style={{ fontSize: 'clamp(1.1rem, 1.7vw, 1.45rem)' }}>
          Shopify
        </span>
      </div>

      <ul className="relative mt-4 flex flex-col gap-2.5">
        {ROWS.map(r => (
          <li key={r.volume} className="rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3.5 transition-colors duration-200 hover:border-[#D46FC8]/30 hover:bg-white/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-center">
              {/* Left ~60%: volume + Yele price + saving badge */}
              <div className="sm:w-[60%]">
                <p className="font-body text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-white/40 mb-1.5">{r.volume}</p>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="sr-only">Yele: </span>
                  <span className="font-display font-semibold text-white leading-none" style={{ fontSize: 'clamp(1.3rem, 2.1vw, 1.75rem)' }}>
                    {r.yele}
                  </span>
                  <SavingBadge text={r.saving} />
                </div>
              </div>

              <span className="hidden sm:block w-px self-stretch bg-white/10 mx-5" aria-hidden="true" />

              {/* Right: Shopify price */}
              <div className="mt-2.5 sm:mt-0 flex-1 flex items-center justify-between sm:justify-end gap-2 border-t border-white/8 pt-2.5 sm:border-0 sm:pt-0">
                <span className="sm:hidden font-body text-[11px] uppercase tracking-wide text-white/40">Shopify</span>
                <span className="font-display font-medium text-white/45" style={{ fontSize: 'clamp(1.05rem, 1.7vw, 1.35rem)' }}>
                  {r.shopify}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

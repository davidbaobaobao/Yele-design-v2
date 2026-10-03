// Cost-comparison card for the /es/tutienda hero — "Comparativa de costes".
// Premium dark SaaS aesthetic: Yele (dominant, green accent) vs Shopify, three
// sales-volume tiers. Data-driven rows, responsive (stacks on mobile with
// explicit Yele/Shopify labels), and accessible (list semantics, decorative
// dividers/arrow hidden from screen readers). No logos, no extra claims.

type Row = { volume: string; yele: string; shopify: string; saving: string }

const ROWS: Row[] = [
  { volume: '5.000 € EN VENTAS/MES', yele: '99 €', shopify: '167 €', saving: '40,7 % menos' },
  { volume: '20.000 € EN VENTAS/MES', yele: '309 €', shopify: '572 €', saving: '46,0 % menos' },
  { volume: '50.000 € EN VENTAS/MES', yele: '729 €', shopify: '1.292 €', saving: '43,6 % menos' },
]

function SavingBadge({ text }: { text: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-[#40e77b]/40 bg-[#40e77b]/10 px-3 py-1 font-body text-xs md:text-sm font-semibold text-[#40e77b] whitespace-nowrap"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="flex-shrink-0">
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
      className="w-full rounded-[28px] border border-[#344152] bg-gradient-to-b from-[#17212c] to-[#0b1016] p-5 sm:p-7 md:p-8 shadow-[0_32px_80px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.04]"
    >
      <h2 className="font-display font-bold tracking-tight text-[#f7f8fa]" style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2rem)' }}>
        Comparativa de costes
      </h2>

      {/* Comparison header: Yele (dominant) + pill · VS · Shopify */}
      <div className="mt-3 flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span className="font-display font-bold text-[#f7f8fa]" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.25rem)' }}>Yele</span>
          <span className="rounded-full border border-[#40e77b]/50 px-2.5 py-1 font-body text-[11px] sm:text-xs font-semibold text-[#40e77b] whitespace-nowrap">
            Más rentable
          </span>
        </div>
        <span className="hidden sm:block flex-1 h-px bg-[#344152]" aria-hidden="true" />
        <span className="font-body text-sm font-medium text-[#a7b0c0]" aria-hidden="true">VS</span>
        <span className="hidden sm:block flex-1 h-px bg-[#344152]" aria-hidden="true" />
        <span className="font-display font-semibold text-[#a7b0c0] flex-shrink-0 ml-auto sm:ml-0" style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2rem)' }}>
          Shopify
        </span>
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {ROWS.map(r => (
          <li
            key={r.volume}
            className="rounded-[22px] border border-[#2a3645] bg-[#151e28] px-4 sm:px-5 py-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center">
              {/* Left ~60%: volume + Yele price + saving badge */}
              <div className="sm:w-[60%]">
                <p className="font-body text-[11px] sm:text-xs uppercase tracking-wide text-[#a7b0c0] mb-1.5">{r.volume}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="sr-only">Yele: </span>
                  <span className="font-display font-bold text-[#f7f8fa] leading-none" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)' }}>
                    {r.yele}
                  </span>
                  <SavingBadge text={r.saving} />
                </div>
              </div>

              <span className="hidden sm:block w-px self-stretch bg-[#2a3645] mx-5" aria-hidden="true" />

              {/* Right: Shopify price */}
              <div className="mt-3 sm:mt-0 flex-1 flex items-center justify-between sm:justify-end gap-2 border-t border-[#2a3645] pt-3 sm:border-0 sm:pt-0">
                <span className="sm:hidden font-body text-xs uppercase tracking-wide text-[#a7b0c0]">Shopify</span>
                <span className="font-display font-semibold text-[#a7b0c0]" style={{ fontSize: 'clamp(1.3rem, 2.4vw, 1.9rem)' }}>
                  {r.shopify}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-[#2a3645] pt-4">
        <p className="font-body text-[11px] sm:text-xs text-[#a7b0c0] leading-relaxed">
          Estimación sobre comisiones y cuota mensual. Shopify: plan equivalente por volumen.
        </p>
      </div>
    </section>
  )
}

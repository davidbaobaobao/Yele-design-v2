'use client'

// Pricing-card CTA on /letsbuild. On click it dispatches the plan value to
// the hero LeadForm (which listens, pre-selects the matching pill, and
// scrolls itself into view) — so choosing a tier takes you back up to the
// form with that plan already selected.
export default function PlanCTA({
  plan,
  label,
  className,
}: {
  plan: string
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('letsbuild:selectplan', { detail: plan }))}
      className={className}
    >
      {label}
    </button>
  )
}

// Below-fold "How it works" section shared by /websites and /newwebsite
// (identical copy on both) — dynamically imported by each page so this
// isn't part of the initial hero/form bundle those pages' LCP depends on.
const STEPS: { n: number; title: string; desc: string; pill: string }[] = [
  {
    n: 1,
    title: 'Tell us your direction',
    desc: "A 2-minute design survey (or a quick call if you'd rather talk).",
    pill: '~2 min',
  },
  {
    n: 2,
    title: 'We design',
    desc: "We design your first draft for your business. Then, from your feedback, we improve it until you're satisfied.",
    pill: '~1 week',
  },
  {
    n: 3,
    title: 'You approve',
    desc: "It goes live — and that's the day of your first payment. Nothing before.",
    pill: 'Days, not months',
  },
  {
    n: 4,
    title: 'We keep improving it',
    desc: 'Constant support and updates on design and functionality.',
    pill: '∞ Ongoing',
  },
]

export default function HowItWorks() {
  return (
    <section className="px-6 py-14 md:py-20 bg-white">
      <div className="max-w-md md:max-w-2xl mx-auto">
        <h2 className="font-display font-bold text-3xl text-ink text-center mb-10">How it works</h2>
        <div className="space-y-8">
          {STEPS.map(step => (
            <div key={step.n} className="flex gap-4">
              <span
                className="flex-shrink-0 w-11 h-11 rounded-full bg-[#D46FC8] text-white font-display font-bold text-lg flex items-center justify-center"
                aria-hidden="true"
              >
                {step.n}
              </span>
              <div className="flex-1 pt-1.5">
                <p className="font-display font-bold text-ink text-xl mb-1.5">{step.title}</p>
                <p className="font-body font-normal text-ink/80 text-lg leading-relaxed mb-3">{step.desc}</p>
                <span className="inline-block font-mono text-xs font-medium uppercase tracking-wide text-[#D46FC8] bg-[#D46FC8]/10 border border-[#D46FC8]/30 rounded-full px-3 py-1">
                  {step.pill}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

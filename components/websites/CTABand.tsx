// Below-fold "Ready to get started?" CTA band shared by /websites and
// /newwebsite (identical on both) — dynamically imported so this isn't
// part of the initial hero/form bundle.
export default function CTABand() {
  return (
    <section className="bg-white px-6 py-16 md:py-20 text-center">
      <h2 className="font-display font-bold text-3xl md:text-4xl text-ink mb-6">Ready to get started?</h2>
      <a
        href="#lead-form"
        className="inline-flex items-center justify-center font-body font-semibold text-lg bg-[#D46FC8] hover:bg-[#DE85D2] text-white px-10 py-4 rounded-full transition-colors"
      >
        Let&apos;s start
      </a>
    </section>
  )
}

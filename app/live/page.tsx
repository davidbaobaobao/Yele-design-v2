import Link from 'next/link'

export const metadata = {
  title: "You're live — Yele",
  robots: { index: false, follow: false },
}

export default function LivePage({ searchParams }: { searchParams: { name?: string } }) {
  const rawName = searchParams.name?.trim() ?? ''
  const name = rawName.split(/\s+/)[0]

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full text-center">
        <Link href="/" className="inline-flex items-center mb-10 focus-visible:outline-none" aria-label="yele">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG, Next's image optimizer refuses to serve those */}
          <img src="/media/logomedia/mainlogo.svg" alt="" className="h-8 w-auto mx-auto" />
        </Link>

        <h1 className="font-display font-bold text-4xl md:text-5xl text-ink tracking-tight leading-tight mb-3">
          {name ? <>You&apos;re all set, {name}. </> : <>You&apos;re all set. </>}
          <span className="inline-block motion-safe:animate-bounce">🚀</span>
        </h1>
        <p className="font-body text-muted text-lg leading-relaxed mb-2">
          Payment received and Yele Care is active — your first month is free.
        </p>
        <p className="font-body text-muted text-base leading-relaxed mb-10">
          We&apos;re setting your website live now. We&apos;ll be in touch shortly with the details.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-[#D46FC8] hover:bg-[#DE85D2] text-white px-8 py-3.5 font-body text-base font-medium transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}

import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-1.5 mb-10 focus-visible:outline-none">
          <span className="w-2 h-2 rounded-full bg-[#34C759]" aria-hidden="true" />
          <span className="font-outfit font-semibold text-sm text-[#1D1D1F]">
            yele<span className="text-[#86868B] font-normal">.design</span>
          </span>
        </Link>

        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-[#34C759]/10 flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="font-outfit font-semibold text-3xl text-[#1D1D1F] tracking-tight mb-3">
          ¡Solicitud enviada!
        </h1>
        <p className="font-manrope text-[#86868B] text-base leading-relaxed mb-3">
          Hemos recibido toda tu información. En breve nos ponemos en contacto contigo.
        </p>
        <p className="font-manrope text-[#86868B] text-sm leading-relaxed mb-8">
          Mientras tanto, puedes acceder a tu panel para ver el estado de tu web.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="https://app.yele.design"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-manrope font-medium text-sm bg-[#1D1D1F] text-white px-6 py-3.5 rounded-xl hover:bg-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
          >
            Ir a mi panel
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <Link
            href="/"
            className="font-manrope text-sm text-[#86868B] hover:text-[#1D1D1F] transition-colors py-2"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

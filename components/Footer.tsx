'use client'

import { useLang } from '@/context/LanguageContext'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="bg-[#1D1D1F] text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 pb-10 border-b border-white/10">
          {/* Left */}
          <div>
            <p className="font-outfit font-semibold text-2xl mb-2">Yele</p>
            <p className="font-manrope text-white/60 text-sm max-w-xs leading-relaxed">
              {t('Diseño web para negocios españoles.', 'Web design for Spanish businesses.')}
            </p>
            <a
              href="mailto:info@yele.design"
              className="font-manrope text-sm text-white/60 hover:text-white transition-colors mt-3 inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
            >
              info@yele.design
            </a>
          </div>

          {/* Right links */}
          <nav aria-label="Pie de página" className="flex flex-col gap-2">
            <a
              href="/aviso-legal"
              className="font-manrope text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
            >
              {t('Aviso Legal', 'Legal Notice')}
            </a>
            <a
              href="/politica-privacidad"
              className="font-manrope text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
            >
              {t('Política de Privacidad', 'Privacy Policy')}
            </a>
          </nav>
        </div>

        <p className="font-manrope text-xs text-white/40 mt-8">
          {t(
            '© 2026 Yele. Todos los derechos reservados.',
            '© 2026 Yele. All rights reserved.'
          )}
        </p>
      </div>
    </footer>
  )
}

import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { EsLangProvider } from '@/components/LangProvider'

export const metadata: Metadata = {
  title: 'Aviso Legal',
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://yele.design/es/legal-notice',
    languages: {
      en: 'https://yele.design/legal-notice',
      es: 'https://yele.design/es/legal-notice',
    },
  },
}

export default function AvisoLegal() {
  return (
    <EsLangProvider>
      <Navigation />
      <main id="main-content" className="pt-[72px]">
        <div className="max-w-[720px] mx-auto px-6 py-20">
          <p className="font-body text-xs text-muted mb-4 uppercase tracking-[0.12em]">Legal</p>
          <h1 className="font-display font-semibold text-4xl text-ink tracking-tight mb-3">
            Aviso Legal
          </h1>
          <p className="font-body text-muted text-sm mb-12">Última actualización: agosto de 2026</p>

          <div className="font-body text-ink space-y-8 leading-relaxed">
            <p className="text-muted">
              Yele es un estudio de diseño web con sede en España que presta servicio a clientes de todo el mundo —incluido Estados Unidos. Este Aviso Legal explica quién opera este sitio web y las condiciones bajo las que lo usas.
            </p>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">1. Titular del Sitio</h2>
              <p className="text-muted">
                En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSICE), los datos del titular del sitio son:
              </p>
              <ul className="mt-4 space-y-2 text-muted">
                <li><span className="text-ink font-medium">Nombre:</span> Yele Design</li>
                <li><span className="text-ink font-medium">Actividad:</span> Diseño, desarrollo y mantenimiento web a medida (desarrollo de pago único más el mantenimiento opcional Yele Care)</li>
                <li><span className="text-ink font-medium">Email de contacto:</span>{' '}
                  <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                    info@yele.design
                  </a>
                </li>
                <li><span className="text-ink font-medium">Sitio web:</span>{' '}
                  <a href="https://yele.design" className="text-[#0066CC] hover:underline" target="_blank" rel="noopener noreferrer">
                    yele.design
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">2. Objeto y Condiciones de Uso</h2>
              <p className="text-muted">
                Este Aviso Legal regula el acceso y el uso de yele.design. Al acceder al sitio, aceptas este aviso en su totalidad. Yele puede actualizarlo en cualquier momento, con efectos desde su publicación.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">3. Propiedad Intelectual e Industrial</h2>
              <p className="text-muted">
                Todo el contenido de este sitio web —textos, imágenes, gráficos, logotipos, iconos, vídeos y código fuente— pertenece a Yele o a sus licenciantes y está protegido por la legislación española, estadounidense e internacional de propiedad intelectual. No puedes reproducirlo, distribuirlo, comunicarlo públicamente ni modificarlo sin el permiso por escrito de Yele.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">4. Limitación de Responsabilidad</h2>
              <p className="text-muted">
                Yele no garantiza que el sitio esté disponible sin interrupciones ni libre de errores. En la máxima medida permitida por la ley, Yele no es responsable de los daños derivados de interrupciones del servicio, virus o accesos no autorizados que escapen a su control razonable.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">5. Privacidad y Cookies</h2>
              <p className="text-muted">
                El tratamiento de los datos personales se rige por nuestra{' '}
                <a href="/es/privacy-policy" className="text-[#0066CC] hover:underline">Política de Privacidad</a>.
                El uso de cookies y tecnologías de seguimiento se describe en nuestra{' '}
                <a href="/es/cookie-policy" className="text-[#0066CC] hover:underline">Política de Cookies</a>.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">6. Ley Aplicable</h2>
              <p className="text-muted">
                Este Aviso Legal se rige por la ley española. Cualquier disputa relativa al sitio web se someterá a los juzgados y tribunales competentes, sin perjuicio de los derechos imperativos de protección de los consumidores que te correspondan conforme a la legislación de tu lugar de residencia.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </EsLangProvider>
  )
}

import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Aviso Legal',
  robots: { index: false, follow: false },
}

export default function AvisoLegal() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="pt-[72px]">
        <div className="max-w-[720px] mx-auto px-6 py-20">
          <p className="font-body text-xs text-muted mb-4 uppercase tracking-[0.12em]">Legal</p>
          <h1 className="font-display font-semibold text-4xl text-ink tracking-tight mb-3">
            Aviso Legal
          </h1>
          <p className="font-body text-muted text-sm mb-12">Última actualización: julio de 2026</p>

          <div className="font-body text-ink space-y-8 leading-relaxed">
            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">1. Datos del titular</h2>
              <p className="text-muted">
                En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSICE), se informa de los datos identificativos del titular de este sitio web:
              </p>
              <ul className="mt-4 space-y-2 text-muted">
                <li><span className="text-ink font-medium">Denominación:</span> Yele</li>
                <li><span className="text-ink font-medium">Actividad:</span> Diseño y desarrollo de páginas web por suscripción</li>
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
              <h2 className="font-display font-semibold text-xl text-ink mb-3">2. Objeto y condiciones de uso</h2>
              <p className="text-muted">
                El presente aviso legal regula el acceso y uso del sitio web yele.design. El acceso al sitio implica la aceptación plena de este aviso. Yele se reserva el derecho a modificarlo en cualquier momento, con efectos desde su publicación en la web.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">3. Propiedad intelectual e industrial</h2>
              <p className="text-muted">
                Todos los contenidos del sitio web —incluyendo textos, imágenes, gráficos, logotipos, iconos, vídeos y código fuente— son propiedad de Yele o de sus licenciantes y están protegidos por la legislación española e internacional sobre propiedad intelectual e industrial. Queda expresamente prohibida su reproducción, distribución, comunicación pública o transformación sin autorización escrita del titular.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">4. Limitación de responsabilidad</h2>
              <p className="text-muted">
                Yele no garantiza la disponibilidad ininterrumpida del sitio ni la ausencia de errores en sus contenidos. No se hace responsable de los daños derivados de interrupciones del servicio, virus informáticos o accesos no autorizados ajenos a su control.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">5. Privacidad y cookies</h2>
              <p className="text-muted">
                El tratamiento de datos personales se rige por nuestra{' '}
                <a href="/politica-privacidad" className="text-[#0066CC] hover:underline">Política de Privacidad</a>.
                El uso de cookies se regula en nuestra{' '}
                <a href="/politica-cookies" className="text-[#0066CC] hover:underline">Política de Cookies</a>.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">6. Ley aplicable y jurisdicción</h2>
              <p className="text-muted">
                Este aviso legal se rige por la legislación española. Para cualquier controversia relacionada con el acceso o uso del sitio, las partes se someten a los juzgados y tribunales competentes de acuerdo con la normativa vigente, sin perjuicio de lo dispuesto en la normativa de protección de consumidores.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

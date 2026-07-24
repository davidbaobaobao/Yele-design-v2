import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  robots: { index: false, follow: false },
}

export default function PoliticaPrivacidad() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="pt-[72px]">
        <div className="max-w-[720px] mx-auto px-6 py-20">
          <p className="font-body text-xs text-muted mb-4 uppercase tracking-[0.12em]">Legal</p>
          <h1 className="font-display font-semibold text-4xl text-ink tracking-tight mb-3">
            Política de Privacidad
          </h1>
          <p className="font-body text-muted text-sm mb-12">Última actualización: julio de 2026</p>

          <div className="font-body text-ink space-y-8 leading-relaxed">
            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Responsable del tratamiento</h2>
              <ul className="space-y-2 text-muted">
                <li><span className="text-ink font-medium">Denominación:</span> Yele</li>
                <li><span className="text-ink font-medium">Email:</span>{' '}
                  <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                    info@yele.design
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Finalidad del tratamiento</h2>
              <p className="text-muted">
                Los datos personales que nos facilite a través del formulario de contacto o por correo electrónico se utilizarán exclusivamente para gestionar su solicitud y prestarle el servicio contratado. No se utilizarán para fines distintos a los indicados en el momento de su recogida.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Base de legitimación</h2>
              <p className="text-muted">
                El tratamiento de sus datos personales se basa en el consentimiento otorgado por el interesado al facilitarlos de forma voluntaria (Art. 6.1.a del Reglamento General de Protección de Datos — RGPD) y/o en la ejecución del contrato de prestación de servicios (Art. 6.1.b RGPD).
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Destinatarios y encargados del tratamiento</h2>
              <p className="text-muted mb-3">
                Los datos no se cederán a terceros salvo obligación legal. Utilizamos los siguientes proveedores técnicos, que actúan como encargados del tratamiento bajo acuerdos de protección de datos conformes al RGPD:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted ml-2">
                <li>
                  <span className="text-ink font-medium">Stripe, Inc.</span> — procesamiento de pagos y gestión de suscripciones. Certificación PCI-DSS nivel 1. Los datos de tarjeta son gestionados íntegramente por Stripe y nunca son almacenados por Yele.
                </li>
                <li>
                  <span className="text-ink font-medium">Supabase, Inc.</span> — almacenamiento de datos de usuario y autenticación. Los datos se alojan en servidores dentro de la Unión Europea.
                </li>
                <li>
                  <span className="text-ink font-medium">Vercel, Inc.</span> — alojamiento y entrega del sitio web.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Plazo de conservación</h2>
              <p className="text-muted">
                Los datos se conservarán durante el tiempo necesario para la prestación del servicio y, una vez finalizada la relación contractual, durante los plazos legalmente establecidos.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Derechos del interesado</h2>
              <p className="text-muted mb-3">
                Puede ejercer los siguientes derechos escribiendo a{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                  info@yele.design
                </a>:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-muted ml-2">
                <li>Acceso a sus datos personales</li>
                <li>Rectificación de datos inexactos</li>
                <li>Supresión de sus datos (&ldquo;derecho al olvido&rdquo;)</li>
                <li>Oposición al tratamiento</li>
                <li>Portabilidad de los datos</li>
                <li>Limitación del tratamiento</li>
              </ul>
              <p className="text-muted mt-3">
                Si considera que el tratamiento no es conforme al RGPD, tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Cookies</h2>
              <p className="text-muted">
                Este sitio web utiliza únicamente cookies técnicas necesarias para su correcto funcionamiento. No se utilizan cookies de análisis, publicidad ni seguimiento de terceros.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Política de Privacidad — Yele',
  description: 'Política de privacidad de Yele conforme al RGPD.',
}

export default function PoliticaPrivacidad() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="pt-[72px]">
        <div className="max-w-[720px] mx-auto px-6 py-20">
          <h1 className="font-outfit font-semibold text-4xl text-[#1D1D1F] tracking-tight mb-10">
            Política de Privacidad
          </h1>

          <div className="font-manrope text-[#1D1D1F] space-y-8 leading-relaxed">
            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">Responsable del tratamiento</h2>
              <ul className="space-y-2 text-[#86868B]">
                <li><span className="text-[#1D1D1F] font-medium">Denominación:</span> Yele</li>
                <li><span className="text-[#1D1D1F] font-medium">CIF/NIF:</span> [Añadir antes de publicar]</li>
                <li><span className="text-[#1D1D1F] font-medium">Domicilio:</span> [Añadir antes de publicar]</li>
                <li><span className="text-[#1D1D1F] font-medium">Email:</span>{' '}
                  <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                    info@yele.design
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">Finalidad del tratamiento</h2>
              <p className="text-[#86868B]">
                Los datos personales que nos facilite a través del formulario de contacto o por correo electrónico se utilizarán exclusivamente para gestionar su solicitud y prestarle el servicio contratado. No se utilizarán para fines distintos a los indicados en el momento de su recogida.
              </p>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">Base de legitimación</h2>
              <p className="text-[#86868B]">
                El tratamiento de sus datos personales se basa en el consentimiento otorgado por el interesado al facilitarlos de forma voluntaria (Art. 6.1.a del Reglamento General de Protección de Datos — RGPD) y/o en la ejecución del contrato de prestación de servicios (Art. 6.1.b RGPD).
              </p>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">Destinatarios</h2>
              <p className="text-[#86868B]">
                Los datos no se cederán a terceros salvo obligación legal. Podemos utilizar proveedores de servicios técnicos (como servicios de alojamiento web) que actúan como encargados del tratamiento bajo acuerdos de confidencialidad y cumpliendo el RGPD.
              </p>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">Plazo de conservación</h2>
              <p className="text-[#86868B]">
                Los datos se conservarán durante el tiempo necesario para la prestación del servicio y, una vez finalizada la relación contractual, durante los plazos legalmente establecidos.
              </p>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">Derechos del interesado</h2>
              <p className="text-[#86868B] mb-3">
                Puede ejercer los siguientes derechos escribiendo a{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                  info@yele.design
                </a>:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-[#86868B] ml-2">
                <li>Acceso a sus datos personales</li>
                <li>Rectificación de datos inexactos</li>
                <li>Supresión de sus datos (&ldquo;derecho al olvido&rdquo;)</li>
                <li>Oposición al tratamiento</li>
                <li>Portabilidad de los datos</li>
                <li>Limitación del tratamiento</li>
              </ul>
              <p className="text-[#86868B] mt-3">
                Si considera que el tratamiento no es conforme al RGPD, tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).
              </p>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">Cookies</h2>
              <p className="text-[#86868B]">
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

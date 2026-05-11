import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Condiciones de Uso — Yele',
  description: 'Condiciones generales del servicio de diseño web por suscripción de Yele.',
}

export default function CondicionesUso() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="pt-[72px]">
        <div className="max-w-[720px] mx-auto px-6 py-20">
          <p className="font-manrope text-xs text-[#86868B] mb-4 uppercase tracking-[0.12em]">Legal</p>
          <h1 className="font-outfit font-semibold text-4xl text-[#1D1D1F] tracking-tight mb-3">
            Condiciones de Uso
          </h1>
          <p className="font-manrope text-[#86868B] text-sm mb-12">Última actualización: mayo de 2026</p>

          <div className="font-manrope text-[#1D1D1F] space-y-10 leading-relaxed">

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">1. Objeto</h2>
              <p className="text-[#86868B]">
                Las presentes Condiciones de Uso regulan la contratación y uso del servicio de diseño web por suscripción ofrecido por Yele a través del sitio web yele.design. La contratación del servicio implica la aceptación plena e incondicional de estas condiciones.
              </p>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">2. Descripción del servicio</h2>
              <p className="text-[#86868B] mb-3">
                Yele ofrece un servicio de diseño, desarrollo y mantenimiento de páginas web bajo modalidad de suscripción mensual. El servicio incluye, según el plan contratado:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#86868B] ml-2">
                <li>Diseño y desarrollo de página web personalizada</li>
                <li>Entrega en un plazo de 3 a 5 días hábiles desde la aprobación del brief</li>
                <li>Alojamiento web y dominio durante la vigencia de la suscripción</li>
                <li>Mantenimiento técnico y actualizaciones de contenido</li>
                <li>Soporte por correo electrónico y WhatsApp</li>
              </ul>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">3. Contratación y registro</h2>
              <p className="text-[#86868B]">
                Para contratar el servicio, el cliente debe ser mayor de edad, actuar en nombre propio o con representación legal suficiente, y proporcionar información veraz y actualizada durante el proceso de registro. El cliente es responsable de mantener la confidencialidad de sus credenciales de acceso.
              </p>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">4. Precio y pago</h2>
              <p className="text-[#86868B] mb-3">
                El precio del servicio es el indicado en la página de precios en el momento de la contratación, expresado en euros e IVA incluido. El cobro se realiza de forma mensual mediante cargo automático a la tarjeta de crédito o débito del cliente, gestionado por Stripe, plataforma de pagos con certificación PCI-DSS de nivel 1.
              </p>
              <p className="text-[#86868B]">
                Yele se reserva el derecho a modificar los precios con un preaviso mínimo de 30 días por correo electrónico. El cliente podrá cancelar antes de que el nuevo precio entre en vigor.
              </p>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">5. Cancelación y baja</h2>
              <p className="text-[#86868B] mb-3">
                El servicio no tiene permanencia mínima. El cliente puede cancelar su suscripción en cualquier momento desde el panel de cliente o escribiendo a{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">info@yele.design</a>.
              </p>
              <p className="text-[#86868B]">
                La cancelación será efectiva al final del período de facturación en curso. No se realizarán reembolsos por períodos parciales ya facturados. Tras la baja, el sitio web dejará de estar activo y el cliente podrá solicitar la exportación de sus contenidos en un plazo de 30 días.
              </p>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">6. Obligaciones del cliente</h2>
              <p className="text-[#86868B] mb-3">El cliente se compromete a:</p>
              <ul className="list-disc list-inside space-y-2 text-[#86868B] ml-2">
                <li>Proporcionar los contenidos, imágenes y textos necesarios para el desarrollo del sitio en tiempo y forma.</li>
                <li>Utilizar el servicio conforme a la ley, la moral y el orden público.</li>
                <li>No publicar contenidos ilícitos, ofensivos, difamatorios o que infrinjan derechos de terceros.</li>
                <li>Mantener actualizada la información de pago para evitar interrupciones del servicio.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">7. Propiedad intelectual</h2>
              <p className="text-[#86868B] mb-3">
                Los contenidos aportados por el cliente (textos, imágenes, logotipos, etc.) son y seguirán siendo propiedad del cliente. El cliente garantiza que dispone de los derechos necesarios para su uso.
              </p>
              <p className="text-[#86868B]">
                El diseño, el código y los desarrollos técnicos realizados por Yele son propiedad de Yele durante la vigencia de la suscripción. Tras la cancelación, el cliente podrá solicitar la exportación de sus contenidos, pero no del código fuente desarrollado por Yele.
              </p>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">8. Limitación de responsabilidad</h2>
              <p className="text-[#86868B]">
                Yele no se hace responsable de las pérdidas de negocio, ingresos o datos derivadas del uso o la imposibilidad de uso del servicio. La responsabilidad máxima de Yele frente al cliente no podrá superar en ningún caso el importe abonado en el último mes de servicio.
              </p>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">9. Modificación de las condiciones</h2>
              <p className="text-[#86868B]">
                Yele se reserva el derecho a modificar estas Condiciones de Uso, notificando al cliente por correo electrónico con al menos 15 días de antelación. El uso continuado del servicio tras dicho plazo implicará la aceptación de las nuevas condiciones.
              </p>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">10. Ley aplicable y jurisdicción</h2>
              <p className="text-[#86868B]">
                Estas condiciones se rigen por la legislación española. Para cualquier controversia derivada de la prestación del servicio, las partes se someten a la jurisdicción de los juzgados y tribunales del domicilio del consumidor, conforme a lo establecido en la normativa de protección de consumidores y usuarios.
              </p>
            </section>

            <section className="pt-4 border-t border-black/[0.06]">
              <p className="text-[#86868B] text-sm">
                Para cualquier consulta sobre estas condiciones, puedes contactarnos en{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                  info@yele.design
                </a>.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

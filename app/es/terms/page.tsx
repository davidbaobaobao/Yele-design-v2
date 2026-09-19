import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { EsLangProvider } from '@/components/LangProvider'

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Condiciones generales del servicio de diseño web a medida de Yele — pago único desde 699€ más el mantenimiento opcional Yele Care desde 49€/mes.',
  alternates: {
    canonical: 'https://yele.design/es/terms',
    languages: {
      en: 'https://yele.design/terms',
      es: 'https://yele.design/es/terms',
    },
  },
}

export default function TerminosCondiciones() {
  return (
    <EsLangProvider>
      <Navigation />
      <main id="main-content" className="pt-[72px]">
        <div className="max-w-[720px] mx-auto px-6 py-20">
          <p className="font-body text-xs text-muted mb-4 uppercase tracking-[0.12em]">Legal</p>
          <h1 className="font-display font-semibold text-4xl text-ink tracking-tight mb-3">
            Términos y Condiciones
          </h1>
          <p className="font-body text-muted text-sm mb-12">Última actualización: agosto de 2026</p>

          <div className="font-body text-ink space-y-10 leading-relaxed">

            <p className="text-muted">
              Estos Términos regulan el uso del servicio de diseño y mantenimiento web prestado por Yele a través de yele.design. Al contratar el servicio, aceptas estos Términos en su totalidad.
            </p>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">1. Objeto</h2>
              <p className="text-muted">
                Estos Términos regulan la contratación y el uso del servicio de diseño, desarrollo y mantenimiento web de Yele.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">2. Descripción del Servicio</h2>
              <p className="text-muted">
                Yele diseña y construye una web a medida por un precio único y después la mantiene en funcionamiento con Yele Care, una suscripción de mantenimiento mensual opcional. Según tu plan, el desarrollo de pago único incluye el diseño y desarrollo web a medida, un objetivo de entrega de menos de cuatro semanas desde la aprobación del brief y las funciones que se indican en la Sección 3. Yele Care incluye alojamiento, seguridad, copias de seguridad, mantenimiento técnico, soporte, pequeñas actualizaciones de contenido y un rediseño completo de la web cada año. El soporte se presta por email y WhatsApp.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">3. Qué Incluye</h2>
              <p className="text-muted mb-3">
                El desarrollo de la web es un precio único. Los planes son los siguientes y forman parte de estos Términos:
              </p>
              <p className="text-muted mb-3">
                <strong className="text-ink font-medium">Launch (699€ pago único):</strong> diseño web a medida, optimización móvil, dominio propio, contacto y formularios, SEO e indexación en Google, y contenido profesional de imagen y vídeo para el sitio.
              </p>
              <p className="text-muted mb-3">
                <strong className="text-ink font-medium">Business (1.199€ pago único):</strong> todo lo de Launch, más reservas por calendario, aceptación de pagos, pequeño e-commerce, optimización de conversión, blog y analítica.
              </p>
              <p className="text-muted mb-3">
                <strong className="text-ink font-medium">Pro (desde 2.799€ pago único):</strong> todo lo de Business, más e-commerce de alto rendimiento, funcionalidad y paneles a medida, integraciones avanzadas, múltiples ubicaciones y flujos de trabajo complejos.
              </p>
              <p className="text-muted mb-3">
                <strong className="text-ink font-medium">Yele Care (49€/mes; 99€/mes para Pro):</strong> alojamiento, soporte de dominio, seguridad, copias de seguridad, mantenimiento técnico, soporte, pequeñas actualizaciones de contenido y un rediseño completo de la web cada año.
              </p>
              <p className="text-muted">
                Los servicios adicionales (creación de contenido continua, publicidad, herramientas de IA y automatizaciones) se presupuestan aparte y no forman parte del desarrollo web ni de Yele Care salvo que se indique expresamente.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">4. Precio y Pago</h2>
              <p className="text-muted mb-3">
                El desarrollo web tiene un precio único mostrado en nuestra página de precios en el momento de la contratación, exclusivo de los impuestos locales aplicables. Pagas el 50% para comenzar el proyecto y el 50% restante cuando la web está terminada y aprobada para su lanzamiento. Los pagos los procesa Stripe, un procesador certificado PCI-DSS Nivel 1.
              </p>
              <p className="text-muted">
                Yele Care, si se contrata, se factura mensual y automáticamente a tu tarjeta y se renueva cada mes hasta que canceles. Yele puede cambiar el precio de Yele Care con un preaviso mínimo de 30 días por email; puedes cancelar antes de que el nuevo precio entre en vigor.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">5. Yele Care, Cancelación y Reembolsos</h2>
              <p className="text-muted mb-3">
                Yele Care es opcional y no obligatorio, aunque lo recomendamos encarecidamente para que tu web siga alojada, segura, actualizada y rediseñada cada año. No hay permanencia mínima; puedes cancelar Yele Care en cualquier momento escribiendo a{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">info@yele.design</a>.
              </p>
              <p className="text-muted mb-3">
                Si dejas de pagar Yele Care, el alojamiento de tu web permanece activo durante un periodo de migración de 30 días para que puedas migrar y respaldar tu web y tu contenido. Transcurrido ese periodo, el alojamiento se interrumpe y el sitio puede quedar fuera de línea. Eres responsable de organizar un alojamiento alternativo antes de que finalice el periodo de migración.
              </p>
              <p className="text-muted">
                No emitimos reembolsos por el desarrollo de pago único una vez comenzado el trabajo, ni por periodos de Yele Care ya facturados.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">6. Obligaciones del Cliente</h2>
              <p className="text-muted mb-3">
                Te comprometes a: facilitar a tiempo el contenido, las imágenes y los textos necesarios para construir tu web; usar el servicio de forma lícita; no publicar contenido ilícito, ofensivo, difamatorio o que infrinja derechos; y mantener actualizada tu información de pago para evitar interrupciones.
              </p>
              <p className="text-muted">
                Si tu plan incluye e-commerce, eres el único responsable de los productos o servicios que vendes, sus descripciones y precios, la gestión de pedidos y los impuestos, así como de las leyes de consumo y de seguridad de producto aplicables.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">7. Propiedad Intelectual y Titularidad</h2>
              <p className="text-muted mb-3">
                El contenido que aportas (textos, imágenes, logotipos, etc.) sigue siendo tuyo, y confirmas que dispones de los derechos para usarlo. Una vez pagado íntegramente el desarrollo de pago único, eres titular del diseño web finalizado y de todas las imágenes y vídeos a medida que Yele produce para ti, y ostentas los derechos de autor sobre ese contenido —puedes conservarlo y usarlo libremente, incluso si más adelante cancelas Yele Care. Los frameworks, librerías, tipografías y herramientas genéricas de terceros empleadas para construir el sitio se mantienen bajo sus respectivas licencias.
              </p>
              <p className="text-muted">
                <strong className="text-ink font-medium">Dominio:</strong> Un dominio que aportes tú es tuyo en todo momento. Un dominio estándar que Yele registre por ti puede transferírtete cuando lo solicites, sujeto a la tarifa de transferencia que en su caso corresponda.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">8. Tu Contenido y Medios al Marcharte</h2>
              <p className="text-muted">
                Si dejas Yele Care, puedes —dentro del periodo de migración de 30 días descrito en la Sección 5— solicitar una exportación de la web, del contenido que aportaste y del diseño, imágenes y vídeos a medida que Yele creó para ti, entregados en formatos de archivo estándar y de uso común. Los datos de clientes, pedidos y productos de e-commerce no se incluyen en esta exportación.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">9. Exclusión de Garantías</h2>
              <p className="text-muted">
                El servicio se presta «tal cual» y «según disponibilidad». En la máxima medida permitida por la ley, Yele rechaza toda garantía, expresa o implícita, incluidas las de comerciabilidad, idoneidad para un fin concreto y funcionamiento ininterrumpido o sin errores.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">10. Limitación de Responsabilidad</h2>
              <p className="text-muted">
                Yele no es responsable de la pérdida de negocio, ingresos o datos derivada del uso o de la imposibilidad de uso del servicio. La responsabilidad total de Yele no excederá el importe que hayas pagado por el último mes de servicio.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">11. Indemnización</h2>
              <p className="text-muted">
                Te comprometes a indemnizar y mantener indemne a Yele frente a cualquier reclamación derivada del contenido que aportes, de los productos o servicios que vendas a través de tu sitio o del uso del servicio en incumplimiento de estos Términos o de la ley aplicable.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">12. Herramienta Web Police (yele.design/webpolice)</h2>
              <p className="text-muted mb-3">
                Yele ofrece una herramienta gratuita y satírica llamada «Web Police» que analiza el diseño de un sitio web que tú envías. La herramienta se ofrece <span className="text-ink font-medium">de forma gratuita, «tal cual» y con fines de entretenimiento e información únicamente</span>. Las puntuaciones, veredictos, «cargos» y comentarios que produce son <span className="text-ink font-medium">opinión subjetiva, parodia y sátira generadas de forma automática</span> —no constituyen una auditoría de diseño profesional, una certificación ni una afirmación de hechos sobre ningún sitio web, negocio o persona, y no debe confiarse en ellos como tales.
              </p>
              <p className="text-muted mb-3">
                Al enviar una dirección web a la herramienta confirmas que hacerlo no infringe ninguna ley ni derecho de terceros, y reconoces que Yele <span className="text-ink font-medium">almacena la URL enviada, una captura de la página de inicio pública, el análisis generado y los metadatos técnicos relacionados</span> en su base de datos, y puede conservarlos y usarlos para operar y mejorar la herramienta y los servicios de Yele y para estudiar tendencias de diseño web, según se describe en nuestra{' '}
                <a href="/es/privacy-policy" className="text-[#0066CC] hover:underline">Política de Privacidad</a>.
              </p>
              <p className="text-muted mb-3">
                Cuando el sitio enviado es la web de un negocio, Yele puede revisar los <span className="text-ink font-medium">datos de contacto profesionales públicos</span> del negocio y puede contactar con él, dentro del horario laboral habitual y conforme a la legislación aplicable, en relación con su web y los servicios de Yele. Cualquier destinatario puede oponerse en cualquier momento según se describe en la Política de Privacidad. Te comprometes a no usar la herramienta de forma ilícita, a no sobrecargarla ni abusar de ella, ni a enviar sitios con el fin de acosar, difamar o perjudicar a terceros.
              </p>
              <p className="text-muted">
                En la máxima medida permitida por la ley, Yele no asume responsabilidad alguna derivada del uso de la herramienta Web Police o de su resultado, ni de la confianza depositada en ellos.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">13. Cambios en estos Términos</h2>
              <p className="text-muted">
                Yele puede modificar estos Términos con un preaviso mínimo de 15 días por email. El uso continuado tras ese periodo constituye la aceptación de los Términos actualizados.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">14. Ley Aplicable</h2>
              <p className="text-muted">
                Estos Términos se rigen por la ley española. Cualquier disputa derivada del servicio se someterá a los juzgados y tribunales competentes, sin perjuicio de los derechos imperativos de protección de los consumidores que te correspondan conforme a la legislación de tu lugar de residencia. Yele opera internacionalmente y presta servicio a clientes, incluidos los de Estados Unidos.
              </p>
            </section>

            <section className="pt-4 border-t border-hairline">
              <p className="text-muted text-sm">
                Para cualquier consulta sobre estos Términos, escribe a{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                  info@yele.design
                </a>.
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </EsLangProvider>
  )
}

import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { EsLangProvider } from '@/components/LangProvider'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://yele.design/es/privacy-policy',
    languages: {
      en: 'https://yele.design/privacy-policy',
      es: 'https://yele.design/es/privacy-policy',
    },
  },
}

export default function PoliticaPrivacidad() {
  return (
    <EsLangProvider>
      <Navigation />
      <main id="main-content" className="pt-[72px]">
        <div className="max-w-[720px] mx-auto px-6 py-20">
          <p className="font-body text-xs text-muted mb-4 uppercase tracking-[0.12em]">Legal</p>
          <h1 className="font-display font-semibold text-4xl text-ink tracking-tight mb-3">
            Política de Privacidad
          </h1>
          <p className="font-body text-muted text-sm mb-12">Última actualización: agosto de 2026</p>

          <div className="font-body text-ink space-y-8 leading-relaxed">
            <p className="text-muted">
              Yele tiene su sede en España y presta servicio a clientes de todo el mundo, incluido Estados Unidos. Nos tomamos tu privacidad en serio y cumplimos el Reglamento General de Protección de Datos de la UE (RGPD). También respetamos los derechos que se describen a continuación para todas las personas usuarias, con independencia de dónde residan, y ofrecemos derechos específicos para residentes de EE. UU. y de California.
            </p>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Responsable del Tratamiento</h2>
              <ul className="space-y-2 text-muted">
                <li><span className="text-ink font-medium">Nombre:</span> Yele Design</li>
                <li><span className="text-ink font-medium">Email:</span>{' '}
                  <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                    info@yele.design
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Información que Recopilamos</h2>
              <p className="text-muted">
                Recopilamos la información que nos facilitas directamente —como tu nombre, email, datos de tu negocio y cualquier contenido que nos envíes a través del formulario de contacto, el asistente de chat, la herramienta de reserva o durante el proceso de alta— y la información que se recopila de forma automática cuando usas el sitio, como datos de uso, información del dispositivo y del navegador, e interacciones registradas por nuestras herramientas de analítica.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Cómo Usamos tu Información</h2>
              <p className="text-muted">
                Usamos tu información para responder a tus solicitudes, prestar y gestionar el servicio que contratas, procesar pagos, comunicarnos contigo, operar y mejorar nuestro sitio web y cumplir con obligaciones legales. No la usamos para fines ajenos a los aquí descritos.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Comunicaciones, Llamadas y Mensajes de Texto</h2>
              <p className="text-muted mb-3">
                Cuando envías un formulario y facilitas un número de teléfono, aceptas expresamente que Yele pueda contactarte en ese número en relación con tu consulta y el servicio —incluido mediante <span className="text-ink font-medium">tecnología automatizada, llamadas de voz generadas por inteligencia artificial (IA) o pregrabadas y mensajes de texto (SMS)</span>, así como por email y aplicaciones de mensajería como WhatsApp. Esto puede incluir un asistente de voz con IA que te llame para dar seguimiento a tu solicitud, resolver dudas y ayudarte a planificar tu proyecto.
              </p>
              <p className="text-muted mb-3">
                Tu consentimiento para recibir llamadas o mensajes automatizados o con IA <span className="text-ink font-medium">no es condición para contratar ningún producto o servicio</span>. La frecuencia de los mensajes puede variar y pueden aplicarse tarifas de mensajes y datos. Puedes darte de baja de las llamadas en cualquier momento diciéndolo durante una llamada o escribiendo a{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">info@yele.design</a>, y darte de baja de los SMS respondiendo <span className="text-ink font-medium">STOP</span> a cualquier mensaje (responde HELP para ayuda). Atenderemos las bajas con prontitud.
              </p>
              <p className="text-muted">
                No vendemos ni compartimos tu número de teléfono con terceros para su propio marketing. Las llamadas pueden grabarse con fines de calidad y formación cuando la ley lo permita.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">La Herramienta Web Police</h2>
              <p className="text-muted mb-3">
                «Web Police» es una herramienta gratuita y satírica, disponible en yele.design/webpolice, que analiza el diseño de un sitio web que tú envías. Cuando alguien envía una dirección web (URL) a la herramienta, tratamos y almacenamos: la URL, una captura de su página de inicio de acceso público, el análisis de diseño automatizado que generamos a partir de ella y metadatos técnicos de la petición (como un identificador truncado o derivado del dispositivo solicitante y el país aproximado). Conservamos estos envíos y análisis en nuestra base de datos para operar la herramienta, servir resultados repetidos sin volver a procesarlos, estudiar tendencias de diseño web y mejorar nuestros propios productos y servicios.
              </p>
              <p className="text-muted mb-3">
                Cuando el sitio enviado es la web de un <span className="text-ink font-medium">negocio</span>, normalmente muestra los <span className="text-ink font-medium">datos de contacto públicos</span> de ese negocio (por ejemplo, un nombre comercial, un teléfono de empresa público, un email de empresa público o enlaces a perfiles públicos en redes sociales). Podemos recopilar, almacenar y revisar esos datos de contacto profesionales públicos junto con nuestro análisis de diseño, y podemos usarlos para <span className="text-ink font-medium">contactar con el negocio en relación con su web y con nuestros servicios de diseño</span> (marketing directo entre empresas, B2B). Lo hacemos únicamente respecto de puntos de contacto profesionales o de organización, a través de los canales que el propio negocio ha hecho públicos —que pueden incluir email, teléfono, WhatsApp u otras apps de mensajería, SMS y cuentas públicas de redes sociales— y realizamos dicho contacto solo dentro del horario laboral local habitual y conforme a la legislación aplicable y a las condiciones de la plataforma utilizada.
              </p>
              <p className="text-muted mb-3">
                <span className="text-ink font-medium">Base jurídica.</span> Para operar la herramienta y para el contacto B2B nos basamos en nuestro <span className="text-ink font-medium">interés legítimo</span> (art. 6.1.f RGPD; véase el considerando 47, que reconoce el marketing directo como posible interés legítimo), ponderado frente a los derechos e intereses de las personas afectadas. Cuando un canal concreto exija por ley el consentimiento previo —por ejemplo, llamadas automatizadas o con IA/pregrabadas, SMS de marketing o email de marketing en las jurisdicciones que lo requieran— no usaremos ese canal sin el consentimiento exigido por la ley. No dirigimos deliberadamente nuestras comunicaciones a datos de contacto privados o personales de particulares, ni tratamos categorías especiales de datos.
              </p>
              <p className="text-muted mb-3">
                <span className="text-ink font-medium">Tus opciones y derecho de oposición.</span> Cualquier negocio (o persona) puede oponerse a este tratamiento y a cualquier acción de marketing directo en cualquier momento, sin necesidad de justificar el motivo (art. 21 RGPD). Para detener todo contacto, ser eliminado de nuestra lista y, si lo deseas, que se suprima el registro relacionado, escribe a{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">info@yele.design</a>; también puedes responder <span className="text-ink font-medium">STOP</span> a cualquier mensaje de texto o indicárnoslo durante cualquier llamada. Atendemos estas solicitudes con prontitud e incluimos el contacto en una lista de exclusión para no volver a contactar. Asimismo respetamos las listas de exclusión publicitaria aplicables (como la <span className="text-ink font-medium">Lista Robinson</span> en España).
              </p>
              <p className="text-muted">
                El análisis de diseño que produce Web Police es sátira y opinión subjetiva generada de forma automática; no es una auditoría profesional ni una afirmación de hechos sobre el negocio o su trabajo.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Base Jurídica (RGPD)</h2>
              <p className="text-muted">
                Tratamos los datos personales sobre la base de tu consentimiento (art. 6.1.a RGPD), la ejecución de nuestro contrato de servicio contigo (art. 6.1.b RGPD) y nuestro interés legítimo en operar y mejorar el servicio (art. 6.1.f RGPD).
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Analítica y Grabación de Sesiones</h2>
              <p className="text-muted">
                Usamos Microsoft Clarity para entender cómo se usa nuestro sitio y mejorarlo. Clarity recopila datos de uso —incluidas páginas vistas, clics, desplazamiento y grabaciones de sesión— y coloca cookies. Estos datos los trata Microsoft Corporation (Estados Unidos). Consulta la declaración de privacidad de Microsoft para más detalles. Si te encuentras en una región que exige consentimiento para este tipo de seguimiento, lo solicitamos mediante nuestro banner de cookies.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Proveedores de Servicios (Encargados del Tratamiento)</h2>
              <p className="text-muted mb-3">
                Compartimos datos solo con proveedores de confianza que los tratan por cuenta nuestra bajo acuerdos de protección de datos, y únicamente en lo necesario para prestar nuestro servicio:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted ml-2">
                <li><span className="text-ink font-medium">Stripe, Inc.</span> — procesamiento de pagos de las webs y de las suscripciones Yele Care (certificado PCI-DSS Nivel 1; los datos de tarjeta los gestiona Stripe y Yele nunca los almacena).</li>
                <li><span className="text-ink font-medium">Supabase, Inc.</span> — base de datos, almacenamiento y autenticación.</li>
                <li><span className="text-ink font-medium">Vercel, Inc.</span> — alojamiento y distribución del sitio web.</li>
                <li><span className="text-ink font-medium">Microsoft Corporation</span> — analítica y grabación de sesiones con Clarity.</li>
                <li><span className="text-ink font-medium">Groq, Inc.</span> — impulsa nuestro asistente de chat con IA; los mensajes que le envías se procesan en Groq para generar respuestas.</li>
                <li><span className="text-ink font-medium">Anthropic, PBC</span> — modelo de IA que genera el análisis de diseño de la herramienta Web Police a partir de la captura del sitio enviado.</li>
                <li><span className="text-ink font-medium">Resend</span> — emails transaccionales y de notificación.</li>
                <li><span className="text-ink font-medium">Cal.com, Inc.</span> — agenda y reserva de llamadas.</li>
              </ul>
              <p className="text-muted mt-3">No vendemos tu información personal.</p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Transferencias Internacionales de Datos</h2>
              <p className="text-muted">
                Dado que nosotros y nuestros proveedores operamos internacionalmente, tus datos pueden tratarse en la Unión Europea, Estados Unidos y otros países. Cuando los datos se transfieren fuera de la UE, aplicamos garantías adecuadas como las Cláusulas Contractuales Tipo de la UE.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Conservación de Datos</h2>
              <p className="text-muted">
                Conservamos los datos personales durante el tiempo necesario para prestar el servicio y, tras finalizar nuestra relación, durante los plazos exigidos por la ley.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Tus Derechos</h2>
              <p className="text-muted">
                Puedes solicitar el acceso, la rectificación, la supresión, la limitación o la oposición al tratamiento de tus datos, o solicitar una copia para su portabilidad, escribiendo a{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                  info@yele.design
                </a>. Si te encuentras en la UE/Reino Unido y consideras que no hemos tratado tus datos correctamente, puedes presentar una reclamación ante tu autoridad local de protección de datos o ante la Agencia Española de Protección de Datos (AEPD, www.aepd.es).
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Tus Derechos de Privacidad en California (CCPA/CPRA)</h2>
              <p className="text-muted">
                Si resides en California, tienes derecho a saber qué información personal recopilamos y cómo la usamos, a solicitar su supresión o corrección y a excluirte de la «venta» o «cesión» de información personal. No vendemos tu información personal. No serás objeto de discriminación por ejercer estos derechos. Para ejercerlos, escribe a{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                  info@yele.design
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Cookies</h2>
              <p className="text-muted">
                El uso de cookies y tecnologías similares —incluidas las de Microsoft Clarity— se describe en nuestra{' '}
                <a href="/es/cookie-policy" className="text-[#0066CC] hover:underline">Política de Cookies</a>.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Privacidad de los Menores</h2>
              <p className="text-muted">
                Nuestro servicio no se dirige a menores de 16 años y no recopilamos conscientemente sus datos personales. Si crees que un menor nos ha facilitado información, contáctanos y la eliminaremos.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Seguridad de los Datos</h2>
              <p className="text-muted">
                Aplicamos medidas técnicas y organizativas razonables para proteger tu información. Ningún método de transmisión o almacenamiento es completamente seguro, pero trabajamos para salvaguardar tus datos.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Cambios en esta Política</h2>
              <p className="text-muted">
                Podemos actualizar esta Política de Privacidad de vez en cuando. La fecha de «Última actualización» que figura arriba refleja la versión más reciente.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </EsLangProvider>
  )
}

import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { EsLangProvider } from '@/components/LangProvider'

export const metadata: Metadata = {
  title: 'Política de Cookies',
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://yele.design/es/cookie-policy',
    languages: {
      en: 'https://yele.design/cookie-policy',
      es: 'https://yele.design/es/cookie-policy',
    },
  },
}

export default function PoliticaCookies() {
  return (
    <EsLangProvider>
      <Navigation />
      <main id="main-content" className="pt-[72px]">
        <div className="max-w-[720px] mx-auto px-6 py-20">
          <p className="font-body text-xs text-muted mb-4 uppercase tracking-[0.12em]">Legal</p>
          <h1 className="font-display font-semibold text-4xl text-ink tracking-tight mb-3">
            Política de Cookies
          </h1>
          <p className="font-body text-muted text-sm mb-12">Última actualización: agosto de 2026</p>

          <div className="font-body text-ink space-y-8 leading-relaxed">
            <p className="text-muted">
              Esta Política de Cookies explica cómo Yele (yele.design) usa cookies y tecnologías similares cuando visitas nuestro sitio web. Debe leerse junto con nuestra{' '}
              <a href="/es/privacy-policy" className="text-[#0066CC] hover:underline">Política de Privacidad</a>.
            </p>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">¿Qué Son las Cookies?</h2>
              <p className="text-muted">
                Las cookies son pequeños archivos de texto que se colocan en tu dispositivo cuando visitas un sitio web. Se usan ampliamente para que las webs funcionen, para recordar tus preferencias y para facilitar información al titular del sitio. Tecnologías similares —como píxeles, etiquetas y almacenamiento local— cumplen funciones equivalentes, y aquí nos referimos a todas ellas como «cookies».
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Categorías de Cookies que Usamos</h2>

              <p className="text-muted mb-3">
                <span className="text-ink font-medium">Cookies estrictamente necesarias.</span> Imprescindibles para que el sitio funcione y para recordar tus preferencias de cookies. Están siempre activas y no requieren consentimiento. Sin ellas, algunas partes del sitio no funcionarían correctamente.
              </p>
              <p className="text-muted mb-3">
                <span className="text-ink font-medium">Cookies de analítica.</span> Nos ayudan a entender cómo se usa el sitio para mejorarlo. Usamos <span className="text-ink font-medium">Microsoft Clarity</span>, que recopila datos de uso como páginas vistas, clics, desplazamiento y grabaciones de sesión anonimizadas. Se colocan solo cuando está permitido y puedes desactivarlas en la configuración de cookies.
              </p>
              <p className="text-muted">
                <span className="text-ink font-medium">Cookies de marketing / publicidad.</span> Sirven para medir y mejorar nuestra publicidad y entender qué campañas nos traen visitantes. Pueden incluir el <span className="text-ink font-medium">píxel de Meta (Facebook)</span> y las herramientas de publicidad y medición de <span className="text-ink font-medium">Google</span>. Puedes desactivarlas en la configuración de cookies.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Tus Opciones y el Consentimiento</h2>
              <p className="text-muted mb-3">
                En tu primera visita mostramos un banner de cookies que te permite aceptar o rechazar las cookies no esenciales (analítica y marketing), o configurar tus preferencias por categoría. Puedes cambiar tu elección en cualquier momento desde el enlace de configuración de cookies de nuestro banner, o borrando las cookies en tu navegador.
              </p>
              <p className="text-muted">
                También puedes bloquear o eliminar cookies desde la configuración de tu navegador. Ten en cuenta que si bloqueas las cookies estrictamente necesarias, algunas partes del sitio podrían no funcionar correctamente.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Cookies de Terceros y Transferencias</h2>
              <p className="text-muted">
                Algunas cookies las colocan los proveedores externos mencionados arriba (por ejemplo Microsoft, Meta y Google), que pueden tratar datos fuera de la Unión Europea, incluido Estados Unidos, con garantías adecuadas como las Cláusulas Contractuales Tipo de la UE. El uso que hacen de los datos se rige por sus propias políticas de privacidad.
              </p>
            </section>

            <section>
              <h2 className="font-display font-semibold text-xl text-ink mb-3">Cambios en esta Política</h2>
              <p className="text-muted">
                Podemos actualizar esta Política de Cookies de vez en cuando. La fecha de «Última actualización» que figura arriba refleja la versión más reciente. ¿Dudas? Escribe a{' '}
                <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">info@yele.design</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </EsLangProvider>
  )
}

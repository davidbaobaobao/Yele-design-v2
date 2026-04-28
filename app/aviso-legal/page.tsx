import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Aviso Legal — Yele',
  description: 'Aviso legal de Yele, servicio de diseño web por suscripción.',
}

export default function AvisoLegal() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="pt-[72px]">
        <div className="max-w-[720px] mx-auto px-6 py-20">
          <h1 className="font-outfit font-semibold text-4xl text-[#1D1D1F] tracking-tight mb-10">
            Aviso Legal
          </h1>

          <div className="font-manrope text-[#1D1D1F] space-y-8 leading-relaxed">
            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">Datos del titular</h2>
              <p className="text-[#86868B]">
                En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSICE), se informa de los datos del titular del sitio web:
              </p>
              <ul className="mt-4 space-y-2 text-[#86868B]">
                <li><span className="text-[#1D1D1F] font-medium">Denominación:</span> Yele</li>
                <li><span className="text-[#1D1D1F] font-medium">CIF/NIF:</span> [Añadir antes de publicar]</li>
                <li><span className="text-[#1D1D1F] font-medium">Domicilio:</span> [Añadir antes de publicar]</li>
                <li><span className="text-[#1D1D1F] font-medium">Email:</span>{' '}
                  <a href="mailto:info@yele.design" className="text-[#0066CC] hover:underline">
                    info@yele.design
                  </a>
                </li>
                <li><span className="text-[#1D1D1F] font-medium">Web:</span>{' '}
                  <a href="https://yele.design" className="text-[#0066CC] hover:underline" target="_blank" rel="noopener noreferrer">
                    yele.design
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">Objeto</h2>
              <p className="text-[#86868B]">
                El presente aviso legal regula el uso del sitio web yele.design, cuya titularidad corresponde a Yele. La utilización del sitio web implica la aceptación plena y sin reservas de todas las disposiciones incluidas en este aviso legal. El titular se reserva el derecho a modificar su contenido en cualquier momento.
              </p>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">Propiedad intelectual</h2>
              <p className="text-[#86868B]">
                Todos los contenidos del sitio web, incluyendo textos, imágenes, gráficos, logotipos, iconos y código fuente, son propiedad de Yele o de sus proveedores de contenidos y están protegidos por la legislación española e internacional sobre propiedad intelectual e industrial. Queda expresamente prohibida su reproducción, distribución, comunicación pública o transformación sin autorización expresa y por escrito del titular.
              </p>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">Limitación de responsabilidad</h2>
              <p className="text-[#86868B]">
                Yele no se hace responsable de los daños y perjuicios derivados del uso del sitio web, de la imposibilidad de acceso al mismo, o de la presencia de virus u otros elementos lesivos en los contenidos o en los programas informáticos utilizados para su acceso y uso. El titular no garantiza que el sitio web esté disponible de forma ininterrumpida ni que el contenido esté libre de errores.
              </p>
            </section>

            <section>
              <h2 className="font-outfit font-semibold text-xl text-[#1D1D1F] mb-3">Ley aplicable y jurisdicción</h2>
              <p className="text-[#86868B]">
                Las presentes condiciones se rigen e interpretan conforme a la legislación española. Para la resolución de cualquier disputa derivada del acceso o uso de este sitio web, las partes se someten a los juzgados y tribunales competentes según la legislación vigente.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

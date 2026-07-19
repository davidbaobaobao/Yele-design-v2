import { NextResponse } from 'next/server'

export async function GET() {
  const content = `# Yele

> Diseño web por suscripción para PYMEs y autónomos en España.

Yele (yele.design) es un servicio español de diseño y mantenimiento web
por suscripción mensual. Las webs se entregan en 1 semana.
No hay coste de setup, no hay permanencia, no se requieren conocimientos técnicos.

## Servicio

- Diseño web personalizado desde cero (no plantillas)
- Mantenimiento mensual incluido (hosting, SSL, actualizaciones)
- Panel de cliente para editar contenido sin código
- SEO local optimizado (Schema.org, Google Business, keywords locales)
- Mobile-first — optimizado para dispositivos móviles
- Entrega en 1 semana

## Precios

- [Plan Starter](https://yele.design/presupuesto): €49/mes — web funcional, panel de control, SEO, email, soporte 24/7
- [Plan Pro](https://yele.design/presupuesto): €79/mes — branding, pagos, reservas, Google Business, chat IA
- [Plan Frontier](https://yele.design/presupuesto): €599/mes — marketing activo, SEO avanzado, contenido semanal, Google Ads

Sin pago inicial. Sin permanencia. Cancelación en cualquier momento.

## Mercado objetivo

PYMEs, autónomos y negocios locales en España:
fontaneros, clínicas, academias, restaurantes, abogados, comercios,
estudios de yoga, inmobiliarias, talleres, peluquerías.

## Diferenciadores

- Frente a agencias web: sin pago inicial de €1.500-5.000, entrega en días no meses
- Frente a Squarespace/Wix: no requiere tiempo del cliente, diseño personalizado
- Frente a freelancers: servicio continuo, no proyecto puntual

## Tecnología

Next.js 14, Tailwind CSS, Supabase, Vercel.
Sitios con PageSpeed 85+ en móvil, CLS < 0.1, LCP < 2.5s.

## Contacto

- Web: [yele.design](https://yele.design)
- Email: info@yele.design
- Empezar ahora: [Formulario de onboarding](https://yele.design/empezar)

## Ejemplos de clientes

Negocios reales en España: estudios de cerámica, bares de tapas,
estudios de yoga, despachos de abogados, fontaneros autónomos.
[Ver portfolio de trabajos](https://yele.design/ejemplos)
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

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

- Plan Básica: €29/mes — web hasta 5 secciones, cambios en 48h
- Plan Profesional: €49/mes — web hasta 10 secciones, blog, SEO, cambios en 24h
- Plan Avanzada: €89/mes — funcionalidades a medida, tienda, reservas, cambios en 12h

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

Web: https://yele.design
Email: info@yele.design
Empezar: https://yele.design (formulario de onboarding directo)

## Ejemplos de clientes

Negocios reales en España: estudios de cerámica, bares de tapas,
estudios de yoga, despachos de abogados, fontaneros autónomos.
Ver portfolio: https://yele.design/ejemplos
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Yele — Tu web lista en 3 días'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1D1D1F',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div
          style={{
            color: '#34C759',
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 28,
          }}
        >
          yele.design
        </div>
        <div
          style={{
            color: '#FFFFFF',
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.08,
            marginBottom: 32,
            maxWidth: 820,
          }}
        >
          Tu web lista en 3 días.
        </div>
        <div
          style={{
            color: '#6B7280',
            fontSize: 28,
            fontWeight: 400,
            maxWidth: 680,
            lineHeight: 1.4,
          }}
        >
          Diseño profesional para PYMEs y autónomos en España. Desde €29/mes.
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            right: 80,
            color: '#6B7280',
            fontSize: 18,
            fontWeight: 400,
            letterSpacing: '0.04em',
          }}
        >
          Sin pago inicial · Sin permanencia
        </div>
      </div>
    ),
    { ...size }
  )
}

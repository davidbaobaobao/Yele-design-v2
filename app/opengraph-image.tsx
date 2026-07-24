import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Yele — Your website, live in 3 days'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#16161A',
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
          Your website, live in 3 days.
        </div>
        <div
          style={{
            color: '#8A8A92',
            fontSize: 28,
            fontWeight: 400,
            maxWidth: 680,
            lineHeight: 1.4,
          }}
        >
          Professional web design for US small businesses. From $99/mo.
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            right: 80,
            color: '#8A8A92',
            fontSize: 18,
            fontWeight: 400,
            letterSpacing: '0.04em',
          }}
        >
          No setup fee · No commitment
        </div>
      </div>
    ),
    { ...size }
  )
}

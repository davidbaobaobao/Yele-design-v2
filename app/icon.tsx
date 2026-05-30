import { ImageResponse } from 'next/og'

export const size = { width: 192, height: 192 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: '50%',
        }}
      >
        {/* Outer ring — lightest green */}
        <div
          style={{
            width: 172,
            height: 172,
            borderRadius: '50%',
            border: '3.5px solid #9ECFAA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Middle ring */}
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: '50%',
              border: '3.5px solid #4DAA72',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Inner ring */}
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                border: '3.5px solid #2A8A52',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Center dot */}
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: '#2A8A52',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}

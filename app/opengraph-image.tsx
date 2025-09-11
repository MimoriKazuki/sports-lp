import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'LANDBRIDGE CUP 2025 - ビーチボールバレー大会'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              margin: 0,
              letterSpacing: '2px',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            LANDBRIDGE CUP 2025
          </h1>
          <p
            style={{
              fontSize: '36px',
              margin: 0,
              opacity: 0.95,
            }}
          >
            ビーチボールバレー大会
          </p>
          <div
            style={{
              display: 'flex',
              gap: '40px',
              marginTop: '40px',
              fontSize: '24px',
              opacity: 0.9,
            }}
          >
            <span>📅 10月26日(日)</span>
            <span>📍 越谷地域スポーツセンター</span>
            <span>💰 ¥3,000</span>
          </div>
          <div
            style={{
              marginTop: '30px',
              padding: '12px 32px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50px',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            男女各16名限定 | 完全個人戦
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LANDBRIDGE CUP 2025 - ビーチボールバレー大会',
  description: 'LANDBRIDGE CUP 2025 ビーチボールバレー大会。10月26日（日）越谷地域スポーツセンターで開催。完全個人戦',
  keywords: 'LANDBRIDGE CUP,ビーチボールバレー,越谷,スポーツ大会,個人戦',
  openGraph: {
    title: 'LANDBRIDGE CUP 2025',
    description: 'ビーチボールバレー大会 - 完全個人戦',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="font-sans">{children}</body>
    </html>
  )
}
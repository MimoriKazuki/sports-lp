// セキュリティヘッダーの設定
export const securityHeaders = [
  // XSS保護
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  // コンテンツタイプの推測を防ぐ
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // クリックジャッキング対策
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  // HTTPS強制
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  },
  // リファラー情報の制限
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  // 権限ポリシー
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  // CSP (コンテンツセキュリティポリシー)
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://*.supabase.co wss://*.supabase.co",
      "frame-src 'self' https://js.stripe.com https://checkout.stripe.com",
      "form-action 'self' https://checkout.stripe.com",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  }
]
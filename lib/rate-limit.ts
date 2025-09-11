import { RateLimiterMemory } from 'rate-limiter-flexible'
import { NextRequest, NextResponse } from 'next/server'

// APIエンドポイント用のレート制限設定
const rateLimiters = {
  // エントリー作成: 1IPあたり10分間に5回まで
  createEntry: new RateLimiterMemory({
    points: 5,
    duration: 600, // 10分
    blockDuration: 600, // ブロック時間: 10分
  }),
  
  // 管理者ログイン: 1IPあたり15分間に5回まで
  adminLogin: new RateLimiterMemory({
    points: 5,
    duration: 900, // 15分
    blockDuration: 1800, // ブロック時間: 30分
  }),
  
  // 一般API: 1IPあたり1分間に60回まで
  general: new RateLimiterMemory({
    points: 60,
    duration: 60, // 1分
    blockDuration: 60, // ブロック時間: 1分
  }),
  
  // Webhook: 1分間に100回まで（Stripeからの正当なリクエストを考慮）
  webhook: new RateLimiterMemory({
    points: 100,
    duration: 60,
    blockDuration: 60,
  })
}

// IPアドレスを取得
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 
             request.headers.get('x-real-ip') || 
             'unknown'
  return ip
}

// レート制限チェック
export async function checkRateLimit(
  request: NextRequest,
  limiterType: keyof typeof rateLimiters = 'general'
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const ip = getClientIp(request)
  const limiter = rateLimiters[limiterType]
  
  try {
    await limiter.consume(ip)
    return { allowed: true }
  } catch (error: any) {
    // レート制限に達した場合
    const retryAfter = Math.round(error.msBeforeNext / 1000) || 60
    return { 
      allowed: false, 
      retryAfter 
    }
  }
}

// レート制限エラーレスポンス
export function rateLimitResponse(retryAfter: number = 60) {
  return NextResponse.json(
    { 
      error: 'Too many requests. Please try again later.',
      retryAfter 
    },
    { 
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': '60',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(Date.now() + retryAfter * 1000).toISOString()
      }
    }
  )
}
import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

// XSS対策：入力値のサニタイズ
export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input.trim(), { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })
}

// エントリーフォームのバリデーションスキーマ
export const entrySchema = z.object({
  name: z.string()
    .min(1, '氏名を入力してください')
    .max(50, '氏名は50文字以内で入力してください')
    .regex(/^[ぁ-んァ-ヶー一-龠a-zA-Z\s]+$/, '氏名に使用できない文字が含まれています')
    .transform(sanitizeInput),
  
  age: z.number()
    .min(18, '18歳以上の方のみ参加可能です')
    .max(70, '70歳以下の方のみ参加可能です'),
  
  gender: z.enum(['male', 'female'] as const, {
    message: '性別を選択してください'
  }),
  
  phone: z.string()
    .regex(/^(0[5-9]0[0-9]{8}|0[1-9][1-9][0-9]{7})$/, '有効な電話番号を入力してください')
    .transform(sanitizeInput),
  
  email: z.string()
    .email('有効なメールアドレスを入力してください')
    .max(100, 'メールアドレスは100文字以内で入力してください')
    .transform(val => val.toLowerCase().trim())
})

// 管理者ログインのバリデーションスキーマ
export const adminLoginSchema = z.object({
  username: z.string()
    .email('有効なメールアドレスを入力してください')
    .transform(sanitizeInput),
  
  password: z.string()
    .min(8, 'パスワードは8文字以上入力してください')
    .max(100, 'パスワードは100文字以内で入力してください')
})

// StripeセッションIDのバリデーション
export const stripeSessionSchema = z.object({
  sessionId: z.string()
    .startsWith('cs_', 'Invalid session ID format')
    .max(200, 'Session ID too long')
})

// 環境変数のバリデーション
export const envSchema = z.object({
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1)
})

// 環境変数の検証（開発時のみ）
export function validateEnv() {
  try {
    envSchema.parse({
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      RESEND_API_KEY: process.env.RESEND_API_KEY
    })
    return true
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Environment variables validation failed:', error)
    }
    return false
  }
}
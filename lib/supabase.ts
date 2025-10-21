import { createClient } from '@supabase/supabase-js'

// クライアント用Supabaseクライアント（環境変数が必須）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)

// サーバー用Supabaseクライアント（管理操作用）
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// データベースの型定義
export interface Entry {
  id: string
  name: string
  age: number
  gender: 'male' | 'female'
  phone: string
  email: string
  payment_status: 'pending' | 'paid' | 'failed'
  stripe_session_id?: string
  created_at: string
  updated_at: string
}

export interface EntryStats {
  male_count: number
  female_count: number
  total_count: number
  male_remaining: number
  female_remaining: number
}
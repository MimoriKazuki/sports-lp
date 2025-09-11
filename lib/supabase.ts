import { createClient } from '@supabase/supabase-js'

// クライアント用Supabaseクライアント
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// サーバー用Supabaseクライアント（管理操作用）
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
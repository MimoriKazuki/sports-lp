import { supabase, supabaseAdmin, Entry, EntryStats } from './supabase'

// エントリー一覧を取得
export async function getEntries() {
  const { data, error } = await supabaseAdmin
    .from('entries')
    .select('*')
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching entries:', error)
    return []
  }

  return data as Entry[]
}

// エントリー統計を取得
export async function getEntryStats(): Promise<EntryStats> {
  const { data, error } = await supabase
    .rpc('get_entry_stats')

  if (error) {
    console.error('Error fetching entry stats:', error)
    return {
      male_count: 0,
      female_count: 0,
      total_count: 0,
      male_remaining: 16,
      female_remaining: 16
    }
  }

  return data[0] as EntryStats
}

// 新規エントリーを作成（決済待ち状態）
export async function createPendingEntry(entryData: {
  name: string
  age: number
  gender: 'male' | 'female'
  phone: string
  email: string
  stripe_session_id: string
}) {
  const { data, error } = await supabaseAdmin
    .from('entries')
    .insert([{
      ...entryData,
      payment_status: 'pending'
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating entry:', error)
    throw error
  }

  return data as Entry
}

// 決済完了後にエントリーを確定
export async function confirmEntry(stripe_session_id: string) {
  const { data, error } = await supabaseAdmin
    .from('entries')
    .update({ payment_status: 'paid' })
    .eq('stripe_session_id', stripe_session_id)
    .select()
    .single()

  if (error) {
    console.error('Error confirming entry:', error)
    throw error
  }

  return data as Entry
}

// エントリーを削除
export async function deleteEntry(id: string) {
  const { error } = await supabaseAdmin
    .from('entries')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting entry:', error)
    throw error
  }

  return true
}

// メールアドレスでエントリーをチェック
export async function checkEmailExists(email: string) {
  const { data, error } = await supabase
    .from('entries')
    .select('id')
    .eq('email', email)
    .eq('payment_status', 'paid')
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error checking email:', error)
    throw error
  }

  return !!data
}
import { NextResponse } from 'next/server'
import { createPendingEntry, confirmEntry, getEntryStats } from '@/lib/supabase-entries'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'create') {
      // テスト用の仮エントリー作成
      const entry = await createPendingEntry({
        name: 'テストユーザー',
        age: 25,
        gender: 'male',
        phone: '090-0000-0000',
        email: `test-${Date.now()}@example.com`,
        stripe_session_id: `test_session_${Date.now()}`
      })
      return NextResponse.json({ success: true, entry })
    }

    if (action === 'confirm') {
      // 最新の仮エントリーを確定
      const { sessionId } = body
      const confirmedEntry = await confirmEntry(sessionId)
      return NextResponse.json({ success: true, entry: confirmedEntry })
    }

    if (action === 'stats') {
      // 統計情報を取得
      const stats = await getEntryStats()
      return NextResponse.json({ success: true, stats })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Test entry error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process test entry' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getEntryStats } from '@/lib/supabase-entries'
import { entrySchema } from '@/lib/validation'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// 決済なしで直接エントリーを作成するAPI
export async function POST(request: NextRequest) {
  try {
    // リクエストボディをパース
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return NextResponse.json(
        { error: 'リクエストデータの形式が不正です' },
        { status: 400 }
      )
    }

    const { entryData } = body

    if (!entryData) {
      return NextResponse.json(
        { error: 'エントリーデータが見つかりません' },
        { status: 400 }
      )
    }

    console.log('Received entryData:', entryData)

    // 入力検証
    const validationResult = entrySchema.safeParse(entryData)
    if (!validationResult.success) {
      console.error('Validation errors:', validationResult.error.issues)
      const errorMessage = validationResult.error.issues?.[0]?.message || '入力データが不正です'
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // 定員チェック（性別問わず合計人数）
    const stats = await getEntryStats()
    if (stats.total_count >= 34) {
      return NextResponse.json(
        { error: '定員に達しました' },
        { status: 400 }
      )
    }

    // メールアドレスの重複チェック
    const { data: existingEntry } = await supabaseAdmin
      .from('entries')
      .select('id')
      .eq('email', validatedData.email)
      .eq('payment_status', 'paid')
      .single()

    if (existingEntry) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録が完了しています。別のメールアドレスをご利用ください。' },
        { status: 400 }
      )
    }

    // データベースに直接保存（決済済みとして登録）
    const { data: newEntry, error: insertError } = await supabaseAdmin
      .from('entries')
      .insert([{
        name: validatedData.name,
        age: validatedData.age,
        gender: validatedData.gender,
        phone: validatedData.phone,
        email: validatedData.email,
        payment_status: 'paid', // 当日払いなので、エントリーは確定とする
        stripe_session_id: null, // Stripe決済は使用しない
      }])
      .select()
      .single()

    if (insertError) {
      console.error('Error creating entry:', insertError)
      return NextResponse.json(
        { error: 'エントリーの作成に失敗しました。もう一度お試しください。' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      entry: newEntry
    })
  } catch (error: any) {
    console.error('Error in entry creation:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

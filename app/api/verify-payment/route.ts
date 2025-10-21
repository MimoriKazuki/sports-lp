import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createPaidEntry, getEntryBySessionId } from '@/lib/supabase-entries'
import { sendConfirmationEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    // まず既存のエントリーをチェック（二重登録防止）
    const existingEntry = await getEntryBySessionId(sessionId)
    if (existingEntry) {
      return NextResponse.json({
        success: true,
        entry: existingEntry,
        message: 'エントリーは既に完了しています'
      })
    }

    // Stripeセッションを取得
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      // メタデータから参加者情報を取得
      const metadata = session.metadata
      if (!metadata || !metadata.email) {
        return NextResponse.json({
          success: false,
          message: '参加者情報が見つかりません'
        }, { status: 400 })
      }

      // 決済が成功した場合、Supabaseにエントリーを作成
      const confirmedEntry = await createPaidEntry({
        name: metadata.name,
        age: parseInt(metadata.age, 10),
        gender: metadata.gender as 'male' | 'female',
        phone: metadata.phone,
        email: metadata.email,
        stripe_session_id: sessionId
      })
      
      if (confirmedEntry) {
        // 確認メールを送信
        const emailResult = await sendConfirmationEmail({
          name: confirmedEntry.name,
          email: confirmedEntry.email,
          gender: confirmedEntry.gender as 'male' | 'female'
        })
        
        if (!emailResult.success) {
          console.error('Failed to send confirmation email:', emailResult.error)
        }
      }
      
      return NextResponse.json({
        success: true,
        entry: confirmedEntry,
        message: 'エントリーが完了しました'
      })
    }

    return NextResponse.json({
      success: false,
      message: '決済が確認できませんでした'
    }, { status: 400 })
    
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { confirmEntry } from '@/lib/supabase-entries'
import { sendConfirmationEmail } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json()

    // Stripeセッションを取得
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      // 決済が成功した場合、Supabaseのエントリーを確定
      const confirmedEntry = await confirmEntry(sessionId)
      
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
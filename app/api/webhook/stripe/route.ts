import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { confirmEntry, getEntryBySessionId } from '@/lib/supabase-entries'
import { sendConfirmationEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log('Payment completed for session:', session.id)
        
        // メタデータから参加者情報を取得
        const metadata = session.metadata
        if (!metadata || !metadata.email) {
          console.error('Missing metadata in session:', session.id)
          break
        }
        
        // 既存のエントリーをチェック（二重登録防止）
        const { getEntryBySessionId, createPaidEntry } = await import('@/lib/supabase-entries')
        const existingEntry = await getEntryBySessionId(session.id)
        
        if (existingEntry) {
          console.log('Entry already exists for session:', session.id)
          break
        }
        
        // 決済完了後にエントリーを作成
        const confirmedEntry = await createPaidEntry({
          name: metadata.name,
          age: parseInt(metadata.age, 10),
          gender: metadata.gender as 'male' | 'female',
          phone: metadata.phone,
          email: metadata.email,
          stripe_session_id: session.id
        })
        
        if (confirmedEntry) {
          console.log('Entry created:', confirmedEntry)
          
          // 確認メールを送信
          const emailResult = await sendConfirmationEmail({
            name: confirmedEntry.name,
            email: confirmedEntry.email,
            gender: confirmedEntry.gender as 'male' | 'female'
          })
          
          if (emailResult.success) {
            console.log('Confirmation email sent to:', confirmedEntry.email)
          } else {
            console.error('Failed to send confirmation email:', emailResult.error)
          }
        } else {
          console.error('Failed to confirm entry for session:', session.id)
        }
        
        break
      }
      
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Session expired:', session.id)
        // 必要に応じて、期限切れセッションの処理を追加
        break
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
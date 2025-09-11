import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createPendingEntry, checkEmailExists, getEntryStats } from '@/lib/supabase-entries'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { entryData } = body

    // 定員チェック
    const stats = await getEntryStats()
    if (entryData.gender === 'male' && stats.male_remaining <= 0) {
      return NextResponse.json(
        { error: '男性の定員に達しました' },
        { status: 400 }
      )
    }
    if (entryData.gender === 'female' && stats.female_remaining <= 0) {
      return NextResponse.json(
        { error: '女性の定員に達しました' },
        { status: 400 }
      )
    }

    // メールアドレスの重複チェック
    const emailExists = await checkEmailExists(entryData.email)
    if (emailExists) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      )
    }

    // Stripeチェックアウトセッションを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: 'LANDBRIDGE CUP 2025 エントリー費',
              description: `参加者: ${entryData.name}`,
            },
            unit_amount: 3000, // 3000円
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/#application`,
      metadata: {
        name: entryData.name,
        age: entryData.age,
        gender: entryData.gender,
        phone: entryData.phone,
        email: entryData.email,
      },
      customer_email: entryData.email,
    })

    // Supabaseに仮エントリーを作成
    await createPendingEntry({
      ...entryData,
      stripe_session_id: session.id
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })
  } catch (error) {
    console.error('Stripe session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
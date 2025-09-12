import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { checkEmailExists, getEntryStats } from '@/lib/supabase-entries'
import { entrySchema } from '@/lib/validation'
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: NextRequest) {
  // レート制限チェック
  const { allowed, retryAfter } = await checkRateLimit(request, 'createEntry')
  if (!allowed) {
    return rateLimitResponse(retryAfter)
  }
  
  try {
    const body = await request.json()
    const { entryData } = body
    
    // デバッグ情報
    console.log('Received entryData:', entryData)
    
    // 入力検証
    const validationResult = entrySchema.safeParse(entryData)
    if (!validationResult.success) {
      console.error('Validation errors:', validationResult.error.errors)
      const errorMessage = validationResult.error.errors?.[0]?.message || '入力データが不正です'
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }
    
    const validatedData = validationResult.data

    // 定員チェック
    const stats = await getEntryStats()
    if (validatedData.gender === 'male' && stats.male_remaining <= 0) {
      return NextResponse.json(
        { error: '男性の定員に達しました' },
        { status: 400 }
      )
    }
    if (validatedData.gender === 'female' && stats.female_remaining <= 0) {
      return NextResponse.json(
        { error: '女性の定員に達しました' },
        { status: 400 }
      )
    }

    // メールアドレスの重複チェック（支払い済みのエントリーのみチェック）
    const emailExists = await checkEmailExists(validatedData.email)
    if (emailExists) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録が完了しています。別のメールアドレスをご利用ください。' },
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
              description: `参加者: ${validatedData.name}`,
            },
            unit_amount: 3000, // 3000円
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin') || 'http://localhost:3002'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin') || 'http://localhost:3002'}/#application`,
      metadata: {
        name: validatedData.name,
        age: String(validatedData.age),
        gender: validatedData.gender,
        phone: validatedData.phone,
        email: validatedData.email,
      },
      customer_email: validatedData.email,
    })

    // 注意: ここではデータベースに登録しない
    // Stripe Webhookで決済完了確認後に登録する

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })
  } catch (error) {
    console.error('Stripe session creation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
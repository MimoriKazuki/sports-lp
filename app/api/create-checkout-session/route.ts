import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { checkEmailExists, getEntryStats } from '@/lib/supabase-entries'
import { entrySchema } from '@/lib/validation'
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // 環境変数チェック
  const STRIPE_KEY = process.env.STRIPE_SECRET_KEY
  if (!STRIPE_KEY) {
    console.error('STRIPE_SECRET_KEY is missing from environment variables')
    return NextResponse.json(
      { error: 'Payment service is not properly configured' },
      { status: 500 }
    )
  }

  // Stripeクライアントを動的に初期化
  let stripe: Stripe
  try {
    stripe = new Stripe(STRIPE_KEY, {
      apiVersion: '2025-08-27.basil',
      maxNetworkRetries: 2,
      timeout: 10000, // 10 seconds
    })
  } catch (error) {
    console.error('Failed to initialize Stripe client:', error)
    return NextResponse.json(
      { error: 'Failed to initialize payment service' },
      { status: 500 }
    )
  }
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
      console.error('Validation errors:', validationResult.error.issues)
      const errorMessage = validationResult.error.issues?.[0]?.message || '入力データが不正です'
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

    // Stripeエラーの詳細なハンドリング
    if (error instanceof Stripe.errors.StripeError) {
      console.error('Stripe Error Type:', error.type)
      console.error('Stripe Error Code:', error.code)
      console.error('Stripe Error Message:', error.message)

      // APIキーのエラー
      if (error.type === 'StripeAuthenticationError') {
        return NextResponse.json(
          { error: 'Payment configuration error. Please contact support.' },
          { status: 500 }
        )
      }

      // ネットワークエラー
      if (error.type === 'StripeConnectionError') {
        return NextResponse.json(
          { error: 'Connection to payment service failed. Please try again.' },
          { status: 500 }
        )
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
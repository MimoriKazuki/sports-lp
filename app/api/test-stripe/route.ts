import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET() {
  const STRIPE_KEY = process.env.STRIPE_SECRET_KEY

  const result: any = {
    hasKey: !!STRIPE_KEY,
    keyLength: STRIPE_KEY?.length,
    keyPrefix: STRIPE_KEY?.substring(0, 7),
    keyEnds: STRIPE_KEY?.substring(STRIPE_KEY.length - 4),
  }

  if (!STRIPE_KEY) {
    result.error = 'No STRIPE_SECRET_KEY found'
    return NextResponse.json(result)
  }

  try {
    // Stripeクライアントを初期化
    const stripe = new Stripe(STRIPE_KEY, {
      apiVersion: '2025-08-27.basil',
    })
    result.stripeInitialized = true

    // テストAPIコール（残高を取得）
    try {
      const balance = await stripe.balance.retrieve()
      result.apiCallSuccess = true
      result.currency = balance.available[0]?.currency || 'none'
    } catch (apiError: any) {
      result.apiCallSuccess = false
      result.apiError = {
        type: apiError?.type,
        message: apiError?.message,
        statusCode: apiError?.statusCode,
        code: apiError?.code,
      }
    }
  } catch (initError: any) {
    result.stripeInitialized = false
    result.initError = {
      message: initError?.message,
      name: initError?.name,
    }
  }

  return NextResponse.json(result)
}
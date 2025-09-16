import { NextResponse } from 'next/server'

export async function GET() {
  const stripeVars = Object.keys(process.env).filter(key => key.includes('STRIPE'))
  const hasStripeKey = !!process.env.STRIPE_SECRET_KEY

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    hasStripeSecretKey: hasStripeKey,
    stripeKeyPrefix: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 7) : 'not set',
    availableStripeVars: stripeVars,
    allEnvVars: Object.keys(process.env).sort()
  })
}
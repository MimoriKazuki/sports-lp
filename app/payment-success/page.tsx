'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      setError('決済セッションが見つかりません')
      setVerifying(false)
      return
    }

    // 決済を確認してエントリーを完了
    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })

        const data = await response.json()

        if (data.success) {
          setVerified(true)
        } else {
          setError(data.message || '決済の確認に失敗しました')
        }
      } catch (err) {
        setError('エラーが発生しました')
      } finally {
        setVerifying(false)
      }
    }

    verifyPayment()
  }, [searchParams])

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-primary-green animate-spin mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">決済を確認中...</h1>
            <p className="text-gray-600">しばらくお待ちください</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">エラーが発生しました</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/#application"
              className="px-6 py-3 bg-primary-green text-white rounded-lg hover:bg-primary-forest transition-colors"
            >
              エントリーフォームに戻る
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-green/10 to-primary-emerald/10 flex items-center justify-center">
        <div className="bg-white p-12 rounded-xl shadow-2xl max-w-lg w-full">
          <div className="flex flex-col items-center">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-primary-green" />
            </div>
            
            <h1 className="text-3xl font-bold text-primary-forest mb-4">
              エントリー完了！
            </h1>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 w-full">
              <p className="text-blue-800 text-center font-medium">
                LANDBRIDGE CUP 2025への<br />
                エントリーが完了しました
              </p>
            </div>
            
            <div className="text-gray-600 text-center mb-8 space-y-2">
              <p>ご登録いただいたメールアドレスに</p>
              <p>確認メールをお送りしました</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 w-full mb-8">
              <h3 className="font-bold text-gray-800 mb-2">大会情報</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>📅 日時: 2025年10月26日（日）</p>
                <p>📍 場所: 越谷地域スポーツセンター</p>
                <p>⏰ 集合: 12:45</p>
              </div>
            </div>
            
            <Link
              href="/"
              className="px-8 py-3 bg-primary-green text-white rounded-lg hover:bg-primary-forest transition-colors font-medium"
            >
              トップページへ戻る
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return null
}
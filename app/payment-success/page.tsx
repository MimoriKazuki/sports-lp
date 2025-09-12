'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Loader2, Calendar, MapPin, Clock, Mail, Home } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

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
      <div className="min-h-screen bg-gradient-to-br from-primary-blue/5 via-white to-primary-sky/5 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-2xl shadow-2xl max-w-md w-full"
        >
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-primary-blue animate-spin mb-6" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">決済を確認中...</h1>
            <p className="text-gray-600">しばらくお待ちください</p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-2xl shadow-2xl max-w-md w-full"
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-pulse-soft">
              <span className="text-3xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">エラーが発生しました</h1>
            <p className="text-gray-600 mb-8 text-center">{error}</p>
            <Link
              href="/#application"
              className="px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-sky text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium"
            >
              エントリーフォームに戻る
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-blue/10 via-white to-primary-sky/10">
        {/* ヒーローセクション */}
        <div className="relative py-20 bg-gradient-to-r from-primary-blue to-primary-sky">
          <div className="absolute inset-0 bg-black/10"></div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 relative z-10"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
                className="inline-block mb-6"
              >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl mx-auto">
                  <CheckCircle className="w-16 h-16 text-primary-blue" />
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-5xl font-bold text-white mb-4"
              >
                エントリー完了！
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl text-white/90"
              >
                LANDBRIDGE CUP 2025へのご参加ありがとうございます
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* コンテンツセクション */}
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid gap-8"
          >
            {/* メール確認カード */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-primary-blue">
              <div className="flex items-start gap-4">
                <div className="bg-primary-blue/10 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-primary-blue" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">確認メールを送信しました</h2>
                  <p className="text-gray-600">
                    ご登録いただいたメールアドレスに大会詳細と注意事項をお送りしました。
                    メールが届かない場合は、迷惑メールフォルダをご確認ください。
                  </p>
                </div>
              </div>
            </div>

            {/* 大会情報カード */}
            <div className="bg-gradient-to-r from-primary-blue/5 to-primary-sky/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">大会情報</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-xl p-6 text-center shadow-md"
                >
                  <Calendar className="w-10 h-10 text-primary-blue mx-auto mb-3" />
                  <div className="text-sm text-gray-500 mb-1">開催日</div>
                  <div className="font-bold text-lg">2025年10月26日</div>
                  <div className="text-sm text-gray-600">日曜日</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-xl p-6 text-center shadow-md"
                >
                  <Clock className="w-10 h-10 text-primary-blue mx-auto mb-3" />
                  <div className="text-sm text-gray-500 mb-1">時間</div>
                  <div className="font-bold text-lg">13:00-17:00</div>
                  <div className="text-sm text-gray-600">集合 12:45</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-xl p-6 text-center shadow-md"
                >
                  <MapPin className="w-10 h-10 text-primary-blue mx-auto mb-3" />
                  <div className="text-sm text-gray-500 mb-1">会場</div>
                  <div className="font-bold text-lg">越谷地域</div>
                  <div className="text-sm text-gray-600">スポーツセンター</div>
                </motion.div>
              </div>
            </div>

            {/* 注意事項 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="font-bold text-amber-800 mb-3">当日の持ち物</h3>
              <ul className="space-y-2 text-amber-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>運動できる服装</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>体育館シューズ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <span>タオル・飲み物</span>
                </li>
              </ul>
            </div>

            {/* アクションボタン */}
            <div className="flex justify-center">
              <Link
                href="/"
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-blue to-primary-sky text-white rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-bold text-lg"
              >
                <Home className="w-5 h-5" />
                トップページへ戻る
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return null
}
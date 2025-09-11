'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, Info } from 'lucide-react'

interface EntryFormModalProps {
  isOpen: boolean
  onClose: () => void
}

// 申し込み人数を管理（実際はデータベースから取得）
let entryCount = {
  male: 8,
  female: 6,
  total: 14
}

export default function EntryFormModal({ isOpen, onClose }: EntryFormModalProps) {
  console.log('Modal isOpen:', isOpen)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentEntryCount, setCurrentEntryCount] = useState(entryCount)

  useEffect(() => {
    // モーダルが開かれた時に最新の申し込み人数を取得
    if (isOpen) {
      fetch('/api/entries')
        .then(res => res.json())
        .then(data => {
          setCurrentEntryCount(data.counts)
          entryCount = data.counts
        })
        .catch(error => console.error('Failed to fetch entry counts:', error))
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreedToTerms || !agreedToPrivacy) {
      alert('利用規約と個人情報の取り扱いに同意してください。')
      return
    }
    
    // 定員チェック
    if (formData.gender === 'male' && currentEntryCount.male >= 16) {
      alert('申し訳ございません。男性の定員に達しました。')
      return
    }
    if (formData.gender === 'female' && currentEntryCount.female >= 16) {
      alert('申し訳ございません。女性の定員に達しました。')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Stripeチェックアウトセッションを作成
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entryData: formData }),
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Stripeの決済ページにリダイレクト
        if (data.url) {
          window.location.href = data.url
        } else {
          alert('決済ページの作成に失敗しました。')
        }
      } else {
        alert('エラーが発生しました。もう一度お試しください。')
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('送信中にエラーが発生しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleClose = () => {
    onClose()
    // モーダルを閉じる際にリセット
    setTimeout(() => {
      setFormData({ name: '', age: '', gender: '', phone: '', email: '' })
      setIsSubmitted(false)
      setAgreedToTerms(false)
      setAgreedToPrivacy(false)
      setShowTerms(false)
      setShowPrivacy(false)
    }, 300)
  }

  const remainingMale = 16 - currentEntryCount.male
  const remainingFemale = 16 - currentEntryCount.female

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isSubmitted && !showTerms && !showPrivacy ? handleClose : undefined}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 overflow-y-auto"
            style={{ zIndex: 9998 }}
          >
            {/* モーダル */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-white p-10 shadow-2xl mx-auto my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {!isSubmitted ? (
                <>
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X size={24} />
                  </button>

                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-primary-forest mb-3">
                      ENTRY FORM
                    </h2>
                    <div className="w-20 h-1 bg-primary-green mx-auto mb-4"></div>
                    
                    {/* 申し込み状況 */}
                    <div className="bg-gray-50 p-3 rounded mb-4">
                      <p className="text-sm text-gray-600 mb-2">現在の申し込み状況</p>
                      <div className="flex justify-center gap-6 text-sm">
                        <div>
                          <span className="font-bold text-primary-green">男子</span>
                          <span className="ml-2">{currentEntryCount.male}/16名</span>
                          <span className="text-xs text-gray-500 ml-1">（残り{remainingMale}名）</span>
                        </div>
                        <div>
                          <span className="font-bold text-primary-emerald">女子</span>
                          <span className="ml-2">{currentEntryCount.female}/16名</span>
                          <span className="text-xs text-gray-500 ml-1">（残り{remainingFemale}名）</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-base font-bold text-gray-700 mb-2">
                        氏名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 text-lg border-2 border-gray-300 focus:border-primary-green outline-none transition-colors disabled:bg-gray-100"
                        placeholder="山田 太郎"
                      />
                    </div>

                    <div>
                      <label htmlFor="age" className="block text-base font-bold text-gray-700 mb-2">
                        年齢 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        required
                        min="1"
                        max="100"
                        value={formData.age}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 text-lg border-2 border-gray-300 focus:border-primary-green outline-none transition-colors disabled:bg-gray-100"
                        placeholder="25"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-bold text-gray-700 mb-2">
                        性別 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-6">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            required
                            checked={formData.gender === 'male'}
                            onChange={handleChange}
                            disabled={isSubmitting || remainingMale <= 0}
                            className="mr-2 w-4 h-4 text-primary-green"
                          />
                          <span className={remainingMale <= 0 ? 'text-gray-400' : ''}>
                            男性
                            {remainingMale <= 0 && <span className="text-xs text-red-500 ml-1">（満員）</span>}
                          </span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            required
                            checked={formData.gender === 'female'}
                            onChange={handleChange}
                            disabled={isSubmitting || remainingFemale <= 0}
                            className="mr-2 w-4 h-4 text-primary-emerald"
                          />
                          <span className={remainingFemale <= 0 ? 'text-gray-400' : ''}>
                            女性
                            {remainingFemale <= 0 && <span className="text-xs text-red-500 ml-1">（満員）</span>}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-base font-bold text-gray-700 mb-2">
                        電話番号 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 text-lg border-2 border-gray-300 focus:border-primary-green outline-none transition-colors disabled:bg-gray-100"
                        placeholder="090-1234-5678"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-base font-bold text-gray-700 mb-2">
                        メールアドレス <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 text-lg border-2 border-gray-300 focus:border-primary-green outline-none transition-colors disabled:bg-gray-100"
                        placeholder="example@email.com"
                      />
                    </div>

                    {/* 参加費 */}
                    <div className="bg-gradient-to-r from-primary-green/10 to-primary-emerald/10 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-700">参加費</p>
                          <p className="text-xs text-gray-600 mt-1">決済はStripeで安全に処理されます</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-green">¥3,000</p>
                          <p className="text-xs text-gray-600">税込</p>
                        </div>
                      </div>
                    </div>

                    {/* 規約同意 */}
                    <div className="border-t pt-4 space-y-3">
                      <div className="bg-gray-50 p-3 rounded text-xs text-gray-600">
                        <p className="mb-2 font-bold">以下の内容をご確認の上、同意してください。</p>
                      </div>
                      
                      <div>
                        <label className="flex items-start cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            disabled={isSubmitting}
                            className="mt-1 mr-2 w-4 h-4"
                          />
                          <span className="text-sm">
                            <button
                              type="button"
                              onClick={() => setShowTerms(true)}
                              className="text-primary-green underline hover:no-underline"
                            >
                              利用規約
                            </button>
                            に同意します <span className="text-red-500">*</span>
                          </span>
                        </label>
                      </div>

                      <div>
                        <label className="flex items-start cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agreedToPrivacy}
                            onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                            disabled={isSubmitting}
                            className="mt-1 mr-2 w-4 h-4"
                          />
                          <span className="text-sm">
                            <button
                              type="button"
                              onClick={() => setShowPrivacy(true)}
                              className="text-primary-green underline hover:no-underline"
                            >
                              個人情報の取り扱い
                            </button>
                            について同意します <span className="text-red-500">*</span>
                          </span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !agreedToTerms || !agreedToPrivacy}
                      className="w-full bg-primary-forest hover:bg-primary-forest/90 disabled:bg-gray-400 text-white font-bold text-xl py-4 transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        '決済ページへ移動中...'
                      ) : (
                        <>
                          <span>決済へ進む</span>
                          <span className="text-sm">(¥3,000)</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-xs text-gray-500 text-center mt-4 space-y-1">
                    <p>※ 決済完了後にエントリーが確定します</p>
                    <p>※ エントリー後のキャンセルはできません</p>
                    <p className="flex items-center justify-center gap-1 mt-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" fill="#22C55E"/>
                      </svg>
                      決済は安全なStripeを使用
                    </p>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle className="w-20 h-20 text-primary-green mx-auto mb-4" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold text-primary-forest mb-2">
                    エントリー完了！
                  </h2>
                  
                  <div className="w-20 h-1 bg-primary-green mx-auto mb-4"></div>
                  
                  <p className="text-gray-700 mb-2">
                    <span className="font-bold">{formData.name}</span>様
                  </p>
                  
                  <p className="text-gray-600 mb-6">
                    LANDBRIDGE CUP 2025への<br />
                    エントリーを受け付けました。
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded text-left space-y-2 mb-6">
                    <p className="text-sm text-gray-600">
                      <span className="font-bold">大会日時：</span>2025年10月26日（日）13:00-17:00
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-bold">会場：</span>越谷地域スポーツセンター
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-bold">集合時間：</span>12:45
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    詳細は登録メールアドレスに<br />
                    送信いたしました。
                  </p>
                  
                  <button
                    onClick={handleClose}
                    className="bg-primary-forest hover:bg-primary-forest/90 text-white font-bold px-8 py-2 rounded transition-colors"
                  >
                    閉じる
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* 利用規約モーダル */}
          {showTerms && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
              style={{ zIndex: 9999 }}
              onClick={() => setShowTerms(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4">利用規約</h3>
                <div className="text-sm space-y-3 text-gray-700">
                  <h4 className="font-bold">第1条（本規約の適用）</h4>
                  <p>本規約は、LandBridge株式会社（以下「主催者」）が開催する「LANDBRIDGE CUP 2025」（以下「本大会」）への参加申込および参加に関する条件を定めるものです。</p>
                  
                  <h4 className="font-bold">第2条（参加資格）</h4>
                  <p>1. 参加者は健康状態が良好であり、スポーツ活動に支障がないことを条件とします。</p>
                  <p>2. 未成年者の参加には保護者の同意が必要です。</p>
                  
                  <h4 className="font-bold">第3条（参加費）</h4>
                  <p>1. 参加費は3,000円とし、大会当日に現金でお支払いいただきます。</p>
                  <p>2. 一度お支払いいただいた参加費は、いかなる理由があっても返金いたしません。</p>
                  
                  <h4 className="font-bold">第4条（キャンセル）</h4>
                  <p>エントリー後のキャンセルはできません。やむを得ない事情がある場合は、速やかに主催者までご連絡ください。</p>
                  
                  <h4 className="font-bold">第5条（免責事項）</h4>
                  <p>1. 参加者は自己の責任において本大会に参加するものとします。</p>
                  <p>2. 大会中の事故、怪我、盗難等について、主催者は一切の責任を負いません。</p>
                  <p>3. 天候その他の理由により大会が中止となった場合でも、参加費の返金はいたしません。</p>
                  
                  <h4 className="font-bold">第6条（肖像権）</h4>
                  <p>大会中に撮影された写真・動画等は、主催者の広報活動に使用する場合があります。</p>
                </div>
                <button
                  onClick={() => setShowTerms(false)}
                  className="mt-6 w-full bg-primary-forest text-white py-2 rounded hover:bg-primary-forest/90 transition-colors"
                >
                  閉じる
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* 個人情報の取り扱いモーダル */}
          {showPrivacy && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
              style={{ zIndex: 9999 }}
              onClick={() => setShowPrivacy(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4">個人情報の取り扱いについて</h3>
                <div className="text-sm space-y-3 text-gray-700">
                  <h4 className="font-bold">1. 個人情報の収集</h4>
                  <p>主催者は、本大会の運営に必要な範囲で、参加者の氏名、年齢、性別、電話番号、メールアドレス等の個人情報を収集します。</p>
                  
                  <h4 className="font-bold">2. 個人情報の利用目的</h4>
                  <p>収集した個人情報は、以下の目的で利用します：</p>
                  <ul className="list-disc ml-6">
                    <li>大会の運営および管理</li>
                    <li>参加者への連絡</li>
                    <li>緊急時の対応</li>
                    <li>今後のイベントのご案内（希望者のみ）</li>
                  </ul>
                  
                  <h4 className="font-bold">3. 個人情報の第三者提供</h4>
                  <p>収集した個人情報は、法令に基づく場合を除き、参加者の同意なく第三者に提供することはありません。</p>
                  
                  <h4 className="font-bold">4. 個人情報の管理</h4>
                  <p>主催者は、個人情報の漏洩、滅失、毀損等を防止するため、適切な安全管理措置を講じます。</p>
                  
                  <h4 className="font-bold">5. 個人情報の開示・訂正・削除</h4>
                  <p>参加者本人から個人情報の開示、訂正、削除の請求があった場合は、本人確認の上、速やかに対応します。</p>
                  
                  <h4 className="font-bold">6. お問い合わせ</h4>
                  <p>個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください：</p>
                  <p>LandBridge株式会社<br />
                  Email: info@landbridge-cup.com</p>
                </div>
                <button
                  onClick={() => setShowPrivacy(false)}
                  className="mt-6 w-full bg-primary-forest text-white py-2 rounded hover:bg-primary-forest/90 transition-colors"
                >
                  閉じる
                </button>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}
'use client'

import { motion } from 'framer-motion'
import { Trophy, Gift, Crown, Star } from 'lucide-react'

export default function PrizeSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* タイトル */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-forest mb-4">
              PRIZES
            </h2>
            <div className="w-32 h-1 bg-primary-green mx-auto mb-6"></div>
            <p className="text-xl text-gray-700">豪華賞品</p>
          </div>

          {/* メインメッセージカード */}
          <motion.div
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16 border-2 border-primary-green/20"
          >
            <div className="text-center">
              <Gift className="w-16 h-16 text-primary-green mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-primary-forest mb-4">
                特別な賞品をご用意
              </h3>
              <p className="text-lg text-gray-600">
                必ず豪華景品を用意致します
              </p>
            </div>
          </motion.div>

          {/* 賞品カード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* 優勝 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  CHAMPION
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-yellow-400 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/10 rounded-bl-full"></div>
                <div className="relative z-10">
                  <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">優勝</h3>
                  <p className="text-center text-gray-600">豪華賞品</p>
                  <div className="flex justify-center mt-4">
                    {[...Array(3)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 準優勝 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  2nd PLACE
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-400 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gray-400/10 rounded-bl-full"></div>
                <div className="relative z-10">
                  <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">準優勝</h3>
                  <p className="text-center text-gray-600">特別賞品</p>
                  <div className="flex justify-center mt-4">
                    {[...Array(2)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-gray-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 3位 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-1 rounded-full text-sm font-bold">
                  3rd PLACE
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-amber-600 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/10 rounded-bl-full"></div>
                <div className="relative z-10">
                  <Trophy className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">第3位</h3>
                  <p className="text-center text-gray-600">記念品</p>
                  <div className="flex justify-center mt-4">
                    <Star className="w-5 h-5 text-amber-600 fill-current" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 参加賞 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-accent rounded-2xl p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">
              🎁 参加者全員にチャンス！
            </h3>
            <p className="text-lg mb-2">ラッキードロー抽選会</p>
            <p className="text-white/90">
              素敵な賞品が当たるチャンス
            </p>
          </motion.div>

          {/* 注釈 */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-500 text-sm">
              ※ 賞品の詳細は大会当日に発表いたします
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
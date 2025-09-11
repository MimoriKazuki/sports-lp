'use client'

import { motion } from 'framer-motion'
import { Clock, AlertTriangle, Book, Calendar } from 'lucide-react'

export default function GuidelinesSection() {
  const schedule = [
    { time: '12:45', event: '集合', highlight: true },
    { time: '13:00', event: '開会式' },
    { time: '13:15', event: 'ビーチボール開始', highlight: true },
    { time: '16:30', event: '終了（コート片付け）' },
    { time: '16:45', event: '閉会式' },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* タイトル */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-forest mb-4">
              大会要項
            </h2>
            <div className="w-32 h-1 bg-primary-green mx-auto"></div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* ルール */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-6"
            >
              <div className="flex items-center mb-4">
                <Book className="w-6 h-6 text-primary-green mr-2" />
                <h3 className="text-xl font-bold text-primary-forest">競技ルール</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4">
                  <p className="font-bold text-gray-800 mb-1">適用ルール</p>
                  <p className="text-gray-600">日本ビーチボール協会公式ルール</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="font-bold text-gray-800 mb-1">試合形式</p>
                  <p className="text-gray-600">完全個人戦</p>
                  <p className="text-gray-600 text-sm">毎試合メンバーチェンジ制</p>
                </div>
              </div>
            </motion.div>

            {/* タイムスケジュール */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-6"
            >
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-primary-green mr-2" />
                <h3 className="text-xl font-bold text-primary-forest">タイムスケジュール</h3>
              </div>
              <div className="space-y-2">
                {schedule.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      item.highlight 
                        ? 'bg-primary-green/10 border border-primary-green/30' 
                        : 'bg-white'
                    }`}
                  >
                    <span className={`font-bold ${
                      item.highlight ? 'text-primary-green' : 'text-gray-700'
                    }`}>
                      {item.time}
                    </span>
                    <span className={
                      item.highlight ? 'text-primary-forest font-medium' : 'text-gray-600'
                    }>
                      {item.event}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 大会概要 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-primary-forest text-white rounded-xl p-8"
          >
            <div className="flex items-center justify-center mb-6">
              <Calendar className="w-6 h-6 mr-2" />
              <h3 className="text-xl font-bold">大会概要</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-white/70 mb-1">開催日</p>
                <p className="font-bold text-lg">2025年10月26日（日）</p>
              </div>
              <div>
                <p className="text-white/70 mb-1">会場</p>
                <p className="font-bold text-lg">越谷地域スポーツセンター</p>
              </div>
              <div>
                <p className="text-white/70 mb-1">定員</p>
                <p className="font-bold text-lg">32名（男女各16名）</p>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
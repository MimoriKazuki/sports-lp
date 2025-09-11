'use client'

import { motion } from 'framer-motion'

const overviewCards = [
  {
    label: '開催時間',
    value: '13:00-17:00',
    sub: '集合 12:45',
  },
  {
    label: '参加費',
    value: '¥3,000',
    sub: '当日払い',
  },
  {
    label: '募集人数',
    value: '30名',
    sub: '男女各15名',
  },
  {
    label: '優勝賞品',
    value: '豪華景品',
    sub: 'ラッキー賞あり',
  },
]

export default function OverviewSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-forest mb-2">
              TOURNAMENT INFO
            </h2>
            <div className="h-1 bg-primary-green"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border-2 border-gray-200 p-6 hover:border-primary-green transition-colors"
            >
              <div className="text-sm text-gray-600 uppercase tracking-wider mb-2">
                {card.label}
              </div>
              <div className="text-2xl font-bold text-primary-forest mb-1">
                {card.value}
              </div>
              <div className="text-sm text-gray-500">{card.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
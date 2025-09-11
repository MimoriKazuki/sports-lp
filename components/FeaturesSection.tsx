'use client'

import { motion } from 'framer-motion'

const features = [
  {
    number: '01',
    title: '完全個人参加制',
    description: '一人でも気軽に参加できる大会形式。チーム単位での申込不要。',
  },
  {
    number: '02',
    title: 'チームシャッフル制',
    description: '毎試合メンバーが変わるので、多くの人と交流できます。',
  },
  {
    number: '03',
    title: '男女混成試合',
    description: '男女がバランスよく配置され、公平で楽しい試合を実現。',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-forest mb-2">
              TOURNAMENT STYLE
            </h2>
            <div className="h-1 bg-primary-green"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="text-6xl font-bold text-primary-green/20 mb-4">
                {feature.number}
              </div>
              <h3 className="text-xl font-bold text-primary-forest mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
'use client'

import { motion } from 'framer-motion'

const notes = [
  '参加費は当日受付にてお支払いください（現金のみ）',
  '運動できる服装でお越しください',
  '体育館シューズをご持参ください',
  '駐車場あり（無料）',
]

export default function NotesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary-forest mb-8">
            参加者への注意事項
          </h2>

          <div className="bg-gray-50 p-8">
            <ul className="space-y-4">
              {notes.map((note, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start"
                >
                  <span className="text-primary-green font-bold text-xl mr-3">▶</span>
                  <span className="text-gray-700">{note}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="mt-8 p-6 border-l-4 border-accent-lime bg-blue-50">
            <p className="font-bold text-primary-forest mb-2">お問い合わせ</p>
            <p className="text-gray-700">
              ご不明な点がございましたら、大会事務局までお気軽にお問い合わせください。
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
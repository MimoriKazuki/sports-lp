'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import EntryFormModal from './EntryFormModal'

export default function CTASection() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section id="application" className="py-20 bg-gradient-accent">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              ENTRY
            </h2>
            
            <div className="bg-white text-primary-forest p-8 md:p-12 mb-8">
              <p className="text-2xl font-bold mb-4">
                エントリー受付中
              </p>
              <p className="text-lg mb-8 text-gray-700">
                定員33名（男性17名、女性16名）
              </p>
              
              <button
                onClick={() => {
                  console.log('Button clicked, opening modal')
                  setIsModalOpen(true)
                }}
                className="bg-primary-forest hover:bg-primary-forest/90 text-white font-bold text-xl px-12 py-4 transition-colors uppercase tracking-wider cursor-pointer"
              >
                ENTRY FORM
              </button>
            </div>
            
            <div className="text-white/90 space-y-2">
              <p>※定員になり次第締切</p>
              <p>※キャンセル不可</p>
            </div>
          </motion.div>
        </div>
      </section>

      <EntryFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
'use client'

import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background image from Unsplash - volleyball court/beach volleyball */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2907&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-primary-blue to-primary-sky text-white inline-block px-4 py-2 font-bold text-sm mb-6 uppercase tracking-wider shadow-lg">
              2025.10.26 SUN
            </div>
            
            <h1 className="text-white mb-4">
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold block">
                LANDBRIDGE
              </span>
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold block bg-gradient-to-r from-primary-blue via-primary-sky to-accent-teal bg-clip-text text-transparent">
                CUP 2025
              </span>
            </h1>
            
            <div className="text-white/90 text-xl md:text-2xl mb-8 font-medium">
              ビーチボールバレー大会
            </div>

            <div className="text-white/80 text-lg space-y-2 mb-8">
              <p>完全個人戦</p>
              <p>毎試合メンバーチェンジ制</p>
            </div>

            <div className="flex flex-wrap gap-4 mb-12 items-stretch">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 text-white">
                <div className="text-sm opacity-70">会場</div>
                <div className="font-bold">越谷地域スポーツセンター</div>
                <div className="text-xs opacity-70 mt-1">〒343-0025 埼玉県越谷市大沢2-10-21</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 text-white flex flex-col justify-center">
                <div className="text-sm opacity-70">日時</div>
                <div className="font-bold">2025年10月26日 13:00-17:00</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 text-white flex flex-col justify-center">
                <div className="text-sm opacity-70">集合</div>
                <div className="font-bold">12:45</div>
              </div>
            </div>

            <a
              href="#application"
              className="inline-block bg-primary-green hover:bg-primary-forest text-white font-bold text-lg px-8 py-4 transition-colors"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              エントリーする →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
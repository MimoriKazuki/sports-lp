export default function Footer() {
  return (
    <footer className="py-12 bg-primary-forest text-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">LANDBRIDGE CUP 2025</h3>
          <p className="text-white/70">ビーチボールバレー大会</p>
        </div>
        
        <div className="border-t border-white/20 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <p className="font-bold mb-2">主催</p>
              <p className="text-white/70">
                <a
                  href="https://www.landbridge.co.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-lime transition-colors"
                >
                  LandBridge株式会社
                </a>
              </p>
            </div>
            <div>
              <p className="font-bold mb-2">会場</p>
              <p className="text-white/70">越谷地域スポーツセンター</p>
            </div>
            <div>
              <p className="font-bold mb-2">お問い合わせ</p>
              <p className="text-white/70">
                <a
                  href="mailto:info@landbridge-cup.com"
                  className="hover:text-accent-lime transition-colors"
                >
                  info@landbridge-cup.com
                </a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 pt-8 border-t border-white/20">
          <p className="text-white/50 text-sm">
            © 2025 LandBridge Cup. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
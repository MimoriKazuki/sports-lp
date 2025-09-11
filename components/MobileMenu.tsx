'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { href: '#application', label: 'ENTRY' },
    { href: '#overview', label: 'INFO' },
    { href: '#features', label: 'STYLE' },
    { href: '#prize', label: 'PRIZES' },
  ]

  if (!showButton) return null

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 right-5 z-50 bg-primary-forest text-white w-12 h-12 flex items-center justify-center shadow-lg md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <nav className="fixed top-0 right-0 w-72 h-full bg-white shadow-2xl z-40 pt-20 px-5 md:hidden">
            <div className="space-y-3">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 border-2 border-primary-forest text-primary-forest hover:bg-primary-forest hover:text-white font-bold transition-colors uppercase tracking-wider text-center"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </>
      )}
    </>
  )
}
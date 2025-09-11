import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          red: '#DC2626',
          blue: '#1E40AF',
          green: '#16A34A',
          emerald: '#10B981',
          forest: '#14532D',
        },
        accent: {
          yellow: '#FFC107',
          orange: '#FF6B35',
          navy: '#1E293B',
          lime: '#84CC16',
          teal: '#14B8A6',
        },
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(180deg, #16A34A 0%, #14532D 100%)',
        'gradient-accent': 'linear-gradient(90deg, #10B981 0%, #14B8A6 100%)',
        'gradient-light': 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)',
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'Segoe UI', 'sans-serif'],
        display: ['Poppins', 'Noto Sans JP', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { 
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideIn: {
          from: {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
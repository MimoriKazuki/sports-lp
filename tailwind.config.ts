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
        // 青色系をプライマリに
        'primary-blue': '#2563eb',
        'primary-sky': '#0ea5e9',
        'primary-navy': '#1e40af',
        'primary-indigo': '#4f46e5',
        'deep-blue': '#1e3a8a',
        'light-blue': '#60a5fa',
        'pale-blue': '#dbeafe',
        'royal-blue': '#2563eb',
        
        // 旧緑色系（互換性のため青にマッピング）
        'primary-green': '#2563eb',
        'primary-emerald': '#0ea5e9',
        'primary-forest': '#1e40af',
        'deep-green': '#1e3a8a',
        
        primary: {
          red: '#DC2626',
          blue: '#2563eb',
          green: '#2563eb', // 青にマッピング
          emerald: '#0ea5e9', // 青にマッピング
          forest: '#1e40af', // 青にマッピング
        },
        accent: {
          yellow: '#FFC107',
          orange: '#FF6B35',
          navy: '#1E293B',
          lime: '#84CC16',
          teal: '#06b6d4',
        },
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-accent': 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)',
        'gradient-light': 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)',
        'gradient-premium': 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #1e40af 100%)',
        'gradient-blue-purple': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'Segoe UI', 'sans-serif'],
        display: ['Poppins', 'Noto Sans JP', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
        'gradient-x': 'gradientX 15s ease infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { 
            opacity: '0',
            transform: 'translateY(30px)',
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
        scaleIn: {
          from: {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(37, 99, 235, 0.5), 0 0 20px rgba(37, 99, 235, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(37, 99, 235, 0.8), 0 0 40px rgba(37, 99, 235, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
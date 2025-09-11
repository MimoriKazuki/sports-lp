'use client'

import { useCountdown } from '@/hooks/useCountdown'

export default function CountdownTimer() {
  const { days, hours, showCountdown } = useCountdown('2025-10-26T13:00:00')

  if (!showCountdown) return null

  return (
    <div className="fixed bottom-5 right-5 bg-primary-green text-white px-5 py-3 shadow-xl z-30 hidden md:block">
      <p className="font-bold text-sm uppercase tracking-wider">
        開催まで {days}日 {hours}時間
      </p>
    </div>
  )
}
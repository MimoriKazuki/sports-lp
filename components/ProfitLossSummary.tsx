'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { fetchExpenses } from '@/lib/expenses-client'

export default function ProfitLossSummary() {
  const [revenue, setRevenue] = useState(0)
  const [expenses, setExpenses] = useState(0)
  const [profit, setProfit] = useState(0)
  const [entryCount, setEntryCount] = useState(0)
  const [categorySummary, setCategorySummary] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    loadFinancialData()
  }, [])

  const loadFinancialData = async () => {
    let totalRevenue = 0

    // 売上（エントリー）を計算
    try {
      const response = await fetch('/api/entries')
      if (response.ok) {
        const data = await response.json()
        const entries = data.entries || []
        const paidEntries = entries.filter((e: any) => e.payment_status === 'paid')
        totalRevenue = paidEntries.length * 3000 // 参加費3,000円
        setRevenue(totalRevenue)
        setEntryCount(paidEntries.length)
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error)
    }

    // 経費を取得
    const expenseData = await fetchExpenses()
    setExpenses(expenseData.total)
    setCategorySummary(expenseData.categorySummary)

    // 利益を計算
    setProfit(totalRevenue - expenseData.total)
  }

  const getCategoryLabel = (code: string) => {
    const labels: { [key: string]: string } = {
      venue: '会場費',
      equipment: '備品・道具',
      prize: '賞品・景品',
      printing: '印刷費',
      transportation: '交通費',
      staff: 'スタッフ費用',
      refreshments: '飲食・軽食',
      insurance: '保険',
      advertising: '広告・宣伝',
      other: 'その他'
    }
    return labels[code] || code
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">収支サマリー</h2>

      {/* メイン収支カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 売上 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-green-600 font-medium">売上</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            ¥{revenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            {entryCount}名 × ¥3,000
          </p>
        </div>

        {/* 経費 */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-500 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm text-red-600 font-medium">経費</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            ¥{expenses.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            {Object.keys(categorySummary).length}カテゴリ
          </p>
        </div>

        {/* 利益 */}
        <div className={`bg-gradient-to-br ${profit >= 0 ? 'from-blue-50 to-blue-100' : 'from-gray-50 to-gray-100'} p-6 rounded-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`${profit >= 0 ? 'bg-blue-500' : 'bg-gray-500'} p-3 rounded-lg`}>
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className={`text-sm ${profit >= 0 ? 'text-blue-600' : 'text-gray-600'} font-medium`}>
              {profit >= 0 ? '利益' : '損失'}
            </span>
          </div>
          <p className={`text-3xl font-bold ${profit >= 0 ? 'text-blue-600' : 'text-red-600'} mb-1`}>
            ¥{Math.abs(profit).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            利益率: {revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {/* 経費内訳 */}
      {Object.keys(categorySummary).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">経費内訳</h3>
          <div className="space-y-3">
            {Object.entries(categorySummary)
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount]) => {
                const percentage = expenses > 0 ? (amount / expenses) * 100 : 0
                return (
                  <div key={category} className="flex items-center gap-4">
                    <div className="w-32 text-sm text-gray-600">
                      {getCategoryLabel(category)}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                        <span className="absolute inset-0 flex items-center px-2 text-xs font-medium text-gray-700">
                          ¥{amount.toLocaleString()} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* 収支の健全性インジケーター */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${profit >= 0 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          <p className="text-sm text-gray-600">
            {profit >= 0
              ? `現在の収支は健全です。利益率${((profit / revenue) * 100).toFixed(1)}%を維持しています。`
              : `現在赤字状態です。あと${Math.ceil(Math.abs(profit) / 3000)}名の参加で黒字化します。`
            }
          </p>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Trash2, Users, UserCheck, UserX, Download, Search, Filter, RefreshCw } from 'lucide-react'
import { Entry } from '@/lib/entries'

export default function AdminDashboard() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [counts, setCounts] = useState({ male: 0, female: 0, total: 0 })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEntries()
    // 30秒ごとに自動更新
    const interval = setInterval(fetchEntries, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entries')
      const data = await response.json()
      setEntries(data.entries)
      setCounts(data.counts)
    } catch (error) {
      console.error('Failed to fetch entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('このエントリーを削除しますか？')) return

    try {
      const response = await fetch(`/api/entries?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchEntries()
      }
    } catch (error) {
      console.error('Failed to delete entry:', error)
    }
  }

  const exportToCSV = () => {
    const headers = ['ID', '氏名', '年齢', '性別', '電話番号', 'メールアドレス', '登録日時']
    const csvContent = [
      headers.join(','),
      ...filteredEntries.map(entry => [
        entry.id,
        entry.name,
        entry.age,
        entry.gender === 'male' ? '男性' : '女性',
        entry.phone,
        entry.email,
        new Date(entry.createdAt).toLocaleString('ja-JP')
      ].join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `landbridge_cup_entries_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.phone.includes(searchTerm)
    const matchesGender = filterGender === 'all' || entry.gender === filterGender
    return matchesSearch && matchesGender
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="bg-primary-forest text-white p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold">LANDBRIDGE CUP 2025 管理画面</h1>
          <p className="mt-2 text-white/80">エントリー管理システム</p>
        </div>

        {/* 統計情報 - 大きく表示 */}
        <div className="bg-gradient-to-r from-primary-green/10 to-primary-emerald/10 p-8 border-b">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary-forest">📊 現在のエントリー状況</h2>
            <button
              onClick={fetchEntries}
              className="flex items-center gap-2 px-4 py-2 bg-white text-primary-green border border-primary-green rounded-lg hover:bg-primary-green hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              更新
            </button>
          </div>
          
          {/* メイン統計カード */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* 総エントリー */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-primary-forest">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">総エントリー数</p>
                  <p className="text-4xl font-bold text-primary-forest">{counts.total}</p>
                  <p className="text-sm text-gray-500 mt-1">定員: 32名</p>
                </div>
                <div className="text-right">
                  <Users className="w-12 h-12 text-primary-forest/30 mb-2" />
                  <p className="text-2xl font-bold text-primary-green">{Math.round((counts.total / 32) * 100)}%</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-primary-green to-primary-emerald h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${Math.min((counts.total / 32) * 100, 100)}%` }}
                >
                  {counts.total > 0 && (
                    <span className="text-xs text-white font-bold">{counts.total}/32</span>
                  )}
                </div>
              </div>
            </div>

            {/* 男性エントリー */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-primary-green">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">男性エントリー</p>
                  <p className="text-4xl font-bold text-primary-green">{counts.male}</p>
                  <p className="text-sm text-gray-500 mt-1">定員: 16名</p>
                </div>
                <div className="text-right">
                  <UserCheck className="w-12 h-12 text-primary-green/30 mb-2" />
                  <p className="text-lg font-bold text-gray-600">残り {16 - counts.male}名</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-primary-green h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${Math.min((counts.male / 16) * 100, 100)}%` }}
                >
                  {counts.male > 0 && (
                    <span className="text-xs text-white font-bold">{counts.male}/16</span>
                  )}
                </div>
              </div>
              {counts.male >= 16 && (
                <p className="text-red-600 text-sm font-bold mt-2">⚠️ 定員に達しました</p>
              )}
            </div>

            {/* 女性エントリー */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-primary-emerald">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">女性エントリー</p>
                  <p className="text-4xl font-bold text-primary-emerald">{counts.female}</p>
                  <p className="text-sm text-gray-500 mt-1">定員: 16名</p>
                </div>
                <div className="text-right">
                  <UserX className="w-12 h-12 text-primary-emerald/30 mb-2" />
                  <p className="text-lg font-bold text-gray-600">残り {16 - counts.female}名</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-primary-emerald h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${Math.min((counts.female / 16) * 100, 100)}%` }}
                >
                  {counts.female > 0 && (
                    <span className="text-xs text-white font-bold">{counts.female}/16</span>
                  )}
                </div>
              </div>
              {counts.female >= 16 && (
                <p className="text-red-600 text-sm font-bold mt-2">⚠️ 定員に達しました</p>
              )}
            </div>
          </div>

          {/* 募集状況サマリー */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">募集状況:</span>
                {counts.total >= 32 ? (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                    🚫 募集終了
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                    ✅ 募集中
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                総残り枠: <span className="font-bold text-primary-forest text-lg">{32 - counts.total}名</span>
              </div>
            </div>
          </div>
        </div>

        {/* フィルター&検索 */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="名前、メール、電話番号で検索..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-green"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-green"
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value as any)}
              >
                <option value="all">全て</option>
                <option value="male">男性のみ</option>
                <option value="female">女性のみ</option>
              </select>
              
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-forest transition-colors"
              >
                <Download className="w-4 h-4" />
                CSV出力
              </button>
            </div>
          </div>
        </div>

        {/* エントリーリスト */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  氏名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  年齢
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  性別
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  電話番号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  メールアドレス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  登録日時
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{entry.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entry.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.age}歳
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      entry.gender === 'male' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {entry.gender === 'male' ? '男性' : '女性'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(entry.createdAt).toLocaleString('ja-JP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredEntries.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              エントリーが見つかりません
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
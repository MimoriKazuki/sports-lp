'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Trash2, Edit2, Plus, X } from 'lucide-react'
import {
  Expense,
  ExpenseCategory,
  fetchExpenses,
  addExpense,
  updateExpense,
  deleteExpense
} from '@/lib/expenses-client'

export default function ExpenseManager() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [categorySummary, setCategorySummary] = useState<{ [key: string]: number }>({})

  // フォームの状態
  const [formData, setFormData] = useState<Expense>({
    category: '',
    description: '',
    amount: 0,
    expense_date: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const data = await fetchExpenses()

    // カテゴリを設定
    setCategories(data.categories)

    // 経費を設定
    setExpenses(data.expenses)

    // 合計を設定
    setTotalExpenses(data.total)

    // カテゴリ別集計を設定
    setCategorySummary(data.categorySummary)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingExpense) {
      // 更新
      await updateExpense(editingExpense.id!, formData)
    } else {
      // 新規追加
      await addExpense(formData)
    }

    // フォームをリセット
    setFormData({
      category: '',
      description: '',
      amount: 0,
      expense_date: format(new Date(), 'yyyy-MM-dd'),
      notes: ''
    })
    setEditingExpense(null)
    setShowForm(false)

    // データを再読み込み
    await loadData()
  }

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setFormData(expense)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('この経費を削除してもよろしいですか？')) {
      await deleteExpense(id)
      await loadData()
    }
  }

  const getCategoryName = (code: string) => {
    const category = categories.find(c => c.code === code)
    return category ? category.name_ja : code
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">経費管理</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          経費を追加
        </button>
      </div>

      {/* 経費入力フォーム */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingExpense ? '経費を編集' : '新規経費'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingExpense(null)
                  setFormData({
                    category: '',
                    description: '',
                    amount: 0,
                    expense_date: format(new Date(), 'yyyy-MM-dd'),
                    notes: ''
                  })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  カテゴリ <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">選択してください</option>
                  {categories.map((cat) => (
                    <option key={cat.code} value={cat.code}>
                      {cat.name_ja}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  項目名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  金額（円） <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  支出日 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.expense_date}
                  onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  備考
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingExpense ? '更新' : '追加'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingExpense(null)
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 集計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">総経費</p>
          <p className="text-2xl font-bold text-red-600">
            ¥{totalExpenses.toLocaleString()}
          </p>
        </div>

        {/* カテゴリ別TOP2 */}
        {Object.entries(categorySummary)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 2)
          .map(([category, amount]) => (
            <div key={category} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">{getCategoryName(category)}</p>
              <p className="text-xl font-bold text-gray-800">
                ¥{amount.toLocaleString()}
              </p>
            </div>
          ))}
      </div>

      {/* 経費一覧 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">日付</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">カテゴリ</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">項目名</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">金額</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">備考</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  {format(new Date(expense.expense_date), 'yyyy/MM/dd', { locale: ja })}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded">
                    {getCategoryName(expense.category)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium">{expense.description}</td>
                <td className="px-4 py-3 text-sm text-right font-medium">
                  ¥{expense.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{expense.notes || '-'}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id!)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {expenses.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            経費データがありません
          </div>
        )}
      </div>
    </div>
  )
}
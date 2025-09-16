// クライアントサイドで使用する経費管理関数

export interface Expense {
  id?: string
  category: string
  description: string
  amount: number
  expense_date: string
  receipt_url?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface ExpenseCategory {
  id: number
  code: string
  name_ja: string
  display_order: number
}

export interface ExpenseData {
  expenses: Expense[]
  categories: ExpenseCategory[]
  total: number
  categorySummary: { [key: string]: number }
}

// 経費データを取得
export async function fetchExpenses(params?: {
  category?: string
  startDate?: string
  endDate?: string
}): Promise<ExpenseData> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category)
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)

    const response = await fetch(`/api/expenses${queryParams.toString() ? '?' + queryParams.toString() : ''}`)
    if (!response.ok) {
      throw new Error('Failed to fetch expenses')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return {
      expenses: [],
      categories: [],
      total: 0,
      categorySummary: {}
    }
  }
}

// 経費を追加
export async function addExpense(expense: Expense): Promise<Expense | null> {
  try {
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    })

    if (!response.ok) {
      throw new Error('Failed to add expense')
    }

    return await response.json()
  } catch (error) {
    console.error('Error adding expense:', error)
    return null
  }
}

// 経費を更新
export async function updateExpense(id: string, expense: Partial<Expense>): Promise<Expense | null> {
  try {
    const response = await fetch('/api/expenses', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...expense }),
    })

    if (!response.ok) {
      throw new Error('Failed to update expense')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating expense:', error)
    return null
  }
}

// 経費を削除
export async function deleteExpense(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/expenses?id=${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete expense')
    }

    return true
  } catch (error) {
    console.error('Error deleting expense:', error)
    return false
  }
}
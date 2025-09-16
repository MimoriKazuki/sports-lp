import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

// 経費カテゴリを取得
export async function getExpenseCategories(): Promise<ExpenseCategory[]> {
  const { data, error } = await supabase
    .from('expense_categories')
    .select('*')
    .order('display_order')

  if (error) {
    console.error('Error fetching expense categories:', error)
    return []
  }

  return data || []
}

// 経費を追加
export async function addExpense(expense: Expense) {
  const { data, error } = await supabase
    .from('expenses')
    .insert([expense])
    .select()
    .single()

  if (error) {
    console.error('Error adding expense:', error)
    return null
  }

  return data
}

// すべての経費を取得
export async function getAllExpenses() {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('expense_date', { ascending: false })

  if (error) {
    console.error('Error fetching expenses:', error)
    return []
  }

  return data || []
}

// 期間指定で経費を取得
export async function getExpensesByDateRange(startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .gte('expense_date', startDate)
    .lte('expense_date', endDate)
    .order('expense_date', { ascending: false })

  if (error) {
    console.error('Error fetching expenses by date range:', error)
    return []
  }

  return data || []
}

// カテゴリ別経費を取得
export async function getExpensesByCategory(category: string) {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('category', category)
    .order('expense_date', { ascending: false })

  if (error) {
    console.error('Error fetching expenses by category:', error)
    return []
  }

  return data || []
}

// 経費を更新
export async function updateExpense(id: string, expense: Partial<Expense>) {
  const { data, error } = await supabase
    .from('expenses')
    .update(expense)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating expense:', error)
    return null
  }

  return data
}

// 経費を削除
export async function deleteExpense(id: string) {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting expense:', error)
    return false
  }

  return true
}

// 経費の合計を計算
export async function getTotalExpenses(startDate?: string, endDate?: string) {
  let query = supabase
    .from('expenses')
    .select('amount')

  if (startDate) {
    query = query.gte('expense_date', startDate)
  }
  if (endDate) {
    query = query.lte('expense_date', endDate)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error calculating total expenses:', error)
    return 0
  }

  return data?.reduce((sum, expense) => sum + expense.amount, 0) || 0
}

// カテゴリ別経費集計
export async function getExpenseSummaryByCategory(startDate?: string, endDate?: string) {
  let query = supabase
    .from('expenses')
    .select('category, amount')

  if (startDate) {
    query = query.gte('expense_date', startDate)
  }
  if (endDate) {
    query = query.lte('expense_date', endDate)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching expense summary:', error)
    return {}
  }

  const summary: { [key: string]: number } = {}
  data?.forEach(expense => {
    if (!summary[expense.category]) {
      summary[expense.category] = 0
    }
    summary[expense.category] += expense.amount
  })

  return summary
}
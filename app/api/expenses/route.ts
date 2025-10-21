import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// サーバーサイドでのみservice roleキーを使用
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 経費一覧の取得
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')

    let query = supabase.from('expenses').select('*')

    if (category) {
      query = query.eq('category', category)
    }
    if (startDate) {
      query = query.gte('expense_date', startDate)
    }
    if (endDate) {
      query = query.lte('expense_date', endDate)
    }

    const { data: expenses, error: expensesError } = await query.order('expense_date', { ascending: false })

    if (expensesError) {
      throw expensesError
    }

    // カテゴリ一覧も取得
    const { data: categories, error: categoriesError } = await supabase
      .from('expense_categories')
      .select('*')
      .order('display_order')

    if (categoriesError) {
      throw categoriesError
    }

    // 合計を計算
    const total = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0

    // カテゴリ別集計
    const categorySummary: { [key: string]: number } = {}
    expenses?.forEach(expense => {
      if (!categorySummary[expense.category]) {
        categorySummary[expense.category] = 0
      }
      categorySummary[expense.category] += expense.amount
    })

    return NextResponse.json({
      expenses: expenses || [],
      categories: categories || [],
      total,
      categorySummary
    })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

// 経費の追加
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('expenses')
      .insert([body])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    )
  }
}

// 経費の更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating expense:', error)
    return NextResponse.json(
      { error: 'Failed to update expense' },
      { status: 500 }
    )
  }
}

// 経費の削除
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting expense:', error)
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    )
  }
}
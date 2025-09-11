import { NextResponse } from 'next/server'
import { getEntries, getEntryStats, deleteEntry } from '@/lib/supabase-entries'

export async function GET() {
  try {
    const [entries, stats] = await Promise.all([
      getEntries(),
      getEntryStats()
    ])
    
    return NextResponse.json({
      entries,
      counts: {
        male: stats.male_count,
        female: stats.female_count,
        total: stats.total_count
      }
    })
  } catch (error) {
    console.error('Error fetching entries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch entries' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      )
    }
    
    await deleteEntry(id)
    const stats = await getEntryStats()
    
    return NextResponse.json({
      success: true,
      counts: {
        male: stats.male_count,
        female: stats.female_count,
        total: stats.total_count
      }
    })
  } catch (error) {
    console.error('Error deleting entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete entry' },
      { status: 500 }
    )
  }
}
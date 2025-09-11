// エントリーデータの型定義と管理
export interface Entry {
  id: string
  name: string
  age: number
  gender: 'male' | 'female'
  phone: string
  email: string
  createdAt: Date
}

// メモリ内でデータを管理（本番環境ではデータベースを使用）
let entries: Entry[] = [
  {
    id: '1',
    name: '山田太郎',
    age: 28,
    gender: 'male',
    phone: '090-1234-5678',
    email: 'yamada@example.com',
    createdAt: new Date('2025-01-10T10:00:00')
  },
  {
    id: '2',
    name: '佐藤花子',
    age: 25,
    gender: 'female',
    phone: '080-2345-6789',
    email: 'sato@example.com',
    createdAt: new Date('2025-01-10T11:00:00')
  },
  {
    id: '3',
    name: '鈴木一郎',
    age: 30,
    gender: 'male',
    phone: '070-3456-7890',
    email: 'suzuki@example.com',
    createdAt: new Date('2025-01-10T12:00:00')
  },
  {
    id: '4',
    name: '田中美咲',
    age: 22,
    gender: 'female',
    phone: '090-4567-8901',
    email: 'tanaka@example.com',
    createdAt: new Date('2025-01-10T13:00:00')
  },
  {
    id: '5',
    name: '高橋健',
    age: 35,
    gender: 'male',
    phone: '080-5678-9012',
    email: 'takahashi@example.com',
    createdAt: new Date('2025-01-10T14:00:00')
  },
  {
    id: '6',
    name: '伊藤愛',
    age: 27,
    gender: 'female',
    phone: '070-6789-0123',
    email: 'ito@example.com',
    createdAt: new Date('2025-01-10T15:00:00')
  },
  {
    id: '7',
    name: '渡辺翔太',
    age: 26,
    gender: 'male',
    phone: '090-7890-1234',
    email: 'watanabe@example.com',
    createdAt: new Date('2025-01-10T16:00:00')
  },
  {
    id: '8',
    name: '小林真由美',
    age: 29,
    gender: 'female',
    phone: '080-8901-2345',
    email: 'kobayashi@example.com',
    createdAt: new Date('2025-01-10T17:00:00')
  },
  {
    id: '9',
    name: '山本大輔',
    age: 31,
    gender: 'male',
    phone: '070-9012-3456',
    email: 'yamamoto@example.com',
    createdAt: new Date('2025-01-11T09:00:00')
  },
  {
    id: '10',
    name: '中村優子',
    age: 24,
    gender: 'female',
    phone: '090-0123-4567',
    email: 'nakamura@example.com',
    createdAt: new Date('2025-01-11T10:00:00')
  },
  {
    id: '11',
    name: '森田健太',
    age: 33,
    gender: 'male',
    phone: '080-1234-5678',
    email: 'morita@example.com',
    createdAt: new Date('2025-01-11T11:00:00')
  },
  {
    id: '12',
    name: '石田さくら',
    age: 21,
    gender: 'female',
    phone: '070-2345-6789',
    email: 'ishida@example.com',
    createdAt: new Date('2025-01-11T12:00:00')
  },
  {
    id: '13',
    name: '木村拓哉',
    age: 28,
    gender: 'male',
    phone: '090-3456-7890',
    email: 'kimura@example.com',
    createdAt: new Date('2025-01-11T13:00:00')
  },
  {
    id: '14',
    name: '吉田理恵',
    age: 26,
    gender: 'female',
    phone: '080-4567-8901',
    email: 'yoshida@example.com',
    createdAt: new Date('2025-01-11T14:00:00')
  }
]

export function getEntries(): Entry[] {
  return entries
}

export function getEntryCounts() {
  const maleCount = entries.filter(e => e.gender === 'male').length
  const femaleCount = entries.filter(e => e.gender === 'female').length
  return {
    male: maleCount,
    female: femaleCount,
    total: entries.length
  }
}

export function addEntry(entry: Omit<Entry, 'id' | 'createdAt'>): Entry {
  const newEntry: Entry = {
    ...entry,
    id: Date.now().toString(),
    createdAt: new Date()
  }
  entries.push(newEntry)
  return newEntry
}

export function deleteEntry(id: string): boolean {
  const index = entries.findIndex(e => e.id === id)
  if (index > -1) {
    entries.splice(index, 1)
    return true
  }
  return false
}

export function updateEntry(id: string, updates: Partial<Omit<Entry, 'id' | 'createdAt'>>): Entry | null {
  const index = entries.findIndex(e => e.id === id)
  if (index > -1) {
    entries[index] = { ...entries[index], ...updates }
    return entries[index]
  }
  return null
}
-- 既存のオブジェクトをチェックしながら作成するSQL

-- 経費テーブルの作成（存在しない場合のみ）
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,
  expense_date TIMESTAMP WITH TIME ZONE NOT NULL,
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- カテゴリを日本語で管理するための参照テーブル（存在しない場合のみ）
CREATE TABLE IF NOT EXISTS expense_categories (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name_ja VARCHAR(100) NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- カテゴリデータの挿入（重複を無視）
INSERT INTO expense_categories (code, name_ja, display_order) VALUES
  ('venue', '会場費', 1),
  ('equipment', '備品・道具', 2),
  ('prize', '賞品・景品', 3),
  ('printing', '印刷費', 4),
  ('transportation', '交通費', 5),
  ('staff', 'スタッフ費用', 6),
  ('refreshments', '飲食・軽食', 7),
  ('insurance', '保険', 8),
  ('advertising', '広告・宣伝', 9),
  ('other', 'その他', 10)
ON CONFLICT (code) DO NOTHING;

-- RLSの有効化（エラーを無視）
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;

-- ポリシーの削除と再作成
DROP POLICY IF EXISTS "Enable all operations for service role" ON expenses;
CREATE POLICY "Enable all operations for service role" ON expenses
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable read for all users" ON expense_categories;
CREATE POLICY "Enable read for all users" ON expense_categories
  FOR SELECT USING (true);

-- 更新日時を自動更新する関数（既に存在する可能性があるので置き換え）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- トリガーの削除と再作成
DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- インデックスの作成（存在しない場合のみ）
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses(expense_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at DESC);
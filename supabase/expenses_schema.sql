-- 経費テーブルの作成
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

-- 経費カテゴリのENUM型（既に存在する場合はスキップ）
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_category') THEN
        CREATE TYPE expense_category AS ENUM (
          'venue', -- 会場費
          'equipment', -- 備品・道具
          'prize', -- 賞品・景品
          'printing', -- 印刷費
          'transportation', -- 交通費
          'staff', -- スタッフ費用
          'refreshments', -- 飲食・軽食
          'insurance', -- 保険
          'advertising', -- 広告・宣伝
          'other' -- その他
        );
    END IF;
END$$;

-- カテゴリを日本語で管理するための参照テーブル
CREATE TABLE IF NOT EXISTS expense_categories (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name_ja VARCHAR(100) NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- カテゴリデータの挿入
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

-- RLSの有効化
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;

-- 管理者のみアクセス可能なポリシー（service_roleキーを使用）
CREATE POLICY "Enable all operations for service role" ON expenses
  FOR ALL USING (true);

CREATE POLICY "Enable read for all users" ON expense_categories
  FOR SELECT USING (true);

-- 更新日時を自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE
  ON expenses FOR EACH ROW EXECUTE PROCEDURE
  update_updated_at_column();

-- インデックスの作成
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date DESC);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_created_at ON expenses(created_at DESC);
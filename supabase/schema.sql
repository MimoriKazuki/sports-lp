-- Supabaseデータベーススキーマ
-- このSQLをSupabaseのSQL Editorで実行してください

-- エントリーテーブル
CREATE TABLE IF NOT EXISTS entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age < 100),
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  stripe_session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- メールアドレスにユニークインデックスを追加（重複エントリー防止）
CREATE UNIQUE INDEX idx_entries_email ON entries(email);

-- 性別ごとのエントリー数を取得するビュー
CREATE OR REPLACE VIEW entry_counts AS
SELECT 
  COUNT(*) FILTER (WHERE gender = 'male' AND payment_status = 'paid') as male_count,
  COUNT(*) FILTER (WHERE gender = 'female' AND payment_status = 'paid') as female_count,
  COUNT(*) FILTER (WHERE payment_status = 'paid') as total_count
FROM entries;

-- 更新日時を自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_entries_updated_at BEFORE UPDATE
  ON entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) を有効化
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- 管理者用のポリシー（Service Roleキーを使用する場合のみ全アクセス可能）
CREATE POLICY "Service role can do everything" ON entries
  FOR ALL USING (auth.role() = 'service_role');

-- 読み取り専用ポリシー（認証なしでカウントのみ取得可能）
CREATE POLICY "Anyone can read counts" ON entries
  FOR SELECT USING (true);

-- エントリー統計を返す関数
CREATE OR REPLACE FUNCTION get_entry_stats()
RETURNS TABLE (
  male_count INTEGER,
  female_count INTEGER,
  total_count INTEGER,
  male_remaining INTEGER,
  female_remaining INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE gender = 'male' AND payment_status = 'paid')::INTEGER as male_count,
    COUNT(*) FILTER (WHERE gender = 'female' AND payment_status = 'paid')::INTEGER as female_count,
    COUNT(*) FILTER (WHERE payment_status = 'paid')::INTEGER as total_count,
    (17 - COUNT(*) FILTER (WHERE gender = 'male' AND payment_status = 'paid'))::INTEGER as male_remaining,
    (16 - COUNT(*) FILTER (WHERE gender = 'female' AND payment_status = 'paid'))::INTEGER as female_remaining
  FROM entries;
END;
$$ LANGUAGE plpgsql;

-- サンプルデータの挿入（開発用）
INSERT INTO entries (name, age, gender, phone, email, payment_status) VALUES
  ('山田太郎', 28, 'male', '090-1234-5678', 'yamada@example.com', 'paid'),
  ('佐藤花子', 25, 'female', '080-2345-6789', 'sato@example.com', 'paid'),
  ('鈴木一郎', 30, 'male', '070-3456-7890', 'suzuki@example.com', 'paid'),
  ('田中美咲', 22, 'female', '090-4567-8901', 'tanaka@example.com', 'paid'),
  ('高橋健', 35, 'male', '080-5678-9012', 'takahashi@example.com', 'paid'),
  ('伊藤愛', 27, 'female', '070-6789-0123', 'ito@example.com', 'paid'),
  ('渡辺翔太', 26, 'male', '090-7890-1234', 'watanabe@example.com', 'paid'),
  ('小林真由美', 29, 'female', '080-8901-2345', 'kobayashi@example.com', 'paid')
ON CONFLICT (email) DO NOTHING;
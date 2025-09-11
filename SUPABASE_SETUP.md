# Supabaseセットアップガイド

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセス
2. アカウントを作成（GitHubアカウントでログイン可能）
3. 「New Project」をクリック
4. プロジェクト情報を入力：
   - プロジェクト名: `landbridge-cup`
   - データベースパスワード: 安全なパスワードを設定
   - リージョン: `Northeast Asia (Tokyo)`を選択

## 2. データベースのセットアップ

1. Supabaseダッシュボードで「SQL Editor」を開く
2. `/supabase/schema.sql`の内容をコピー
3. SQL Editorに貼り付けて「Run」をクリック

## 3. APIキーの取得と設定

1. Supabaseダッシュボードで「Settings」→「API」
2. 以下のキーをコピー：
   - `Project URL`
   - `anon public`キー
   - `service_role secret`キー

3. `.env.local`を更新：

```env
NEXT_PUBLIC_SUPABASE_URL=あなたのProject URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのanon publicキー
SUPABASE_SERVICE_ROLE_KEY=あなたのservice_role secretキー
```

## 4. テーブル構造

### entriesテーブル
- `id`: UUID (主キー)
- `name`: 氏名
- `age`: 年齢
- `gender`: 性別（male/female）
- `phone`: 電話番号
- `email`: メールアドレス（ユニーク）
- `payment_status`: 決済状態（pending/paid/failed）
- `stripe_session_id`: StripeセッションID
- `created_at`: 作成日時
- `updated_at`: 更新日時

## 5. セキュリティ設定

Row Level Security (RLS)が有効になっています：
- Service Roleキー: 全操作可能（管理画面用）
- Anonキー: 読み取りのみ（統計取得用）

## 6. 動作確認

1. アプリケーションを起動
```bash
npm run dev
```

2. 管理画面にアクセス
```
http://localhost:3000/admin
```

3. エントリーが表示されることを確認

## 7. トラブルシューティング

### データが表示されない場合
- APIキーが正しく設定されているか確認
- Supabaseプロジェクトが起動しているか確認
- SQLスキーマが正しく実行されたか確認

### エラーが発生する場合
- Supabaseダッシュボードで「Logs」を確認
- ブラウザのコンソールでエラーメッセージを確認

## 8. 本番環境への移行

1. 本番用のSupabaseプロジェクトを作成
2. 本番用のAPIキーに置き換え
3. Vercelなどのホスティングサービスに環境変数を設定

## データのバックアップ

Supabaseダッシュボードから：
1. 「Database」→「Backups」
2. 「Create backup」をクリック
3. 定期的にバックアップを取得
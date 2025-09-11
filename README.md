# LANDBRIDGE CUP 2025 - ビーチボールバレー大会

## 概要
LANDBRIDGE CUP 2025の公式ウェブサイト。エントリー管理、決済処理、参加者管理を含む総合的な大会運営システム。

## 技術スタック
- **フロントエンド**: Next.js 15, TypeScript, Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **決済**: Stripe
- **ホスティング**: Vercel（推奨）

## セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.local`ファイルを作成し、以下の変数を設定：

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
STRIPE_SECRET_KEY=your_key
STRIPE_WEBHOOK_SECRET=your_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
```

### 3. Supabaseデータベースのセットアップ
1. [Supabase](https://supabase.com)でプロジェクトを作成
2. SQL Editorで`/supabase/schema.sql`を実行
3. APIキーを`.env.local`に設定

詳細は[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)を参照

### 4. Stripe決済のセットアップ
1. [Stripe](https://stripe.com)でアカウントを作成
2. APIキーを取得
3. `.env.local`に設定

詳細は[STRIPE_SETUP.md](./STRIPE_SETUP.md)を参照

### 5. 開発サーバーの起動
```bash
npm run dev
```

http://localhost:3000 でアクセス可能

## デプロイ（Vercel）

### 1. Vercelにプロジェクトをインポート
```bash
npx vercel
```

### 2. 環境変数の設定
Vercelダッシュボードで以下の環境変数を設定：
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. デプロイ
```bash
vercel --prod
```

## 主な機能

### 利用者向け
- 大会情報の閲覧
- オンラインエントリー
- Stripe決済
- エントリー完了通知

### 管理者向け（/admin）
- エントリー管理
- 参加者リスト表示
- CSV出力
- リアルタイム統計

**管理画面ログイン**:
- ユーザー名: `admin`
- パスワード: `landbridge2025`

## プロジェクト構成
```
├── app/                  # Next.js App Router
│   ├── admin/           # 管理画面
│   ├── api/             # APIルート
│   └── payment-success/ # 決済完了ページ
├── components/          # Reactコンポーネント
├── lib/                 # ユーティリティ
│   ├── supabase.ts     # Supabaseクライアント
│   └── supabase-entries.ts # エントリー管理
├── supabase/           # データベーススキーマ
└── public/             # 静的ファイル
```

## 注意事項
- 本番環境では必ず本番用のAPIキーを使用
- 定期的なデータバックアップを推奨
- Supabaseの無料プランには制限あり

## サポート
問題が発生した場合は、以下を確認：
1. 環境変数が正しく設定されているか
2. Supabaseプロジェクトが起動しているか
3. Stripeアカウントが有効か

## ライセンス
© 2025 LandBridge株式会社
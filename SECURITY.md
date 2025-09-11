# セキュリティ対策

LANDBRIDGE CUP 2025ウェブサイトには、以下の包括的なセキュリティ対策が実装されています。

## 実装済みのセキュリティ対策

### 1. 入力検証とサニタイゼーション
- **Zod**による厳格な入力検証
- **DOMPurify**によるXSS対策のためのサニタイゼーション
- SQLインジェクション対策（Supabaseのパラメータ化クエリ）
- メールアドレス、電話番号の形式検証
- 年齢制限（18-70歳）

### 2. レート制限
- エントリー作成: 10分間に5回まで/IP
- 管理者ログイン: 15分間に5回まで/IP（失敗時30分ブロック）
- 一般API: 1分間に60回まで/IP
- Webhook: 1分間に100回まで

### 3. セキュリティヘッダー
- `X-XSS-Protection`: XSS攻撃対策
- `X-Content-Type-Options`: MIMEタイプスニッフィング防止
- `X-Frame-Options`: クリックジャッキング対策
- `Strict-Transport-Security`: HTTPS強制
- `Referrer-Policy`: リファラー情報制限
- `Permissions-Policy`: 不要な権限の無効化
- `Content-Security-Policy`: リソース読み込み制限（開発中）

### 4. 認証・認可
- Stripe Webhook署名検証
- 管理画面のセッション管理
- Supabase Row Level Security (RLS)

### 5. データ保護
- 環境変数の検証
- APIキーの保護（サーバーサイドのみ）
- HTTPSの強制
- パスワードの複雑性要件

### 6. CSRF対策
- SameSite Cookieの使用
- Stripeチェックアウトによる決済処理

### 7. エラーハンドリング
- エラーメッセージの適切な処理（詳細情報の非表示）
- ログの適切な管理

## 環境変数の管理

### 必須の環境変数
```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Email
RESEND_API_KEY=re_...
```

### セキュリティベストプラクティス
1. 本番環境では必ず本番用のAPIキーを使用
2. 環境変数は`.env.local`に保存（gitignoreに追加済み）
3. Vercelなどのホスティングサービスの環境変数機能を使用

## 定期的なセキュリティチェック

### 推奨事項
1. 依存関係の定期的な更新
   ```bash
   npm audit
   npm audit fix
   ```

2. セキュリティヘッダーの確認
   - [SecurityHeaders.com](https://securityheaders.com)でチェック

3. SSL/TLS設定の確認
   - [SSL Labs](https://www.ssllabs.com/ssltest/)でチェック

## インシデント対応

セキュリティ上の問題を発見した場合：
1. 本番環境への影響を最小限に抑える
2. ログを確認して影響範囲を特定
3. 必要に応じてAPIキーをローテーション
4. Supabaseのダッシュボードで不審なアクティビティを確認

## 連絡先

セキュリティに関する報告：
- Email: sales@landbridge.co.jp
- 緊急度が高い場合は電話でも連絡可能

## 更新履歴

- 2025年1月: 初版作成
- セキュリティ対策の実装完了
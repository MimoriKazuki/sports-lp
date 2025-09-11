# Stripe決済セットアップガイド

## 1. Stripeアカウントの作成

1. [Stripe](https://stripe.com/jp)にアクセス
2. アカウントを作成（テスト環境は無料）

## 2. APIキーの取得

1. Stripeダッシュボードにログイン
2. 「開発者」→「APIキー」にアクセス
3. 以下のキーをコピー：
   - 公開可能キー（pk_test_...）
   - シークレットキー（sk_test_...）

## 3. 環境変数の設定

`.env.local`ファイルを編集：

```env
# 実際のキーに置き換えてください
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_あなたの公開可能キー
STRIPE_SECRET_KEY=sk_test_あなたのシークレットキー
```

## 4. Webhook設定（本番環境用）

1. Stripeダッシュボードで「開発者」→「Webhooks」
2. 「エンドポイントを追加」
3. エンドポイントURL: `https://あなたのドメイン/api/stripe-webhook`
4. イベントを選択：
   - `checkout.session.completed`
5. Webhook署名シークレットを`.env.local`に追加

## 5. テスト用カード番号

開発環境では以下のテストカードを使用：

- **成功**: 4242 4242 4242 4242
- **拒否**: 4000 0000 0000 0002
- **要認証**: 4000 0025 0000 3155

有効期限: 未来の任意の日付
CVC: 任意の3桁
郵便番号: 任意の5桁

## 6. 価格設定の変更

`/app/api/create-checkout-session/route.ts`の`unit_amount`を変更：

```typescript
unit_amount: 3000, // 円単位（3000 = 3,000円）
```

## 7. 本番環境への移行

1. Stripeダッシュボードで本番環境を有効化
2. 本番用のAPIキーに置き換え
3. Webhookエンドポイントを本番URLに設定
4. テストモードを無効化

## トラブルシューティング

### 決済が失敗する場合
- APIキーが正しく設定されているか確認
- Stripeアカウントが有効化されているか確認

### Webhookが動作しない場合
- エンドポイントURLが正しいか確認
- 署名シークレットが正しいか確認
- イベントタイプが選択されているか確認
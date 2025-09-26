# OIDC認証の設定ガイド

このプロジェクトではOIDC（OpenID Connect）を使用したユーザー認証を実装しています。

## 現在の実装状況

### ✅ 実装完了
- OIDC認証フローのUI（ログイン・登録画面）
- WebBrowserを使用したOIDC認証の開始
- Firebase Functions側でのOIDC認証処理
- トークン検証とFirebaseカスタムトークン生成
- ユーザープロファイルのFirestore保存

### ⚠️ 設定が必要な項目

#### 1. OIDCプロバイダーの設定

実際のOIDCプロバイダーを使用するには、以下の設定が必要です：

**Azure AD の例:**
- OIDC_ISSUER: `https://login.microsoftonline.com/{tenant-id}/v2.0`
- OIDC_CLIENT_ID: Azure AD アプリケーション ID
- OIDC_CLIENT_SECRET: Azure AD クライアントシークレット

**Google の例:**
- OIDC_ISSUER: `https://accounts.google.com`
- OIDC_CLIENT_ID: Google OAuth 2.0 クライアント ID
- OIDC_CLIENT_SECRET: Google OAuth 2.0 クライアントシークレット

**Auth0 の例:**
- OIDC_ISSUER: `https://your-tenant.auth0.com`
- OIDC_CLIENT_ID: Auth0 アプリケーション ID
- OIDC_CLIENT_SECRET: Auth0 クライアントシークレット

#### 2. Firebase Functions環境変数の設定

```bash
# Firebase Functions用の環境変数を設定
firebase functions:config:set oidc.issuer="https://your-oidc-provider.com"
firebase functions:config:set oidc.client_id="your-client-id"
firebase functions:config:set oidc.client_secret="your-client-secret"

# デプロイして設定を反映
firebase deploy --only functions
```

#### 3. アプリ側のOIDCプロバイダー設定更新

`app/(auth)/login.tsx` と `app/(auth)/register.tsx` で以下を更新：

```typescript
// 実際のOIDCプロバイダーのURLに変更
const oidcAuthUrl = 'https://your-actual-oidc-provider.com/auth';
const clientId = 'your-actual-client-id';
```

#### 4. リダイレクトURI の設定

OIDCプロバイダー側で以下のリダイレクトURIを許可：
- `com.dotob9.stickersmash://auth` （アプリ用）

## ファイル構成

```
functions/src/
├── index.ts              # メインのCloud Functions（TODO生成機能）
├── oidc-auth.ts          # OIDC認証処理
app/(auth)/
├── login.tsx             # OIDC ログイン画面
├── register.tsx          # OIDC 登録画面
```

## セキュリティ考慮事項

1. **PKCE フロー**: クライアント側でPKCE（Proof Key for Code Exchange）を実装済み
2. **トークン検証**: サーバー側でIDトークンの検証を実装
3. **Firebaseカスタムトークン**: 検証済みのOIDC情報を基にFirebaseトークンを生成
4. **クライアントシークレット**: Firebase Functions側で安全に管理

## 運用開始のチェックリスト

- [ ] OIDCプロバイダーの登録とクライアント設定
- [ ] Firebase Functions環境変数の設定
- [ ] リダイレクトURIの設定
- [ ] アプリ側のOIDC設定更新
- [ ] テスト環境での動作確認
- [ ] 本番環境へのデプロイ

## トラブルシューティング

### よくある問題

1. **「認証プロバイダーが見つからない」エラー**
   - Firebase Consoleで認証プロバイダーが有効化されているか確認

2. **「リダイレクトURIが一致しない」エラー**
   - OIDCプロバイダー側とアプリ側のリダイレクトURIが一致しているか確認

3. **トークン検証エラー**
   - OIDC_ISSUERとclient_idが正しく設定されているか確認
   - IDトークンの発行者とオーディエンスが一致しているか確認

### ログの確認方法

```bash
# Firebase Functions のログを確認
firebase functions:log

# 特定の関数のログを確認
firebase functions:log --only oidcAuth
```

## 実装のカスタマイズ

現在の実装は汎用的なOIDC認証に対応していますが、特定のプロバイダー固有の機能を使用する場合は、`functions/src/oidc-auth.ts` をカスタマイズしてください。

例：
- カスタムクレームの処理
- 追加のユーザー情報の取得
- ロールベースアクセス制御の実装
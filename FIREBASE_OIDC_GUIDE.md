# Firebase標準OIDC実装ガイド

## Firebase Authenticationに組み込まれたOIDC機能を使用

FirebaseにはOIDC（OpenID Connect）プロバイダーのサポートが標準で組み込まれています。複雑なカスタム実装は不要です。

## Firebase Console での設定手順

### 1. Firebase Consoleにアクセス
- [Firebase Console](https://console.firebase.google.com/)
- プロジェクト「message-19a76」を選択

### 2. Authentication の設定
1. 左メニュー → Authentication
2. 「Sign-in method」タブをクリック
3. 「Add new provider」をクリック
4. 「OpenID Connect」を選択

### 3. OIDCプロバイダーの設定
必要な情報を入力：

**Azure AD の場合:**
- Provider name: `Azure AD` (任意の名前)
- Provider ID: `oidc.azuread` (自動生成または手動設定)
- Client ID: Azure ADアプリケーションID
- Issuer (URL): `https://login.microsoftonline.com/{tenant-id}/v2.0`

**Google の場合:**
- Provider name: `Google OIDC`
- Provider ID: `oidc.google`
- Client ID: Google OAuth 2.0 クライアントID
- Issuer (URL): `https://accounts.google.com`

**Auth0 の場合:**
- Provider name: `Auth0`
- Provider ID: `oidc.auth0`
- Client ID: Auth0 アプリケーションID
- Issuer (URL): `https://your-tenant.auth0.com`

### 4. 追加設定
- **Scopes**: `openid email profile`
- **Custom parameters** (必要に応じて)

## React Native での実装

### 現在の実装状況
- ✅ UI は実装済み（login.tsx, register.tsx）
- ✅ Firebase Config は設定済み
- ⚠️ React Native用のOIDCフローが必要

### React Native でのOIDC認証の実装方法

#### オプション1: Firebase Auth Web SDK + WebView
```typescript
import { OAuthProvider, signInWithRedirect, getAuth } from 'firebase/auth';

const provider = new OAuthProvider('oidc.your-provider-id');
provider.addScope('email');
provider.addScope('profile');

// WebViewまたはブラウザでのリダイレクト
await signInWithRedirect(auth, provider);
```

#### オプション2: Deep Linking + Custom URL Scheme
```typescript
// app.json で URL scheme を設定
{
  "expo": {
    "scheme": "com.dotob9.stickersmash"
  }
}

// カスタムURLでのリダイレクト処理
const authUrl = `https://your-project.firebaseapp.com/__/auth/handler?providerId=oidc.your-provider`;
```

#### オプション3: Firebase Functions との連携
Firebase Functions でOIDC認証を処理し、カスタムトークンを返す方法（現在の実装）

## 推奨実装方法

React Nativeアプリでは、**Firebase Functions連携**が最も安全で確実です：

### 1. Firebase Console でOIDCプロバイダー設定
- 上記手順でOIDCプロバイダーを設定

### 2. Firebase Functions でのトークン処理
```typescript
// functions/src/index.ts
import { httpsCallable } from 'firebase/functions';

export const authenticateWithOIDC = httpsCallable(functions, 'authenticateWithOIDC');
```

### 3. アプリ側での呼び出し
```typescript
// app側
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/firebase-config';

const authenticateWithOIDC = httpsCallable(functions, 'authenticateWithOIDC');

const result = await authenticateWithOIDC({
  idToken: 'oidc-id-token-from-provider'
});
```

## 設定例（Azure AD）

### Firebase Console 設定
- Provider ID: `oidc.azuread`
- Client ID: `12345678-1234-1234-1234-123456789abc`
- Issuer URL: `https://login.microsoftonline.com/your-tenant-id/v2.0`
- Scopes: `openid email profile`

### Azure AD アプリケーション設定
- Redirect URI: `https://message-19a76.firebaseapp.com/__/auth/handler`
- Supported account types: 適切な設定を選択
- API permissions: `openid`, `email`, `profile`

## セキュリティ考慮事項

### ✅ Firebase標準機能の利点
- トークン検証は Firebase が自動処理
- セキュリティアップデートは Firebase が管理
- CSRF保護、状態管理も自動

### ⚠️ 注意点
- React Nativeでは直接のpopup認証は不可
- Deep LinkingやWebViewでの実装が必要
- カスタムURLスキームの設定が必要

## 次のステップ

1. **Firebase Console でOIDCプロバイダー設定**
   - 使用するプロバイダー（Azure AD、Google、Auth0など）を選択
   - 必要な設定情報を入力

2. **React Native 認証フローの実装**
   - WebView + Deep Linking
   - または Firebase Functions 連携

3. **テストと検証**
   - 開発環境でのテスト
   - 本番環境での動作確認

## トラブルシューティング

### よくある問題
- **「プロバイダーが見つからない」**: Firebase ConsoleでOIDCプロバイダーが正しく設定されているか確認
- **「リダイレクトURIが不正」**: Firebase AuthのリダイレクトURIを確認
- **「トークンが無効」**: OIDCプロバイダー側のクライアント設定を確認

### ログの確認
```bash
# Firebase Authentication ログ
firebase auth:export users.json
```

この標準OIDC実装により、セキュリティが向上し、実装がシンプルになります。
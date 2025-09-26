# 🎯 Google認証実装ガイド

Firebase Authenticationと連携したGoogle認証を実装しました。
最もシンプルで安定した認証方法の一つです。

## ✅ 実装完了

### フロントエンド
- `app/(auth)/login.tsx` - Googleログイン画面
- `app/(auth)/register.tsx` - Googleアカウント作成画面
- `expo-auth-session/providers/google` を使用

### バックエンド
- Firebase Authentication (標準機能)
- Firebase Functions でユーザープロファイル管理

## 🔧 Google認証の設定手順

### 1. Google Cloud Console での設定

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクトを選択または作成
3. **APIs & Services** → **Credentials** に移動

### 2. OAuth 2.0 クライアントIDの作成

#### Web アプリケーション用
```
Application type: Web application
Name: StickerSmash Web
Authorized JavaScript origins:
  - https://message-19a76.firebaseapp.com
  - http://localhost:8081 (開発用)
Authorized redirect URIs:
  - https://message-19a76.firebaseapp.com/__/auth/handler
```

#### Android 用 (必要に応じて)
```
Application type: Android
Name: StickerSmash Android
Package name: com.dotob9.stickersmash
SHA-1 certificate fingerprint: [開発用証明書のSHA-1]
```

#### iOS 用 (必要に応じて)
```
Application type: iOS
Name: StickerSmash iOS
Bundle ID: com.dotob9.stickersmash
```

### 3. Firebase Console での設定

1. [Firebase Console](https://console.firebase.google.com/project/message-19a76) にアクセス
2. **Authentication** → **Sign-in method** に移動
3. **Google** を有効化
4. Web SDK 設定で Google Cloud Console で作成したクライアントIDを設定

### 4. アプリ設定の更新

現在のクライアントIDプレースホルダーを実際の値に置き換えます：

#### `app/(auth)/login.tsx` と `app/(auth)/register.tsx` 内：
```typescript
const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: 'YOUR_ACTUAL_WEB_CLIENT_ID.googleusercontent.com', // 実際のWeb用クライアントID
  androidClientId: 'YOUR_ANDROID_CLIENT_ID.googleusercontent.com', // Android用
  iosClientId: 'YOUR_IOS_CLIENT_ID.googleusercontent.com', // iOS用
});
```

### 5. app.json/app.config.js の設定

Expo設定でOAuthリダイレクトスキームを追加：

```json
{
  "expo": {
    "scheme": "com.dotob9.stickersmash",
    "web": {
      "bundler": "metro"
    }
  }
}
```

## 🚀 動作の流れ

1. **認証開始**: ユーザーが「Googleでログイン」をタップ
2. **Google OAuth**: expo-auth-session が Google OAuth フローを開始
3. **トークン取得**: Google からアクセストークンとIDトークンを取得
4. **Firebase認証**: Firebase Auth で Google クレデンシャルを使用してサインイン
5. **プロファイル作成**: Firebase Functions でユーザープロファイルを作成/更新
6. **ログイン完了**: アプリのメイン画面に遷移

## 🔒 セキュリティ利点

- ✅ **OAuth 2.0 準拠**: 業界標準のセキュリティプロトコル
- ✅ **Firebase 管理**: Google が直接管理するセキュリティ
- ✅ **トークン自動更新**: Firebase が自動処理
- ✅ **デバイス間同期**: 同じGoogleアカウントで複数デバイス対応

## 📱 プラットフォーム対応

### Web
- ✅ ブラウザ上でのポップアップ認証
- ✅ JavaScript Origins 設定済み

### Android
- ⚠️ SHA-1 証明書フィンガープリントの設定が必要
- ⚠️ Play Console での設定が必要（本番時）

### iOS
- ⚠️ Bundle ID の設定が必要
- ⚠️ App Store Connect での設定が必要（本番時）

## 🧪 テスト手順

### 1. 開発環境でのテスト
```bash
cd /home/dotob9/StickerSmash
npx expo start --web
```

### 2. 認証フローのテスト
1. Webブラウザで http://localhost:8081 を開く
2. ログイン画面で「Googleでログイン」をクリック
3. Google認証画面で認証
4. アプリのメイン画面に遷移することを確認

### 3. ユーザープロファイルの確認
- Firebase Console → Authentication → Users でユーザー作成確認
- Firestore → users コレクションでプロファイル保存確認

## 🛠️ トラブルシューティング

### よくある問題

#### 「redirect_uri_mismatch」エラー
- Google Cloud Console でリダイレクトURIが正しく設定されているか確認
- Firebase の認証ドメインと一致しているか確認

#### 「invalid_client」エラー
- クライアントIDが正しく設定されているか確認
- Web/Android/iOS用のクライアントIDが適切に使い分けられているか確認

#### 認証画面が表示されない
- expo-auth-session, expo-web-browser がインストールされているか確認
- Google Cloud Console でOAuth同意画面が設定されているか確認

## 📊 監視・分析

### Firebase Analytics での追跡
Google認証のログイン数、成功率などを自動で追跡可能

### ユーザー管理
Firebase Console でユーザーの認証状況、最終ログイン時刻などを確認可能

## 🎉 次のステップ

1. **Google Cloud Console でOAuth設定完了**
2. **Firebase Console でGoogle認証有効化**
3. **実際のクライアントIDに更新**
4. **テスト実行**
5. **本番デプロイ**

Google認証により、ユーザーフレンドリーで安全な認証システムが完成します！
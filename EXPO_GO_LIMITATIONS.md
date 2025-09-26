# 📱 Expo Go での認証制限と解決策

## 🚫 Expo Go の制限事項

### Google OAuth の問題
- **リダイレクトURI**: `exp://c7ajnsy-anonymous-8081.exp.direct`
- **Google設定**: 事前承認されたURIのみ許可
- **結果**: 404エラー（未承認のリダイレクト先）

### Expo Go でできないこと
❌ カスタムスキーム（`com.dotob9.stickersmash://`）
❌ 事前定義されたリダイレクトURI
❌ ネイティブGoogle Sign-In

## ✅ 解決策

### 1. 開発ビルド（最も簡単）
```bash
npx expo run:android
# または
npx expo run:ios
```

**メリット**:
- カスタムスキーム使用可能
- Google OAuth正常動作
- より本番環境に近い

### 2. Firebase Email/Password認証（Expo Go対応）
```typescript
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// メール/パスワード認証はExpo Goで動作
const signUpWithEmail = async (email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result;
};
```

### 3. Expo AuthSession + カスタム設定
```typescript
// Google Cloud Console でリダイレクトURIを手動登録
const redirectUri = AuthSession.makeRedirectUri({ 
  scheme: 'exp',
  path: 'auth' 
});

// Google Console に以下を追加:
// https://auth.expo.io/@anonymous/StickerSmash
// exp://127.0.0.1:19000/--/auth
```

## 🎯 おすすめのアプローチ

### すぐに動作確認したい場合
→ **開発ビルド**（`npx expo run:android`）

### Expo Go でテストを続けたい場合  
→ **Email/Password認証**に一時的に変更

### 本格的に開発する場合
→ **EASビルド** + 本番用Google OAuth設定

## 現在の選択肢

1. **すぐ解決**: `npx expo run:android` で開発ビルド
2. **Expo Go継続**: Email認証に変更（一時的）
3. **設定変更**: Google OAuth の詳細設定（上級者向け）

どのアプローチを選びますか？
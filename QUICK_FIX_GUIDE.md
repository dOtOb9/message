# 🚀 Google認証クイック設定ガイド

現在のエラー（400エラー）を解決するための設定手順です。

## ❌ 現在の問題
- Google認証で400エラー（リクエスト形式が正しくない）
- Firebase ConsoleでGoogle認証が有効化されていない可能性

## ✅ 解決手順

### 1. Firebase Console でGoogle認証を有効化

1. **Firebase Consoleにアクセス**
   ```
   https://console.firebase.google.com/project/message-19a76/authentication/providers
   ```

2. **Google認証を有効化**
   - 「Sign-in method」タブをクリック
   - 「Google」をクリック
   - 「Enable」トグルをONにする
   - **プロジェクトの公開名**を入力（例：StickerSmash）
   - **プロジェクトサポートメール**を設定
   - 「Save」をクリック

### 2. 認証ドメインの確認

Firebase Console で以下のドメインが許可されていることを確認：
- `localhost` （開発用）
- `message-19a76.firebaseapp.com` （本番用）

### 3. Web環境でのテスト

現在のFirebase標準Google認証実装は Web環境で動作します：

```bash
# Webブラウザでテスト
http://localhost:8081
```

### 4. 動作確認

1. ブラウザで http://localhost:8081 を開く
2. 「Googleでログイン」ボタンをクリック
3. Googleポップアップで認証
4. 成功すればメイン画面に遷移

## 🔧 実装の特徴

### 現在の実装（修正済み）
- ✅ Firebase標準の `signInWithPopup` を使用
- ✅ Web環境で即座に動作可能
- ✅ 詳細なエラーメッセージ表示
- ✅ Google Cloud Console設定不要（Firebase内で完結）

### エラーハンドリング
- `auth/popup-closed-by-user` - ユーザーがキャンセル
- `auth/popup-blocked` - ブラウザがポップアップをブロック
- `auth/unauthorized-domain` - ドメインが未認証

## 📱 モバイル対応

Web環境で動作確認後、モバイル対応が必要な場合：
1. Google Cloud Console でOAuth設定
2. React Native用の認証フロー実装

## ⚡ 即座にテスト可能

Firebase Console でGoogle認証を有効化するだけで、すぐにテストできます！

## 🎯 次のステップ

1. **Firebase Console でGoogle認証有効化** ← 今すぐ実行
2. **Web環境でテスト実行**
3. **動作確認完了**
4. **モバイル対応（必要に応じて）**
# 🚨 400エラー解決 - 緊急対応ガイド

Google認証が有効だがサーバー起動に失敗し、400エラーが発生している問題の解決手順です。

## 🎯 最も可能性の高い原因

**Firebase Console の「承認済みドメイン」設定が不完全**

## ✅ 即座に確認すべき設定

### 1. 承認済みドメインの設定

**Firebase Console URL:**
```
https://console.firebase.google.com/project/message-19a76/authentication/settings
```

**必要な設定:**
- ✅ `localhost` が追加されているか
- ✅ `127.0.0.1` が追加されているか
- ✅ `message-19a76.firebaseapp.com` が追加されているか

### 2. 設定手順

1. 上記URLにアクセス
2. 「Authorized domains」セクションを確認
3. 不足しているドメインがあれば「Add domain」で追加：
   - `localhost`
   - `127.0.0.1`

## 🔍 診断ツール使用方法

1. **Webブラウザで開く:**
   ```
   http://localhost:8081
   ```

2. **診断ツールにアクセス:**
   - ログイン画面の「🔍 認証エラーの診断ツール」をクリック
   - 「診断情報を取得」で現在の設定確認
   - 「Google認証テスト」で詳細エラー確認

3. **エラー詳細の確認:**
   - ブラウザの開発者ツール（F12）でコンソールログ確認
   - 詳細なエラーコードとメッセージが表示される

## 🛠️ よくある問題と解決法

### 問題1: `auth/unauthorized-domain`
**原因:** 承認済みドメインに `localhost` が追加されていない
**解決:** Firebase Console で `localhost` を承認済みドメインに追加

### 問題2: `auth/popup-blocked`
**原因:** ブラウザがポップアップをブロック
**解決:** ブラウザのポップアップブロックを無効化

### 問題3: `auth/operation-not-allowed`
**原因:** Google認証プロバイダーが無効
**解決:** Firebase Console でGoogle認証を再度有効化

### 問題4: `auth/network-request-failed`
**原因:** ネットワークまたはCORS問題
**解決:** ブラウザキャッシュクリア、他のブラウザでテスト

## 🚀 テスト実行手順

1. **Firebase Console設定確認**
   - 承認済みドメインに `localhost` 追加

2. **ブラウザキャッシュクリア**
   ```
   Ctrl + Shift + R (強制リロード)
   ```

3. **診断ツールでテスト**
   - http://localhost:8081 → 診断ツール → Google認証テスト

4. **エラーログ確認**
   - ブラウザ開発者ツールでコンソール確認
   - 詳細なエラー情報をチェック

## 📋 チェックリスト

設定確認のためのチェックリスト：

- [ ] Firebase Console でGoogle認証が有効になっている
- [ ] 承認済みドメインに `localhost` が追加されている
- [ ] 承認済みドメインに `127.0.0.1` が追加されている
- [ ] ブラウザでポップアップが許可されている
- [ ] ブラウザキャッシュをクリアした
- [ ] 開発者ツールでエラーログを確認した

## 🆘 緊急時の回避策

もし上記で解決しない場合の代替方法：

1. **別ブラウザでテスト** (Chrome, Firefox, Safari)
2. **シークレットモードでテスト**
3. **Firebase エミュレーターの使用**
4. **Firebase プロジェクトの再作成**

## 💬 エラー報告時の情報

サポートが必要な場合は以下の情報を提供してください：

- 診断ツールの出力結果
- ブラウザコンソールのエラーログ
- 使用ブラウザとバージョン
- Firebase Console の承認済みドメイン一覧のスクリーンショット

## ⚡ 即座に試すべき設定

**最も確率の高い解決法:**
1. https://console.firebase.google.com/project/message-19a76/authentication/settings
2. Authorized domains に `localhost` を追加
3. ブラウザでハードリフレッシュ（Ctrl + Shift + R）
4. http://localhost:8081 で再テスト

この手順で99%の400エラーが解決するはずです！
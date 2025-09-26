# 🚨 Firebase WebクライアントID 設定ガイド

## 現在の問題
- **404エラー**: Googleの認証後のリダイレクトが失敗している
- **認証結果: dismiss**: Google OAuth設定が不正のため認証が中断される

## 解決手順

### 1. Firebase Console での WebクライアントID 取得

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクト「message-19a76」を選択
3. 左メニューから「Authentication」→「Sign-in method」
4. 「Google」プロバイダーをクリック
5. 「Web SDK configuration」セクションで **WebクライアントID** をコピー

### 2. Google Cloud Console での設定確認

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス  
2. プロジェクト「message-19a76」を選択
3. 左メニューから「APIとサービス」→「認証情報」
4. OAuth 2.0 クライアント ID の中から **ウェブアプリケーション** を選択
5. **承認済みのリダイレクト URI** に以下を追加：
   ```
   https://auth.expo.io/@anonymous/StickerSmash
   exp://c7ajnsy-anonymous-8081.exp.direct
   https://auth.expo.io/@dotob9/StickerSmash  (もしExpoアカウント名がdotob9の場合)
   ```

### 3. コード内の WebクライアントID を更新

現在のコード:
```typescript
clientId: '242503901797-9dq6n6u2h3d5e8s6v8r2q4l1k7m9p6e3.apps.googleusercontent.com'
```

↓ 正しいWebクライアントIDに変更:
```typescript  
clientId: '242503901797-[正しいwebclient-id].apps.googleusercontent.com'
```

### 4. Expo設定の確認

app.jsonで以下を確認:
```json
{
  "expo": {
    "scheme": "com.dotob9.stickersmash"
  }
}
```

### 5. デバッグ情報を確認

最新のログで以下を確認:
- リダイレクトURI: `exp://c7ajnsy-anonymous-8081.exp.direct`
- ClientID: 現在設定されているID
- 認証結果の詳細

## 📍 次のアクション

1. Firebase Console から正しいWebクライアントIDを取得
2. Google Cloud Console でリダイレクトURIを設定
3. コード内のclientIdを更新
4. アプリを再起動してテスト

この設定が完了すれば、404エラーと認証の dismiss 問題は解決されるはずです。
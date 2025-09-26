# モバイル環境でのGoogle認証設定ガイド

## 問題
モバイル環境（iOS/Android）でのGoogle認証が動作しない

## 解決策

### 1. Firebase Console での設定

#### Android 設定
1. Firebase Console > プロジェクト設定 > 全般
2. 「アプリを追加」> Android を選択
3. パッケージ名: `com.dotob9.stickersmash` (app.jsonのschemeと一致)
4. SHA-1フィンガープリントを追加:

```bash
# デバッグ用SHA-1フィンガープリント取得
cd android
./gradlew signingReport
```

5. `google-services.json` をダウンロードして `android/app/` に配置

#### iOS 設定
1. Firebase Console > プロジェクト設定 > 全般
2. 「アプリを追加」> iOS を選択
3. バンドルID: `com.dotob9.stickersmash`
4. `GoogleService-Info.plist` をダウンロードして `ios/` に配置

### 2. クライアントID の取得

Firebase Console > 認証 > Sign-in method > Google > Web SDK設定

- **Web Client ID**: `242503901797-[actual-web-client-id].apps.googleusercontent.com`
- **Android Client ID**: `242503901797-[actual-android-client-id].apps.googleusercontent.com`
- **iOS Client ID**: `242503901797-[actual-ios-client-id].apps.googleusercontent.com`

### 3. コード更新

`login.tsx` の `webClientId` を実際のWeb Client IDに更新:

```typescript
GoogleSignin.configure({
  webClientId: '242503901797-[actual-web-client-id].apps.googleusercontent.com',
  offlineAccess: true,
  hostedDomain: '',
  forceCodeForRefreshToken: true,
});
```

### 4. ビルド設定

```bash
# Android
npx expo run:android

# iOS  
npx expo run:ios
```

### 5. テスト手順

1. Expo Go ではなく、開発ビルドを使用
2. 実機またはエミュレーターでテスト
3. ログを確認: `npx expo logs`

### 6. よくあるエラーと解決方法

#### `SIGN_IN_REQUIRED`
- Google Play Services が必要
- エミュレーターにGoogle Play Storeをインストール

#### `DEVELOPER_ERROR`
- SHA-1フィンガープリントが正しくない
- パッケージ名が一致しない

#### `Network Error`
- google-services.json/GoogleService-Info.plist が正しく配置されていない

### 7. デバッグ情報

現在の設定状況を確認:

```javascript
// Google Sign-In設定確認
GoogleSignin.configure({...});
console.log('Google Sign-In configured');

// Play Services確認
const hasPlayServices = await GoogleSignin.hasPlayServices();
console.log('Play Services:', hasPlayServices);
```

## 現在の実装状況 (2025年9月27日更新)

✅ プラットフォーム自動判定
✅ モバイル環境: expo-auth-session でGoogle OAuth
⚠️  Web環境: 開発中（現在未対応）
⚠️  Firebase Console設定（要確認）
⚠️  実際のClient ID設定（要更新）

### 最新の変更点
- `@react-native-google-signin/google-signin` から `expo-auth-session` に変更
- Expo環境に最適化された認証フローを採用
- AsyncStorage警告は残存（FirebaseAuth設定要改善）

### 次のステップ
1. Firebase ConsoleでWebクライアントIDを正しく設定
2. リダイレクトURIをFirebase Console で承認
3. 実機でのテスト実行
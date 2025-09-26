import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";

/**
 * Firebase標準OIDC認証での追加処理
 * Firebase AuthenticationでOIDC認証完了後、
 * ユーザープロファイルの追加情報を処理
 */
export const handleOIDCPostAuth = onCall(
  {
    region: "asia-northeast1",
    cors: true
  },
  async (request) => {
    try {
      const { auth } = request;
      
      if (!auth) {
        throw new Error("認証が必要です");
      }

      // Firebase Authentication経由で既に認証済みのユーザー情報を取得
      const user = await admin.auth().getUser(auth.uid);
      
      // Firestoreにユーザープロファイルを保存/更新
      const userDoc = admin.firestore().collection('users').doc(auth.uid);
      
      await userDoc.set({
        uid: auth.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        providerId: user.providerData[0]?.providerId || 'unknown',
        // OIDC固有の情報
        oidcProvider: user.customClaims?.oidc_provider || null,
        lastSignIn: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: user.metadata.creationTime,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      return {
        success: true,
        message: "ユーザープロファイルが更新されました",
        user: {
          uid: auth.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }
      };

    } catch (error) {
      console.error("OIDC後処理エラー:", error);
      throw new Error(`OIDC後処理に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

/**
 * OIDC認証状態の確認と初期化
 * アプリ起動時にユーザーの認証状態を確認
 */
export const initializeOIDCUser = onCall(
  {
    region: "asia-northeast1",
    cors: true
  },
  async (request) => {
    try {
      const { auth } = request;
      
      if (!auth) {
        return { authenticated: false };
      }

      // ユーザー情報を取得
      const userDoc = await admin.firestore()
        .collection('users')
        .doc(auth.uid)
        .get();

      if (!userDoc.exists) {
        // ユーザードキュメントが存在しない場合は作成
        // 直接ユーザードキュメントを作成
        const user = await admin.auth().getUser(auth.uid);
        
        await admin.firestore().collection('users').doc(auth.uid).set({
          uid: auth.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          providerId: user.providerData[0]?.providerId || 'unknown',
          lastSignIn: admin.firestore.FieldValue.serverTimestamp(),
          createdAt: user.metadata.creationTime,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        return {
          authenticated: true,
          user: {
            uid: auth.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }
        };
      }

      return {
        authenticated: true,
        user: userDoc.data() || null
      };

    } catch (error) {
      console.error("OIDC初期化エラー:", error);
      return {
        authenticated: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
);
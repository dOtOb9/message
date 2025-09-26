import { auth, functions } from '@/firebase-config';
import { httpsCallable } from 'firebase/functions';
import { useEffect, useState } from 'react';

// Firebase Functions のCallable関数
const handleOIDCPostAuth = httpsCallable(functions, 'handleOIDCPostAuth');
const initializeOIDCUser = httpsCallable(functions, 'initializeOIDCUser');

export interface OIDCUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  providerId?: string;
}

export const useFirebaseOIDC = () => {
  const [user, setUser] = useState<OIDCUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 認証状態の初期化
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Firebase Authの状態を確認
        if (auth.currentUser) {
          // Firebase Functions でユーザープロファイル初期化
          const result = await initializeOIDCUser();
          const data = result.data as any;
          
          if (data.authenticated) {
            setUser(data.user as OIDCUser);
          }
        }
      } catch (err) {
        console.error('OIDC初期化エラー:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Firebase Auth状態変更の監視
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // OIDC認証後の処理
          const result = await handleOIDCPostAuth();
          const data = result.data as any;
          setUser(data.user as OIDCUser);
          setError(null);
        } catch (err) {
          console.error('OIDC後処理エラー:', err);
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } else {
        setUser(null);
        setError(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // OIDC認証開始（Firebase Consoleで設定されたプロバイダーを使用）
  const signInWithOIDC = async (providerId: string) => {
    try {
      setLoading(true);
      setError(null);

      // React NativeでのOIDC認証
      // 注意: 実際の実装では、WebViewやDeep Linkingが必要
      console.log(`OIDC認証開始: ${providerId}`);
      
      // デモ実装
      throw new Error('React NativeでのOIDC認証はWebViewまたはDeep Linkingが必要です。Firebase_OIDC_GUIDE.mdを参照してください。');
      
    } catch (err) {
      console.error('OIDC認証エラー:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ログアウト
  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('ログアウトエラー:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signInWithOIDC,
    signOut,
    isAuthenticated: !!user
  };
};
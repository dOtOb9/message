import { auth } from '@/firebase-config';
import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { getRedirectResult, GoogleAuthProvider, signInWithCredential, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Web browser setup for mobile auth
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  // Web版でリダイレクト結果をチェック
  useEffect(() => {
    if (Platform.OS === 'web') {
      checkRedirectResult();
    }
  }, []);

  const checkRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        console.log('リダイレクト認証成功:', result.user?.displayName);
        if (Platform.OS === 'web') {
          window.alert(`ようこそ、${result.user.displayName}さん！`);
        }
        router.replace('/(tabs)/todo');
      }
    } catch (error: any) {
      console.error('リダイレクト結果エラー:', error);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      if (Platform.OS === 'web') {
        await handleGoogleLoginWeb();
      } else {
        await handleGoogleLoginMobile();
      }
    } catch (error: any) {
      console.error('Google認証エラー:', error);
      Alert.alert('認証エラー', `認証に失敗しました: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginMobile = async () => {
    try {
      console.log('モバイル環境でのGoogle認証開始...');
      console.log('Platform:', Platform.OS);
      
      // リダイレクトURIを生成
      const redirectUri = AuthSession.makeRedirectUri();
      console.log('リダイレクトURI:', redirectUri);
      
      // Google OAuth設定
      const request = new AuthSession.AuthRequest({
        clientId: '242503901797-9dq6n6u2h3d5e8s6v8r2q4l1k7m9p6e3.apps.googleusercontent.com',
        scopes: ['openid', 'profile', 'email'],
        redirectUri: redirectUri,
        responseType: AuthSession.ResponseType.IdToken,
        extraParams: {
          nonce: Math.random().toString(36).substring(7), // nonce追加でセキュリティ強化
        },
      });

      console.log('認証リクエスト作成完了');
      console.log('ClientID:', request.clientId);
      console.log('RedirectUri:', request.redirectUri);
      
      // 認証プロンプトを表示
      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
      });

      console.log('認証結果:', result.type);
      console.log('認証詳細:', JSON.stringify(result, null, 2));

      if (result.type === 'success') {
        console.log('認証成功 - パラメータ確認中...');
        
        if (!result.params.id_token) {
          console.error('IDトークンが見つかりません:', result.params);
          throw new Error('IDトークンが取得できませんでした');
        }
        
        const { id_token } = result.params;
        console.log('IDトークン取得成功 (最初の20文字):', id_token.substring(0, 20) + '...');

        // Firebase用の認証情報を作成
        const googleCredential = GoogleAuthProvider.credential(id_token);
        
        console.log('Firebase認証開始...');
        // Firebaseにサインイン
        const firebaseResult = await signInWithCredential(auth, googleCredential);
        
        console.log('Firebase認証成功:', firebaseResult.user?.displayName);
        Alert.alert('認証成功', `ようこそ、${firebaseResult.user.displayName}さん！`);
        router.replace('/(tabs)/todo');
      } else if (result.type === 'cancel') {
        console.log('ユーザーが認証をキャンセルしました');
        Alert.alert('認証キャンセル', '認証がキャンセルされました');
      } else if (result.type === 'dismiss') {
        console.log('認証ダイアログが閉じられました (dismiss)');
        Alert.alert('認証中断', '認証が中断されました。もう一度お試しください。');
      } else if (result.type === 'error') {
        console.error('認証エラー:', result.error);
        throw new Error(`認証エラー: ${result.error?.message || '不明なエラー'}`);
      } else {
        console.log('予期しない結果タイプ:', result.type);
        throw new Error(`予期しない認証結果: ${result.type}`);
      }
      
    } catch (error: any) {
      console.error('モバイルGoogle認証エラー:', error);
      console.error('エラースタック:', error.stack);
      throw error;
    }
  };

  const handleGoogleLoginWeb = async () => {
    try {
      console.log('Web環境でのGoogle認証開始...');
      
      // GoogleAuthProviderを初期化
      const provider = new GoogleAuthProvider();
      
      // スコープを設定（必要に応じて）
      provider.addScope('email');
      provider.addScope('profile');
      
      try {
        // まずポップアップを試行
        console.log('Googleサインインポップアップを表示...');
        const result = await signInWithPopup(auth, provider);
        
        console.log('Web認証成功:', result.user?.displayName);
        
        // 成功時の処理
        if (Platform.OS === 'web') {
          window.alert(`ようこそ、${result.user.displayName}さん！`);
        } else {
          Alert.alert('認証成功', `ようこそ、${result.user.displayName}さん！`);
        }
        
        router.replace('/(tabs)/todo');
        
      } catch (popupError: any) {
        console.log('ポップアップ認証失敗、リダイレクト認証を試行:', popupError.code);
        
        // ポップアップが失敗した場合（ブロックされた場合など）、リダイレクトを使用
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/unauthorized-domain') {
          
          console.log('リダイレクト認証を開始...');
          // リダイレクト認証を使用
          await signInWithRedirect(auth, provider);
          // リダイレクト後は自動的にcheckRedirectResultが呼ばれる
          
        } else {
          throw popupError; // その他のエラーは再スロー
        }
      }
      
    } catch (error: any) {
      console.error('WebGoogle認証エラー:', error);
      
      // エラー処理
      let errorMessage = '認証に失敗しました。';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'ログインがキャンセルされました。';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'ポップアップがブロックされました。リダイレクト認証を試行中...';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'このドメインは認証が許可されていません。Firebase Consoleで localhost を承認済みドメインに追加してください。';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'ログインがキャンセルされました。';
      } else if (error.message) {
        errorMessage = `認証エラー: ${error.message}`;
      }
      
      if (Platform.OS === 'web') {
        window.alert(errorMessage);
      } else {
        Alert.alert('認証エラー', errorMessage);
      }
      
      throw error;
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6 flex  items-center justify-center w-full">
        <View className="items-center mb-12">
          <Ionicons name="chatbubble-ellipses" size={80} color="#3B82F6" />
          <Text className="text-3xl font-bold mt-4 text-gray-800">Message</Text>
        </View>

        <TouchableOpacity
          onPress={handleGoogleLogin}
          disabled={loading}
          className={`p-4 rounded-lg max-w-xs flex-row items-center justify-center ${
            loading ? 'bg-gray-400' : 'bg-blue-500'
          }`}
          style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
        >
          {!loading && (
            <Ionicons name="logo-google" size={24} color="white" style={{ marginRight: 12 }} />
          )}
          <Text className="text-white font-semibold text-lg">
            {loading ? 'ログイン中...' : 'Googleでログイン'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
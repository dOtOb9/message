import { auth } from '@/firebase-config';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DiagnosticScreen() {
  const [loading, setLoading] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState('');

  const runDiagnostics = () => {
    const info = {
      currentURL: typeof window !== 'undefined' ? window.location.origin : 'N/A',
      authDomain: auth.app.options.authDomain,
      projectId: auth.app.options.projectId,
      apiKey: auth.app.options.apiKey?.substring(0, 20) + '...',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
    };
    
    setDiagnosticInfo(JSON.stringify(info, null, 2));
  };

  const testGoogleAuth = async () => {
    setLoading(true);
    try {
      console.log('=== Google認証テスト開始 ===');
      
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      // 詳細なログ出力
      console.log('Provider設定:', provider);
      console.log('Auth instance:', auth);
      console.log('現在のURL:', window.location.origin);
      console.log('Auth domain:', auth.app.options.authDomain);
      
      const result = await signInWithPopup(auth, provider);
      
      console.log('認証成功!', result.user);
      Alert.alert('認証成功', `ユーザー: ${result.user.displayName}\nEmail: ${result.user.email}`);
      
    } catch (error: any) {
      console.error('=== Google認証エラー詳細 ===');
      console.error('エラーオブジェクト:', error);
      console.error('エラーコード:', error.code);
      console.error('エラーメッセージ:', error.message);
      
      if (error.customData) {
        console.error('カスタムデータ:', error.customData);
      }
      
      // ユーザーにわかりやすいエラー表示
      let userMessage = `エラーコード: ${error.code}\nメッセージ: ${error.message}`;
      
      if (error.code === 'auth/unauthorized-domain') {
        userMessage = `承認されていないドメインです。\n\n現在のURL: ${window.location.origin}\n\nFirebase Console で以下を確認してください:\n1. Authentication > Settings > Authorized domains\n2. "${window.location.hostname}" が追加されているか`;
      }
      
      Alert.alert('認証エラー', userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-center mb-4">🔍 Firebase認証診断</Text>
        
        <TouchableOpacity
          onPress={runDiagnostics}
          className="bg-blue-500 py-3 px-6 rounded-lg mb-4"
        >
          <Text className="text-white text-center font-semibold">診断情報を取得</Text>
        </TouchableOpacity>
        
        {diagnosticInfo ? (
          <View className="bg-gray-100 p-4 rounded-lg mb-4">
            <Text className="text-sm font-mono">{diagnosticInfo}</Text>
          </View>
        ) : null}
        
        <TouchableOpacity
          onPress={testGoogleAuth}
          disabled={loading}
          className={`py-4 rounded-lg flex-row items-center justify-center ${
            loading ? 'bg-gray-400' : 'bg-red-500'
          }`}
        >
          <Ionicons name="logo-google" size={24} color="white" style={{ marginRight: 12 }} />
          <Text className="text-white font-semibold text-lg">
            {loading ? 'テスト実行中...' : 'Google認証テスト'}
          </Text>
        </TouchableOpacity>
        
        <View className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Text className="text-yellow-800 text-sm">
            <Text className="font-semibold">チェックポイント:</Text>{'\n'}
            1. Firebase Console → Authentication → Settings → Authorized domains{'\n'}
            2. "localhost" と "127.0.0.1" が追加されているか{'\n'}
            3. Google認証プロバイダーが有効化されているか{'\n'}
            4. Web SDK設定が正しいか
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          className="mt-4 py-2 px-4 bg-gray-500 rounded-lg"
        >
          <Text className="text-white text-center">ログイン画面に戻る</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
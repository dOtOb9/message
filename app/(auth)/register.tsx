import { auth } from '@/firebase-config';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      // Firebase標準のGoogle認証を使用（Web環境）
      const provider = new GoogleAuthProvider();
      // メールアドレスへのアクセスを要求しないよう、スコープを削除
      
      // ポップアップでGoogle認証
      const result = await signInWithPopup(auth, provider);
      
      console.log('Googleアカウント作成成功:', result.user);
      Alert.alert('アカウント作成成功', `ようこそ、${result.user.displayName}さん！`);
      router.replace('/(tabs)/todo');
      
    } catch (error: any) {
      console.error('Googleアカウント作成エラー:', error);
      
      // エラーコード別の詳細メッセージ
      let errorMessage = 'Googleアカウント作成に失敗しました';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = '認証がキャンセルされました';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'ポップアップがブロックされました。ブラウザの設定を確認してください';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'このドメインは認証用に設定されていません';
      }
      
      Alert.alert('アカウント作成エラー', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-12">
          <Ionicons name="person-add" size={80} color="#10B981" />
          <Text className="text-3xl font-bold mt-4 text-gray-800">アカウント作成</Text>
          <Text className="text-gray-600 mt-2 text-center">
            Googleアカウントでアカウントを作成してください
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleGoogleRegister}
          disabled={loading}
          className={`py-4 rounded-lg flex-row items-center justify-center ${
            loading ? 'bg-gray-400' : 'bg-green-500'
          }`}
          style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
        >
          {!loading && (
            <Ionicons name="logo-google" size={24} color="white" style={{ marginRight: 12 }} />
          )}
          <Text className="text-white font-semibold text-lg">
            {loading ? 'アカウント作成中...' : 'Googleでアカウント作成'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 py-2"
        >
          <Text className="text-green-500 text-center">
            すでにアカウントをお持ちの方はこちら
          </Text>
        </TouchableOpacity>

        <View className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <Text className="text-green-800 text-sm text-center">
            ✅ Firebase標準Google認証{'\n'}
            Web環境ではFirebase標準のGoogle認証が利用可能です。{'\n'}
            Firebase Console でGoogle認証が有効化されている必要があります。
          </Text>
        </View>
      </View>
    </View>
  );
}
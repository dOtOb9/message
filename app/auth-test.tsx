import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AuthTestScreen() {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>認証状態確認中...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold mb-6 text-center">🔍 認証状態確認</Text>
      
      <View className="mb-6 p-4 bg-gray-100 rounded-lg">
        <Text className="font-bold mb-2">Firebase Auth User:</Text>
        {user ? (
          <View>
            <Text>✅ ログイン済み</Text>
            <Text>UID: {user.uid}</Text>
            <Text>Display Name: {user.displayName || '未設定'}</Text>
            <Text>Provider: {user.providerData[0]?.providerId || '不明'}</Text>
            <Text>Provider: {user.providerData[0]?.providerId || '不明'}</Text>
          </View>
        ) : (
          <Text>❌ 未ログイン</Text>
        )}
      </View>

      <View className="mb-6 p-4 bg-gray-100 rounded-lg">
        <Text className="font-bold mb-2">User Profile (Firestore):</Text>
        {userProfile ? (
          <View>
            <Text>✅ プロフィール作成済み</Text>
            <Text>Display Name: {userProfile.displayName}</Text>
            <Text>Created At: {userProfile.createdAt?.toString()}</Text>
            <Text>Last Login: {userProfile.lastLoginAt?.toString()}</Text>
          </View>
        ) : (
          <Text>❌ プロフィール未作成</Text>
        )}
      </View>

      <View className="mb-6">
        <Text className="font-bold mb-4">📍 現在の状況:</Text>
        {user && userProfile ? (
          <View className="p-4 bg-green-100 rounded-lg">
            <Text className="text-green-800 font-bold">🎉 認証完了</Text>
            <Text className="text-green-700">
              Googleログインが正常に完了し、ユーザープロフィールも作成されています。
              メールアドレスの入力は不要でした。
            </Text>
          </View>
        ) : user ? (
          <View className="p-4 bg-yellow-100 rounded-lg">
            <Text className="text-yellow-800 font-bold">⚠️ プロフィール作成中</Text>
            <Text className="text-yellow-700">
              Firebase認証は完了していますが、Firestoreのプロフィール作成を処理中です。
            </Text>
          </View>
        ) : (
          <View className="p-4 bg-red-100 rounded-lg">
            <Text className="text-red-800 font-bold">❌ 未認証</Text>
            <Text className="text-red-700">
              ログインが必要です。
            </Text>
          </View>
        )}
      </View>

      <View className="space-y-3">
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/todo')}
          className="bg-blue-500 py-3 px-6 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">Todo画面に移動</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(tabs)/profile')}
          className="bg-green-500 py-3 px-6 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">プロフィール画面に移動</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          className="bg-gray-500 py-3 px-6 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">ログイン画面に戻る</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
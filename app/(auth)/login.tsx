import { auth } from '@/firebase-config'; // Firebase設定ファイルのパス
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('エラー', 'メールアドレスとパスワードを入力してください');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('ログインエラー', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-12">
          <Ionicons name="person-circle" size={80} color="#3B82F6" />
          <Text className="text-3xl font-bold mt-4 text-gray-800">ログイン</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              パスワード
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              value={password}
              onChangeText={setPassword}
              placeholder="パスワードを入力"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className={`mt-8 py-4 rounded-lg ${
            loading ? 'bg-gray-400' : 'bg-blue-500'
          }`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? 'ログイン中...' : 'ログイン'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('./register')}
          className="mt-4 py-2"
        >
          <Text className="text-blue-500 text-center">
            アカウントをお持ちでない方はこちら
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
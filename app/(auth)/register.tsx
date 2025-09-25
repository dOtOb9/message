import { auth } from '@/firebase-config';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('エラー', 'すべてのフィールドを入力してください');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('エラー', 'パスワードが一致しません');
      return;
    }

    if (password.length < 6) {
      Alert.alert('エラー', 'パスワードは6文字以上である必要があります');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('登録エラー', error.message);
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
          <Ionicons name="person-add" size={80} color="#3B82F6" />
          <Text className="text-3xl font-bold mt-4 text-gray-800">新規登録</Text>
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
              placeholder="パスワードを入力（6文字以上）"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              パスワード確認
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="パスワードを再入力"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className={`mt-8 py-4 rounded-lg ${
            loading ? 'bg-gray-400' : 'bg-blue-500'
          }`}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? '登録中...' : '新規登録'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 py-2"
        >
          <Text className="text-blue-500 text-center">
            既にアカウントをお持ちの方はこちら
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
import { auth } from '@/firebase-config';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EmailLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('エラー', 'メールアドレスとパスワードを入力してください');
      return;
    }

    setLoading(true);
    try {
      let result;
      
      if (isSignUp) {
        console.log('新規登録開始...');
        result = await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert('登録成功', 'アカウントが作成されました！');
      } else {
        console.log('ログイン開始...');
        result = await signInWithEmailAndPassword(auth, email, password);
        Alert.alert('ログイン成功', 'ようこそ！');
      }
      
      console.log('認証成功:', result.user?.email);
      router.replace('/(tabs)/todo');
      
    } catch (error: any) {
      console.error('認証エラー:', error);
      
      let errorMessage = '認証に失敗しました';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'このメールアドレスは既に使用されています';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = '無効なメールアドレスです';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'パスワードは6文字以上で入力してください';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'ユーザーが見つかりません';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'パスワードが間違っています';
      }
      
      Alert.alert('認証エラー', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-12">
          <Ionicons name="chatbubble-ellipses" size={80} color="#3B82F6" />
          <Text className="text-3xl font-bold mt-4 text-gray-800">Message App</Text>
          <Text className="text-gray-600 mt-2 text-center">
            {isSignUp ? '新規アカウント作成' : 'メールアドレスでログイン'}
          </Text>
        </View>

        <View className="space-y-4">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="メールアドレス"
            keyboardType="email-address"
            autoCapitalize="none"
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
          />
          
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="パスワード"
            secureTextEntry
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
          />
        </View>

        <TouchableOpacity
          onPress={handleEmailAuth}
          disabled={loading}
          className={`py-4 rounded-lg flex-row items-center justify-center mt-6 ${
            loading ? 'bg-gray-400' : 'bg-blue-500'
          }`}
        >
          <Text className="text-white font-semibold text-lg">
            {loading ? '処理中...' : (isSignUp ? '新規登録' : 'ログイン')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsSignUp(!isSignUp)}
          className="mt-4 py-2"
        >
          <Text className="text-blue-500 text-center">
            {isSignUp ? '既にアカウントをお持ちの方はこちら' : '新規アカウント作成はこちら'}
          </Text>
        </TouchableOpacity>

        <View className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Text className="text-yellow-800 text-sm text-center font-semibold mb-2">
            ⚠️ Expo Go 対応版
          </Text>
          <Text className="text-yellow-700 text-xs text-center">
            Expo Go では Google OAuth に制限があるため、{'\n'}
            メール/パスワード認証を使用しています。{'\n'}
            本格的な認証には開発ビルドをお勧めします。
          </Text>
        </View>
      </View>
    </View>
  );
}
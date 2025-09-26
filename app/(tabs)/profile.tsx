import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ProfileScreen() {
  const { user, userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    console.log('ログアウト処理開始...');
    await signOut();
    router.replace('/(auth)/login');
    
  };

  return (
    <ScrollView>
      <View className="flex-1 min-h-screen bg-blue-500 justify-center items-center">
        <View className="items-center">
          <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-4">
            <Ionicons name="person" size={40} color="#3B82F6" />
          </View>
          <Text className="text-white text-xl font-bold">
            {userProfile?.displayName || '匿名ユーザー'}
          </Text>
          <Text className="text-blue-100 text-sm">
            Google アカウントでログイン中
          </Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} className="flex-row items-center py-4 bg-gray-400 rounded-lg mt-8 px-6">
          <Ionicons name="log-out-outline" size={24} color="#ffffff" />
          <Text className="ml-3 text-white text-base font-medium ">ログアウト</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
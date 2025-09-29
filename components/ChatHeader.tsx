import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ChatHeaderProps {
  friendName?: string;
  friendAvatar?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ friendName, friendAvatar }) => {
  return (
    <View className="bg-white border-b border-gray-200 px-4 py-3">
      <View className="flex-row items-center">
        {/* 戻るボタン */}
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mr-3 p-2 -ml-2"
        >
          <Ionicons name="chevron-back" size={24} color="#3B82F6" />
        </TouchableOpacity>

        {/* フレンドアバター */}
        <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
          <Text className="text-xl">{friendAvatar || '👤'}</Text>
        </View>

        {/* フレンド情報 */}
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">
            {friendName || 'フレンド'}
          </Text>
          <Text className="text-sm text-green-500">オンライン</Text>
        </View>
      </View>
    </View>
  );
};
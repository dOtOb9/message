import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

export const EmptyState: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Ionicons name="list-outline" size={64} color="#9CA3AF" />
      <Text className="text-gray-500 text-lg mt-4">タスクがありません</Text>
      <Text className="text-gray-400 text-sm mt-1">新しいタスクを追加してください</Text>
    </View>
  );
};
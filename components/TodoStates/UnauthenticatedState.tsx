import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

export const UnauthenticatedState: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <Ionicons name="person-outline" size={48} color="#9CA3AF" />
      <Text className="text-lg text-gray-600 mt-4">ログインが必要です</Text>
      <Text className="text-sm text-gray-400 mt-1">ToDoを表示するにはログインしてください</Text>
    </View>
  );
};
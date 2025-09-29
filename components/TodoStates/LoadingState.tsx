import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export const LoadingState: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="text-lg text-gray-600 mt-4">ToDoを読み込み中...</Text>
      <Text className="text-sm text-gray-400 mt-1">しばらくお待ちください</Text>
    </View>
  );
};
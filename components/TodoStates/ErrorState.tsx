import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
      <Text className="text-lg text-red-600 mt-4">エラーが発生しました</Text>
      <Text className="text-sm text-gray-600 mt-2 px-4 text-center">{error}</Text>
      <TouchableOpacity 
        onPress={onRetry}
        className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
      >
        <Text className="text-white font-medium">再試行</Text>
      </TouchableOpacity>
    </View>
  );
};
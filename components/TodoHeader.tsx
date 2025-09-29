import type { TodoItem } from '@/types';
import React from 'react';
import { Text, View } from 'react-native';

interface TodoHeaderProps {
  todos: TodoItem[];
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({ todos }) => {
  const pendingCount = todos.filter(t => 
    (t.status === 'pending' || (!t.completed && !t.status))
  ).length;

  return (
    <View className="bg-white pt-12 pb-6 px-4 shadow-sm">
      <Text className="text-2xl font-bold text-gray-800">Todo リスト</Text>
      <Text className="text-sm text-gray-600 mt-1">
        {pendingCount} 個の未完了タスク
      </Text>
    </View>
  );
};
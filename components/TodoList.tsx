import { TodoItemComponent } from '@/components/TodoItemComponent';
import { EmptyState } from '@/components/TodoStates/EmptyState';
import type { TodoItem } from '@/types';
import type { User } from 'firebase/auth';
import React from 'react';
import { FlatList, View } from 'react-native';

interface TodoListProps {
  todos: TodoItem[];
  user: User | null;
  onToggle: (id: string, currentStatus: string, isFromChat: boolean) => void;
  onDelete: (id: string, isFromChat: boolean) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ 
  todos, 
  user, 
  onToggle, 
  onDelete 
}) => {
  const renderTodoItem = ({ item }: { item: TodoItem }) => (
    <TodoItemComponent
      item={item}
      user={user}
      onToggle={onToggle}
      onDelete={onDelete}
    />
  );

  return (
    <View className="flex-1 px-4 mt-4">
      {todos.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={renderTodoItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};
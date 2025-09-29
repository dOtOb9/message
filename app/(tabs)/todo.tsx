import { TodoHeader } from '@/components/TodoHeader';
import { TodoInput } from '@/components/TodoInput';
import { TodoList } from '@/components/TodoList';
import { ErrorState, LoadingState, UnauthenticatedState } from '@/components/TodoStates';
import { useAuth } from '@/contexts/AuthContext';
import { useTodos } from '@/hooks/useTodos';
import React, { useState } from 'react';
import { View } from 'react-native';


export default function Todo() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  
  // カスタムhookでTodo操作を管理
  const { todos, loading, error, addTodo: addTodoToDb, toggleTodo, deleteTodo, setError, setLoading } = useTodos(user ?? undefined);

  const handleAddTodo = async () => {
    if (inputText.trim()) {
      try {
        await addTodoToDb(inputText.trim());
        setInputText('');
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const handleRetry = () => {
    setError('');
    setLoading(true);
  };

  // 各状態に応じて適切なコンポーネントを返す
  if (!user) {
    return <UnauthenticatedState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <TodoHeader todos={todos} />
      <TodoInput 
        inputText={inputText}
        onChangeText={setInputText}
        onSubmit={handleAddTodo}
      />
      <TodoList 
        todos={todos}
        user={user}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </View>
  );
}
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  timestamp?: number; // 追加: タスクの作成時間
}

export default function Todo() {
const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: '買い物に行く', completed: false, timestamp: Date.now() - 300000 },
    { id: '2', text: 'レポートを書く', completed: true, timestamp: Date.now() - 200000 },
    { id: '3', text: '友達に連絡する', completed: false, timestamp: Date.now() - 100000 },
]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: inputText.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputText('');
    }
  };

  const toggleTodo = (id: string) => {
  setTodos(prevTodos => {
    const updatedTodos = prevTodos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    // 完了したタスクと未完了のタスクを分離
    const completedTodos = updatedTodos.filter(todo => todo.completed);
    const incompleteTodos = updatedTodos.filter(todo => !todo.completed);
    
    // 未完了タスクを時間順（IDの昇順）でソート、完了タスクはそのまま
    const sortedIncompleteTodos = incompleteTodos.sort((a, b) => Number(a.id) - Number(b.id));
    
    // 未完了タスクを上に、完了タスクを下に配置
    return [...sortedIncompleteTodos, ...completedTodos];
  });
};

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const renderTodo = ({ item }: { item: TodoItem }) => (
    <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
      <TouchableOpacity
        onPress={() => toggleTodo(item.id)}
        className={`w-7 h-7 mr-4 items-center justify-center rounded-md border ${
          item.completed ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
        }`}
      >
        {item.completed && (
          <Ionicons name="checkmark" size={18} color="white" />
        )}
      </TouchableOpacity>
      
      <View className="flex-1">
        <Text
          className={`text-base ${
            item.completed 
              ? 'text-gray-500 line-through' 
              : 'text-black'
          }`}
        >
          {item.text}
        </Text>
        <Text className="text-xs text-gray-400 mt-1"> {/* Timestamp display */}
          {new Date(item.timestamp || 0).toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
      
      <TouchableOpacity
        onPress={() => deleteTodo(item.id)}
        className="p-2 bg-transparent rounded"
      >
        <Ionicons name="trash-outline" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-center mb-4">ToDo</Text>
        
        <View className="flex-row items-center">
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 mr-3 text-base"
            value={inputText}
            onChangeText={setInputText}
            placeholder="新しいタスクを追加..."
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity
            onPress={addTodo}
            className="bg-blue-500 p-3 rounded-lg"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={todos}
        renderItem={renderTodo}
        keyExtractor={(item) => item.id}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      />
      
      {todos.length === 0 && (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="list-outline" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 text-lg mt-4">タスクがありません</Text>
        </View>
      )}
    </View>
  );
}
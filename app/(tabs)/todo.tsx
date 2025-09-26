import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase-config';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface TodoItem {
  id: string;
  content: string;
  status: 'pending' | 'completed';
  createdAt: Date;
  sourceMessageId?: string; // Cloud Functionsで生成された場合
}

export default function Todo() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  // Firestoreからリアルタイムでtodosを取得
  useEffect(() => {
    if (!user) return;

    const todosRef = collection(db, 'users', user.uid, 'todos');
    const q = query(todosRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todoList: TodoItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        todoList.push({
          id: doc.id,
          content: data.content,
          status: data.status,
          createdAt: data.createdAt?.toDate() || new Date(),
          sourceMessageId: data.sourceMessageId,
        });
      });
      setTodos(todoList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTodo = async () => {
    if (inputText.trim() && user) {
      try {
        await addDoc(collection(db, 'users', user.uid, 'todos'), {
          content: inputText.trim(),
          status: 'pending',
          createdAt: new Date(),
        });
        setInputText('');
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const toggleTodo = async (id: string, currentStatus: string) => {
    if (!user) return;
    
    try {
      const todoRef = doc(db, 'users', user.uid, 'todos', id);
      await updateDoc(todoRef, {
        status: currentStatus === 'pending' ? 'completed' : 'pending'
      });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!user) return;
    
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'todos', id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '今';
    if (diffInMinutes < 60) return `${diffInMinutes}分前`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}時間前`;
    return `${Math.floor(diffInMinutes / 1440)}日前`;
  };

  const renderTodoItem = ({ item }: { item: TodoItem }) => (
    <View className="bg-white rounded-lg p-4 mb-2 flex-row items-center shadow-sm">
      <TouchableOpacity
        onPress={() => toggleTodo(item.id, item.status)}
        className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
          item.status === 'completed' ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
        }`}
      >
        {item.status === 'completed' && (
          <Ionicons name="checkmark" size={16} color="white" />
        )}
      </TouchableOpacity>
      
      <View className="flex-1">
        <Text className={`text-base ${
          item.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'
        }`}>
          {item.content}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-xs text-gray-400 mr-2">
            {formatTime(item.createdAt)}
          </Text>
          {item.sourceMessageId && (
            <View className="bg-green-100 px-2 py-0.5 rounded-full">
              <Text className="text-xs text-green-600">自動生成</Text>
            </View>
          )}
        </View>
      </View>
      
      <TouchableOpacity
        onPress={() => deleteTodo(item.id)}
        className="ml-3 p-1"
      >
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* ヘッダー */}
      <View className="bg-white pt-12 pb-6 px-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">Todo リスト</Text>
        <Text className="text-sm text-gray-600 mt-1">
          {todos.filter(t => t.status === 'pending').length} 個の未完了タスク
        </Text>
      </View>

      {/* 入力フィールド */}
      <View className="bg-white mx-4 mt-4 p-4 rounded-lg shadow-sm">
        <View className="flex-row items-center">
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-3"
            value={inputText}
            onChangeText={setInputText}
            placeholder="新しいタスクを追加..."
            placeholderTextColor="#9CA3AF"
            returnKeyType="done"
            onSubmitEditing={addTodo}
          />
          <TouchableOpacity
            onPress={addTodo}
            className="bg-blue-500 rounded-lg px-4 py-2"
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Todoリスト */}
      <View className="flex-1 px-4 mt-4">
        {todos.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="list-outline" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-4">タスクがありません</Text>
            <Text className="text-gray-400 text-sm mt-1">新しいタスクを追加してください</Text>
          </View>
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
    </View>
  );
}
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface TodoInputProps {
  inputText: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({ 
  inputText, 
  onChangeText, 
  onSubmit 
}) => {
  return (
    <View className="bg-white mx-4 mt-4 p-4 rounded-lg shadow-sm">
      <View className="flex-row items-center">
        <TextInput
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-3"
          value={inputText}
          onChangeText={onChangeText}
          placeholder="新しいタスクを追加..."
          placeholderTextColor="#9CA3AF"
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />
        <TouchableOpacity
          onPress={onSubmit}
          className="bg-blue-500 rounded-lg px-4 py-2"
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
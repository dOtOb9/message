import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface MessageInputProps {
  inputText: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  inputText, 
  onChangeText, 
  onSend 
}) => {
  return (
    <View className="flex-row items-end px-4 py-3 bg-white border-t border-gray-200">
      
      <TextInput
        className="flex-1 border border-gray-200 rounded-2xl px-4 py-2.5 text-base bg-gray-50 max-h-24"
        value={inputText}
        onChangeText={onChangeText}
        placeholder="メッセージを入力..."
        placeholderTextColor="#999"
        multiline
      />
      
      <TouchableOpacity 
        className="ml-3 p-2" 
        onPress={onSend}
        disabled={!inputText.trim()}
      >
        <Ionicons 
          name="send" 
          size={24} 
          color={inputText.trim() ? "#3B82F6" : "#D1D5DB"} 
        />
      </TouchableOpacity>
    </View>
  );
};
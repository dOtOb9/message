import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: Date;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'こんにちは！',
      isOwn: false,
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: '2',
      text: 'お疲れ様です！',
      isOwn: true,
      timestamp: new Date(Date.now() - 30000),
    },
    {
      id: '3',
      text: '今日はいい天気ですね',
      isOwn: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isOwn: true,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`my-1 max-w-[80%] ${
        item.isOwn 
          ? 'self-end items-end' 
          : 'self-start items-start'
      }`}
    >
      <View
        className={`px-4 py-2.5 rounded-2xl mb-1 ${
          item.isOwn 
            ? 'bg-blue-500' 
            : 'bg-white border border-gray-200'
        }`}
      >
        <Text 
          className={`text-base ${
            item.isOwn ? 'text-white' : 'text-black'
          }`}
        >
          {item.text}
        </Text>
      </View>
      <Text className="text-xs text-gray-500 mx-2">
        {item.timestamp.toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        className="flex-1"
        contentContainerClassName="p-4"
      />
      
      <View className="flex-row items-end px-4 py-3 bg-white border-t border-gray-200">
        <TextInput
          className="flex-1 border border-gray-200 rounded-2xl px-4 py-2.5 text-base bg-gray-50 max-h-24"
          value={inputText}
          onChangeText={setInputText}
          placeholder="メッセージを入力..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity className="ml-3 p-2" onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: Date;
}

export default function ChatScreen() {
  // パラメータからフレンド情報を取得
  const { friendId, friendName, friendAvatar } = useLocalSearchParams<{
    friendId: string;
    friendName: string;
    friendAvatar: string;
  }>();
  // フレンド固有のメッセージデータ（実際のアプリでは、friendIdを使ってサーバーから取得）
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
      text: `${friendName || 'フレンド'}さんとチャット中です`,
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
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* チャットヘッダー */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center">
          {/* 戻るボタン */}
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mr-3 p-2 -ml-2"
          >
            <Ionicons name="chevron-back" size={24} color="#3B82F6" />
          </TouchableOpacity>

          {/* フレンドアバター */}
          <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
            <Text className="text-xl">{friendAvatar || '👤'}</Text>
          </View>

          {/* フレンド名 */}
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">
              {friendName || 'フレンド'}
            </Text>
            <Text className="text-sm text-green-500">オンライン</Text>
          </View>

          {/* メニューボタン */}
          <TouchableOpacity className="p-2 -mr-2">
            <Ionicons name="ellipsis-horizontal" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* メッセージリスト */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          className="flex-1"
          contentContainerClassName="p-4"
          showsVerticalScrollIndicator={false}
        />
        
        {/* メッセージ入力エリア */}
        <View className="flex-row items-end px-4 py-3 bg-white border-t border-gray-200">
          <TouchableOpacity className="mr-3 p-2">
            <Ionicons name="add" size={24} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TextInput
            className="flex-1 border border-gray-200 rounded-2xl px-4 py-2.5 text-base bg-gray-50 max-h-24"
            value={inputText}
            onChangeText={setInputText}
            placeholder="メッセージを入力..."
            placeholderTextColor="#999"
            multiline
          />
          
          <TouchableOpacity 
            className="ml-3 p-2" 
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons 
              name="send" 
              size={24} 
              color={inputText.trim() ? "#3B82F6" : "#D1D5DB"} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
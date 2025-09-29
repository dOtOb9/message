import { MessageItem } from '@/components/MessageItem';
import type { Message } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

interface MessagesListProps {
  messages: Message[];
  loading: boolean;
  currentUserId?: string;
  userNames: { [key: string]: string };
}

export const MessagesList: React.FC<MessagesListProps> = ({ 
  messages, 
  loading, 
  currentUserId, 
  userNames 
}) => {
  const renderMessage = ({ item }: { item: Message }) => (
    <MessageItem 
      message={item} 
      currentUserId={currentUserId} 
      userNames={userNames} 
    />
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Ionicons name="hourglass-outline" size={48} color="#3B82F6" />
        <Text className="text-lg text-gray-600 mt-2">メッセージを読み込み中...</Text>
      </View>
    );
  }

  const EmptyComponent = () => (
    <View className="flex-1 items-center justify-center py-12">
      <Ionicons name="chatbubble-outline" size={64} color="#D1D5DB" />
      <Text className="text-lg text-gray-500 mt-4">まだメッセージがありません</Text>
      <Text className="text-sm text-gray-400 mt-2">最初のメッセージを送信してみましょう</Text>
    </View>
  );

  return (
    <FlatList
      data={messages}
      renderItem={renderMessage}
      keyExtractor={(item) => item.id}
      className="flex-1"
      contentContainerClassName="p-4"
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={EmptyComponent}
    />
  );
};
import { FriendItem } from '@/components/FriendItem';
import type { Friend } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

interface FriendsListProps {
  friends: Friend[];
  loading: boolean;
  searchText: string;
  onFriendPress: (friend: Friend) => void;
}

export const FriendsList: React.FC<FriendsListProps> = ({ 
  friends, 
  loading, 
  searchText, 
  onFriendPress 
}) => {
  const renderFriendItem = ({ item }: { item: Friend }) => (
    <FriendItem friend={item} onPress={onFriendPress} />
  );

  // ローディング表示
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Ionicons name="hourglass-outline" size={48} color="#3B82F6" />
        <Text className="text-lg text-gray-600 mt-2">読み込み中...</Text>
      </View>
    );
  }

  const EmptyComponent = () => (
    <View className="flex-1 items-center justify-center py-12">
      <Ionicons name="people-outline" size={64} color="#D1D5DB" />
      <Text className="text-lg text-gray-500 mt-4">
        {searchText ? '該当するフレンドが見つかりません' : 'フレンドがいません'}
      </Text>
      {!searchText && (
        <Text className="text-sm text-gray-400 mt-2">
          他のユーザーがログインするとここに表示されます
        </Text>
      )}
    </View>
  );

  return (
    <FlatList
      data={friends}
      renderItem={renderFriendItem}
      keyExtractor={(item) => item.id}
      className="flex-1"
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={EmptyComponent}
    />
  );
};
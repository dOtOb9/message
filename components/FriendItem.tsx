import type { Friend } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface FriendItemProps {
  friend: Friend;
  onPress: (friend: Friend) => void;
}

export const FriendItem: React.FC<FriendItemProps> = ({ friend, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(friend)}
      className="flex-row items-center px-4 py-3 border-b border-gray-100 bg-white active:bg-gray-50"
    >
      {/* アバター */}
      <View className="relative mr-3">
        <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center">
          <Text className="text-2xl">{friend.avatar}</Text>
        </View>
        {/* オンライン状態インジケーター */}
        {friend.isOnline && (
          <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        )}
      </View>

      {/* メッセージ内容 */}
      <View className="flex-1 mr-2">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="font-semibold text-gray-900 text-base">
            {friend.name}
          </Text>
          <Text className="text-xs text-gray-500">
            {friend.lastMessageTime}
          </Text>
        </View>
        <Text 
          className="text-sm text-gray-600" 
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {friend.lastMessage}
        </Text>
      </View>

      {/* 未読カウント */}
      {friend.unreadCount > 0 && (
        <View className="bg-red-500 rounded-full min-w-[20px] h-5 px-1.5 items-center justify-center">
          <Text className="text-white text-xs font-bold">
            {friend.unreadCount > 99 ? '99+' : friend.unreadCount}
          </Text>
        </View>
      )}

      {/* 矢印アイコン */}
      <Ionicons 
        name="chevron-forward" 
        size={16} 
        color="#9CA3AF" 
        style={{ marginLeft: 8 }}
      />
    </TouchableOpacity>
  );
};
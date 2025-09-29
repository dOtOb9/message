import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface FriendsHeaderProps {
  friendsCount: number;
  searchText: string;
  onSearchChange: (text: string) => void;
  onRefresh: () => void;
}

export const FriendsHeader: React.FC<FriendsHeaderProps> = ({ 
  friendsCount, 
  searchText, 
  onSearchChange, 
  onRefresh 
}) => {
  return (
    <View className="bg-white border-b border-gray-200 px-4 py-3">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-2xl font-bold text-gray-900">
          フレンド ({friendsCount})
        </Text>
        <TouchableOpacity 
          className="p-2"
          onPress={onRefresh}
        >
          <Ionicons name="refresh-outline" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* 検索バー */}
      <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
        <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="名前やメールで検索..."
          value={searchText}
          onChangeText={onSearchChange}
          className="flex-1 text-base text-gray-900"
          placeholderTextColor="#9CA3AF"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
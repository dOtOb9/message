import { FloatingActionButton } from '@/components/FloatingActionButton';
import { FriendsHeader } from '@/components/FriendsHeader';
import { FriendsList } from '@/components/FriendsList';
import { useAuth } from '@/contexts/AuthContext';
import { useFriends } from '@/hooks/useFriends';
import type { Friend } from '@/types';
import { filterFriends } from '@/utils';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FriendsScreen() {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  
  // カスタムhookでフレンド管理
  const { friends, loading, refreshData } = useFriends(user);
  
  // 検索でフィルタリング
  const filteredFriends = filterFriends(friends, searchText);

  // チャット画面に遷移
  const navigateToChat = (friend: Friend) => {
    router.push({
      pathname: '/(tabs)/chat',
      params: {
        friendId: friend.id,
        friendName: friend.name,
        friendAvatar: friend.avatar,
      },
    });
  };

  // チャット画面に直接移動（FAB用）
  const navigateToDirectChat = () => {
    router.push('/(tabs)/chat');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FriendsHeader 
        friendsCount={filteredFriends.length}
        searchText={searchText}
        onSearchChange={setSearchText}
        onRefresh={refreshData}
      />
      
      <FriendsList 
        friends={filteredFriends}
        loading={loading}
        searchText={searchText}
        onFriendPress={navigateToChat}
      />

      <FloatingActionButton onPress={navigateToDirectChat} />
    </SafeAreaView>
  );
}
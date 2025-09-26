import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase-config';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  isOnline: boolean;
  unreadCount: number;
  email?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
}

interface RegisteredUser {
  uid: string;
  displayName: string;
  email: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export default function FriendsScreen() {
  const { user, userProfile } = useAuth();
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  // 登録済みユーザーを取得
  const fetchRegisteredUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const users: RegisteredUser[] = [];
      
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          uid: doc.id,
          displayName: data.displayName || '匿名ユーザー',
          email: data.email || '',
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
        });
      });
      
      // 最後のログイン時間でソート（新しい順）
      users.sort((a, b) => b.lastLoginAt.getTime() - a.lastLoginAt.getTime());
      setRegisteredUsers(users);
    } catch (error) {
      console.error('ユーザー取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  // 現在のユーザーをFirestoreに登録/更新
  const registerCurrentUser = async () => {
    if (!user) return;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        displayName: user.displayName || '匿名ユーザー',
        email: user.email || '',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      }, { merge: true });
      
      console.log('ユーザー情報を更新しました:', user.displayName);
    } catch (error) {
      console.error('ユーザー登録エラー:', error);
    }
  };

  useEffect(() => {
    // 現在のユーザーを登録
    if (user) {
      registerCurrentUser();
    }
    
    // 登録済みユーザーを取得
    fetchRegisteredUsers();
  }, [user]);

  // 登録済みユーザーをFriend形式に変換
  const convertToFriends = (users: RegisteredUser[]): Friend[] => {
    return users.map((registeredUser) => {
      const isCurrentUser = user?.uid === registeredUser.uid;
      const timeDiff = new Date().getTime() - registeredUser.lastLoginAt.getTime();
      const isRecentlyActive = timeDiff < 5 * 60 * 1000; // 5分以内
      
      return {
        id: registeredUser.uid,
        name: registeredUser.displayName,
        avatar: registeredUser.displayName.charAt(0).toUpperCase(),
        lastMessage: isCurrentUser ? 'あなた' : registeredUser.email,
        lastMessageTime: formatLastLoginTime(registeredUser.lastLoginAt),
        isOnline: isCurrentUser || isRecentlyActive,
        unreadCount: 0,
        email: registeredUser.email,
        createdAt: registeredUser.createdAt,
        lastLoginAt: registeredUser.lastLoginAt,
      };
    });
  };

  // 最後のログイン時間をフォーマット
  const formatLastLoginTime = (date: Date): string => {
    const now = new Date();
    const timeDiff = now.getTime() - date.getTime();
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'たった今';
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    if (days < 7) return `${days}日前`;
    return date.toLocaleDateString('ja-JP');
  };

  const friends = convertToFriends(registeredUsers);
  
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchText.toLowerCase()) ||
    friend.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  const navigateToChat = (friend: Friend) => {
    // チャット画面に遷移（パラメータとしてフレンド情報を渡す）
    router.push({
      pathname: '/(tabs)/chat',
      params: {
        friendId: friend.id,
        friendName: friend.name,
        friendAvatar: friend.avatar,
      },
    });
  };

  const renderFriendItem = ({ item: friend }: { item: Friend }) => (
    <TouchableOpacity
      onPress={() => navigateToChat(friend)}
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* ヘッダー */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-2xl font-bold text-gray-900">
            登録ユーザー ({registeredUsers.length})
          </Text>
          <TouchableOpacity 
            className="p-2"
            onPress={() => {
              setLoading(true);
              fetchRegisteredUsers();
            }}
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
            onChangeText={setSearchText}
            className="flex-1 text-base text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ローディング表示 */}
      {loading && (
        <View className="flex-1 items-center justify-center py-12">
          <Ionicons name="hourglass-outline" size={48} color="#3B82F6" />
          <Text className="text-lg text-gray-600 mt-2">読み込み中...</Text>
        </View>
      )}

      {/* ユーザーリスト */}
      {!loading && (
        <FlatList
          data={filteredFriends}
          renderItem={renderFriendItem}
          keyExtractor={(item) => item.id}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-12">
              <Ionicons name="people-outline" size={64} color="#D1D5DB" />
              <Text className="text-lg text-gray-500 mt-4">
                {searchText ? '該当するユーザーが見つかりません' : '登録ユーザーがいません'}
              </Text>
              {!searchText && (
                <Text className="text-sm text-gray-400 mt-2">
                  ログインすると自動的に登録されます
                </Text>
              )}
            </View>
          }
        />
      )}

      {/* フローティングアクションボタン */}
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/chat')}
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-lg"
        style={{
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        }}
      >
        <Ionicons name="chatbubble" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
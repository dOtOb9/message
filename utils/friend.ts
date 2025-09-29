import type { Friend, RegisteredUser } from '@/types/friend';
import { formatLastLoginTime } from './date';

/**
 * RegisteredUserをFriend形式に変換する（自分自身は除外）
 * @param users - 登録済みユーザーリスト
 * @param currentUserId - 現在のユーザーID
 * @returns Friend配列
 */
export const convertUsersToFriends = (users: RegisteredUser[], currentUserId?: string): Friend[] => {
  return users
    .filter((registeredUser) => registeredUser.uid !== currentUserId) // 自分自身を除外
    .map((registeredUser) => {
      const timeDiff = new Date().getTime() - registeredUser.lastLoginAt.getTime();
      const isRecentlyActive = timeDiff < 5 * 60 * 1000; // 5分以内
      
      return {
        id: registeredUser.uid,
        name: registeredUser.displayName,
        avatar: registeredUser.displayName.charAt(0).toUpperCase(),
        lastMessage: registeredUser.email,
        lastMessageTime: formatLastLoginTime(registeredUser.lastLoginAt),
        isOnline: isRecentlyActive,
        unreadCount: 0,
        email: registeredUser.email,
        createdAt: registeredUser.createdAt,
        lastLoginAt: registeredUser.lastLoginAt,
      };
    });
};

/**
 * Friend配列を検索キーワードでフィルタリングする
 * @param friends - Friend配列
 * @param searchText - 検索キーワード
 * @returns フィルタリングされたFriend配列
 */
export const filterFriends = (friends: Friend[], searchText: string): Friend[] => {
  if (!searchText) return friends;
  
  return friends.filter(friend =>
    friend.name.toLowerCase().includes(searchText.toLowerCase()) ||
    friend.email?.toLowerCase().includes(searchText.toLowerCase())
  );
};
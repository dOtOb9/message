import { db } from '@/firebase-config';
import type { Friend, RegisteredUser } from '@/types';
import { convertUsersToFriends } from '@/utils';
import type { User } from 'firebase/auth';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

/**
 * フレンド管理のカスタムhook
 */
export const useFriends = (user: User | null) => {
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);

  // 登録済みユーザーを取得
  const fetchRegisteredUsers = async () => {
    try {
      setLoading(true);
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
      
      // Friend形式に変換
      const convertedFriends = convertUsersToFriends(users, user?.uid);
      setFriends(convertedFriends);
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

  // データ更新（手動リフレッシュ用）
  const refreshData = () => {
    fetchRegisteredUsers();
  };

  useEffect(() => {
    // 現在のユーザーを登録
    if (user) {
      registerCurrentUser();
    }
    
    // 登録済みユーザーを取得
    fetchRegisteredUsers();
  }, [user]);

  return {
    friends,
    registeredUsers,
    loading,
    refreshData,
  };
};
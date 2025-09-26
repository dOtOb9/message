import { auth, db } from '@/firebase-config';
import { signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserProfile {
  uid: string;
  displayName?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    try {
      console.log('ログアウト処理開始...');
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
      console.log('ログアウト完了');
    } catch (error) {
      console.error('ログアウトエラー:', error);
      throw error;
    }
  };

  const createOrUpdateUserProfile = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // 新規ユーザーの場合、プロフィールを作成
        const newUserProfile = {
          uid: user.uid,
          displayName: user.displayName || '匿名ユーザー',
          createdAt: new Date(),
          lastLoginAt: new Date(),
        };
        
        await setDoc(userRef, newUserProfile);
        setUserProfile(newUserProfile);
      } else {
        // 既存ユーザーの場合、最終ログイン時刻を更新
        const existingProfile = userSnap.data();
        const updatedProfile = {
          ...existingProfile,
          uid: existingProfile.uid,
          displayName: existingProfile.displayName,
          createdAt: existingProfile.createdAt?.toDate ? existingProfile.createdAt.toDate() : new Date(existingProfile.createdAt),
          lastLoginAt: new Date(),
        };
        
        await setDoc(userRef, { ...updatedProfile, createdAt: existingProfile.createdAt, lastLoginAt: new Date() }, { merge: true });
        setUserProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        await createOrUpdateUserProfile(user);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
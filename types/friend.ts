export interface Friend {
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

export interface RegisteredUser {
  uid: string;
  displayName: string;
  email: string;
  createdAt: Date;
  lastLoginAt: Date;
}
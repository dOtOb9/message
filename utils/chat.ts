import type { Message } from '@/types';

/**
 * チャットIDを生成（2つのユーザーIDをソートして結合）
 */
export const generateChatId = (userId1?: string, userId2?: string): string => {
  if (!userId1 || !userId2) return '';
  return [userId1, userId2].sort().join('_');
};

/**
 * メッセージの時間をフォーマット
 */
export const formatMessageTime = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * メッセージが自分のものかどうかを判定
 */
export const isOwnMessage = (message: Message, currentUserId?: string): boolean => {
  return message.senderId === currentUserId;
};

/**
 * メッセージのタイムスタンプをDateオブジェクトに変換
 */
export const getMessageDate = (message: Message): Date => {
  return message.timestamp instanceof Date 
    ? message.timestamp 
    : message.timestamp?.toDate() || new Date();
};

/**
 * メッセージ送信者の名前を取得
 */
export const getSenderName = (message: Message, userNames: { [key: string]: string }): string => {
  return userNames[message.senderId] || '読み込み中...';
};
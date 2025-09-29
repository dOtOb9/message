export interface TodoItem {
  id: string;
  title?: string;
  description?: string;
  content?: string; // 既存のToDoとの互換性のため
  status?: 'pending' | 'completed';
  completed?: boolean; // GPT生成のToDoで使用
  priority?: 'high' | 'medium' | 'low';
  category?: string;
  dueDate?: string | null;
  createdAt: Date;
  updatedAt?: Date;
  userId?: string;
  sourceChatId?: string;
  sourceFriendName?: string;
  chatLink?: string;
  sourceMessageId?: string; // 既存のフィールドも保持
}
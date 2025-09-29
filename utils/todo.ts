import type { TodoItem } from '@/types';

/**
 * TodoItemの表示用コンテンツを取得する
 * @param item - TodoItem
 * @returns 表示用文字列
 */
export const getTodoDisplayContent = (item: TodoItem): string => {
  return item.content || item.title || '無題のToDo';
};

/**
 * TodoItemが完了状態かどうかを判定する
 * @param item - TodoItem
 * @returns 完了状態かどうか
 */
export const isTodoCompleted = (item: TodoItem): boolean => {
  return item.status === 'completed' || !!item.completed;
};

/**
 * TodoItemがチャットから生成されたものかどうかを判定する
 * @param item - TodoItem
 * @returns チャット生成かどうか
 */
export const isTodoFromChat = (item: TodoItem): boolean => {
  return !!item.sourceChatId;
};

/**
 * 優先度に応じたスタイルクラス名を取得する
 * @param priority - 優先度
 * @returns Tailwind CSSクラス名
 */
export const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case 'high':
      return { bg: 'bg-red-100', text: 'text-red-600', label: '高' };
    case 'medium':
      return { bg: 'bg-yellow-100', text: 'text-yellow-600', label: '中' };
    case 'low':
      return { bg: 'bg-green-100', text: 'text-green-600', label: '低' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-600', label: '未設定' };
  }
};
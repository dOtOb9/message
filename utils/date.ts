/**
 * 日時を相対的な文字列にフォーマットする
 * @param date - フォーマットする日時
 * @returns 相対時間文字列（例：「3分前」、「2時間前」）
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return '今';
  if (diffInMinutes < 60) return `${diffInMinutes}分前`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}時間前`;
  return `${Math.floor(diffInMinutes / 1440)}日前`;
};

/**
 * 日付を日本語形式でフォーマットする
 * @param date - フォーマットする日付
 * @returns 日本語形式の日付文字列
 */
export const formatJapaneseDate = (date: Date): string => {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  });
};

/**
 * 最後のログイン時間をフォーマットする
 * @param date - ログイン時間
 * @returns フォーマットされた時間文字列
 */
export const formatLastLoginTime = (date: Date): string => {
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
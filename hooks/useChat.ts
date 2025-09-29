import { fetchUserNames, saveTodosToFirestore, subscribeToMessages } from '@/services/firestoreService';
import type { Message } from '@/types';
import { generateChatId } from '@/utils';
import type { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { checkIfTodoGenerationNeeded, generateTodosFromChat } from '../services/openaiService';

/**
 * Chat機能のカスタムhook
 */
export const useChat = (user: User | null, friendId?: string, friendName?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState<{[key: string]: string}>({});
  const [lastAnalyzedMessageCount, setLastAnalyzedMessageCount] = useState(0);
  const [autoAnalysisTimer, setAutoAnalysisTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [lastAnalyzedTimestamp, setLastAnalyzedTimestamp] = useState<Date | null>(null);

  // チャットIDを生成
  const chatId = generateChatId(user?.uid, friendId);
  console.log('Generated chatId:', { chatId, userId: user?.uid, friendId });

  // ユーザー名を取得
  useEffect(() => {
    const loadUserNames = async () => {
      try {
        const namesMap = await fetchUserNames();
        setUserNames(namesMap);
      } catch (error) {
        console.error('ユーザー名取得エラー:', error);
      }
    };
    
    loadUserNames();
  }, []);

  // メッセージの購読
  useEffect(() => {
    if (!user || !friendId) return;
    
    const unsubscribe = subscribeToMessages(
      chatId,
      (messagesData) => {
        setMessages(messagesData);
        setLoading(false);
      },
      (error) => {
        console.error('メッセージ取得エラー:', error);
        setLoading(false);
      }
    );
    
    return unsubscribe;
  }, [user, friendId, chatId]);

  // 自動でチャット履歴を分析してToDo生成
  const autoAnalyzeChatForTodos = async (currentMessages: Message[]) => {
    if (currentMessages.length === 0) return;
    
    // 最後に分析したタイムスタンプ以降の新しいメッセージのみを分析対象とする
    let messagesToAnalyze = currentMessages;
    if (lastAnalyzedTimestamp) {
      messagesToAnalyze = currentMessages.filter(msg => {
        const msgTime = msg.timestamp instanceof Date 
          ? msg.timestamp 
          : msg.timestamp?.toDate?.() || new Date(0);
        return msgTime > lastAnalyzedTimestamp;
      });
    }
    
    // 新しいメッセージが3件未満の場合はスキップ
    if (messagesToAnalyze.length < 3) {
      console.log(`新しいメッセージは${messagesToAnalyze.length}件のため分析をスキップ`);
      return;
    }
    
    console.log(`新しいメッセージ ${messagesToAnalyze.length} 件を分析中...`);
    
    try {
      // まず軽量な分析でToDo生成が必要か判定
      const needsAnalysis = await checkIfTodoGenerationNeeded(messagesToAnalyze, userNames);
      
      if (needsAnalysis) {
        console.log('ToDo生成が必要と判定されました。詳細分析を開始...');
        // フル分析を実行（新しいメッセージのみ）
        const todos = await generateTodosFromChat(messagesToAnalyze, userNames);
        
        if (todos.length > 0) {
          // ToDoをFirestoreに保存
          await saveTodosToFirestore(todos, chatId, user?.uid || '', friendName);
          console.log(`自動ToDo生成完了: ${todos.length}件のToDoを生成しました`);
        } else {
          console.log('このチャットからはToDo項目が見つかりませんでした。');
        }
      } else {
        console.log('ToDo生成は不要と判定されました。');
      }
      
      // 最後に分析したタイムスタンプを更新
      const latestMessage = currentMessages[currentMessages.length - 1];
      if (latestMessage) {
        const timestamp = latestMessage.timestamp instanceof Date 
          ? latestMessage.timestamp 
          : latestMessage.timestamp?.toDate?.() || new Date();
        setLastAnalyzedTimestamp(timestamp);
      }
      
    } catch (error: any) {
      if (error.message.includes('billing_not_active') || error.message.includes('429')) {
        console.log('⚠️ OpenAI APIの請求設定が無効です。OpenAI機能は一時的に無効化されます。');
      } else {
        console.error('OpenAI分析エラー:', error);
      }
    }
    
    setLastAnalyzedMessageCount(currentMessages.length);
  };

  // チャット履歴を分析してToDoを生成
  const analyzeChatAndGenerateTodos = async () => {
    if (messages.length === 0 || !user) return;
    
    try {
      const todos = await generateTodosFromChat(messages, userNames);
      
      if (todos.length > 0) {
        // ToDoをFirestoreに保存
        await saveTodosToFirestore(todos, chatId, user.uid, friendName);
        console.log(`自動ToDo生成完了: ${todos.length}件のToDoを生成しました`);
      } else {
        console.log('このチャットからはToDo項目が見つかりませんでした。');
      }
      
    } catch (error: any) {
      console.error('チャット分析エラー:', error);
    }
  };

  // メッセージの変更を監視して自動分析をトリガー
  useEffect(() => {
    if (messages.length === 0 || loading) return;
    
    // タイマーをクリア
    if (autoAnalysisTimer) {
      clearTimeout(autoAnalysisTimer);
    }
    
    // 新しいメッセージが追加されてから3秒後に分析を開始
    const timer = setTimeout(() => {
      autoAnalyzeChatForTodos(messages);
    }, 3000);
    
    setAutoAnalysisTimer(timer);
    
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [messages.length, loading, userNames]);

  // コンポーネントのアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (autoAnalysisTimer) {
        clearTimeout(autoAnalysisTimer);
      }
    };
  }, [autoAnalysisTimer]);

  return {
    messages,
    loading,
    userNames,
    chatId,
    analyzeChatAndGenerateTodos,
  };
};
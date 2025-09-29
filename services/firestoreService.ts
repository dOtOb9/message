import { db } from '@/firebase-config';
import type { GeneratedTodo, Message } from '@/types';
import type { User } from 'firebase/auth';
import {
    addDoc,
    collection,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    Unsubscribe,
} from 'firebase/firestore';

/**
 * メッセージを送信する
 */
export const sendMessage = async (
  chatId: string,
  text: string,
  user: User
): Promise<void> => {
  console.log('sendMessage called with:', { chatId, text, userId: user.uid });
  
  if (!chatId || chatId.includes('/')) {
    console.error('Invalid chatId:', chatId);
    throw new Error(`Invalid chatId: ${chatId}`);
  }
  
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  console.log('Messages collection path:', `chats/${chatId}/messages`);
  
  await addDoc(messagesRef, {
    text: text.trim(),
    senderId: user.uid,
    timestamp: serverTimestamp(),
    chatId: chatId,
  });
};

/**
 * メッセージをリアルタイムで取得する
 */
export const subscribeToMessages = (
  chatId: string,
  callback: (messages: Message[]) => void,
  onError: (error: Error) => void
): Unsubscribe => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const messagesData: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messagesData.push({
          id: doc.id,
          text: data.text,
          senderId: data.senderId,
          timestamp: data.timestamp?.toDate() || new Date(),
          chatId: data.chatId,
        });
      });
      callback(messagesData);
    },
    onError
  );
};

/**
 * 登録済みユーザーの名前マップを取得
 */
export const fetchUserNames = async (): Promise<{ [key: string]: string }> => {
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);
  const namesMap: { [key: string]: string } = {};
  
  usersSnapshot.forEach((doc) => {
    const data = doc.data();
    namesMap[doc.id] = data.displayName || '匿名ユーザー';
  });
  
  return namesMap;
};

/**
 * ToDoをFirestoreに保存
 */
export const saveTodosToFirestore = async (
  todos: GeneratedTodo[],
  sourceChatId: string,
  userId: string,
  sourceFriendName?: string
): Promise<void> => {
  for (const todo of todos) {
    try {
      const todoRef = doc(collection(db, 'todos'));
      await setDoc(todoRef, {
        ...todo,
        userId: userId,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        sourceChatId: sourceChatId,
        sourceFriendName: sourceFriendName || '不明',
        chatLink: `chat_${sourceChatId}`, // チャットへのリンク情報
      });
    } catch (error) {
      console.error('ToDo保存エラー:', error);
    }
  }
};
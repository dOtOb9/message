import { db } from '@/firebase-config';
import type { TodoItem } from '@/types';
import type { User } from 'firebase/auth';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

/**
 * Todo操作のためのカスタムhook
 */
export const useTodos = (user?: User) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

    // 新しいTodoを追加
  const addTodo = async (content: string) => {
    if (!user) return;
    
    try {
      await addDoc(collection(db, 'users', user.uid, 'todos'), {
        content: content.trim(),
        status: 'pending',
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      throw error;
    }
  };

  // Todoの完了状態切り替え
  const toggleTodo = async (id: string, currentStatus: string, isFromChat = false) => {
    if (!user) return;
    
    try {
      if (isFromChat) {
        const todoRef = doc(db, 'todos', id);
        await updateDoc(todoRef, {
          completed: currentStatus !== 'completed',
          updatedAt: new Date(),
        });
      } else {
        const todoRef = doc(db, 'users', user.uid, 'todos', id);
        await updateDoc(todoRef, {
          status: currentStatus === 'pending' ? 'completed' : 'pending'
        });
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  };

  // Todoの削除
  const deleteTodo = async (id: string, isFromChat = false) => {
    if (!user) return;
    
    try {
      if (isFromChat) {
        await deleteDoc(doc(db, 'todos', id));
      } else {
        await deleteDoc(doc(db, 'users', user.uid, 'todos', id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  };

  // Todosの購読
  useEffect(() => {
    if (!user) {
      console.log('ユーザーが認証されていません');
      setLoading(false);
      return;
    }

    console.log('ユーザーID:', user.uid, 'でToDoを取得中...');
    setError('');

    const allTodos: TodoItem[] = [];
    let globalLoaded = false;
    let userLoaded = false;

    const checkAndUpdateTodos = () => {
      if (globalLoaded && userLoaded) {
        console.log('取得したToDo数:', allTodos.length);
        const sortedTodos = allTodos.sort((a, b) => {
          const aTime = a.createdAt?.getTime() || 0;
          const bTime = b.createdAt?.getTime() || 0;
          return bTime - aTime;
        });
        setTodos(sortedTodos);
        setLoading(false);
      }
    };

    // GPT生成のToDoを取得（グローバルtodosコレクション）
    const globalTodosRef = collection(db, 'todos');
    const globalQuery = query(globalTodosRef, where('userId', '==', user.uid));
    
    const unsubscribeGlobal = onSnapshot(
      globalQuery,
      (querySnapshot) => {
        console.log('グローバルToDo数:', querySnapshot.size);
        
        // 既存のグローバルToDoをクリア
        for (let i = allTodos.length - 1; i >= 0; i--) {
          if (allTodos[i].sourceChatId) {
            allTodos.splice(i, 1);
          }
        }
        
        // 新しいグローバルToDoを追加
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          allTodos.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            content: data.title || data.content,
            status: data.completed ? 'completed' : 'pending',
            completed: data.completed,
            priority: data.priority,
            category: data.category,
            dueDate: data.dueDate,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate(),
            userId: data.userId,
            sourceChatId: data.sourceChatId,
            sourceFriendName: data.sourceFriendName,
            chatLink: data.chatLink,
          });
        });
        
        globalLoaded = true;
        checkAndUpdateTodos();
      },
      (error) => {
        console.error('グローバルToDo取得エラー:', error);
        setError(`グローバルToDo取得エラー: ${error.message}`);
        globalLoaded = true;
        checkAndUpdateTodos();
      }
    );
    
    // 手動作成のToDoを取得（ユーザー固有サブコレクション）
    const userTodosRef = collection(db, 'users', user.uid, 'todos');
    const userQuery = query(userTodosRef);
    
    const unsubscribeUser = onSnapshot(
      userQuery,
      (querySnapshot) => {
        console.log('ユーザーToDo数:', querySnapshot.size);
        
        // 既存のユーザーToDoをクリア
        for (let i = allTodos.length - 1; i >= 0; i--) {
          if (!allTodos[i].sourceChatId) {
            allTodos.splice(i, 1);
          }
        }
        
        // 新しいユーザーToDoを追加
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          allTodos.push({
            id: doc.id,
            content: data.content,
            status: data.status,
            createdAt: data.createdAt?.toDate() || new Date(),
            sourceMessageId: data.sourceMessageId,
          });
        });
        
        userLoaded = true;
        checkAndUpdateTodos();
      },
      (error) => {
        console.error('ユーザーToDo取得エラー:', error);
        setError(`ユーザーToDo取得エラー: ${error.message}`);
        userLoaded = true;
        checkAndUpdateTodos();
      }
    );

    return () => {
      unsubscribeGlobal();
      unsubscribeUser();
    };
  }, [user]);

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    setError,
    setLoading
  };
};
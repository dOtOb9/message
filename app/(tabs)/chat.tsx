import { ChatHeader } from '@/components/ChatHeader';
import { MessageInput } from '@/components/MessageInput';
import { MessagesList } from '@/components/MessagesList';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { sendMessage } from '@/services/firestoreService';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  
  // パラメータからフレンド情報を取得
  const { friendId, friendName, friendAvatar } = useLocalSearchParams<{
    friendId: string;
    friendName: string;
    friendAvatar: string;
  }>();
  
  // カスタムhookでChat機能を管理
  const { messages, loading, userNames, chatId } = useChat(user, friendId, friendName);

    // メッセージ送信
  const handleSendMessage = async () => {
    if (!inputText.trim() || !user) return;
    
    try {
      await sendMessage(chatId, inputText, user);
      setInputText('');
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
    }
  };  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ChatHeader friendName={friendName} friendAvatar={friendAvatar} />
      
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <MessagesList 
          messages={messages}
          loading={loading}
          currentUserId={user?.uid}
          userNames={userNames}
        />
        
        <MessageInput 
          inputText={inputText}
          onChangeText={setInputText}
          onSend={handleSendMessage}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
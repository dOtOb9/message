import type { Message } from '@/types';
import { formatMessageTime, getMessageDate, getSenderName, isOwnMessage } from '@/utils';
import React from 'react';
import { Text, View } from 'react-native';

interface MessageItemProps {
  message: Message;
  currentUserId?: string;
  userNames: { [key: string]: string };
}

export const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  currentUserId, 
  userNames 
}) => {
  const isOwn = isOwnMessage(message, currentUserId);
  const messageTime = getMessageDate(message);
  const senderName = getSenderName(message, userNames);
  
  return (
    <View
      className={`my-1 max-w-[80%] ${
        isOwn 
          ? 'self-end items-end' 
          : 'self-start items-start'
      }`}
    >
      {/* 送信者名（自分以外の場合のみ表示） */}
      {!isOwn && (
        <Text className="text-xs text-gray-400 mb-1 mx-2">
          {senderName}
        </Text>
      )}
      
      <View
        className={`px-4 py-2.5 rounded-2xl mb-1 ${
          isOwn 
            ? 'bg-blue-500' 
            : 'bg-white border border-gray-200'
        }`}
      >
        <Text 
          className={`text-base ${
            isOwn ? 'text-white' : 'text-black'
          }`}
        >
          {message.text}
        </Text>
      </View>
      
      <Text className="text-xs text-gray-500 mx-2">
        {formatMessageTime(messageTime)}
      </Text>
    </View>
  );
};
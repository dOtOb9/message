import type { TodoItem } from '@/types';
import { formatRelativeTime, getPriorityStyles, getTodoDisplayContent, isTodoCompleted, isTodoFromChat } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { User } from 'firebase/auth';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface TodoItemComponentProps {
  item: TodoItem;
  user: User | null;
  onToggle: (id: string, currentStatus: string, isFromChat: boolean) => void;
  onDelete: (id: string, isFromChat: boolean) => void;
}

export const TodoItemComponent: React.FC<TodoItemComponentProps> = ({
  item,
  user,
  onToggle,
  onDelete,
}) => {
  const displayContent = getTodoDisplayContent(item);
  const isCompleted = isTodoCompleted(item);
  const isFromChat = isTodoFromChat(item);
  
  const handleChatLinkPress = () => {
    if (item.sourceChatId && item.sourceFriendName) {
      // チャットページに移動 - friendIdを抽出
      const participants = item.sourceChatId.split('_');
      const friendId = participants.find(id => id !== user?.uid);
      if (friendId) {
        router.push({
          pathname: '/(tabs)/chat',
          params: { 
            friendId: friendId,
            friendName: item.sourceFriendName 
          }
        });
      }
    }
  };
  
  return (
    <View className="bg-white rounded-lg p-4 mb-2 shadow-sm">
      <View className="flex-row items-start">
        <TouchableOpacity
          onPress={() => onToggle(item.id, isCompleted ? 'completed' : 'pending', isFromChat)}
          className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center mt-0.5 ${
            isCompleted ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
          }`}
        >
          {isCompleted && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </TouchableOpacity>
        
        <View className="flex-1">
          <Text className={`text-base font-medium ${
            isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'
          }`}>
            {displayContent}
          </Text>
          
          {item.description && (
            <Text className={`text-sm mt-1 ${
              isCompleted ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {item.description}
            </Text>
          )}
          
          <View className="flex-row items-center flex-wrap mt-2">
            <Text className="text-xs text-gray-400 mr-3">
              {formatRelativeTime(item.createdAt)}
            </Text>
            
            {item.priority && (() => {
              const priorityStyles = getPriorityStyles(item.priority);
              return (
                <View className={`px-2 py-0.5 rounded-full mr-2 ${priorityStyles.bg}`}>
                  <Text className={`text-xs ${priorityStyles.text}`}>
                    {priorityStyles.label}
                  </Text>
                </View>
              );
            })()}
            
            {item.category && (
              <View className="bg-purple-100 px-2 py-0.5 rounded-full mr-2">
                <Text className="text-xs text-purple-600">{item.category}</Text>
              </View>
            )}
            
            {(item.sourceMessageId || item.sourceChatId) && (
              <View className="bg-blue-100 px-2 py-0.5 rounded-full mr-2">
                <Text className="text-xs text-blue-600">自動生成</Text>
              </View>
            )}
            
            {item.sourceChatId && item.sourceFriendName && (
              <TouchableOpacity
                onPress={handleChatLinkPress}
                className="bg-green-100 px-2 py-0.5 rounded-full mr-2 flex-row items-center"
              >
                <Ionicons name="chatbubble-outline" size={10} color="#16A34A" />
                <Text className="text-xs text-green-600 ml-1">
                  {item.sourceFriendName}とのチャット
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() => onDelete(item.id, isFromChat)}
          className="ml-3 p-1"
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
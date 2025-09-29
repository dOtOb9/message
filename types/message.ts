import { Timestamp } from 'firebase/firestore';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date | Timestamp;
  chatId: string;
}

export interface TodoGenerationRequest {
  chatHistory: string;
  recentMessages: Message[];
}

export interface GeneratedTodo {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  dueDate: string | null;
  relatedMessages: string[];
}
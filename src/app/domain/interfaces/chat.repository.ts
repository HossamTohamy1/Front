import { Observable } from 'rxjs';
import { ChatConversation, ChatMessage } from '../models/chat.model';

export interface IChatRepository {
  getConversations(): Observable<ChatConversation[]>;
  getConversationById(id: string): Observable<ChatConversation | undefined>;
  sendMessage(conversationId: string, message: Omit<ChatMessage, 'id'>): Observable<ChatMessage>;
  markAsRead(conversationId: string): Observable<void>;
}

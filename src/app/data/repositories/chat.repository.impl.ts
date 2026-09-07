import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IChatRepository } from '../../domain/interfaces/chat.repository';
import { ChatConversation, ChatMessage } from '../../domain/models/chat.model';
import { DEFAULT_CHAT_CONVERSATIONS } from '../mock/chat.mock';
import { environment } from '../../../environments/environment';

const CHAT_KEY = `${environment.storagePrefix}dashboard-support-chats-v1`;

@Injectable({
  providedIn: 'root',
})
export class ChatRepositoryImpl implements IChatRepository {
  private http = inject(HttpClient);

  getConversations(): Observable<ChatConversation[]> {
    if (!environment.useMockData) {
      return this.http.get<ChatConversation[]>(`${environment.apiBaseUrl}/chat/conversations`);
    }
    try {
      const stored = localStorage.getItem(CHAT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return of(parsed);
        }
      }
      localStorage.setItem(CHAT_KEY, JSON.stringify(DEFAULT_CHAT_CONVERSATIONS));
      return of(DEFAULT_CHAT_CONVERSATIONS);
    } catch {
      return of(DEFAULT_CHAT_CONVERSATIONS);
    }
  }

  getConversationById(id: string): Observable<ChatConversation | undefined> {
    if (!environment.useMockData) {
      return this.http.get<ChatConversation>(`${environment.apiBaseUrl}/chat/conversations/${id}`);
    }
    return this.getConversations().pipe(map(convs => convs.find(c => c.id === id)));
  }

  sendMessage(conversationId: string, message: Omit<ChatMessage, 'id'>): Observable<ChatMessage> {
    const fullMsg: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };

    if (!environment.useMockData) {
      return this.http.post<ChatMessage>(`${environment.apiBaseUrl}/chat/conversations/${conversationId}/messages`, message);
    }

    return this.getConversations().pipe(
      map(convs => {
        const next = convs.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: [...c.messages, fullMsg],
              lastMessage: message.text,
              lastTime: message.time,
            };
          }
          return c;
        });
        try {
          localStorage.setItem(CHAT_KEY, JSON.stringify(next));
        } catch {}
        return fullMsg;
      })
    );
  }

  markAsRead(conversationId: string): Observable<void> {
    if (!environment.useMockData) {
      return this.http.post<void>(`${environment.apiBaseUrl}/chat/conversations/${conversationId}/read`, {});
    }
    return this.getConversations().pipe(
      map(convs => {
        const next = convs.map(c => (c.id === conversationId ? { ...c, unread: 0 } : c));
        try {
          localStorage.setItem(CHAT_KEY, JSON.stringify(next));
        } catch {}
      })
    );
  }
}

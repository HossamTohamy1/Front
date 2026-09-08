import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
      return this.http.get<any>(`${environment.apiBaseUrl}/chat/conversations`).pipe(
        map(res => {
          const items = res?.data ?? res ?? [];
          if (!Array.isArray(items) || items.length === 0) return DEFAULT_CHAT_CONVERSATIONS;
          return items.map((c: any) => ({
            id: c.id,
            customerName: c.customerName || c.userName || 'عميل المتجر',
            customerPhone: c.customerPhone || c.phone || '',
            orderNumber: c.orderNumber || '',
            unread: c.unreadCount ?? c.unread ?? 0,
            lastMessage: c.lastMessage || '',
            lastTime: c.lastMessageTime || c.lastTime || '',
            messages: Array.isArray(c.messages) ? c.messages.map((m: any) => ({
              id: m.id,
              sender: m.isStaff || m.senderType === 'staff' ? 'staff' : 'customer',
              text: m.message || m.text || '',
              time: m.createdAt || m.time || ''
            })) : [],
            initials: (c.customerName || 'عميل').slice(0, 2),
            isOnline: true
          } as ChatConversation));
        }),
        catchError(() => of(DEFAULT_CHAT_CONVERSATIONS))
      );
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
      return this.http.get<any>(`${environment.apiBaseUrl}/chat/conversations/${id}`).pipe(
        map(res => {
          const c = res?.data ?? res;
          if (!c) return undefined;
          return {
            id: c.id || id,
            customerName: c.customerName || 'عميل المتجر',
            customerPhone: c.customerPhone || '',
            orderNumber: c.orderNumber || '',
            unread: c.unread ?? 0,
            lastMessage: c.lastMessage || '',
            lastTime: c.lastTime || '',
            messages: Array.isArray(c) ? c.map((m: any) => ({
              id: m.id,
              sender: m.isStaff || m.senderType === 'staff' ? 'staff' : 'customer',
              text: m.message || m.text || '',
              time: m.createdAt || m.time || ''
            })) : (c.messages || []),
          } as ChatConversation;
        }),
        catchError(() => this.getConversations().pipe(map(convs => convs.find(c => c.id === id))))
      );
    }
    return this.getConversations().pipe(map(convs => convs.find(c => c.id === id)));
  }

  sendMessage(conversationId: string, message: Omit<ChatMessage, 'id'>): Observable<ChatMessage> {
    const fullMsg: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };

    if (!environment.useMockData) {
      return this.http.post<any>(`${environment.apiBaseUrl}/chat/conversations/${conversationId}/messages`, {
        text: message.text,
        sender: message.sender
      }).pipe(
        map(() => fullMsg),
        catchError(() => of(fullMsg))
      );
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
      return this.http.post<void>(`${environment.apiBaseUrl}/chat/conversations/${conversationId}/read`, {}).pipe(
        catchError(() => of(void 0))
      );
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

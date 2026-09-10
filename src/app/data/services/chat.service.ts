import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth/auth.service';
import * as signalR from '@microsoft/signalr';

export interface ChatMessage {
  id?: string;
  senderId?: string;
  recipientId?: string;
  message: string;
  attachmentUrl?: string;
  createdAt?: string;
  isRead?: boolean;
  senderRole?: string;
  senderType?: string;
  senderName?: string;
  guestName?: string;
}

export interface ConversationResponse {
  id: string;
  messages: ChatMessage[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = environment.apiBaseUrl;
  
  private hubConnection?: signalR.HubConnection;
  private messageReceivedSource = new Subject<ChatMessage>();
  messageReceived$ = this.messageReceivedSource.asObservable();

  private refreshConversationSource = new Subject<void>();
  refreshConversation$ = this.refreshConversationSource.asObservable();

  triggerRefresh() {
    this.refreshConversationSource.next();
  }

  getMyConversation(): Observable<ConversationResponse | null> {
    return this.http.get<any>(`${this.baseUrl}/chat/conversations/my`).pipe(
      map(res => {
        const data = res?.data !== undefined ? res.data : res;
        if (!data || !data.id) return null;
        return data as ConversationResponse;
      })
    );
  }

  uploadMedia(file: File | Blob, fileName: string = 'recording.webm'): Observable<string> {
    const formData = new FormData();
    formData.append('file', file, fileName);
    return this.http.post<any>(`${this.baseUrl}/chat/upload`, formData).pipe(
      map(res => {
        const data = res?.data ?? res;
        return data?.url || '';
      })
    );
  }

  sendMessage(conversationId: string, text: string, attachmentUrl?: string, guestName?: string): Observable<any> {
    const payload: any = { message: text, text, attachmentUrl, guestName };
    if (!conversationId) {
      return this.http.post<any>(`${this.baseUrl}/chat/send`, payload);
    }
    return this.http.post(`${this.baseUrl}/chat/conversations/${conversationId}/messages`, payload);
  }

  markRead(conversationId: string): Observable<any> {
    if (!conversationId) return new Observable(obs => { obs.next(null); obs.complete(); });
    return this.http.post<any>(`${this.baseUrl}/chat/conversations/${conversationId}/read`, {});
  }

  startConnection(conversationId: string) {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      if (conversationId) {
        this.hubConnection.invoke('JoinConversation', conversationId).catch((err: any) => console.error(err));
      }
      return;
    }

    const token = this.authService.getToken();
    
    const hubPath = (environment.apiUrl ? environment.apiUrl.replace(/\/api\/?$/, '') : '') || '';
    const hubUrl = hubPath ? `${hubPath}/chatHub` : '/chatHub';

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token || ''
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessage', (message: any) => {
      this.messageReceivedSource.next({
        message: message.message,
        createdAt: message.timestamp,
        senderId: message.userId,
        senderRole: 'Staff',
        senderType: 'Staff',
        senderName: message.userName || 'Support'
      });
    });

    this.hubConnection.start()
      .then(() => {
        console.log('SignalR connected');
        // Join the group for this conversation
        if (conversationId) {
          this.hubConnection?.invoke('JoinConversation', conversationId).catch((err: any) => console.error(err));
        }
      })
      .catch((err: any) => console.error('Error while starting connection: ' + err));
  }

  stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}

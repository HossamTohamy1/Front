import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
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

  getMyConversation(): Observable<ConversationResponse> {
    return this.http.get<ConversationResponse>(`${this.baseUrl}/chat/conversations/my`);
  }

  sendMessage(conversationId: string, text: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/chat/conversations/${conversationId}/messages`, { text });
  }

  startConnection(conversationId: string) {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
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
        senderRole: 'Staff'
      });
    });

    this.hubConnection.start()
      .then(() => {
        console.log('SignalR connected');
        // Join the group for this conversation
        this.hubConnection?.invoke('JoinConversation', conversationId).catch((err: any) => console.error(err));
      })
      .catch((err: any) => console.error('Error while starting connection: ' + err));
  }

  stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}

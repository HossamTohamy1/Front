export interface ChatMessage {
  id: string;
  sender: 'customer' | 'staff';
  text: string;
  time: string;
  kind?: 'text' | 'image' | 'audio';
  mediaUrl?: string;
  durationSeconds?: number;
}

export interface ChatConversation {
  id: string;
  customerName: string;
  customerPhone: string;
  orderNumber: string;
  unread: number;
  lastMessage: string;
  lastTime: string;
  messages: ChatMessage[];
  initials?: string;
  isOnline?: boolean;
}

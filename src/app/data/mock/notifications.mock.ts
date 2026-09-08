export interface NotificationItem {
  id: string;
  type: 'order' | 'chat' | 'offer' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  orderId?: string;
}

export const notifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'order',
    title: 'NOTIFICATIONS.ORDER_SHIPPED_TITLE',
    message: 'NOTIFICATIONS.ORDER_SHIPPED_MSG',
    read: false,
    createdAt: '2025-11-22T09:20:00Z',
    orderId: 'ord-1',
  },
  {
    id: 'notif-2',
    type: 'offer',
    title: 'NOTIFICATIONS.FLASH_SALE_TITLE',
    message: 'NOTIFICATIONS.FLASH_SALE_MSG',
    read: false,
    createdAt: '2025-11-21T12:00:00Z',
  },
];

export const chatMessages = [
  { id: 'm-1', sender: 'user', text: "Hi! I'd like to know more about sizing for the Pro Waist Cincher.", time: '14:20', read: true },
  { id: 'm-2', sender: 'support', text: "Hello! We'd be happy to help. What are your waist measurements?", time: '14:23', read: true },
];

export const adminChatInbox = [
  { id: 'conv-1', name: 'Sarah Johnson', avatar: 'S', lastMessage: 'Thank you so much!', time: '14:32', unread: 0, online: true },
  { id: 'conv-2', name: 'Fatima Al-Hassan', avatar: 'F', lastMessage: 'When will my order arrive?', time: '13:45', unread: 2, online: false },
];

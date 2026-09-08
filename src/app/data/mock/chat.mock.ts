import { ChatConversation } from '../../domain/models/chat.model';

export const DEFAULT_CHAT_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'chat-1',
    customerName: 'Nadeen',
    customerPhone: '01028372333',
    orderNumber: 'LKB0272345',
    unread: 1,
    lastMessage: 'مرحباً، هل يمكن تعديل موعد التوصيل؟',
    lastTime: '14:35',
    initials: 'N',
    isOnline: true,
    messages: [
      { id: 'm-1', sender: 'customer', text: 'السلام عليكم، أريد الاستفسار عن موعد الشحن', time: '14:30' },
      { id: 'm-2', sender: 'staff', text: 'أهلاً بك يا نادين، طلبك قيد التجهيز وسيتم الشحن اليوم.', time: '14:32' },
      { id: 'm-3', sender: 'customer', text: 'مرحباً، هل يمكن تعديل موعد التوصيل؟', time: '14:35' },
    ],
  },
  {
    id: 'chat-2',
    customerName: 'سارة أحمد',
    customerPhone: '0551234567',
    orderNumber: 'LK09763832',
    unread: 0,
    lastMessage: 'شكراً جزيلاً وصل الطلب بشكل ممتاز',
    lastTime: '11:20',
    initials: 'س',
    isOnline: false,
    messages: [
      { id: 'm-4', sender: 'customer', text: 'شكراً جزيلاً وصل الطلب بشكل ممتاز', time: '11:20' },
      { id: 'm-5', sender: 'staff', text: 'العفو ونسعد دائماً بخدمتك!', time: '11:22' },
    ],
  },
];

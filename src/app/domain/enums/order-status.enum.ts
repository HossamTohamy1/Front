export type OrderStatus =
  | 'pending-approval'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'out-for-delivery'
  | 'delivered'
  | 'postponed';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  'pending-approval': 'قيد الاعتماد',
  confirmed: 'طلب جديد',
  preparing: 'قيد التجهيز',
  shipped: 'تم الشحن',
  'out-for-delivery': 'قيد التوصيل',
  delivered: 'تم التسليم',
  postponed: 'طلب مؤجل',
};

export const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
  'pending-approval': 'dashboard-status dashboard-status--pending-approval',
  confirmed: 'dashboard-status dashboard-status--new',
  preparing: 'dashboard-status dashboard-status--prepared',
  shipped: 'dashboard-status dashboard-status--approval',
  'out-for-delivery': 'dashboard-status dashboard-status--shipping',
  delivered: 'dashboard-status dashboard-status--delivered',
  postponed: 'dashboard-status dashboard-status--postponed',
};

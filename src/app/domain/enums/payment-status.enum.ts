export type PaymentStatus = 'paid' | 'unpaid';

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  paid: 'تم الدفع',
  unpaid: 'غير مدفوع',
};

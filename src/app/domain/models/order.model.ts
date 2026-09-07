import { OrderStatus } from '../enums/order-status.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export type TrackedOrderStatus = OrderStatus;
export type TrackedOrderPaymentStatus = PaymentStatus;
export type TrackedOrderGender = 'رجالي' | 'نسائي' | 'مختلط';

export interface TrackedOrderStatusUpdater {
  name: string;
  avatar?: string;
}

export interface TrackedOrderViewerEntry {
  id: string;
  viewedAt: string;
  viewedBy: TrackedOrderStatusUpdater;
}

export interface TrackedOrderHistoryEntry {
  id: string;
  field: string;
  fieldLabel: string;
  oldValue?: string;
  newValue: string;
  updatedAt: string;
  updatedBy: TrackedOrderStatusUpdater;
}

export interface BankTransferReceipt {
  name: string;
  type: string;
  dataUrl: string;
}

export interface TrackedOrderItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
}

export interface TrackedOrder {
  id: string;
  orderNumber: string;
  shipmentCode?: string;
  createdAt: string;
  updatedAt: string;
  status: TrackedOrderStatus;
  paymentStatus?: TrackedOrderPaymentStatus;
  items: TrackedOrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  customerName: string;
  phone: string;
  city: string;
  area: string;
  address: string;
  notes?: string;
  paymentMethod: string;
  country: string;
  deliveryCompany: string;
  estimatedDelivery: string;
  gender?: TrackedOrderGender;
  bankTransferReceipt?: BankTransferReceipt;
  statusUpdatedBy?: TrackedOrderStatusUpdater;
  viewCount?: number;
  viewHistory?: TrackedOrderViewerEntry[];
  editHistory?: TrackedOrderHistoryEntry[];
  processedCount?: number;
}

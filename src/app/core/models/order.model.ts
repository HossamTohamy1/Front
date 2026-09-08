export type TrackedOrderStatus =
  | 'pending-approval'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'out-for-delivery'
  | 'delivered'
  | 'postponed';

export type TrackedOrderPaymentStatus = 'paid' | 'unpaid';
export type TrackedOrderGender = 'COMMON.MENS' | 'COMMON.WOMENS' | 'COMMON.UNISEX';

export type TrackedOrderStatusUpdater = {
  name: string;
  avatar?: string;
};

export type TrackedOrderViewerEntry = {
  id: string;
  viewedAt: string;
  viewedBy: TrackedOrderStatusUpdater;
};

export type TrackedOrderHistoryEntry = {
  id: string;
  field: string;
  fieldLabel: string;
  oldValue?: string;
  newValue: string;
  updatedAt: string;
  updatedBy: TrackedOrderStatusUpdater;
};

export type BankTransferReceipt = {
  name: string;
  type: string;
  dataUrl: string;
};

export type TrackedOrderItem = {
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
};

export type TrackedOrder = {
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
};

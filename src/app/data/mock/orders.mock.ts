export interface LegacyOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  country: string;
  notes: string;
  items: any[];
  subtotal: number;
  delivery: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shipmentCode?: string;
  createdAt: string;
  updatedAt: string;
}

export const orders: LegacyOrder[] = [
  {
    id: 'ord-1',
    orderNumber: 'LK-2025-1847',
    customerId: 'user-1',
    customerName: 'Sarah Johnson',
    customerPhone: '+1 555 123 4567',
    customerEmail: 'sarah@email.com',
    address: '123 Maple Street, Apt 4B',
    city: 'New York',
    country: 'United States',
    notes: 'Please leave at the door.',
    items: [
      {
        productId: 'prod-1',
        productName: 'Pro Waist Cincher Elite',
        productImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop&auto=format',
        size: 'M',
        quantity: 1,
        price: 49.99,
      },
    ],
    subtotal: 49.99,
    delivery: 5.99,
    total: 55.98,
    status: 'shipped',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    shipmentCode: 'TK-882910-FX',
    createdAt: '2025-11-20T14:32:00Z',
    updatedAt: '2025-11-22T09:15:00Z',
  },
  {
    id: 'ord-2',
    orderNumber: 'LK-2025-1846',
    customerId: 'user-2',
    customerName: 'Fatima Al-Hassan',
    customerPhone: '+971 50 234 5678',
    customerEmail: 'fatima@email.com',
    address: 'Villa 12, Street 5, Al Barsha',
    city: 'Dubai',
    country: 'UAE',
    notes: '',
    items: [
      {
        productId: 'prod-2',
        productName: 'Full Body Shaper Supreme',
        productImage: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=200&h=200&fit=crop&auto=format',
        size: 'L',
        quantity: 1,
        price: 64.99,
      },
      {
        productId: 'prod-6',
        productName: 'Thermal Slim Belt',
        productImage: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=200&h=200&fit=crop&auto=format',
        size: 'L/XL',
        quantity: 2,
        price: 24.99,
      },
    ],
    subtotal: 114.97,
    delivery: 0,
    total: 114.97,
    status: 'confirmed',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    createdAt: '2025-11-21T10:05:00Z',
    updatedAt: '2025-11-21T16:30:00Z',
  },
];

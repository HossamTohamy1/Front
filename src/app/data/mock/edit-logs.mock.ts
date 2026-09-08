export interface EditLog {
  id: string;
  orderId: string;
  orderNumber: string;
  field: string;
  oldValue: string;
  newValue: string;
  editedBy: string;
  editorRole: string;
  timestamp: string;
}

export const editLogs: EditLog[] = [
  {
    id: 'log-1',
    orderId: 'ord-1',
    orderNumber: 'LK-2025-1847',
    field: 'Status',
    oldValue: 'Confirmed',
    newValue: 'Shipped',
    editedBy: 'Ahmed Hassan',
    editorRole: 'Admin',
    timestamp: '2025-11-22T09:15:00Z',
  },
  {
    id: 'log-2',
    orderId: 'ord-1',
    orderNumber: 'LK-2025-1847',
    field: 'Shipment Code',
    oldValue: '—',
    newValue: 'TK-882910-FX',
    editedBy: 'Ahmed Hassan',
    editorRole: 'Admin',
    timestamp: '2025-11-22T09:15:00Z',
  },
];

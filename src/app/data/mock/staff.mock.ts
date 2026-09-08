import { StaffAccount } from '../../domain/models/staff-account.model';

export const DEFAULT_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: 'staff-admin',
    name: 'Nadeen',
    email: 'admin@loxxking.com',
    role: 'admin',
    roleLabel: 'مدير النظام',
  },
  {
    id: 'staff-sales-1',
    name: 'Asmaa',
    email: 'asmaa@loxxking.com',
    role: 'sales',
    roleLabel: 'موظف مبيعات',
  },
];

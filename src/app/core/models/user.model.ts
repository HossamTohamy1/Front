export type UserRole = 'customer' | 'admin' | 'manager' | 'sales';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export function isStaffRole(role?: string): boolean {
  return role === 'admin' || role === 'manager' || role === 'sales';
}

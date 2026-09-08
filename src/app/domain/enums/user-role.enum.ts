export type UserRole = 'customer' | 'admin' | 'manager' | 'sales';
export type StaffRole = 'admin' | 'manager' | 'sales';

export function isStaffRole(role?: string): boolean {
  return role === 'admin' || role === 'manager' || role === 'sales';
}

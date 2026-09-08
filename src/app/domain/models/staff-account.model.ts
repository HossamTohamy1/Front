import { StaffRole } from '../enums/user-role.enum';

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  roleLabel: string;
  avatar?: string;
  phone?: string;
  lastLoginAt?: string;
}

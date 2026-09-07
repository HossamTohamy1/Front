import { Observable } from 'rxjs';
import { StaffAccount } from '../models/staff-account.model';

export interface IStaffRepository {
  getStaffAccounts(): Observable<StaffAccount[]>;
  getActiveAccountId(): Observable<string>;
  setActiveAccountId(id: string): Observable<void>;
  updateStaffAccount(id: string, updates: Partial<StaffAccount>): Observable<StaffAccount>;
}

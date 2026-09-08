import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IStaffRepository } from '../../domain/interfaces/staff.repository';
import { StaffAccount } from '../../domain/models/staff-account.model';
import { DEFAULT_STAFF_ACCOUNTS } from '../mock/staff.mock';
import { environment } from '../../../environments/environment';

const STAFF_KEY = `${environment.storagePrefix}dashboard-staff-accounts-v1`;
const ACTIVE_KEY = `${environment.storagePrefix}dashboard-active-account-v1`;

@Injectable({
  providedIn: 'root',
})
export class StaffRepositoryImpl implements IStaffRepository {
  private http = inject(HttpClient);

  getStaffAccounts(): Observable<StaffAccount[]> {
    if (!environment.useMockData) {
      return this.http.get<any>(`${environment.apiBaseUrl}/users/staff`).pipe(
        map(res => {
          const items = res?.data ?? res ?? [];
          if (!Array.isArray(items) || items.length === 0) return DEFAULT_STAFF_ACCOUNTS;
          return items.map((u: any) => {
            const roleStr = (u.role || 'admin').toLowerCase();
            const staffRole: any = roleStr.includes('manager') ? 'manager' : (roleStr.includes('sales') ? 'sales' : 'admin');
            return {
              id: u.id,
              name: u.name || 'موظف',
              email: u.email || '',
              role: staffRole,
              roleLabel: staffRole === 'admin' ? 'مدير عام' : (staffRole === 'manager' ? 'مدير متجر' : 'مسؤول مبيعات'),
              phone: u.phone,
              avatar: u.avatar
            } as StaffAccount;
          });
        }),
        catchError(() => of(DEFAULT_STAFF_ACCOUNTS))
      );
    }
    try {
      const stored = localStorage.getItem(STAFF_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return of(parsed);
        }
      }
      localStorage.setItem(STAFF_KEY, JSON.stringify(DEFAULT_STAFF_ACCOUNTS));
      return of(DEFAULT_STAFF_ACCOUNTS);
    } catch {
      return of(DEFAULT_STAFF_ACCOUNTS);
    }
  }

  getActiveAccountId(): Observable<string> {
    try {
      const id = localStorage.getItem(ACTIVE_KEY) || DEFAULT_STAFF_ACCOUNTS[0]?.id || 'staff-admin';
      return of(id);
    } catch {
      return of(DEFAULT_STAFF_ACCOUNTS[0]?.id || 'staff-admin');
    }
  }

  setActiveAccountId(id: string): Observable<void> {
    try {
      localStorage.setItem(ACTIVE_KEY, id);
    } catch {}
    return of(void 0);
  }

  updateStaffAccount(id: string, updates: Partial<StaffAccount>): Observable<StaffAccount> {
    if (!environment.useMockData) {
      return this.http.put<any>(`${environment.apiBaseUrl}/users/staff/${id}`, updates).pipe(
        map(res => (res?.data ?? res ?? updates) as StaffAccount),
        catchError(() => of(updates as StaffAccount))
      );
    }
    return this.getStaffAccounts().pipe(
      map(accounts => {
        let updated: StaffAccount | undefined;
        const next = accounts.map(a => {
          if (a.id === id) {
            updated = { ...a, ...updates };
            return updated;
          }
          return a;
        });
        try {
          localStorage.setItem(STAFF_KEY, JSON.stringify(next));
        } catch {}
        return updated || (updates as StaffAccount);
      })
    );
  }
}


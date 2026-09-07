import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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
      return this.http.get<StaffAccount[]>(`${environment.apiBaseUrl}/users/staff`);
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
      return this.http.patch<StaffAccount>(`${environment.apiBaseUrl}/users/staff/${id}`, updates);
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


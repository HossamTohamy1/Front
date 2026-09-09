import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { User, isStaffRole } from '../../models/user.model';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  user = signal<User | null>(null);
  isAdmin = computed(() => isStaffRole(this.user()?.role));

  constructor() {
    // If we want to auto-fetch on load:
    if (isPlatformBrowser(this.platformId)) {
      this.fetchUser().catch(() => { });
    }
  }

  async fetchUser(): Promise<User | null> {
    try {
      const url = `${environment.apiBaseUrl || 'http://localhost:5050/api'}/users/me`;
      const res = await firstValueFrom(this.http.get<any>(url, { withCredentials: true }));

      if (res && res.isSuccess && this.isUser(res.data)) {
        this.user.set(res.data);
        return res.data;
      }
      this.user.set(null);
      return null;
    } catch {
      this.user.set(null);
      return null;
    }
  }

  private isUser(value: any): value is User {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    return Boolean(
      value.id &&
      value.name &&
      value.email &&
      value.role &&
      ['customer', 'admin', 'manager', 'sales'].includes(value.role)
    );
  }

  setUser(nextUser: User | null) {
    this.user.set(nextUser);
    if (!nextUser && isPlatformBrowser(this.platformId)) {
      window.localStorage.removeItem('lk-auth-token');
    }
  }
}

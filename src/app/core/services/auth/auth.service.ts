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

  isAuthenticated(): boolean {
    return this.user() !== null;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage.getItem('lk-auth-token');
    }
    return null;
  }

  async fetchUser(): Promise<User | null> {
    try {
      const url = `${environment.apiBaseUrl || '/api'}/users/me`;
      const res = await firstValueFrom(this.http.get<any>(url, { withCredentials: true }));
      const data = res?.data || res;

      if (data && data.id && data.email) {
        // Fallback: extract role from JWT if backend omits it
        if (!data.role) {
          const token = this.getToken();
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              data.role = (payload.role || payload.Role || 'customer').toLowerCase();
            } catch (e) {}
          }
        }

        if (this.isUser(data)) {
          this.user.set(data);
          return data;
        }
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
      ['customer', 'admin', 'manager', 'sales'].includes(value.role.toLowerCase())
    );
  }

  setUser(nextUser: User | null) {
    this.user.set(nextUser);
    if (!nextUser && isPlatformBrowser(this.platformId)) {
      window.localStorage.removeItem('lk-auth-token');
    }
  }
}

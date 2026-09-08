import { Injectable, signal, computed, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User, isStaffRole } from '../../models/user.model';

const USER_STORAGE_KEY = 'lk-auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = signal<User | null>(null);
  isAdmin = computed(() => isStaffRole(this.user()?.role));

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.user.set(this.readStoredUser());
      
      window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key === USER_STORAGE_KEY) {
          this.user.set(this.readStoredUser());
        }
      });
    }
  }

  private readStoredUser(): User | null {
    try {
      const stored = window.localStorage.getItem(USER_STORAGE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (this.isUser(parsed)) return parsed;
      return null;
    } catch {
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
    if (isPlatformBrowser(this.platformId)) {
      if (nextUser) {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
      } else {
        window.localStorage.removeItem(USER_STORAGE_KEY);
        window.localStorage.removeItem('lk-auth-token');
      }
    }
  }
}


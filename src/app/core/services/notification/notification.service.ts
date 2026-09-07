import { Injectable, signal, inject, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  unreadCount = signal(0);
  chatUnread = signal(0);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.refreshUnreadCount();
    }
  }

  refreshUnreadCount() {
    if (!this.authService.user()) return;
    this.http.get<any>(`${environment.apiBaseUrl}/notifications/unread-count`).subscribe({
      next: (res: any) => {
        const count = res?.data || res || 0;
        this.unreadCount.set(count);
      },
      error: (err: any) => console.error(err)
    });
  }

  setUnreadCount(count: number) {
    this.unreadCount.set(count);
  }

  setChatUnread(count: number) {
    this.chatUnread.set(count);
  }
}

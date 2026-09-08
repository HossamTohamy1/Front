import { Injectable, signal, inject, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private injector = inject(Injector);
  toasts = signal<Toast[]>([]);

  showToast(message: string, type: Toast['type'] = 'success') {
    let msg = message;
    try {
      const translate = this.injector.get(TranslateService, null, { optional: true });
      if (translate) {
        msg = translate.instant(message);
      }
    } catch {}

    const id = Math.random().toString(36).slice(2);
    this.toasts.update(current => [...current, { id, type, message: msg }]);
    
    setTimeout(() => {
      this.dismissToast(id);
    }, 3500);
  }

  error(message: string) {
    this.showToast(message, 'error');
  }

  success(message: string) {
    this.showToast(message, 'success');
  }

  info(message: string) {
    this.showToast(message, 'info');
  }

  dismissToast(id: string) {
    this.toasts.update(current => current.filter(toast => toast.id !== id));
  }
}

import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  showToast(message: string, type: Toast['type'] = 'success') {
    const id = Math.random().toString(36).slice(2);
    this.toasts.update(current => [...current, { id, type, message }]);
    
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

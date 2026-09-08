import { Injectable, signal, inject, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from '../lang/lang.service';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration: number;
  createdAt: number;
}

const DEFAULT_TITLES_AR: Record<ToastType, string> = {
  success: 'تمت العملية بنجاح',
  error: 'حدث خطأ',
  warning: 'تنبيه',
  info: 'إشعار'
};

const DEFAULT_TITLES_EN: Record<ToastType, string> = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Notice'
};

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private injector = inject(Injector);
  private langService = inject(LangService);

  readonly toasts = signal<Toast[]>([]);
  private lastToastTime = 0;
  private lastToastMsg = '';

  showToast(message: string, type: ToastType = 'success', duration = 4000, customTitle?: string) {
    this.show(message, type, duration, customTitle);
  }

  show(message: string, type: ToastType = 'success', duration = 4000, customTitle?: string) {
    if (!message) return;

    // Prevent immediate duplicate toasts (within 400ms)
    const now = Date.now();
    if (this.lastToastMsg === message && now - this.lastToastTime < 400) {
      return;
    }
    this.lastToastTime = now;
    this.lastToastMsg = message;

    const resolvedMessage = this.resolveText(message);
    const resolvedTitle = customTitle ? this.resolveText(customTitle) : this.getDefaultTitle(type);

    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = {
      id,
      type,
      message: resolvedMessage,
      title: resolvedTitle,
      duration: Math.max(2500, Math.min(6000, duration)), // 2.5s to 6s, default 4s
      createdAt: now
    };

    // Keep max 3 toasts visible at once to avoid screen clutter
    this.toasts.update(current => {
      const next = [...current, toast];
      if (next.length > 3) {
        return next.slice(next.length - 3);
      }
      return next;
    });

    // Auto dismiss after duration
    setTimeout(() => {
      this.dismissToast(id);
    }, toast.duration);
  }

  success(message: string, duration = 4000, title?: string) {
    this.show(message, 'success', duration, title);
  }

  error(message: string, duration = 4000, title?: string) {
    this.show(message, 'error', duration, title);
  }

  info(message: string, duration = 4000, title?: string) {
    this.show(message, 'info', duration, title);
  }

  warning(message: string, duration = 4000, title?: string) {
    this.show(message, 'warning', duration, title);
  }

  dismissToast(id: string) {
    this.toasts.update(current => current.filter(toast => toast.id !== id));
  }

  dismiss(id: string) {
    this.dismissToast(id);
  }

  clearAll() {
    this.toasts.set([]);
  }

  private resolveText(text: string): string {
    if (!text) return '';
    try {
      const translate = this.injector.get(TranslateService, null, { optional: true });
      if (translate) {
        const translated = translate.instant(text);
        if (translated && translated !== text) {
          return translated;
        }
      }
    } catch (_) {}

    return text;
  }

  private getDefaultTitle(type: ToastType): string {
    const isArabic = this.langService.effectiveLang() === 'ar';
    return isArabic ? DEFAULT_TITLES_AR[type] : DEFAULT_TITLES_EN[type];
  }
}

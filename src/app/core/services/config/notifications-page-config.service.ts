import { Injectable, signal, effect } from '@angular/core';
import { sanitizeWithInitial } from '../../utils/config-sanitizer';

export type NotificationsPageConfig = {
    pageTitle: string;
    emptyStateTitle: string;
};

const DEFAULT_CONFIG: NotificationsPageConfig = {
    pageTitle: 'NOTIFICATIONS.TITLE',
    emptyStateTitle: 'NOTIFICATIONS.EMPTY',
};

@Injectable({
  providedIn: 'root'
})
export class NotificationsPageConfigService {
  private readonly STORAGE_KEY = 'loxx-notifications-config';
  
  config = signal<NotificationsPageConfig>(this.getInitialConfig());

  constructor() {
    effect(() => {
      window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config()));
    });

    window.addEventListener('storage', (e) => {
      if (e.key === this.STORAGE_KEY && e.newValue) {
        this.config.set(sanitizeWithInitial(JSON.parse(e.newValue), DEFAULT_CONFIG));
      }
    });
  }

  private getInitialConfig(): NotificationsPageConfig {
    const saved = window.localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const clean = sanitizeWithInitial(JSON.parse(saved), DEFAULT_CONFIG);
        window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(clean));
        return clean;
      } catch (_) {}
    }
    return DEFAULT_CONFIG;
  }

  setConfig(config: NotificationsPageConfig) {
    this.config.set(config);
  }
}

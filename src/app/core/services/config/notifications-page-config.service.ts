import { Injectable, signal, effect } from '@angular/core';

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
        this.config.set(JSON.parse(e.newValue));
      }
    });
  }

  private getInitialConfig(): NotificationsPageConfig {
    const saved = window.localStorage.getItem(this.STORAGE_KEY);
    return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
  }

  setConfig(config: NotificationsPageConfig) {
    this.config.set(config);
  }
}

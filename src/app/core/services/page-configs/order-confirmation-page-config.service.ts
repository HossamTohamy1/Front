import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect } from '@angular/core';
type OrderConfirmationPageConfig = {
    pageTitle: string;
    successMessage: string;
    showOrderDetails: boolean;
    showNextSteps: boolean;
};

const DEFAULT_CONFIG = {
    pageTitle: 'تم تأكيد طلبك',
    successMessage: 'شكراً لتسوقك من LOXX KING. تم استلام طلبك بنجاح.',
    showOrderDetails: true,
    showNextSteps: true,
};







@Injectable({
  providedIn: 'root'
})
export class OrderConfirmationPageConfigService {
  private readonly storageKey = 'loxx-order-confirmation-config';

  readonly pageConfig = signal<any>(this.loadInitialConfig());

  constructor() {
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key === this.storageKey && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          this.pageConfig.set(this.mergeWithInitial(updated));
        } catch (_) {}
      }
    });

    effect(() => {
      const config = this.pageConfig();
      localStorage.setItem(this.storageKey, JSON.stringify(config));
      
      try {
        window.dispatchEvent(new StorageEvent('storage', {
          key: this.storageKey,
          newValue: JSON.stringify(config),
          storageArea: localStorage,
        }));
      } catch (_) {}
    });
  }

  updateConfig(newConfig: any) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): any {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return this.mergeWithInitial(parsed);
      } catch (e) {}
    }
    return DEFAULT_CONFIG;
  }

  private mergeWithInitial(parsed: any): any {
    return sanitizeWithInitial(parsed, DEFAULT_CONFIG);
  }
}

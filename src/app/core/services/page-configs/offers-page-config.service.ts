import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect } from '@angular/core';
type OffersPageConfig = {
    heroTitle: string;
    heroSubtitle: string;
    showHero: boolean;
    currentOffersTitle: string;
    bundlesTitle: string;
    bundlesSubtitle: string;
};

const DEFAULT_CONFIG = {
    heroTitle: 'عروض خاصة',
    heroSubtitle: 'أفضل الأسعار لفترة محدودة',
    showHero: true,
    currentOffersTitle: 'التخفيضات الحالية',
    bundlesTitle: 'وفر أكثر مع الباقات',
    bundlesSubtitle: 'اختار الباقة الأنسب لك بأسعار مخفضة',
};







@Injectable({
  providedIn: 'root'
})
export class OffersPageConfigService {
  private readonly storageKey = 'loxx-offers-config';

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

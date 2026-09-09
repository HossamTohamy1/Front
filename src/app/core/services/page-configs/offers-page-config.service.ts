import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect , NgZone, inject} from '@angular/core';
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








const INSTANCE_ID = typeof crypto !== 'undefined' && crypto.randomUUID 
  ? crypto.randomUUID() 
  : Math.random().toString(36).substring(2) + Date.now().toString(36);

@Injectable({
  providedIn: 'root'
})
export class OffersPageConfigService {
  private readonly storageKey = 'loxx-offers-config';

  readonly pageConfig = signal<any>(this.loadInitialConfig());

  private zone = inject(NgZone);

  constructor() {
    window.addEventListener('storage', (e: StorageEvent) => {
      if ((e as any).__sourceInstanceId === INSTANCE_ID) return; // Discard self-triggered synthetic events

      if (e.key === this.storageKey && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          this.zone.run(() => { this.pageConfig.set(this.mergeWithInitial(updated)); });
        } catch (_) {}
      }
    });

    effect(() => {
      const config = this.pageConfig();
      localStorage.setItem(this.storageKey, JSON.stringify(config));
      
      try {
        const event = new StorageEvent('storage', {
          key: this.storageKey,
          newValue: JSON.stringify(config),
          storageArea: localStorage,
        });
        (event as any).__sourceInstanceId = INSTANCE_ID;
        window.dispatchEvent(event);
      } catch (_) {}
    });
  }

  updateConfig(newConfig: any) {
    this.zone.run(() => { this.pageConfig.set(newConfig); });
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

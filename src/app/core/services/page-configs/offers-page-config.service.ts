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
    heroTitle: 'OFFERS.TITLE',
    heroSubtitle: 'OFFERS.SUBTITLE',
    showHero: true,
    currentOffersTitle: 'OFFERS.CURRENT',
    bundlesTitle: 'OFFERS.BUNDLES',
    bundlesSubtitle: 'OFFERS.BUNDLES_DESC',
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
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return { ...DEFAULT_CONFIG, ...parsed };
    }
    return parsed;
  }
}

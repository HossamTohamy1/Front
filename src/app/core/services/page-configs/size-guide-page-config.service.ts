import { Injectable, signal, effect } from '@angular/core';
type SizeGuidePageConfig = {
    pageTitle: string;
    pageSubtitle: string;
    showMeasurementsTable: boolean;
    showHelpSection: boolean;
    heroImage: string;
};

const DEFAULT_CONFIG = {
    pageTitle: 'PRODUCT.SIZE_GUIDE',
    pageSubtitle: 'SIZE_GUIDE.SUBTITLE',
    showMeasurementsTable: true,
    showHelpSection: true,
    heroImage: '',
};







@Injectable({
  providedIn: 'root'
})
export class SizeGuidePageConfigService {
  private readonly storageKey = 'loxx-size-guide-config';

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

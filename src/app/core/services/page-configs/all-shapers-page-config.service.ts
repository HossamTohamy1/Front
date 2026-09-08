import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect } from '@angular/core';


export interface AllShapersPageConfig {
    headerTitle: string;
    
    showRating: boolean;
    showReviewsCount: boolean;
    showOriginalPrice: boolean;
    
    emptyTitle: string;
    emptyText: string;
    emptyCta: string;
}


const initialConfig: AllShapersPageConfig = {
    headerTitle: 'كل المشدات',
    
    showRating: true,
    showReviewsCount: true,
    showOriginalPrice: true,
    
    emptyTitle: 'لا توجد منتجات بهذه المواصفات',
    emptyText: 'جرّبي تغيير اللون أو المقاس أو نطاق السعر.',
    emptyCta: 'عرض كل المشدات'
}

@Injectable({
  providedIn: 'root'
})
export class AllShapersPageConfigService {
  private readonly storageKey = 'loxxking-allshapers-page-config';

  readonly pageConfig = signal<AllShapersPageConfig>(this.loadInitialConfig());

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

  updateConfig(newConfig: AllShapersPageConfig) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): AllShapersPageConfig {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return this.mergeWithInitial(parsed);
      } catch (e) {}
    }
    return initialConfig;
  }

  private mergeWithInitial(parsed: any): any {
    return sanitizeWithInitial(parsed, initialConfig);
  }
}

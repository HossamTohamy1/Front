import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect, inject, NgZone } from '@angular/core';


const INSTANCE_ID = typeof crypto !== 'undefined' && crypto.randomUUID 
  ? crypto.randomUUID() 
  : Math.random().toString(36).substring(2) + Date.now().toString(36);

export interface AllShapersPageConfig {
    headerTitle: string;
    headerTitleAr?: string;
    headerTitleEn?: string;
    
    showRating: boolean;
    showReviewsCount: boolean;
    showOriginalPrice: boolean;
    
    emptyTitle: string;
    emptyTitleAr?: string;
    emptyTitleEn?: string;
    emptyText: string;
    emptyTextAr?: string;
    emptyTextEn?: string;
    emptyCta: string;
    emptyCtaAr?: string;
    emptyCtaEn?: string;
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
  private zone = inject(NgZone);

  constructor() {
    window.addEventListener('storage', (e: StorageEvent) => {
      if ((e as any).__sourceInstanceId === INSTANCE_ID) return; // Discard self-triggered synthetic events

      if (e.key === this.storageKey && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          this.zone.run(() => {
            this.pageConfig.set(this.mergeWithInitial(updated));
          });
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

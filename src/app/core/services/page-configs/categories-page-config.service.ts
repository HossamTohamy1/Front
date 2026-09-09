import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect, inject, NgZone } from '@angular/core';


const INSTANCE_ID = typeof crypto !== 'undefined' && crypto.randomUUID 
  ? crypto.randomUUID() 
  : Math.random().toString(36).substring(2) + Date.now().toString(36);

export interface CategoryCardConfig {
    id: string;
    title: string;
    titleAr?: string;
    titleEn?: string;
    accent: string;
    accentAr?: string;
    accentEn?: string;
    description: string;
    descriptionAr?: string;
    descriptionEn?: string;
    path: string;
}

export interface CategoriesPageConfig {
    showTitle: boolean;
    headerTitle: string;
    headerTitleAr?: string;
    headerTitleEn?: string;
    headerSubtitle: string;
    headerSubtitleAr?: string;
    headerSubtitleEn?: string;
    categories: CategoryCardConfig[];
}


const initialConfig: CategoriesPageConfig = {
    showTitle: true,
    headerTitle: 'التصنيفات',
    headerSubtitle: 'تصفح جميع المنتجات حسب الفئة',
    categories: [
        { id: 'men', title: 'مشدات', accent: 'رجالية', description: 'دعم مثالي وثقة\nطوال اليوم', path: '/all-shapers?type=men' },
        { id: 'women', title: 'مشدات', accent: 'نسائية', description: 'تصاميم أنثوية\nلإطلالة مثالية', path: '/all-shapers?type=women' },
        { id: 'postpartum', title: 'مشدات بعد', accent: 'الولادة', description: 'راحة ودعم بعد\nفترة الحمل', path: '/all-shapers?type=postpartum' },
        { id: 'sport', title: 'مشدات', accent: 'رياضية', description: 'حرية الحركة\nوأداء أفضل', path: '/all-shapers?type=sport' },
        { id: 'full-body', title: 'مشد كامل', accent: 'الجسم', description: 'تنسيق شامل\nلجسم مثالي', path: '/all-shapers?type=full-body' },
        { id: 'waist', title: 'مشدات', accent: 'الخصر', description: 'خصر أنحف\nوإطلالة جذابة', path: '/all-shapers?type=waist' }
    ]
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesPageConfigService {
  private readonly storageKey = 'loxxking-categories-page-config';

  readonly pageConfig = signal<CategoriesPageConfig>(this.loadInitialConfig());
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

  updateConfig(newConfig: CategoriesPageConfig) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): CategoriesPageConfig {
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

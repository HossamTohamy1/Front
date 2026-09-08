import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect } from '@angular/core';


export interface CategoryCardConfig {
    id: string;
    title: string;
    accent: string;
    description: string;
    path: string;
}

export interface CategoriesPageConfig {
    showTitle: boolean;
    headerTitle: string;
    headerSubtitle: string;
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

import { Injectable, signal, effect } from '@angular/core';
import { sanitizeWithInitial } from '../../utils/config-sanitizer';


export interface TrustBadgeConfig {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
}

export interface FavoritesPageConfig {
    showTitle: boolean;
    headerTitle: string;
    headerSubtitle: string;
    
    showAddAllToCart: boolean;
    addAllToCartText: string;
    
    showToolbar: boolean;
    showSort: boolean;
    showCount: boolean;
    
    showProductColor: boolean;
    showProductSize: boolean;
    showProductPrice: boolean;
    showProductOldPrice: boolean;
    showProductStock: boolean;
    showRemoveAction: boolean;
    showMoveToCartAction: boolean;
    
    emptyStateTitle: string;
    emptyStateSubtitle: string;
    emptyStateButtonText: string;
    showEmptyStateIllustration: boolean;
    
    showTrustBadges: boolean;
    trustBadges: TrustBadgeConfig[];
}


const initialConfig: FavoritesPageConfig = {
    showTitle: true,
    headerTitle: 'المفضلة',
    headerSubtitle: 'المنتجات التي قمت بحفظها لوقت لاحق',
    
    showAddAllToCart: true,
    addAllToCartText: 'إضافة جميع المنتجات إلى السلة',
    
    showToolbar: true,
    showSort: true,
    showCount: true,
    
    showProductColor: true,
    showProductSize: true,
    showProductPrice: true,
    showProductOldPrice: true,
    showProductStock: true,
    showRemoveAction: true,
    showMoveToCartAction: true,
    
    emptyStateTitle: 'قائمة المفضلة فارغة',
    emptyStateSubtitle: 'لم تقم بإضافة أي منتجات إلى قائمة المفضلة بعد',
    emptyStateButtonText: 'ابدأ التسوق',
    showEmptyStateIllustration: true,
    
    showTrustBadges: true,
    trustBadges: [
        { id: '1', icon: 'BadgeCheck', title: 'منتجات أصلية', subtitle: '100% مضمونة' },
        { id: '2', icon: 'Truck', title: 'شحن سريع', subtitle: '2 - 5 أيام' },
        { id: '3', icon: 'RotateCcw', title: 'إرجاع سهل', subtitle: 'خلال 14 يوم' },
        { id: '4', icon: 'ShieldCheck', title: 'دفع آمن', subtitle: '100% آمن' }
    ]
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesPageConfigService {
  private readonly storageKey = 'loxxking-favorites-page-config';

  readonly pageConfig = signal<FavoritesPageConfig>(this.loadInitialConfig());

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

  updateConfig(newConfig: FavoritesPageConfig) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): FavoritesPageConfig {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return this.mergeWithInitial(parsed);
      } catch (e) {}
    }
    return initialConfig;
  }

  private mergeWithInitial(parsed: any): FavoritesPageConfig {
    return sanitizeWithInitial(parsed, initialConfig);
  }
}

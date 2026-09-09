import { Injectable, signal, effect, NgZone, inject } from '@angular/core';
import { sanitizeWithInitial } from '../../utils/config-sanitizer';


const INSTANCE_ID = typeof crypto !== 'undefined' && crypto.randomUUID 
  ? crypto.randomUUID() 
  : Math.random().toString(36).substring(2) + Date.now().toString(36);

export interface TrustBadgeConfig {
    id: string;
    icon: string;
    title: string;
    titleAr?: string;
    titleEn?: string;
    subtitle: string;
    subtitleAr?: string;
    subtitleEn?: string;
}

export interface FavoritesPageConfig {
    showTitle: boolean;
    headerTitle: string;
    headerTitleAr?: string;
    headerTitleEn?: string;
    headerSubtitle: string;
    headerSubtitleAr?: string;
    headerSubtitleEn?: string;
    
    showAddAllToCart: boolean;
    addAllToCartText: string;
    addAllToCartTextAr?: string;
    addAllToCartTextEn?: string;
    
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
    emptyStateTitleAr?: string;
    emptyStateTitleEn?: string;
    emptyStateSubtitle: string;
    emptyStateSubtitleAr?: string;
    emptyStateSubtitleEn?: string;
    emptyStateButtonText: string;
    emptyStateButtonTextAr?: string;
    emptyStateButtonTextEn?: string;
    showEmptyStateIllustration: boolean;
    
    showTrustBadges: boolean;
    trustBadges: TrustBadgeConfig[];
}


const initialConfig: FavoritesPageConfig = {
    showTitle: true,
    headerTitle: 'المفضلة',
    headerTitleAr: 'المفضلة',
    headerTitleEn: 'Favorites',
    headerSubtitle: 'المنتجات التي قمت بحفظها لوقت لاحق',
    headerSubtitleAr: 'المنتجات التي قمت بحفظها لوقت لاحق',
    headerSubtitleEn: 'Products you saved for later',
    
    showAddAllToCart: true,
    addAllToCartText: 'إضافة جميع المنتجات إلى السلة',
    addAllToCartTextAr: 'إضافة جميع المنتجات إلى السلة',
    addAllToCartTextEn: 'Add all products to cart',
    
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
    emptyStateTitleAr: 'قائمة المفضلة فارغة',
    emptyStateTitleEn: 'Your favorites list is empty',
    emptyStateSubtitle: 'لم تقم بإضافة أي منتجات إلى قائمة المفضلة بعد',
    emptyStateSubtitleAr: 'لم تقم بإضافة أي منتجات إلى قائمة المفضلة بعد',
    emptyStateSubtitleEn: 'You haven\'t added any products to your favorites list yet',
    emptyStateButtonText: 'ابدأ التسوق',
    emptyStateButtonTextAr: 'ابدأ التسوق',
    emptyStateButtonTextEn: 'Start Shopping',
    showEmptyStateIllustration: true,
    
    showTrustBadges: true,
    trustBadges: [
        { id: '1', icon: 'BadgeCheck', title: 'منتجات أصلية', titleAr: 'منتجات أصلية', titleEn: 'Original Products', subtitle: '100% مضمونة', subtitleAr: '100% مضمونة', subtitleEn: '100% Guaranteed' },
        { id: '2', icon: 'Truck', title: 'شحن سريع', titleAr: 'شحن سريع', titleEn: 'Fast Shipping', subtitle: '2 - 5 أيام', subtitleAr: '2 - 5 أيام', subtitleEn: '2 - 5 days' },
        { id: '3', icon: 'RotateCcw', title: 'إرجاع سهل', titleAr: 'إرجاع سهل', titleEn: 'Easy Returns', subtitle: 'خلال 14 يوم', subtitleAr: 'خلال 14 يوم', subtitleEn: 'Within 14 days' },
        { id: '4', icon: 'ShieldCheck', title: 'دفع آمن', titleAr: 'دفع آمن', titleEn: 'Secure Payment', subtitle: '100% آمن', subtitleAr: '100% آمن', subtitleEn: '100% Secure' }
    ]
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesPageConfigService {
  private readonly storageKey = 'loxxking-favorites-page-config';

  readonly pageConfig = signal<FavoritesPageConfig>(this.loadInitialConfig());

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

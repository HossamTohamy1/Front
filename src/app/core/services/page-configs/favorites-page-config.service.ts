import { Injectable, signal, effect } from '@angular/core';


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
    headerTitle: 'FAVORITES.TITLE',
    headerSubtitle: 'FAVORITES.SUBTITLE',
    
    showAddAllToCart: true,
    addAllToCartText: 'FAVORITES.ADD_ALL',
    
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
    
    emptyStateTitle: 'FAVORITES.EMPTY',
    emptyStateSubtitle: 'FAVORITES.EMPTY_DESC',
    emptyStateButtonText: 'COMMON.START_SHOPPING',
    showEmptyStateIllustration: true,
    
    showTrustBadges: true,
    trustBadges: [
        { id: '1', icon: 'BadgeCheck', title: 'CART.ORIGINAL_PRODUCTS', subtitle: 'CART.GUARANTEED_100' },
        { id: '2', icon: 'Truck', title: 'CART.FAST_SHIPPING', subtitle: 'CART.DAYS_2_5' },
        { id: '3', icon: 'RotateCcw', title: 'CART.EASY_RETURNS', subtitle: 'CART.RETURN_PERIOD' },
        { id: '4', icon: 'ShieldCheck', title: 'CART.SECURE_PAYMENT', subtitle: 'CART.SECURE_100' }
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
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return { ...initialConfig, ...parsed };
    }
    return parsed;
  }
}

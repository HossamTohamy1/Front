import { Injectable, signal, effect } from '@angular/core';


export interface ProductFeatureConfig {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
}

export interface ServiceRowConfig {
    id: string;
    icon: string;
    text: string;
}

export interface ProductPageConfig {
    showBreadcrumb: boolean;
    showBestSellerBadge: boolean;
    bestSellerText: string;
    showRatingLine: boolean;
    
    showColorOptions: boolean;
    colorLabel: string;
    showSizeOptions: boolean;
    sizeLabel: string;
    sizeGuideText: string;
    
    showPurchaseActions: boolean;
    addToCartText: string;
    buyNowText: string;
    
    showServiceRow: boolean;
    services: ServiceRowConfig[];
    
    showTabs: boolean;
    tabDescriptionText: string;
    tabFeaturesText: string;
    tabReviewsText: string;
    
    showDescriptionSection: boolean;
    
    showFeaturesSection: boolean;
    features: ProductFeatureConfig[];
    
    showReviewsSection: boolean;
}


const initialConfig: ProductPageConfig = {
    showBreadcrumb: true,
    showBestSellerBadge: true,
    bestSellerText: 'HOME.BEST_SELLERS_ALT',
    showRatingLine: true,
    
    showColorOptions: true,
    colorLabel: 'PRODUCT.COLOR',
    showSizeOptions: true,
    sizeLabel: 'PRODUCT.SIZE',
    sizeGuideText: 'PRODUCT.SIZE_GUIDE',
    
    showPurchaseActions: true,
    addToCartText: 'PRODUCT.ADD_TO_CART',
    buyNowText: 'PRODUCT.BUY_NOW',
    
    showServiceRow: true,
    services: [
        { id: '1', icon: 'Truck', text: 'PRODUCT.SERVICE_FREE_SHIPPING' },
        { id: '2', icon: 'RotateCcw', text: 'PRODUCT.SERVICE_EASY_RETURNS' }
    ],
    
    showTabs: true,
    tabDescriptionText: 'PRODUCT.DESCRIPTION',
    tabFeaturesText: 'PRODUCT.FEATURES',
    tabReviewsText: 'PRODUCT.REVIEWS',
    
    showDescriptionSection: true,
    
    showFeaturesSection: true,
    features: [
        { id: '1', icon: 'shield', title: 'PRODUCT.SAFE_MATERIAL', subtitle: 'PRODUCT.GENTLE' },
        { id: '2', icon: 'feather', title: 'PRODUCT.LIGHTWEIGHT', subtitle: 'PRODUCT.COMFORTABLE' },
        { id: '3', icon: 'posture', title: 'PRODUCT.BACK_SUPPORT', subtitle: 'PRODUCT.IMPROVES_POSTURE' },
        { id: '4', icon: 'fabric', title: 'PRODUCT.BREATHABLE', subtitle: 'PRODUCT.AIRFLOW' },
        { id: '5', icon: 'waist', title: 'PRODUCT.WAIST_SCULPTING', subtitle: 'PRODUCT.SHAPES_BODY' }
    ],
    
    showReviewsSection: true,
}

@Injectable({
  providedIn: 'root'
})
export class ProductPageConfigService {
  private readonly storageKey = 'loxxking-product-page-config';

  readonly pageConfig = signal<ProductPageConfig>(this.loadInitialConfig());

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

  updateConfig(newConfig: ProductPageConfig) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): ProductPageConfig {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return this.mergeWithInitial(parsed);
      } catch (e) {}
    }
    return initialConfig;
  }

  private mergeWithInitial(parsed: any): ProductPageConfig {
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return { ...initialConfig, ...parsed };
    }
    return parsed;
  }
}

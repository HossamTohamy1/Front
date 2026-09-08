import { sanitizeWithInitial } from '../../utils/config-sanitizer';
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
    bestSellerText: 'الأكثر مبيعاً',
    showRatingLine: true,
    
    showColorOptions: true,
    colorLabel: 'اللون',
    showSizeOptions: true,
    sizeLabel: 'المقاس',
    sizeGuideText: 'دليل المقاسات',
    
    showPurchaseActions: true,
    addToCartText: 'أضف للسلة',
    buyNowText: 'شراء الآن',
    
    showServiceRow: true,
    services: [
        { id: '1', icon: 'Truck', text: 'توصيل مجاني للطلبات فوق 300 ر.س' },
        { id: '2', icon: 'RotateCcw', text: 'استبدال واسترجاع خلال 14 يوم' }
    ],
    
    showTabs: true,
    tabDescriptionText: 'الوصف',
    tabFeaturesText: 'المميزات',
    tabReviewsText: 'التقييمات',
    
    showDescriptionSection: true,
    
    showFeaturesSection: true,
    features: [
        { id: '1', icon: 'shield', title: 'خامة آمنة', subtitle: 'لطيفة على البشرة' },
        { id: '2', icon: 'feather', title: 'خفيف الوزن', subtitle: 'لراحة تدوم طويلاً' },
        { id: '3', icon: 'posture', title: 'دعم الظهر', subtitle: 'يحسن استقامة القوام' },
        { id: '4', icon: 'fabric', title: 'تهوية عالية', subtitle: 'يسمح بمرور الهواء' },
        { id: '5', icon: 'waist', title: 'نحت الخصر', subtitle: 'يمنحك شكلاً متناسقاً' }
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

  private mergeWithInitial(parsed: any): any {
    return sanitizeWithInitial(parsed, initialConfig);
  }
}

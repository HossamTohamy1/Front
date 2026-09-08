import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect } from '@angular/core';


export interface TrustBadgeConfig {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
}

export interface CartPageConfig {
    headerTitle: string;
    
    showProductImage: boolean;
    showQuantityControls: boolean;
    showRemoveButton: boolean;
    showOldPrice: boolean;

    showCouponSection: boolean;
    couponTitle: string;
    couponPlaceholder: string;
    couponButtonText: string;

    showSubtotal: boolean;
    showShipping: boolean;
    showDiscount: boolean;
    showTotal: boolean;

    checkoutButtonText: string;

    emptyCartIllustration: boolean;
    emptyCartText: string;
    showContinueShopping: boolean;

    showTrustBadges: boolean;
    trustBadges: TrustBadgeConfig[];
}


const initialConfig: CartPageConfig = {
    headerTitle: 'سلة التسوق',
    
    showProductImage: true,
    showQuantityControls: true,
    showRemoveButton: true,
    showOldPrice: true,

    showCouponSection: true,
    couponTitle: 'كود الخصم',
    couponPlaceholder: 'ادخل كود الخصم',
    couponButtonText: 'تطبيق',

    showSubtotal: true,
    showShipping: true,
    showDiscount: true,
    showTotal: true,

    checkoutButtonText: 'إتمام الطلب',

    emptyCartIllustration: true,
    emptyCartText: 'السلة فارغة',
    showContinueShopping: true,

    showTrustBadges: true,
    trustBadges: [
        { id: 't1', icon: 'BadgeCheck', title: 'منتجات أصلية', subtitle: '100% مضمونة' },
        { id: 't2', icon: 'Truck', title: 'شحن سريع', subtitle: 'خلال 2 - 5 أيام' },
        { id: 't3', icon: 'RotateCcw', title: 'إرجاع سهل', subtitle: 'خلال 14 يوم' },
        { id: 't4', icon: 'ShieldCheck', title: 'دفع آمن', subtitle: '100% آمن' },
    ]
}

@Injectable({
  providedIn: 'root'
})
export class CartPageConfigService {
  private readonly storageKey = 'loxxking-cart-page-config';

  readonly pageConfig = signal<CartPageConfig>(this.loadInitialConfig());

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

  updateConfig(newConfig: CartPageConfig) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): CartPageConfig {
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

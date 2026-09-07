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
    headerTitle: 'CART.TITLE',
    
    showProductImage: true,
    showQuantityControls: true,
    showRemoveButton: true,
    showOldPrice: true,

    showCouponSection: true,
    couponTitle: 'CART.DISCOUNT_CODE',
    couponPlaceholder: 'CART.ENTER_DISCOUNT',
    couponButtonText: 'COMMON.APPLY',

    showSubtotal: true,
    showShipping: true,
    showDiscount: true,
    showTotal: true,

    checkoutButtonText: 'CART.CHECKOUT',

    emptyCartIllustration: true,
    emptyCartText: 'CART.EMPTY',
    showContinueShopping: true,

    showTrustBadges: true,
    trustBadges: [
        { id: 't1', icon: 'BadgeCheck', title: 'CART.ORIGINAL_PRODUCTS', subtitle: 'CART.GUARANTEED_100' },
        { id: 't2', icon: 'Truck', title: 'CART.FAST_SHIPPING', subtitle: 'CART.DELIVERY_TIME' },
        { id: 't3', icon: 'RotateCcw', title: 'CART.EASY_RETURNS', subtitle: 'CART.RETURN_PERIOD' },
        { id: 't4', icon: 'ShieldCheck', title: 'CART.SECURE_PAYMENT', subtitle: 'CART.SECURE_100' },
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

  private mergeWithInitial(parsed: any): CartPageConfig {
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return { ...initialConfig, ...parsed };
    }
    return parsed;
  }
}

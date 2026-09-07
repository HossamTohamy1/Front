import { Injectable, signal } from '@angular/core';

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
};

@Injectable({
  providedIn: 'root'
})
export class CartPageConfigService {
  private readonly STORAGE_KEY = 'loxxking-cart-page-config';
  
  config = signal<CartPageConfig>(this.loadConfig());

  constructor() {
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key === this.STORAGE_KEY && e.newValue) {
        try {
          this.config.set(JSON.parse(e.newValue));
        } catch (_) {}
      }
    });
  }

  private loadConfig(): CartPageConfig {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...initialConfig, ...parsed };
      } catch (e) {}
    }
    return initialConfig;
  }

  updateConfig(newConfig: CartPageConfig) {
    this.config.set(newConfig);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newConfig));
    try {
      window.dispatchEvent(new StorageEvent('storage', {
        key: this.STORAGE_KEY,
        newValue: JSON.stringify(newConfig),
        storageArea: localStorage,
      }));
    } catch (_) {}
  }
}

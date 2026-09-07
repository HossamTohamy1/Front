import { Injectable, signal, effect } from '@angular/core';


export interface CheckoutTrustBadge {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
}

export interface CheckoutPageConfig {
    headerTitle: string;
    headerSubtitle: string;
    
    showCustomerInfo: boolean;
    customerInfoTitle: string;
    
    showPaymentInfo: boolean;
    paymentInfoTitle: string;
    
    showOrderSummary: boolean;
    summaryTitle: string;
    
    showSafeShopping: boolean;
    safeShoppingTitle: string;
    safeShoppingText: string;
    
    showTrustBadges: boolean;
    trustBadges: CheckoutTrustBadge[];
    
    emptyStateTitle: string;
    emptyStateText: string;
    emptyStateCta: string;
}


const initialConfig: CheckoutPageConfig = {
    headerTitle: 'CART.CHECKOUT',
    headerSubtitle: 'CHECKOUT.ENTER_DETAILS',
    
    showCustomerInfo: true,
    customerInfoTitle: 'CHECKOUT.CUSTOMER_DETAILS',
    
    showPaymentInfo: true,
    paymentInfoTitle: 'CHECKOUT.PAYMENT_METHOD',
    
    showOrderSummary: true,
    summaryTitle: 'CHECKOUT.ORDER_SUMMARY',
    
    showSafeShopping: true,
    safeShoppingTitle: 'CHECKOUT.SECURE_SHOPPING',
    safeShoppingText: 'CHECKOUT.DATA_PROTECTION',
    
    showTrustBadges: true,
    trustBadges: [
        { id: '1', icon: 'BadgeCheck', title: 'CART.ORIGINAL_PRODUCTS', subtitle: 'CART.GUARANTEED_100' },
        { id: '2', icon: 'Truck', title: 'CART.FAST_SHIPPING', subtitle: 'CART.DELIVERY_TIME' },
        { id: '3', icon: 'RotateCcw', title: 'CART.EASY_RETURNS', subtitle: 'CART.RETURN_PERIOD' },
        { id: '4', icon: 'ShieldCheck', title: 'CART.SECURE_PAYMENT', subtitle: 'CART.SECURE_100' }
    ],
    
    emptyStateTitle: 'CHECKOUT.NO_PRODUCTS',
    emptyStateText: 'CHECKOUT.ADD_FIRST',
    emptyStateCta: 'CHECKOUT.BACK_TO_CART'
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutPageConfigService {
  private readonly storageKey = 'loxxking-checkout-page-config';

  readonly pageConfig = signal<CheckoutPageConfig>(this.loadInitialConfig());

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

  updateConfig(newConfig: CheckoutPageConfig) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): CheckoutPageConfig {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return this.mergeWithInitial(parsed);
      } catch (e) {}
    }
    return initialConfig;
  }

  private mergeWithInitial(parsed: any): CheckoutPageConfig {
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return { ...initialConfig, ...parsed };
    }
    return parsed;
  }
}

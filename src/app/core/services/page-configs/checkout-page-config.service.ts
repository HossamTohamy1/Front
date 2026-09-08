import { sanitizeWithInitial } from '../../utils/config-sanitizer';
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
    headerTitle: 'إتمام الطلب',
    headerSubtitle: 'أدخل بياناتك لإكمال الطلب',
    
    showCustomerInfo: true,
    customerInfoTitle: 'بيانات العميل',
    
    showPaymentInfo: true,
    paymentInfoTitle: 'طريقة الدفع',
    
    showOrderSummary: true,
    summaryTitle: 'ملخص الطلب',
    
    showSafeShopping: true,
    safeShoppingTitle: 'تسوق آمن',
    safeShoppingText: 'نحن نضمن حماية بياناتك ومعلوماتك الشخصية',
    
    showTrustBadges: true,
    trustBadges: [
        { id: '1', icon: 'BadgeCheck', title: 'منتجات أصلية', subtitle: '100% مضمونة' },
        { id: '2', icon: 'Truck', title: 'شحن سريع', subtitle: 'خلال 2 - 5 أيام' },
        { id: '3', icon: 'RotateCcw', title: 'إرجاع سهل', subtitle: 'خلال 14 يوم' },
        { id: '4', icon: 'ShieldCheck', title: 'دفع آمن', subtitle: '100% آمن' }
    ],
    
    emptyStateTitle: 'لا توجد منتجات لإتمام الطلب',
    emptyStateText: 'أضيفي المنتجات إلى السلة أولًا ثم تابعي إتمام الطلب.',
    emptyStateCta: 'عودة إلى السلة'
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

  private mergeWithInitial(parsed: any): any {
    return sanitizeWithInitial(parsed, initialConfig);
  }
}

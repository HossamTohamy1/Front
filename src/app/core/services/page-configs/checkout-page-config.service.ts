import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect, inject, NgZone } from '@angular/core';


const INSTANCE_ID = typeof crypto !== 'undefined' && crypto.randomUUID 
  ? crypto.randomUUID() 
  : Math.random().toString(36).substring(2) + Date.now().toString(36);

export interface CheckoutTrustBadge {
    id: string;
    icon: string;
    title: string;
    titleAr?: string;
    titleEn?: string;
    subtitle: string;
    subtitleAr?: string;
    subtitleEn?: string;
}

export interface CheckoutPageConfig {
    headerTitle: string;
    headerTitleAr?: string;
    headerTitleEn?: string;
    headerSubtitle: string;
    headerSubtitleAr?: string;
    headerSubtitleEn?: string;
    
    showCustomerInfo: boolean;
    customerInfoTitle: string;
    customerInfoTitleAr?: string;
    customerInfoTitleEn?: string;
    
    showPaymentInfo: boolean;
    paymentInfoTitle: string;
    paymentInfoTitleAr?: string;
    paymentInfoTitleEn?: string;
    
    showOrderSummary: boolean;
    summaryTitle: string;
    summaryTitleAr?: string;
    summaryTitleEn?: string;
    
    showSafeShopping: boolean;
    safeShoppingTitle: string;
    safeShoppingTitleAr?: string;
    safeShoppingTitleEn?: string;
    safeShoppingText: string;
    safeShoppingTextAr?: string;
    safeShoppingTextEn?: string;
    
    showTrustBadges: boolean;
    trustBadges: CheckoutTrustBadge[];
    
    emptyStateTitle: string;
    emptyStateTitleAr?: string;
    emptyStateTitleEn?: string;
    emptyStateText: string;
    emptyStateTextAr?: string;
    emptyStateTextEn?: string;
    emptyStateCta: string;
    emptyStateCtaAr?: string;
    emptyStateCtaEn?: string;
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

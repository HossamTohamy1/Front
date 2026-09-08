import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect } from '@angular/core';


export interface MyOrdersPageConfig {
    headerTitle: string;
    headerSubtitle: string;
    
    phonePlaceholder: string;
    orderPlaceholder: string;
    buttonText: string;
    
    emptyTitle: string;
    emptyText: string;
    emptyCta: string;
    
    notFoundTitle: string;
    notFoundText: string;
    
    showSupportCard: boolean;
    supportTitle: string;
    supportText: string;
}


const initialConfig: MyOrdersPageConfig = {
    headerTitle: 'تتبع',
    headerSubtitle: 'أدخل رقم الهاتف ورقم الطلب لمعرفة حالة طلبك بسهولة',
    
    phonePlaceholder: 'رقم الهاتف',
    orderPlaceholder: 'رقم الطلب',
    buttonText: 'تتبع',
    
    emptyTitle: 'ليس لديك طلبات مشحونة',
    emptyText: 'لا يوجد حاليًا أي طلبات مكتملة أو قيد الشحن. ابدئي التسوق وسيظهر طلبك هنا بعد إتمامه.',
    emptyCta: 'ابدأي التسوق',
    
    notFoundTitle: 'لم يتم العثور على طلب مطابق',
    notFoundText: 'تأكدي من رقم الهاتف أو رقم الطلب ثم حاولي مرة أخرى.',
    
    showSupportCard: true,
    supportTitle: 'نحن هنا لمساعدتك',
    supportText: 'إذا واجهت أي مشكلة، تواصل معنا عبر واتساب'
}

@Injectable({
  providedIn: 'root'
})
export class MyOrdersPageConfigService {
  private readonly storageKey = 'loxxking-myorders-page-config';

  readonly pageConfig = signal<MyOrdersPageConfig>(this.loadInitialConfig());

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

  updateConfig(newConfig: MyOrdersPageConfig) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): MyOrdersPageConfig {
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

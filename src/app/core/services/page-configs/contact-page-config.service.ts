import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect } from '@angular/core';
type ContactMethod = {
    id: string;
    type: 'phone' | 'whatsapp' | 'email';
    title: string;
    value: string;
    link: string;
};

const DEFAULT_CONFIG = {
    pageTitle: 'تواصل معنا',
    pageSubtitle: 'نحن هنا لمساعدتك والإجابة على كافة استفساراتك.',
    formTitle: 'أرسل لنا رسالة',
    formSubtitle: 'سنقوم بالرد عليك في أقرب وقت ممكن.',
    showContactForm: true,
    bannerImage: '',
    contactMethods: [
        { id: '1', type: 'phone', title: 'خدمة العملاء', value: '920000000', link: 'tel:920000000' },
        { id: '2', type: 'whatsapp', title: 'واتساب', value: '+966500000000', link: 'https://wa.me/966500000000' },
        { id: '3', type: 'email', title: 'البريد الإلكتروني', value: 'support@loxxking.com', link: 'mailto:support@loxxking.com' },
    ]
};







@Injectable({
  providedIn: 'root'
})
export class ContactPageConfigService {
  private readonly storageKey = 'loxx-contact-config';

  readonly pageConfig = signal<any>(this.loadInitialConfig());

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

  updateConfig(newConfig: any) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): any {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return this.mergeWithInitial(parsed);
      } catch (e) {}
    }
    return DEFAULT_CONFIG;
  }

  private mergeWithInitial(parsed: any): any {
    return sanitizeWithInitial(parsed, DEFAULT_CONFIG);
  }
}

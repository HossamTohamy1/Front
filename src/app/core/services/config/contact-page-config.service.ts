import { Injectable, signal } from '@angular/core';
import { sanitizeWithInitial } from '../../utils/config-sanitizer';

export type ContactMethod = {
    id: string;
    type: 'phone' | 'whatsapp' | 'email';
    title: string;
    value: string;
    link: string;
};

export type ContactPageConfig = {
    pageTitle: string;
    pageSubtitle: string;
    formTitle: string;
    formSubtitle: string;
    showContactForm: boolean;
    contactMethods: ContactMethod[];
    bannerImage: string;
};

const DEFAULT_CONFIG: ContactPageConfig = {
    pageTitle: 'CONTACT.TITLE',
    pageSubtitle: 'CONTACT.SUBTITLE',
    formTitle: 'CONTACT.FORM_TITLE',
    formSubtitle: 'CONTACT.FORM_SUBTITLE',
    showContactForm: true,
    bannerImage: '',
    contactMethods: [
        { id: '1', type: 'phone', title: 'CONTACT.CUSTOMER_SERVICE', value: '920000000', link: 'tel:920000000' },
        { id: '2', type: 'whatsapp', title: 'CONTACT.WHATSAPP', value: '+966500000000', link: 'https://wa.me/966500000000' },
        { id: '3', type: 'email', title: 'CONTACT.EMAIL', value: 'support@loxxking.com', link: 'mailto:support@loxxking.com' },
    ]
};

@Injectable({
  providedIn: 'root'
})
export class ContactPageConfigService {
  private configSignal = signal<ContactPageConfig>(DEFAULT_CONFIG);

  get config() {
    return this.configSignal.asReadonly();
  }

  constructor() {
    this.loadConfig();
    window.addEventListener('storage', (e) => {
      if (e.key === 'loxx-contact-config' && e.newValue) {
        this.configSignal.set(sanitizeWithInitial(JSON.parse(e.newValue), DEFAULT_CONFIG));
      }
    });
  }

  private loadConfig() {
    const saved = localStorage.getItem('loxx-contact-config');
    if (saved) {
      const clean = sanitizeWithInitial(JSON.parse(saved), DEFAULT_CONFIG);
      localStorage.setItem('loxx-contact-config', JSON.stringify(clean));
      this.configSignal.set(clean);
    }
  }

  setConfig(newConfig: ContactPageConfig) {
    this.configSignal.set(newConfig);
    localStorage.setItem('loxx-contact-config', JSON.stringify(newConfig));
  }
}

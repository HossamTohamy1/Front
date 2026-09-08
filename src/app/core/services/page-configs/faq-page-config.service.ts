import { Injectable, signal, effect } from '@angular/core';


export interface FaqItemConfig {
    id: string;
    question: string;
    answer: string;
}

export interface FaqPageConfig {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    showSearch: boolean;
    showSupportCard: boolean;
    supportCardTitle: string;
    supportCardSubtitle: string;
    faqs: FaqItemConfig[];
}


const initialConfig: FaqPageConfig = {
    title: 'FAQ.TITLE',
    subtitle: 'FAQ.SUBTITLE',
    searchPlaceholder: 'FAQ.SEARCH',
    showSearch: true,
    showSupportCard: true,
    supportCardTitle: 'FAQ.NOT_FOUND',
    supportCardSubtitle: 'FAQ.CONTACT_WHATSAPP',
    faqs: [
        { id: 'size', question: 'FAQ.Q1', answer: 'FAQ.A1' },
        { id: 'exchange', question: 'FAQ.Q2', answer: 'FAQ.A2' },
        { id: 'delivery', question: 'FAQ.Q3', answer: 'FAQ.A3' },
    ]
}

@Injectable({
  providedIn: 'root'
})
export class FaqPageConfigService {
  private readonly storageKey = 'loxxking-faq-page-config';

  readonly pageConfig = signal<FaqPageConfig>(this.loadInitialConfig());

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

  updateConfig(newConfig: FaqPageConfig) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): FaqPageConfig {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return this.mergeWithInitial(parsed);
      } catch (e) {}
    }
    return initialConfig;
  }

  private mergeWithInitial(parsed: any): FaqPageConfig {
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return { ...initialConfig, ...parsed };
    }
    return parsed;
  }
}

import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect, inject, NgZone } from '@angular/core';

const INSTANCE_ID = typeof crypto !== 'undefined' && crypto.randomUUID 
  ? crypto.randomUUID() 
  : Math.random().toString(36).substring(2) + Date.now().toString(36);

export interface FaqItemConfig {
  id: string;
  question: string;
  questionAr?: string;
  questionEn?: string;
  answer: string;
  answerAr?: string;
  answerEn?: string;
}

export interface FaqPageConfig {
  title: string;
  titleAr?: string;
  titleEn?: string;
  subtitle: string;
  subtitleAr?: string;
  subtitleEn?: string;
  searchPlaceholder: string;
  searchPlaceholderAr?: string;
  searchPlaceholderEn?: string;
  showSearch: boolean;
  showSupportCard: boolean;
  supportCardTitle: string;
  supportCardTitleAr?: string;
  supportCardTitleEn?: string;
  supportCardSubtitle: string;
  supportCardSubtitleAr?: string;
  supportCardSubtitleEn?: string;
  faqs: FaqItemConfig[];
}

const initialConfig: FaqPageConfig = {
  title: 'الأسئلة الشائعة',
  subtitle: 'ابحث عن إجابات لأسئلتك الشائعة هنا',
  searchPlaceholder: 'ابحث في الأسئلة',
  showSearch: true,
  showSupportCard: true,
  supportCardTitle: 'لم تجد ما تبحث عنه؟',
  supportCardSubtitle: 'تواصل معنا على الواتساب',
  faqs: [
    {
      id: 'size',
      question: 'كيف اعرف مقاسي؟',
      answer: 'يمكنك معرفة مقاسك من خلال جدول المقاسات'
    }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class FaqPageConfigService {
  private readonly storageKey = 'loxxking-faq-page-config';

  readonly pageConfig = signal<FaqPageConfig>(this.loadInitialConfig());
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
    return sanitizeWithInitial(parsed, initialConfig);
  }
}

import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect, NgZone, inject } from '@angular/core';


const INSTANCE_ID = typeof crypto !== 'undefined' && crypto.randomUUID 
  ? crypto.randomUUID() 
  : Math.random().toString(36).substring(2) + Date.now().toString(36);

export interface SearchPageConfig {
    searchPlaceholder: string;
    searchPlaceholderAr?: string;
    searchPlaceholderEn?: string;
    quickSuggestionsTitle: string;
    quickSuggestionsTitleAr?: string;
    quickSuggestionsTitleEn?: string;
    quickSuggestions: { text: string; textAr?: string; textEn?: string }[];
    recentSearchTitle: string;
    recentSearchTitleAr?: string;
    recentSearchTitleEn?: string;
    showRecentSearch: boolean;
    noResultsTitle: string;
    noResultsTitleAr?: string;
    noResultsTitleEn?: string;
    noResultsSubtitle: string;
    noResultsSubtitleAr?: string;
    noResultsSubtitleEn?: string;
    showSupportCard: boolean;
    supportCardTitle: string;
    supportCardTitleAr?: string;
    supportCardTitleEn?: string;
    supportCardSubtitle: string;
    supportCardSubtitleAr?: string;
    supportCardSubtitleEn?: string;
    suggestedProductsTitle: string;
    suggestedProductsTitleAr?: string;
    suggestedProductsTitleEn?: string;
}

const initialConfig: SearchPageConfig = {
    searchPlaceholder: 'ابحث عن...',
    searchPlaceholderAr: 'ابحث عن...',
    searchPlaceholderEn: 'Search for...',
    quickSuggestionsTitle: 'عمليات بحث شائعة:',
    quickSuggestionsTitleAr: 'عمليات بحث شائعة:',
    quickSuggestionsTitleEn: 'Popular Searches:',
    quickSuggestions: [
        { text: 'مشد خصر رجالي', textAr: 'مشد خصر رجالي', textEn: 'Men Waist Trainer' },
        { text: 'مشد خصر نسائي', textAr: 'مشد خصر نسائي', textEn: 'Women Waist Trainer' },
        { text: 'مشد خصر للتنحيف', textAr: 'مشد خصر للتنحيف', textEn: 'Slimming Corset' },
        { text: 'مشد خصر بعد الولادة', textAr: 'مشد خصر بعد الولادة', textEn: 'Postpartum Corset' },
    ],
    recentSearchTitle: 'عمليات البحث الأخيرة',
    recentSearchTitleAr: 'عمليات البحث الأخيرة',
    recentSearchTitleEn: 'Recent Searches',
    showRecentSearch: true,
    noResultsTitle: 'لم يتم العثور على أي منتج',
    noResultsTitleAr: 'لم يتم العثور على أي منتج',
    noResultsTitleEn: 'No products found',
    noResultsSubtitle: 'جرب استخدام كلمات بحث مختلفة أو تصفح المنتجات الشائعة',
    noResultsSubtitleAr: 'جرب استخدام كلمات بحث مختلفة أو تصفح المنتجات الشائعة',
    noResultsSubtitleEn: 'Try using different search keywords or browse popular products',
    showSupportCard: true,
    supportCardTitle: 'لم تجد ما تبحث عنه؟',
    supportCardTitleAr: 'لم تجد ما تبحث عنه؟',
    supportCardTitleEn: 'Did not find what you are looking for?',
    supportCardSubtitle: 'تواصل معنا عبر واتساب للمساعدة',
    supportCardSubtitleAr: 'تواصل معنا عبر واتساب للمساعدة',
    supportCardSubtitleEn: 'Contact us via WhatsApp for help',
    suggestedProductsTitle: 'منتجات مقترحة',
    suggestedProductsTitleAr: 'منتجات مقترحة',
    suggestedProductsTitleEn: 'Suggested Products',
}

@Injectable({
  providedIn: 'root'
})
export class SearchPageConfigService {
  private readonly storageKey = 'loxxking-search-page-config';

  readonly pageConfig = signal<SearchPageConfig>(this.loadInitialConfig());

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

  updateConfig(newConfig: SearchPageConfig) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): SearchPageConfig {
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

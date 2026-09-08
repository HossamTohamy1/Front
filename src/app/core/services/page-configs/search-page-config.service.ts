import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect } from '@angular/core';


export interface SearchPageConfig {
    searchPlaceholder: string;
    quickSuggestionsTitle: string;
    quickSuggestions: string[];
    recentSearchTitle: string;
    showRecentSearch: boolean;
    noResultsTitle: string;
    noResultsSubtitle: string;
    showSupportCard: boolean;
    supportCardTitle: string;
    supportCardSubtitle: string;
}


const initialConfig: SearchPageConfig = {
    searchPlaceholder: 'ابحث عن...',
    quickSuggestionsTitle: 'عمليات بحث شائعة:',
    quickSuggestions: [
        'مشد خصر رجالي',
        'مشد خصر نسائي',
        'مشد خصر للتنحيف',
        'مشد خصر بعد الولادة',
    ],
    recentSearchTitle: 'عمليات البحث الأخيرة',
    showRecentSearch: true,
    noResultsTitle: 'لم يتم العثور على أي منتج',
    noResultsSubtitle: 'جرب استخدام كلمات بحث مختلفة أو تصفح المنتجات الشائعة',
    showSupportCard: true,
    supportCardTitle: 'لم تجد ما تبحث عنه؟',
    supportCardSubtitle: 'تواصل معنا عبر واتساب للمساعدة',
}

@Injectable({
  providedIn: 'root'
})
export class SearchPageConfigService {
  private readonly storageKey = 'loxxking-search-page-config';

  readonly pageConfig = signal<SearchPageConfig>(this.loadInitialConfig());

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

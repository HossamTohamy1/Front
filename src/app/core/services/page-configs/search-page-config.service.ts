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
    searchPlaceholder: 'SEARCH.FIND_PLACEHOLDER',
    quickSuggestionsTitle: 'SEARCH.POPULAR_TITLE',
    quickSuggestions: [
        'SEARCH.MENS_WAIST',
        'SEARCH.WOMENS_WAIST',
        'SEARCH.SLIMMING_WAIST',
        'SEARCH.POSTPARTUM_WAIST',
    ],
    recentSearchTitle: 'SEARCH.RECENT',
    showRecentSearch: true,
    noResultsTitle: 'SEARCH.NO_RESULTS',
    noResultsSubtitle: 'SEARCH.TRY_DIFFERENT',
    showSupportCard: true,
    supportCardTitle: 'SEARCH.NOT_FOUND',
    supportCardSubtitle: 'SEARCH.WHATSAPP_HELP',
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

  private mergeWithInitial(parsed: any): SearchPageConfig {
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return { ...initialConfig, ...parsed };
    }
    return parsed;
  }
}
